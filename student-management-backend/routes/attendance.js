import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("REQ BODY 👉", req.body); // 🔴 IMPORTANT

    const { student, subject, date, status } = req.body;

    if (!student || !subject || !date || !status) {
      return res.status(400).json({
        message: "Missing required fields",
        received: req.body
      });
    }

    const record = await Attendance.create({
      student,
      subject,
      date,
      status
    });

    res.status(201).json(record);

  } catch (err) {
    console.error("SAVE ERROR 👉", err);

    if (err.code === 11000) {
      return res.status(409).json({
        message: "Attendance already marked"
      });
    }

    res.status(500).json({ error: err.message });
  }
});

export default router;
