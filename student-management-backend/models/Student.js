import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  rollNumber: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
});


export default mongoose.model("Student", studentSchema);
