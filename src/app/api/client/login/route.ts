import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Client } from "@/models/Client";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Parse request body
    const { email, password } = await req.json();

    console.log("Login attempt for client:", email);

    // 3. Find client by email
    const client = await Client.findOne({ email });
    if (!client) {
      console.log("Client not found:", email);
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 4. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      console.log("Invalid password for:", email);
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("Client login successful:", email);

    // 5. Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: "Login successful",
        client: {
          id: client._id,
          name: client.name,
          company: client.company,
          email: client.email
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Client Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
