import express from "express";
import Exam from "../models/Exam.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const exam = new Exam(req.body);
  await exam.save();
  res.json(exam);
});

router.get("/", async (req, res) => {
  res.json(await Exam.find());
});

export default router;
