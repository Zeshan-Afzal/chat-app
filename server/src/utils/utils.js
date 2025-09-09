
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;
const expiry=process.env.JWT_SECRET_EXPIRY
export const generateToken = ({id, email}) => {
  return jwt.sign({ id, email}, secretKey, {
    expiresIn: expiry,
  });
};

export const verifyToken = (token) => {
  console.log("token in verified header...", token);
  console.log("token in verified in env...", secretKey);

  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log("JWT verification error:", error.message);
    return null;
  }
};

export const makeRoom = (user1, user2) => {
  const userIds = [user1, user2].sort();
  return `room_${userIds[0]}_${userIds[1]}`;
};