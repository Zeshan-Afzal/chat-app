import { makeRoom } from "../../utils/utils.js";
import Room from "./chat_model.js";

class ChatService {
 async startChat(userAId, userBId) {
    let room = await Room.findOne({
      $or: [
        { "users.userA": userAId, "users.userB": userBId },
        { "users.userA": userBId, "users.userB": userAId },
      ],
    });
    const roomId= makeRoom(userAId, userBId)
    if (!room) {
      room = await Room.create({
        roomId, 
        users: {
          userA: userAId,
          userB: userBId,
        },
        recentMessage: {
          sender: null,
          text: "You Linked!",
        },
      });
    }

    return room;
  }

 async getUserChats(userId) {
    const rooms = await Room.find({
      $or: [
        { "users.userA": userId },
        { "users.userB": userId },
      ],
    })
      .populate("users.userA", "name email")
      .populate("users.userB", "name email")
      .sort({ updatedAt: -1 });

    return rooms.map(room => {
      const isUserA = room.users.userA._id.toString() === userId.toString();
      const unreadCount = isUserA ? room.unread.userA : room.unread.userB;
      
      return {
        ...room.toObject(),
        unreadCount,
        otherUser: isUserA ? room.users.userB : room.users.userA
      };
    });
  }
}

export default new ChatService();
