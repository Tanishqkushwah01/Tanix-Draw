import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { isAllowedOrigin } from "../config/cors.js";
import { getTokenFromRequest } from "../utils/auth.cookie.js";
import canvasModel from "../models/canvas.model.js";
import shapeModel from "../models/shape.model.js";
import {
  createRoom,
  addUserToRoom,
  getRoom,
  removeUserFromRoom,
  closeRoom,
} from "./roomManager.js";


export const connectedUsers = new Map();
export const pendingRequests = new Map();
const ownerLeaveTimers = new Map();

const clearApprovals = (roomId, userId = null) => {
  for (const [id, r] of pendingRequests) {
    if (r.roomId === roomId && (userId === null || r.requesterId === userId)) {
      pendingRequests.delete(id);
    }
  }
};


const startOwnerLeaveTimer = (roomId) => {
  if (ownerLeaveTimers.has(roomId)) {
    clearTimeout(ownerLeaveTimers.get(roomId));
  }

  const timer = setTimeout(() => {
    const currentRoom = getRoom(roomId);
    if (!currentRoom) {
      ownerLeaveTimers.delete(roomId);
      return;
    }

    currentRoom.users.forEach((user, uid) => {
      if (uid.toString() === currentRoom.ownerId.toString()) return;

      if (user.socket?.readyState === 1) {
        user.socket.send(
          JSON.stringify({
            type: "removed-from-room",
            roomId,
            reason: "owner-left",  
          })
        );
      }
    });

    const ownerEntry = currentRoom.users.get(currentRoom.ownerId);
    closeRoom(roomId);
    clearApprovals(roomId);

    if (ownerEntry?.socket && ownerEntry.socket.readyState === 1) {
      const freshRoom = createRoom(roomId, currentRoom.ownerId, ownerEntry.socket);
      sendUsersList(freshRoom);
    }

    ownerLeaveTimers.delete(roomId);
  }, 10000);

  ownerLeaveTimers.set(roomId, timer);
};

const sendUsersList = (room) => {
  const usersList = [];

  room.users.forEach((user, userId) => {
    usersList.push({
      userId: userId.toString(),
      username: user.username || "User",
      permission: user.permission,
    });
  });

  room.users.forEach((user) => {
    if (user.socket.readyState === 1) {
      user.socket.send(
        JSON.stringify({
          type: "users-list",
          users: usersList,
        })
      );
    }
  });
};

