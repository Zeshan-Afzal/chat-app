import bcrypt from "bcrypt";
import { generateToken } from "../../utils/utils.js";
import User from "./user_model.js";
import mongoose from "mongoose";

class AuthService {
  async register({ email, name, password }) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      password:passwordHash,
    });

    const token = generateToken({ id: user._id, email: user.email });

    return { user, token };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken({ id: user._id, email: user.email });

    return { user, token };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async listUsersExcluding(currentUserId) {
    const users = await User.aggregate([
      {
        $match: { _id: { $ne: mongoose.Types.ObjectId.createFromHexString(currentUserId) } }, 
      },
      {
        $lookup: {
          from: "rooms", 
          let: { otherUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$users.userA", mongoose.Types.ObjectId.createFromHexString(currentUserId) ] },
                        { $eq: ["$users.userB", "$$otherUserId"] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$users.userB", mongoose.Types.ObjectId.createFromHexString(currentUserId) ] },
                        { $eq: ["$users.userA", "$$otherUserId"] },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "room",
        },
      },
      {
        $match: { room: { $size: 0 } }, 
      },
      {
        $project: {
          password: 0, 
        },
      },
    ]);
    console.log(users,
      "users"
    );
    
    return users;
  }
}

export default new AuthService();
