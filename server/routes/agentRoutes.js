import express from "express";
import { createAgent, getAllAgents } from "../controllers/agentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
//agent routes
router.post("/add", authMiddleware, createAgent);
router.get("/", getAllAgents);

export default router;
