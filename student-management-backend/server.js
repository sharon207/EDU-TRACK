import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";

// Models
import User from "./models/User.js";
import Student from "./models/Student.js";
import Course from "./models/Course.js";
import Subject from "./models/Subject.js";
import Attendance from "./models/Attendance.js";
import CourseWork from "./models/CourseWork.js";

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- DATABASE ---------------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/studentdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

/* ---------------- TEST ---------------- */
app.get("/", (req, res) => {
  res.send("Backend running");
});

/* ---------------- AUTH ---------------- */

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role, // STAFF / STUDENT
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- COURSES ---------------- */

app.post("/api/courses", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    console.error("Add course error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/courses", async (req, res) => {
  res.json(await Course.find());
});

/* ---------------- SUBJECTS ---------------- */

app.post("/api/subjects", async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.json(subject);
  } catch (err) {
    console.error("Add subject error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/subjects/:courseId", async (req, res) => {
  res.json(await Subject.find({ courseId: req.params.courseId }));
});

/* ---------------- STUDENTS ---------------- */

// ADD STUDENT
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET STUDENTS (OPTIONAL COURSE FILTER + POPULATE)
app.get("/api/students", async (req, res) => {
  try {
    const { courseId } = req.query;

    let students;
    if (courseId) {
      students = await Student.find({ courseId }).populate("courseId");
    } else {
      students = await Student.find().populate("courseId");
    }

    res.json(students);
  } catch (err) {
    console.error("Fetch students error:", err);
    res.status(500).json({ message: err.message });
  }
});

// UPDATE STUDENT (EDIT)
app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("courseId");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE STUDENT
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET ALL STUDENT USERS (for Add Student page)
app.get("/api/users/students", async (req, res) => {
  const users = await User.find({ role: "STUDENT" })
    .select("_id name email");
  res.json(users);
});

// STUDENT PROFILE
app.get("/api/student/user/:userId", async (req, res) => {
  const student = await Student.findOne({ userId: req.params.userId })
    .populate("courseId")
    .populate("subjects");

  if (!student) {
    return res.status(404).json({ message: "Student profile not found" });
  }

  res.json(student);
});

/* ---------------- ATTENDANCE ---------------- */

// SAVE / UPDATE ATTENDANCE (NO DUPLICATES)
app.post("/api/attendance", async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: "No attendance data received" });
    }

    for (const record of req.body) {
      if (
        !record.studentId ||
        !record.subjectId ||
        !record.date ||
        !record.status
      ) {
        return res.status(400).json({ message: "Missing attendance fields" });
      }

      await Attendance.findOneAndUpdate(
        {
          studentId: record.studentId,
          subjectId: record.subjectId,
          date: record.date,
        },
        { $set: { status: record.status } },
        { upsert: true, new: true }
      );
    }

    res.json({ message: "Attendance saved successfully" });
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ message: err.message });
  }
});

// VIEW ATTENDANCE (Teacher)
app.get("/api/attendance", async (req, res) => {
  const { subjectId, date } = req.query;

  const attendance = await Attendance.find({ subjectId, date })
    .populate("studentId")
    .populate("subjectId");

  res.json(attendance);
});

// VIEW ATTENDANCE (Student)
app.get("/api/attendance/student/:id", async (req, res) => {
  const attendance = await Attendance.find({
    studentId: req.params.id,
  }).populate("subjectId");

  res.json(attendance);
});
/* ---------------- ATTENDANCE PERCENTAGE PER SUBJECT ---------------- */

app.get("/api/attendance/percentage/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Fetch all attendance for this student
    const records = await Attendance.find({ studentId })
      .populate("subjectId");

    if (!records.length) {
      return res.json([]);
    }

    // Group by subject
    const grouped = {};

    records.forEach(r => {
      const subject = r.subjectId?.name || "Unknown";

      if (!grouped[subject]) {
        grouped[subject] = { present: 0, total: 0 };
      }

      if (r.status === "Present") grouped[subject].present++;
      grouped[subject].total++;
    });

    // Convert to percentage array
    const result = Object.keys(grouped).map(subject => ({
      subject,
      present: grouped[subject].present,
      total: grouped[subject].total,
      percentage: Math.round((grouped[subject].present / grouped[subject].total) * 100)
    }));

    res.json(result);

  } catch (err) {
    console.error("Percentage error:", err);
    res.status(500).json({ message: "Failed to calculate percentage" });
  }
});
/* ---------------- COURSE WORK UPLOAD ---------------- */

// Upload work
app.post("/api/coursework", async (req, res) => {
  try {
    const work = new CourseWork(req.body);
    await work.save();
    res.status(201).json(work);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all works for a course
app.get("/api/coursework/:courseId", async (req, res) => {
  const works = await CourseWork.find({ courseId: req.params.courseId })
    .sort({ date: -1 });

  res.json(works);
});

/* ---------------- SERVER ---------------- */

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
