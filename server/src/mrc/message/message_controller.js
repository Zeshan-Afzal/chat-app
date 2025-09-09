import message_service from "./message_service.js";

export const sendMessage = async (req, res) => {
  try {
    const { roomId, text } = req.body;
    if (!roomId) return res.status(400).json({ error: "roomId is required" });

    const message = await message_service.sendMessage({
      senderId: req.user.id,
      roomId,
      text,
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    return res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { roomId  } = req.params;
    let page, limit
    const messages = await message_service.getMessages(roomId, req.user.id , page=1, limit=20);
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { roomId } = req.params;
    const result = await message_service.markAsRead(roomId, req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in markAsRead:", error.message);
    return res.status(500).json({ error: "Failed to mark as read" });
  }
};
