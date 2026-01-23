import mongoose from "mongoose";

const courseWorkSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  description: String,
  fileUrl: String,       // uploaded file URL
  link: String,          // external link
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CourseWork", courseWorkSchema);
