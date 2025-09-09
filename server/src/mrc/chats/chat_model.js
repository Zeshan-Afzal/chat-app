import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    users: {
      userA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },

    recentMessage: {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
        default: "You Linked!",
      },
    },

    unread: {
      userA: { type: Number, default: 0 },
      userB: { type: Number, default: 0 },
    },

  },
  { timestamps: true } 
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
