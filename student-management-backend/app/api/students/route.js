import { connectDB } from "../../../lib/mongodb";
import Student from "../../../models/Student";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const students = await Student.find();
  return NextResponse.json(students);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const student = await Student.create(data);
  return NextResponse.json(student);
}
