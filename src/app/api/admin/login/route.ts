import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 });
    }

    // Attempt to locate the specific admin in the DB
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Compare the securely hashed passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Login successful" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
  }
}
