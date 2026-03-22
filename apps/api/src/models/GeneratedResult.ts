import { Schema, model, type HydratedDocument } from "mongoose";
import { GeneratedResult } from "@vedaai/shared";

export type GeneratedResultRecord = HydratedDocument<GeneratedResult>;

const GeneratedQuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    marks: { type: Number, required: true }
  },
  { _id: false }
);

const GeneratedSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [GeneratedQuestionSchema], default: [] }
  },
  { _id: false }
);

const GeneratedResultSchema = new Schema<GeneratedResult>(
  {
    assignmentId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    maximumMarks: { type: Number, required: true },
    instructions: { type: [String], default: [] },
    sections: { type: [GeneratedSectionSchema], default: [] },
    answerKey: { type: Array, default: undefined },
    rawModelResponse: { type: String, default: null },
    normalizedPayload: { type: Object, required: true }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        return ret;
      }
    }
  }
);

export const GeneratedResultModel = model<GeneratedResult>("GeneratedResult", GeneratedResultSchema);
