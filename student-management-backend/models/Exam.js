import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  name: String,
  subject: String,
  className: String,
  date: Date,
});

export default mongoose.model("Exam", examSchema);
