import mongoose from "mongoose";

const encryptedPayloadSchema = new mongoose.Schema({
  ciphertext: String,
  iv: String,
  authTag: String,
  keyVersion: { type: Number, default: 1 },
});

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: String, required: true },
    encryptedPayload: encryptedPayloadSchema,
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
