import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Admin } from "@/models/Admin";
import { connectDB } from "@/lib/mongodb";

// 👇 ये add करो
export async function GET() {
  await connectDB();

  const existing = await Admin.findOne({ username: "pu34345" });

  if (existing) {
    return NextResponse.json({ message: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash("piyush@admin", 10);

  const admin = await Admin.create({
    username: "pu34345",
    password: hashedPassword
  });

  return NextResponse.json({ success: true, admin });
}