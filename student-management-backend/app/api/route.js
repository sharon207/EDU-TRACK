import { connectDB } from "../../../lib/mongodb";
import Student from "../../../models/Student";
import { NextResponse } from "next/server";


export async function GET() {
  await connectDB();
  return NextResponse.json(await Subject.find());
}

export async function POST(req) {
  await connectDB();
  return NextResponse.json(await Subject.create(await req.json()));
}
