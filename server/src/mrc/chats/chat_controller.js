import chat_servcie from "./chat_servcie.js";

export const startRoom = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ error: "targetUserId is required" });
    }

    const room = await chat_servcie.startChat(req.user.id, targetUserId);
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error in startRoom:", error.message);
    return res.status(500).json({ error: "Failed to start room" });
  }
};

export const getUserRooms = async (req, res) => {
  try {
    const rooms = await chat_servcie.getUserChats(req.user.id);
    return res.status(200).json(rooms);
  } catch (error) {
    console.error("Error in getUserRooms:", error.message);
    return res.status(500).json({ error: "Failed to fetch rooms" });
  }
};
