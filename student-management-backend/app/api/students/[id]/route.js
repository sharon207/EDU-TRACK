import { connectDB } from "../../../../lib/mongodb";
import Student from "../../../../models/Student";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();
  return NextResponse.json(
    await Student.findByIdAndUpdate(params.id, await req.json(), { new: true })
  );
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Student.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
