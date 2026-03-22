import { Schema, model, type HydratedDocument } from "mongoose";
import { AssignmentDocument } from "@vedaai/shared";

export type AssignmentRecord = HydratedDocument<AssignmentDocument>;

const AssignmentSchema = new Schema<AssignmentDocument>(
  {
    title: { type: String, trim: true },
    dueDate: { type: String, required: true },
    source: {
      fileName: { type: String, default: null },
      fileType: { type: String, enum: ["pdf", "txt"], default: null },
      extractedText: { type: String, default: null },
      originalUploadPath: { type: String, default: null },
      storageKey: { type: String, default: null }
    },
    questionBlueprint: [
      {
        type: { type: String, required: true },
        count: { type: Number, required: true },
        marksPerQuestion: { type: Number, required: true }
      }
    ],
    additionalInstructions: { type: String, default: "" },
    totalQuestions: { type: Number, required: true, default: 0 },
    totalMarks: { type: Number, required: true, default: 0 },
    teacherName: { type: String, default: "John Doe" },
    teacherEmail: { type: String, default: "john.doe@vedaai.school" },
    schoolName: { type: String, default: "Delhi Public School Sector-4, Bokaro" },
    subject: { type: String, default: "English" },
    className: { type: String, default: "5th" },
    durationMinutes: { type: Number, default: 45 },
    maximumMarks: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "queued", "generating", "completed", "failed"], default: "draft" },
    generationJobId: { type: String, default: null },
    resultId: { type: String, default: null },
    promptSignature: { type: String, default: "" }
  },
  { timestamps: true, versionKey: false }
);

export const AssignmentModel = model<AssignmentDocument>("Assignment", AssignmentSchema);
