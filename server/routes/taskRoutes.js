import express from "express";

import {
  createTasks,
  getAgentTaskCounts,
  getAllTasks,
  upload,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
//task routes
router.post("/upload", upload.single("file"), authMiddleware, createTasks);
router.get("/assigned-tasks", getAllTasks);
router.get("/agent-task-counts/:id", getAgentTaskCounts);
export default router;
