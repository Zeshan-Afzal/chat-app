import mongoose from "mongoose";
const emailValidator = {
  validator: (value) => {
    const re =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;
    return re.test(value);
  },
  message: "Please enter a valid email",
};
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true , validate:emailValidator},
  name: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

const User=mongoose.model("User", userSchema);
export default User
