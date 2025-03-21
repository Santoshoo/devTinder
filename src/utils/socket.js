const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const intializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined the chat" + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName,lastName, userId, targetUserId, text }) => {
        //save mesg to db
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(roomId);
          console.log(firstName + " sent a message to " + text);

          //check if userId and targetUserId friend or not
//      const existingUser = await ConnectionRequest.findOne({
//        $or: [
//          { userId: userId, targetUserId: targetUserId, status: "accepted" },
//          { userId: targetUserId, targetUserId: userId, status: "accepted" },
//        ],
//      });
          
// if (!connection || connection.status !== "accepted") {
//   console.log("Message blocked: Users are not friends.");
//   return; // Stop message processing if not friends
// }
        

        
            let chat = await Chat.findOne({
              participants: { $all: [userId, targetUserId] },
            });
            if (!chat) {
              chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
              });
            }
        

          chat.messages.push({ senderId: userId, text });

          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
          });
        } catch (err) {
          console.log(err);
        }

        socket.on("disconnect", () => {});
      }
    );
  });
};

module.exports = intializeSocket;
