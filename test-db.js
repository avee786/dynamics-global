const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split(/\r?\n/);
let MONGODB_URI = '';

for (const line of lines) {
  if (line.startsWith('MONGODB_URI=')) {
    // Split only at the first '='
    const index = line.indexOf('=');
    MONGODB_URI = line.substring(index + 1).replace(/"/g, '').trim();
    break;
  }
}

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
console.log('URI Length:', MONGODB_URI.length);
// console.log('URI Start:', MONGODB_URI.substring(0, 30));

async function test() {
  try {
    // Mongoose 8+ connect returns a promise
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

test();
