import mongoose from "mongoose";

// Ensure we have a valid MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable inside .env.local");
}

// Implement a global caching strategy to prevent multiple connections in dev mode (Next.js HMR)
/**
 * Global caching is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // If connection is already cached, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no ongoing connection promise, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // best practice for Next.js models
    };

    // Important: Mongoose will attempt to connect using the URI.
    // If your password has special characters (@, :, /, etc.), they MUST be URL encoded (e.g., @ becomes %40).
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Successfully connected to MongoDB");
  } catch (e) {
    // If it fails, we nullify the promise so we can try again later
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
