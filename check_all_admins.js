const mongoose = require("mongoose");
const fs = require('fs');

async function checkAllAdmins() {
  let uri = "";
  try {
    const envFile = fs.readFileSync(".env.local", "utf-8");
    const match = envFile.match(/MONGODB_URI=["']?(.*?)["']?(\r?\n|$)/);
    if (match) {
      uri = match[1];
    }
  } catch (e) {
    console.error("Error reading .env.local:", e);
  }

  if (!uri) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const AdminSchema = new mongoose.Schema({
      username: String,
      password: { type: String, required: true },
    }, { collection: 'admins' });

    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

    const admins = await Admin.find({});
    console.log("Admins found:", admins.map(a => a.username));
    
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAllAdmins();
