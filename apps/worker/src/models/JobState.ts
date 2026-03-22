import { Schema, model } from "mongoose";

const JobStateSchema = new Schema(
  {
    jobId: { type: String, required: true, index: true, unique: true },
    assignmentId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["queued", "started", "progress", "completed", "failed", "retrying"],
      required: true
    },
    progress: { type: Number, default: 0 },
    message: { type: String, default: "" },
    resultId: { type: String, default: null },
    error: { type: String, default: null }
  },
  { timestamps: true, versionKey: false }
);

export const JobStateModel = model("JobState", JobStateSchema);
