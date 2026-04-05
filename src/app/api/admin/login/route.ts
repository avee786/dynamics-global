import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";
import { generateToken } from "@/utils/auth";

export async function POST(req: Request) {
  console.log(">>> ADMIN LOGIN ATTEMPT RECEIVED");
  try {
    console.log(">>> Connecting to DB...");
    await connectDB();
    console.log(">>> DB Connected. Parsing request body...");
    const { username, password } = await req.json();
    console.log(`>>> Username: ${username}`);

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 });
    }

    // Find admin in DB
    console.log(`>>> [AUTH] Querying for user: ${username}`);
    const admin = await Admin.findOne({ username });
    console.log(`>>> [AUTH] Admin found: ${!!admin}`);
    
    if (!admin) {
      console.warn(`>>> [AUTH] User not found: ${username}`);
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    const token = generateToken({ id: admin._id.toString(), role: 'admin', username: admin.username });
    console.log("Admin login successful:", username);

    // Set token in HTTP-only cookie + return in JSON body
    const response = NextResponse.json(
      { success: true, message: "Login successful", token },
      { status: 200 }
    );
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
  }
}