const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {


    const origin = req.headers.origin;
    if (origin && !isAllowedOrigin(origin)) {
      ws.close(4403, "Forbidden origin");
      return;
    }

    try {
      const token = getTokenFromRequest(req);
      ws.authUserId = jwt.verify(token, process.env.JWT_SECRET).userId.toString();
    } catch {
      ws.close(4401, "Unauthorized");
      return;
    }


    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);

         

        
        if (data.type === "register-user") {
          const verifiedId = ws.authUserId;

          ws.userId = verifiedId;
          ws.username = data.username;
          connectedUsers.set(verifiedId, ws);
        }

         
        if (data.type === "accept-request") {
          const { requestId } = data;

          const request = pendingRequests.get(requestId);

          if (!request) {
            ws.send(
              JSON.stringify({
                type: "accept-request-error",
                message: "Join request not found",
              })
            );

            return;
          }

          if (request.ownerId !== ws.userId.toString()) {
            return;
          }

          request.status = "accepted";

          pendingRequests.set(requestId, request);

           

          const requesterSocketAccept = connectedUsers.get(
            request.requesterId
          );

          if (
            requesterSocketAccept &&
            requesterSocketAccept.readyState === 1
          ) {
            requesterSocketAccept.send(
              JSON.stringify({
                type: "join-request-accepted",
                roomId: request.roomId,
              })
            );
          }
        }


         
        if (data.type === "reject-request") {
          const { requestId } = data;

          const request = pendingRequests.get(requestId);

          if (!request) {
            return;
          }

          if (request.ownerId !== ws.userId.toString()) {
            return;
          }

          request.status = "rejected";

          pendingRequests.set(requestId, request);

           

          const requesterSocketReject = connectedUsers.get(
            request.requesterId
          );

          if (
            requesterSocketReject &&
            requesterSocketReject.readyState === 1
          ) {
            requesterSocketReject.send(
              JSON.stringify({
                type: "join-request-rejected",
              })
            );
          }
        }

         
        if (data.type === "change-permission") {
          const { roomId, targetUserId, permission } = data;

          if (permission !== "editor" && permission !== "viewer") return;

          const room = getRoom(roomId);
          if (!room) return;

          if (room.ownerId !== ws.userId.toString()) return;

          const targetUser = room.users.get(targetUserId);
          if (!targetUser) return;

          targetUser.permission = permission; // "editor" ya "viewer"

          if (!room.permissions) room.permissions = new Map();
          room.permissions.set(targetUserId, permission);

          sendUsersList(room); // sabko updated list bhejo taaki badge/UI update ho
        }

        
        if (data.type === "remove-user") {
          const { roomId, targetUserId } = data;

          const room = getRoom(roomId);
          if (!room) return;

          if (room.ownerId !== ws.userId.toString()) return;

          if (targetUserId === ws.userId.toString()) return;

          const targetUser = room.users.get(targetUserId);

          if (targetUser?.socket?.readyState === 1) {
            targetUser.socket.send(
              JSON.stringify({
                type: "removed-from-room",
                roomId,
              })
            );
          }

          removeUserFromRoom(roomId, targetUserId);

          room.permissions?.delete(targetUserId);
          clearApprovals(roomId, targetUserId);


          sendUsersList(room);
        }

        
        if (data.type === "close-room") {
          const { roomId } = data;

          const room = getRoom(roomId);
          if (!room) return;

          if (room.ownerId !== ws.userId.toString()) return;

          room.users.forEach((user, uid) => {
            if (uid.toString() === ws.userId.toString()) return;

            if (user.socket?.readyState === 1) {
              user.socket.send(
                JSON.stringify({
                  type: "removed-from-room",
                  roomId,
                })
              );
            }
          });

          closeRoom(roomId);
          clearApprovals(roomId);
          const freshRoom = createRoom(roomId, ws.userId, ws);

          sendUsersList(freshRoom);

        }



        
        if (data.type === "join-canvas") {


          const ownerCanvas = await canvasModel.findOne({ roomId: data.roomId });

          if (
            !ownerCanvas ||
            !ws.userId ||
            ownerCanvas.ownerId.toString() !== ws.userId
          ) {
            ws.send(
              JSON.stringify({
                type: "room-error",
                message: "Not allowed",
              })
            );
            return;
          }

          const room = createRoom(
            data.roomId,
            ws.userId,
            ws
          );

          ws.roomId = data.roomId;

          if (ownerLeaveTimers.has(data.roomId)) {
            clearTimeout(ownerLeaveTimers.get(data.roomId));
            ownerLeaveTimers.delete(data.roomId);
          }

           

          sendUsersList(room);
        }


         
        if (data.type === "join-room") {
          const { roomId } = data;

          const room = getRoom(roomId);

          if (!room) {
            ws.send(
              JSON.stringify({
                type: "room-error",
                message: "Room not found",
              })
            );

            return;
          }

          const isRoomOwner = room.ownerId === ws.userId;
          const approved = [...pendingRequests.values()].some(
            (r) =>
              r.roomId === roomId &&
              r.requesterId === ws.userId &&
              r.status === "accepted"
          );

          if (!isRoomOwner && !approved) {
            ws.send(
              JSON.stringify({
                type: "room-error",
                message: "Not approved",
              })
            );
            return;
          }

          const added = addUserToRoom(
            roomId,
            ws.userId,
            ws
          );

          if (!added) return;

          ws.roomId = roomId;

           

          sendUsersList(room);
        }

        if (data.type === "shape-created") {
          const { roomId, shape } = data;
          const room = getRoom(roomId);
          if (!room) {
            return;
          }

          const sender = room.users.get(ws.userId);
          if (!sender || (sender.permission !== "owner" && sender.permission !== "editor")) {
            return;
          }

          room.users.forEach((user, userId) => {
            if (userId.toString() === ws.userId.toString()) {
              return;
            }

            if (user.socket.readyState === 1) {
              user.socket.send(
                JSON.stringify({
                  type: "shape-created",
                  shape,
                })
              );
            }
          });
        }


        if (data.type === "shape-updated") {
          const { roomId, shape } = data;
          const room = getRoom(roomId);
          if (!room) return;

          const sender = room.users.get(ws.userId);
          if (!sender || (sender.permission !== "owner" && sender.permission !== "editor")) {
            return;
          }

          room.users.forEach((user, userId) => {
            if (userId.toString() === ws.userId.toString()) return;

            if (user.socket.readyState === 1) {
              user.socket.send(
                JSON.stringify({
                  type: "shape-updated",
                  shape,
                })
              );
            }
          });
        }

        if (data.type === "shape-deleted") {
          const { roomId, shapeId } = data;
          const room = getRoom(roomId);
          if (!room) return;

          const sender = room.users.get(ws.userId);
          if (!sender || (sender.permission !== "owner" && sender.permission !== "editor")) {
            return;
          }

          room.users.forEach((user, userId) => {
            if (userId.toString() === ws.userId.toString()) return;

            if (user.socket.readyState === 1) {
              user.socket.send(
                JSON.stringify({
                  type: "shape-deleted",
                  shapeId,
                })
              );
            }
          });
        }

        if (data.type === "cursor-move") {
          const { roomId, x, y } = data;

          const room = getRoom(roomId);
          if (!room) return;

          if (!ws.userId || !room.users.has(ws.userId)) return;

          const username = ws.username || "User";

          room.users.forEach((user, uid) => {
            if (uid.toString() === ws.userId.toString()) return;

            if (user.socket.readyState === 1) {
              user.socket.send(
                JSON.stringify({
                  type: "cursor-move",
                  userId: ws.userId,
                  username,
                  x,
                  y,
                })
              );
            }
          });
        }

         
        if (data.type === "leave-room") {
          const { roomId } = data;

          if (!roomId || !ws.userId) return;

          const removed = removeUserFromRoom(roomId, ws.userId);

          if (removed) {
            ws.roomId = null;  

            const room = getRoom(roomId);

            if (room) {
              sendUsersList(room);  
            }

          }
        }

         
        if (data.type === "owner-left-canvas") {
          const { roomId } = data;

          const room = getRoom(roomId);
          if (!room) return;

          if (room.ownerId !== ws.userId.toString()) return;

          startOwnerLeaveTimer(roomId);

        }

         
        if (data.type === "clear-canvas") {
          const { roomId } = data;

          const room = getRoom(roomId);
          if (!room) return;

          if (room.ownerId !== ws.userId.toString()) {
            return;
          }

          const canvas = await canvasModel.findOne({ roomId });

          if (canvas) {
            await shapeModel.deleteMany({ canvasId: canvas._id });
          }

          room.users.forEach((user) => {
            if (user.socket.readyState === 1) {
              user.socket.send(
                JSON.stringify({ type: "canvas-cleared" })
              );
            }
          });

        }


      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

     
    ws.on("close", () => {

      if (ws.userId && connectedUsers.get(ws.userId) === ws) {
        connectedUsers.delete(ws.userId);
      }

      if (ws.roomId && ws.userId) {
        const room = getRoom(ws.roomId);

        const entry = room?.users.get(ws.userId);
        if (entry && entry.socket !== ws) return;

        if (room && room.ownerId === ws.userId.toString()) {
          removeUserFromRoom(ws.roomId, ws.userId);
          startOwnerLeaveTimer(ws.roomId);


        } else {
          const removed = removeUserFromRoom(ws.roomId, ws.userId);
          if (removed) {
            const updatedRoom = getRoom(ws.roomId);
            if (updatedRoom) sendUsersList(updatedRoom);

          }
        }
      }


    });


  });

  return wss;
};

export default setupWebSocket;