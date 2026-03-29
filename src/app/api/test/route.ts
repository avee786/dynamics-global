import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    // 1. Attempt to establish the connection
    await connectDB();

    // 2. We are successfully connected!
    return NextResponse.json(
      {
        success: true,
        message: "MongoDB Connected",
        state: mongoose.connection.readyState // 1 = connected
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ MongoDB Connection Error:", error);

    // Provide clearer debugging hints for common MongoDB issues
    let debugHint = "Make sure your MONGODB_URI is correct.";

    if (error.message.includes("authentication failed")) {
      debugHint = "Authentication failed! Ensure that the username and password in the database dashboard exactly match the URI. Also, special characters in passwords must be URL-encoded (e.g., '@' becomes '%40').";
    } else if (error.message.includes("ECONNREFUSED") || error.message.includes("querySrv")) {
      debugHint = "Network restricted! Your local network/ISP might be blocking MongoDB's SRV DNS queries, or your IP address isn't whitelisted on MongoDB Atlas.";
    }

    // Return the specific JSON output format required
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to connect to MongoDB",
        hint: debugHint
      },
      { status: 500 }
    );
  }
}
