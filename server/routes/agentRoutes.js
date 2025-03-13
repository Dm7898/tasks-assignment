import express from "express";
import { createAgent, getAllAgents } from "../controllers/agentController.js";
const router = express.Router();

router.post("/add", createAgent);
router.get("/", getAllAgents);

export default router;
