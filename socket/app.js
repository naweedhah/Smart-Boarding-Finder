import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = [];

// Add user
const addUser = (userId, socketId) => {
  const exists = onlineUsers.find((user) => user.userId === userId);

  if (!exists) {
    onlineUsers.push({ userId, socketId });
  }
};

// Remove user
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

// Get user
const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Add user when they login / open app
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("👤 Online users:", onlineUsers);
  });

  // Send message
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
    removeUser(socket.id);
  });
});

io.listen(4000);