import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
console.log('URI:', MONGODB_URI.split('@')[0] + '@' + MONGODB_URI.split('@')[1].substring(0, 5) + '...');

async function test() {
  try {
    await mongoose.connect(MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

test();
