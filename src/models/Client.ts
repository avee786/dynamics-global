import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  company: string;
  email: string;
  password?: string;
  role: string;
  createdAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'client' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Client = mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
