import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  date: String,
  status: { type: String, enum: ["Present", "Absent"] }
});


export default mongoose.model("Attendance", attendanceSchema);
