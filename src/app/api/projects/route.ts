import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newProject = await Project.create(body);
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
