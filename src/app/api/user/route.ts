import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Prevent duplicate user creation blindly
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    const newUser = await User.create(body);
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
