import { Router } from "express";
import { createAssignment, deleteAssignment, downloadPdf, getAssignment, getAssignmentResult, getJobStatus, listAssignments, regenerateAssignment } from "../controllers/assignmentController";
import { upload } from "../middleware/upload";

export const assignmentRoutes = Router();

assignmentRoutes.get("/", listAssignments);
assignmentRoutes.post("/", upload.single("file"), createAssignment);
assignmentRoutes.get("/:id", getAssignment);
assignmentRoutes.get("/:id/result", getAssignmentResult);
assignmentRoutes.post("/:id/regenerate", regenerateAssignment);
assignmentRoutes.delete("/:id", deleteAssignment);
assignmentRoutes.get("/:id/pdf", downloadPdf);

export const jobRoutes = Router();
jobRoutes.get("/:jobId/status", getJobStatus);
