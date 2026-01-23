import express from "express";
import Subject from "../models/Subject.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const subject = new Subject(req.body);
  await subject.save();
  res.json(subject);
});

router.get("/", async (req, res) => {
  res.json(await Subject.find());
});

export default router;
