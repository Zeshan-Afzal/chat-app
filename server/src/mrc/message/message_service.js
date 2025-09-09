import mongoose from "mongoose";
import { decryptMessage, encryptMessage } from "../../utils/encryption.js";
import Room from "../chats/chat_model.js";
import Message from "./message_model.js";

class MessageService {
  async sendMessage({ senderId, roomId, text }) {
    const encryptedPayload = encryptMessage(text);
    const message = await Message.create({
      sender: senderId,
      roomId,
      encryptedPayload,
      readBy: [senderId],
    });

    const room = await Room.findOne({ roomId });
    if (!room) throw new Error("Room not found");

    const updateData = {
      roomId,
      recentMessage: {
        sender: senderId,
        text: text || "Attachment",
      },
      updatedAt: new Date(),
    };

    if (room.users.userA.toString() === senderId.toString()) {
      updateData.$inc = { "unread.userB": 1 };
    } else if (room.users.userB.toString() === senderId.toString()) {
      updateData.$inc = { "unread.userA": 1 };
    }

    await Room.findOneAndUpdate({ roomId }, updateData);

    return message;
  }

   async getMessages(roomId, userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const messages = await Message.aggregate([
      {
        $match: {
          roomId: roomId,
        },
      },
      {
        $addFields: {
          status: {
            $cond: [
              { $in: [ mongoose.Types.ObjectId.createFromHexString(userId), "$readBy"] },
              "read",
              "unread",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
  console.log(messages);
  
   return messages.map((msg) => ({
      ...msg,
      text: decryptMessage(msg?.encryptedPayload),
    }));
  }

async markAsRead(roomId, userId) {
  await Message.updateMany(
    { roomId:roomId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } }
  );

  const room = await Room.findOne({roomId});
  if (!room) throw new Error("Room not found");

  const update = {};
  if (room.users.userA.toString() === userId.toString()) {
    update["unread.userA"] = 0;
  } else if (room.users.userB.toString() === userId.toString()) {
    update["unread.userB"] = 0;
  }

  await Room.updateOne({ roomId }, { $set: update });

  return { success: true };
}

}

export default new MessageService();
