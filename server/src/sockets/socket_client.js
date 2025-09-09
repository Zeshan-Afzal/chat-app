import { Server } from "socket.io";
//import { server } from "../../server.js";
import cors from "cors"
import { connectUser, senddMessage, markMessagesAsRead, handleTypingStart, handleTypingStop } from "./socket_methods.js";
import { verifyToken } from "../utils/utils.js";
let onlineUsers=[]
let io;
export const configSockt=async(server)=>{
io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket)=>{
    const token = socket.handshake?.auth?.token;
    const payload = verifyToken(token);
    if (!payload) {
      try { socket.disconnect(true); } catch {}
      return;
    }
    socket.user = payload; // { id, email }
    console.log("connetcion")
    socket.on("connect_user", (data)=>connectUser(data, socket, io))
    socket.on("send_message", (data)=>senddMessage(data, socket, io))
    socket.on("mark_messages_read", (data)=>markMessagesAsRead(data, socket, io))
    socket.on("typing_start", (data)=>handleTypingStart(data, socket, io))
    socket.on("typing_stop", (data)=>handleTypingStop(data, socket, io))
}) 

}


