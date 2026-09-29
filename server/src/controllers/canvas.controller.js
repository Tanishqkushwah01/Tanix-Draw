import canvasModel from "../models/canvas.model.js";
import shapeModel from "../models/shape.model.js";
import userModel from "../models/user.model.js";
import {
  connectedUsers,
  pendingRequests,
} from "../sockets/socket.js";

const joinAttemptCooldown = new Map();
const JOIN_COOLDOWN_MS = 4000;  


function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[crypto.randomInt(chars.length)];
  }
  return result;
}

export const createCanvas = async (req, res) => {
  try {

    const canvasCount = await canvasModel.countDocuments({
      ownerId: req.userId,
    });

    if (canvasCount >= 12) {
      return res.status(400).json({
        success: false,
        message: "You can create a maximum of 12 canvases",
      });
    }


    const {
      roomName,
      canvasTheme,
      showGrid,
      tag,
      cardColor,
    } = req.body;




    if (!roomName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Room name is required",
      });
    }

    const roomId = generateCode(6);

    let joinCode;

    do {
      joinCode = generateCode(6);
    } while (joinCode === roomId);

    const canvas = await canvasModel.create({
      title: roomName.trim(),
      roomId,
      joinCode,
      ownerId: req.userId,
      canvasTheme: canvasTheme || "paper",
      showGrid: showGrid ?? true,
      tag: tag || "GENERAL",
      cardColor: cardColor || "#f5c4be",
    });

    return res.status(201).json({
      success: true,
      message: "Canvas created successfully",
      canvas,
    });
  } catch (error) {
    console.error("Create Canvas Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const getMyCanvases = async (req, res) => {
  try {
    const canvases = await canvasModel
      .find({ ownerId: req.userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      canvases,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getCanvasById = async (req, res) => {
  try {
    const { id } = req.params;

    const canvas = await canvasModel.findOne({ roomId: id });

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: "Canvas not found",
      });
    }

    const isOwner = canvas.ownerId.toString() === req.userId.toString();

    if (!isOwner) {
      const approved = [...pendingRequests.values()].some(
        (r) =>
          r.roomId === canvas.roomId &&
          r.requesterId === req.userId.toString() &&
          r.status === "accepted"
      );

      if (!approved) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    const shapes = await shapeModel
      .find({ canvasId: canvas._id })
      .sort({ createdAt: 1, _id: 1 });

    const canvasData = canvas.toObject();
    if (!isOwner) delete canvasData.joinCode;

    return res.status(200).json({
      success: true,
      canvas: canvasData,
      shapes,
    });

  } catch (error) {
    console.error("Get Canvas By Id Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const requestJoinRoom = async (req, res) => {
  try {
    const { roomId, joinCode } = req.body;

    if (!roomId || !joinCode) {
      return res.status(400).json({
        success: false,
        message: "Room ID and join code are required",
      });
    }

    const cooldownKey = `${req.userId.toString()}:${roomId.trim()}`;
    const lastAttempt = joinAttemptCooldown.get(cooldownKey);
    const now = Date.now();

    if (lastAttempt && now - lastAttempt < JOIN_COOLDOWN_MS) {
      return res.status(429).json({
        success: false,
        message: "Please wait a few seconds before trying again.",
      });
    }

    joinAttemptCooldown.set(cooldownKey, now);

    const canvas = await canvasModel.findOne({
      roomId: roomId.trim(),
    });


     

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: "Canvas not found",
      });
    }

    if (canvas.joinCode !== joinCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid join code",
      });
    }

    if (canvas.ownerId.toString() === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Owner cannot join own canvas",
      });
    }

    const ownerSocket = connectedUsers.get(
      canvas.ownerId.toString()
    );

    if (!ownerSocket || ownerSocket.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: "Owner is offline",
      });
    }

    const requesterUser = await userModel.findById(req.userId);
    const requesterName = requesterUser?.username || "User";

    const existingRequest = [...pendingRequests.values()].find(
      (request) =>
        request.roomId === canvas.roomId &&
        request.requesterId === req.userId.toString() &&
        request.status === "pending"
    );

    if (existingRequest) {


      ownerSocket.send(
        JSON.stringify({
          type: "join-request",
          requestId: existingRequest.requestId,
          requesterId: existingRequest.requesterId,
          requesterName: existingRequest.requesterName || requesterName,
          roomId: existingRequest.roomId,
        })
      );

      return res.status(200).json({
        success: true,
        message: "Join request resent to owner",
        requestId: existingRequest.requestId,
      });
    }

    const requestId =
      Date.now().toString() +
      Math.random().toString(36).substring(2, 8);

    const requestData = {
      requestId,
      roomId: canvas.roomId,
      requesterId: req.userId.toString(),
      requesterName,
      ownerId: canvas.ownerId.toString(),
      status: "pending",
    };

    pendingRequests.set(requestId, requestData);

    ownerSocket.send(
      JSON.stringify({
        type: "join-request",
        requestId,
        requesterId: req.userId.toString(),
        requesterName,
        roomId: canvas.roomId,
      })
    );

    return res.status(200).json({
      success: true,
      message: "Join request sent to owner",
      requestId,
    });

  } catch (error) {
    console.error("Request Join Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getJoinRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = pendingRequests.get(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Join request not found",
      });
    }

    if (request.requesterId !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (request.status === "accepted") {
      return res.status(200).json({
        success: true,
        status: "accepted",
        roomId: request.roomId,
        message: "Join request accepted",
      });
    }

    if (request.status === "rejected") {
      return res.status(200).json({
        success: false,
        status: "rejected",
        message: "Owner rejected the request",
      });
    }

    return res.status(200).json({
      success: true,
      status: "pending",
      message: "Waiting for owner response",
    });

  } catch (error) {
    console.error("Join Request Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const updateCanvas = async (req, res) => {
  try {
    const { id } = req.params;
    const { showGrid, canvasTheme, roomName, tag, cardColor } = req.body;

    const canvas = await canvasModel.findOne({ roomId: id });

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: "Canvas not found",
      });
    }

    if (canvas.ownerId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (typeof showGrid === "boolean") {
      canvas.showGrid = showGrid;
    }

    if (canvasTheme === "paper" || canvasTheme === "dark") {
      canvas.canvasTheme = canvasTheme;
    }

    if (typeof roomName === "string" && roomName.trim()) {
      canvas.title = roomName.trim();
    }

    if (typeof tag === "string" && tag.trim()) {
      canvas.tag = tag.trim();
    }

    if (typeof cardColor === "string" && cardColor.trim()) {
      canvas.cardColor = cardColor.trim();
    }

    await canvas.save();

    return res.status(200).json({
      success: true,
      message: "Canvas updated successfully",
      canvas,
    });
  } catch (error) {
    console.error("Update Canvas Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const deleteCanvas = async (req, res) => {
  try {
    const { id } = req.params;

    const canvas = await canvasModel.findOne({ roomId: id });

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: "Canvas not found",
      });
    }

    if (canvas.ownerId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await shapeModel.deleteMany({ canvasId: canvas._id });
    await canvasModel.deleteOne({ _id: canvas._id });

    return res.status(200).json({
      success: true,
      message: "Canvas deleted successfully",
    });
  } catch (error) {
    console.error("Delete Canvas Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};