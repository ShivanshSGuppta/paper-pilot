import { AssignmentModel } from "../models/Assignment";
import { GeneratedResultModel } from "../models/GeneratedResult";
import { DEFAULT_CLASS_NAME, DEFAULT_DURATION_MINUTES, DEFAULT_SCHOOL_NAME, DEFAULT_SUBJECT } from "@vedaai/shared";

export async function seedDemoData() {
  const existing = await AssignmentModel.findOne({ promptSignature: "demo-signature-electricity" }).lean();
  if (existing) return;

  const result = await GeneratedResultModel.create({
    assignmentId: "demo-assignment-1",
    title: "Quiz on Electricity",
    schoolName: DEFAULT_SCHOOL_NAME,
    subject: DEFAULT_SUBJECT,
    className: DEFAULT_CLASS_NAME,
    durationMinutes: DEFAULT_DURATION_MINUTES,
    maximumMarks: 12,
    instructions: ["Read all questions carefully.", "Attempt all questions."],
    sections: [
      {
        id: "section-a",
        title: "Section A",
        instruction: "Answer all questions.",
        questions: [
          {
            id: "section-a-q1",
            text: "Define electric current in one sentence.",
            type: "short_answer",
            difficulty: "easy",
            marks: 2
          },
          {
            id: "section-a-q2",
            text: "What is the SI unit of resistance?",
            type: "short_answer",
            difficulty: "easy",
            marks: 2
          }
        ]
      },
      {
        id: "section-b",
        title: "Section B",
        instruction: "Answer any two questions.",
        questions: [
          {
            id: "section-b-q1",
            text: "Explain how a simple electric circuit works.",
            type: "long_answer",
            difficulty: "medium",
            marks: 4
          },
          {
            id: "section-b-q2",
            text: "Draw and label a basic circuit diagram with cell, bulb, and switch.",
            type: "diagram",
            difficulty: "hard",
            marks: 4
          }
        ]
      }
    ],
    normalizedPayload: {
      title: "Quiz on Electricity",
      schoolName: DEFAULT_SCHOOL_NAME,
      subject: DEFAULT_SUBJECT,
      className: DEFAULT_CLASS_NAME,
      durationMinutes: DEFAULT_DURATION_MINUTES,
      maximumMarks: 12,
      instructions: ["Read all questions carefully.", "Attempt all questions."],
      sections: [
        {
          id: "section-a",
          title: "Section A",
          instruction: "Answer all questions.",
          questions: [
            {
              id: "section-a-q1",
              text: "Define electric current in one sentence.",
              type: "short_answer",
              difficulty: "easy",
              marks: 2
            },
            {
              id: "section-a-q2",
              text: "What is the SI unit of resistance?",
              type: "short_answer",
              difficulty: "easy",
              marks: 2
            }
          ]
        },
        {
          id: "section-b",
          title: "Section B",
          instruction: "Answer any two questions.",
          questions: [
            {
              id: "section-b-q1",
              text: "Explain how a simple electric circuit works.",
              type: "long_answer",
              difficulty: "medium",
              marks: 4
            },
            {
              id: "section-b-q2",
              text: "Draw and label a basic circuit diagram with cell, bulb, and switch.",
              type: "diagram",
              difficulty: "hard",
              marks: 4
            }
          ]
        }
      ],
      answerKey: [
        { questionRef: "section-a-q1", answer: "Electric current is the flow of electric charge." }
      ]
    }
  });

  await AssignmentModel.create({
    title: "Quiz on Electricity",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    source: {
      fileName: "electricity-reference.txt",
      fileType: "txt",
      extractedText: "Current, circuit, resistance, conductors, and insulators."
    },
    questionBlueprint: [
      { type: "short_answer", count: 2, marksPerQuestion: 2 },
      { type: "long_answer", count: 2, marksPerQuestion: 4 }
    ],
    additionalInstructions: "Keep language simple and age-appropriate.",
    totalQuestions: 4,
    totalMarks: 12,
    teacherName: "John Doe",
    teacherEmail: "john.doe@vedaai.school",
    schoolName: DEFAULT_SCHOOL_NAME,
    subject: DEFAULT_SUBJECT,
    className: DEFAULT_CLASS_NAME,
    durationMinutes: DEFAULT_DURATION_MINUTES,
    maximumMarks: 12,
    status: "completed",
    generationJobId: "demo-job-1",
    resultId: result.id,
    promptSignature: "demo-signature-electricity"
  });
}
