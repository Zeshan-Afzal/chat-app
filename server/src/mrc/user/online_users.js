import mongoose from "mongoose";

const onlineUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true},
  socketId:{type:String,required:true}
}, { timestamps: true });

const OnlineUsers=mongoose.model("OnlineUsers", onlineUserSchema);
export default OnlineUsers