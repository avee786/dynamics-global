import { connectDB } from "./src/lib/mongodb.js";
import { Admin } from "./src/models/Admin.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seedAdmin() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    const existingAdmin = await Admin.findOne({ username: "pu34345" });
    if (existingAdmin) {
      console.log("Admin 'pu34345' already exists in Db.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("piyush@admin", 10);
    const newAdmin = await Admin.create({
      username: "pu34345",
      password: hashedPassword,
    });

    console.log("Successfully seeded Admin:", newAdmin.username);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin", err);
    process.exit(1);
  }
}

seedAdmin();
