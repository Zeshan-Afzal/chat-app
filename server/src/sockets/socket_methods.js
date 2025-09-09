import message_service from "../mrc/message/message_service.js ";
import OnlineUsers from "../mrc/user/online_users.js";
import User from "../mrc/user/user_model.js";

let onlineUsers=[]

export const senddMessage = async (data, socket , io) => {
  try {
    const { roomId, text, toEmail, fromEmail } = JSON.parse(data);
    if (!roomId) return;
    if (!fromEmail) return;
    const user = await User.findOne({ email: fromEmail });
    const recipientOnline = await OnlineUsers.findOne({ email: toEmail });
    const message = await message_service.sendMessage({
      senderId: user._id,
      roomId,
      text,
    });
    const outbound = {
      _id: message._id,
      roomId,
      sender: { _id: user._id },
      text,
      createdAt: message.createdAt,
    };
    if (recipientOnline?.socketId) {
      io.to(recipientOnline.socketId).emit("res_message", outbound)
    }
    io.to(socket.id).emit("res_message", outbound)
  } catch (error) {
    console.log("Error in sendMessage:", error);
  }
};
export const connectUser = async (data, socket, isEmit) => {
  try {
    const fallback = data ? JSON.parse(data) : {};
    const email = fallback.email || socket.user?.email;
    if (!email) return;
    await OnlineUsers.findOneAndUpdate(
      { email },
      { $set: { socketId: socket.id } },
      { upsert: true }
    )
  } catch {}
};

export const markMessagesAsRead = async (data, socket, io) => {
  try {
    const { roomId, userId } = JSON.parse(data);
    if (!roomId || !userId) return;
    
    await message_service.markAsRead(roomId, userId);
    
    io.to(roomId).emit("messages_read", { roomId, userId });
  } catch (error) {
    console.log("Error in markMessagesAsRead:", error);
  }
};

export const handleTypingStart = async (data, socket, io) => {
  try {
    const { roomId, user } = JSON.parse(data);
    if (!roomId || !user) return;
    
    socket.join(roomId);
    
    socket.to(roomId).emit("typing_start", { roomId, user });
  } catch (error) {
    console.log("Error in handleTypingStart:", error);
  }
};

export const handleTypingStop = async (data, socket, io) => {
  try {
    const { roomId, user } = JSON.parse(data);
    if (!roomId || !user) return;
    
    socket.to(roomId).emit("typing_stop", { roomId, user });
  } catch (error) {
    console.log("Error in handleTypingStop:", error);
  }
};