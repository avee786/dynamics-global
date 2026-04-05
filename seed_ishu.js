import { connectDB } from "./src/lib/mongodb.js";
import { Admin } from "./src/models/Admin.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seedIshu() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding 'ishu'...");

    const username = "ishu";
    const password = "ishu@admin123";

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`Admin '${username}' already exists.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
    });

    console.log(`Successfully seeded Admin: ${newAdmin.username}`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin 'ishu':", err);
    process.exit(1);
  }
}

seedIshu();
