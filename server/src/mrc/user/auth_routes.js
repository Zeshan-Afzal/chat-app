import express from "express"
import { currentUser, login, register, listUsers } from "./auth_contorller.js"
import { authenticUser } from "../../midleware/authentic.js"

const authRouter= express.Router()

authRouter
  .post("/login", login)
  .post("/sign_up", register)
  .get("/get_user", authenticUser, currentUser)
  .get("/list_users", authenticUser, listUsers)
export default authRouter