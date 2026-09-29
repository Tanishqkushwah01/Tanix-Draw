const rooms = new Map();

export const createRoom = (roomId, ownerId, ownerSocket) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);

    room.users.set(ownerId, {
      socket: ownerSocket,
      username: ownerSocket.username,
      permission: "owner",
    });

    return room;
  }

  const room = {
    ownerId,

    users: new Map([
      [
        ownerId,
        {
          socket: ownerSocket,
          username: ownerSocket.username,
          permission: "owner",
        },
      ],
    ]),

    permissions: new Map(),

    pendingRequests: [],
  };

  rooms.set(roomId, room);

  return room;
};

export const addUserToRoom = (roomId, userId, socket) => {
  const room = rooms.get(roomId);

  if (!room) return false;

  const savedPermission = room.permissions?.get(userId) || "viewer";

  room.users.set(userId, {
    socket,
    username: socket.username,
    permission: savedPermission,
  });

  return true;
};

export const getRoom = (roomId) => {
  return rooms.get(roomId);
};

export const removeUserFromRoom = (roomId, userId) => {
  const room = rooms.get(roomId);

  if (!room) return false;

  room.users.delete(userId);

  return true;
};

export const updateUserSocket = (roomId, userId, socket) => {
  const room = rooms.get(roomId);

  if (!room) return false;

  const user = room.users.get(userId);

  if (!user) return false;

  user.socket = socket;
  user.username = socket.username;

  return true;
};

export const closeRoom = (roomId) => {
  return rooms.delete(roomId);
};