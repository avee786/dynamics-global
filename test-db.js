const mongoose = require("mongoose");
const fs = require('fs');

// Read the .env.local file natively instead of requiring 'dotenv'
let uri = "";
try {
  const envFile = fs.readFileSync(".env.local", "utf-8");
  const match = envFile.match(/MONGODB_URI=["']?(.*?)["']?(\r?\n|$)/);
  if (match) {
    uri = match[1];
  }
} catch (e) {
  // ignore
}

console.log("-----------------------------------------");
console.log("Testing MongoDB Connection...");
console.log("-----------------------------------------");

if (!uri) {
  console.error("❌ MONGODB_URI is undefined. Please check your .env.local file.");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Success! Connected to MongoDB Atlas.");
    console.log("-----------------------------------------");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed!");
    console.error("-----------------------------------------");
    console.error(err.message);
    
    // Help identify the specific Atlas error
    if (err.message.includes("authentication failed")) {
       console.error("\n💡 HINT: The username or password in your MongoDB URI is incorrect. Please check the Database Access settings on MongoDB Atlas.");
    }
    
    process.exit(1);
  });
