import express from "express"
import { getUserRooms, startRoom } from "./chat_controller.js"
import { authenticUser } from "../../midleware/authentic.js"


const chatRouter= express.Router()
chatRouter.post(
    "/start_chat", authenticUser,  startRoom
).get("/get_chats", authenticUser, getUserRooms)
export default chatRouter