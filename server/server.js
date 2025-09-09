
import express from "express";
import http from "http";
import cors from "cors";
import authRouter from "./src/mrc/user/auth_routes.js";
import chatRouter from "./src/mrc/chats/chat_routes.js";
import messageRouter from "./src/mrc/message/message_routes.js";


const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter)
app.use("/api/message", messageRouter)
app.get("/status", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});


export const server = http.createServer(app);
