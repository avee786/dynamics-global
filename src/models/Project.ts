import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  companyName: string;
  clientName: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  location: string;
  description: string;
  status: "Pending" | "Approved" | "Ongoing" | "Completed";
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    companyName: { type: String, required: true },
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    projectType: { type: String, required: true },
    budget: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Ongoing", "Completed"],
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate mongoose model error
export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
