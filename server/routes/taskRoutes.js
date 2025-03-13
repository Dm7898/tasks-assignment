import express from "express";

import {
  createTasks,
  getAllTasks,
  upload,
} from "../controllers/taskController.js";

const router = express.Router();
//task routes
router.post("/upload", upload.single("file"), createTasks);
router.get("/assigned-tasks", getAllTasks);

export default router;
