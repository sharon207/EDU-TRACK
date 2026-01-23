import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["ADMIN", "STAFF", "STUDENT"],
    required: true
  }
});

export default mongoose.model("User", userSchema);
