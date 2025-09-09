import express from "express"
import { authenticUser } from "../../midleware/authentic.js"
import { getMessages, markAsRead, sendMessage } from "./message_controller.js"

const messageRouter= express.Router()

messageRouter.post("/send_message", authenticUser, sendMessage).get("/get_messages/:roomId", authenticUser, getMessages).get("/mark_read/:roomId", authenticUser, markAsRead)
export default messageRouter