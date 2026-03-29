import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Client } from "@/models/Client";
import { connectDB } from "@/lib/mongodb";
import { generateToken } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    console.log("Login attempt for client:", email);

    // Find client by email
    const client = await Client.findOne({ email });
    if (!client) {
      console.log("Client not found:", email);
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      console.log("Invalid password for:", email);
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("Client login successful:", email);

    // Generate JWT
    const token = generateToken({
      id: client._id.toString(),
      role: 'client',
      email: client.email,
      name: client.name,
      company: client.company,
    });

    // Set token in HTTP-only cookie + return in JSON body
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        client: {
          id: client._id,
          name: client.name,
          company: client.company,
          email: client.email,
        }
      },
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
    console.error("Client Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

