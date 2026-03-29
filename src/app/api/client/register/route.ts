import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Client } from "@/models/Client";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Parse request body
    const { name, company, email, password } = await req.json();

    console.log("Registering new client:", email);

    // 3. Check if client already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      console.log("Client already exists:", email);
      return NextResponse.json(
        { success: false, message: "Client with this email already exists" },
        { status: 400 }
      );
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create and save the new client
    const newClient = await Client.create({
      name,
      company,
      email,
      password: hashedPassword,
    });

    console.log("Client registered successfully:", newClient._id);

    // 6. Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: "Client registered successfully",
        client: {
          id: newClient._id,
          name: newClient.name,
          company: newClient.company,
          email: newClient.email
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Client Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
