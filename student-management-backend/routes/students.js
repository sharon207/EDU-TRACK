import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// ------------------ STUDENTS ------------------

// Add student
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    res.json(await Student.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ ATTENDANCE ------------------

router.post("/:id/attendance", async (req, res) => {
  try {
    const { date, status } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    student.attendance.push({ date, status });
    await student.save();

    res.json({ message: "Attendance added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ MARKS ------------------

router.post("/:id/marks", async (req, res) => {
  try {
    const { exam, subject, score } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    student.marks.push({ exam, subject, score });
    await student.save();

    res.json({ message: "Marks added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ VIEW MARKS BY EXAM ------------------

router.get("/exam/:examName", async (req, res) => {
  try {
    const students = await Student.find({
      "marks.exam": req.params.examName,
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ STUDENT DASHBOARD ------------------

router.get("/dashboard/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.json({
      attendance: student.attendance,
      marks: student.marks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
