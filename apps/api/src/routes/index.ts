import { Router } from "express";
import { assignmentRoutes, jobRoutes } from "./assignmentRoutes";
import { healthRoutes } from "./healthRoutes";

export const apiRoutes = Router();

apiRoutes.use(healthRoutes);
apiRoutes.use("/api/assignments", assignmentRoutes);
apiRoutes.use("/api/jobs", jobRoutes);
