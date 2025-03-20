import xlsx from "xlsx";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Task from "../models/Task.js";
import Agent from "../models/Agent.js";
import mongoose from "mongoose";
import { count } from "console";

// Convert ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the "uploads" directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
//store file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage, // Use diskStorage to save the file
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.ms-excel",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only CSV/XLSX files allowed"), false);
    }
    cb(null, true);
  },
});

export const createTasks = async (req, res) => {
  try {
    const adminId = req.body.adminId;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get the uploaded file path
    const filePath = req.file.path;

    // Read the file from disk
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    // console.log(data);
    // Validate file structure
    if (!data.every((row) => row.firstname && row.phone && row.notes)) {
      fs.unlinkSync(filePath); // Remove invalid file
      return res.status(400).json({
        message: "Invalid file format. Required: firstname, phone, notes",
      });
    }

    // Get existing tasks from the database
    const existingTasks = await Task.find({}, "firstname phone notes");
    console.log(existingTasks);
    // Check for duplicates
    const duplicateEntries = data.filter((newTask) =>
      existingTasks.some(
        (existingTask) =>
          existingTask.firstname.trim().toLowerCase() ===
            newTask.firstname.trim().toLowerCase() &&
          existingTask.phone.trim() === newTask.phone.trim() &&
          existingTask.notes.trim().toLowerCase() ===
            newTask.notes.trim().toLowerCase()
      )
    );

    if (duplicateEntries.length > 0) {
      fs.unlinkSync(filePath); // Remove file if duplicates exist
      return res.status(400).json({
        message: "Duplicate content detected! File cannot be uploaded.",
        duplicates: duplicateEntries,
      });
    }

    // If no duplicates, keep the file and proceed with task distribution
    const agents = await Agent.find({ adminId });
    if (agents.length === 0) {
      fs.unlinkSync(filePath); // Remove file if no agents exist
      return res.status(400).json({ message: "No agents available" });
    }
    // console.log(agents);

    let taskIndex = 0;
    const distributedTasks = data.map((task) => {
      const assignedAgent = agents[taskIndex % agents.length];
      taskIndex++;
      return { ...task, assignedTo: assignedAgent._id, createdBy: adminId };
    });

    await Task.insertMany(distributedTasks);

    res.status(200).json({
      message: "Tasks uploaded and distributed successfully",
      filePath,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing file", error: error.message });
  }
};
//get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const { createdBy: adminId } = req.query;
    // console.log(adminId);
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    const tasks = await Task.find({ createdBy: adminId }).populate(
      "assignedTo",
      "name email"
    );
    // console.log(tasks);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const getAgentTaskCounts = async (req, res) => {
  try {
    const { id: adminId } = req.params;
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    // Aggregate tasks and count per agent
    const taskCounts = await Task.aggregate([
      {
        $match: { createdBy: new mongoose.Types.ObjectId(adminId) },
      },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "agents",
          localField: "_id",
          foreignField: "_id",
          as: "agentDetails",
        },
      },
      { $unwind: { path: "$agentDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          agentId: "$_id",
          agentName: "$agentDetails.name",
          agentEmail: "$agentDetails.email",
          agentMobile: "$agentDetails.mobile",
          agentPassword: "$agentDetails.password",
          count: 1,
        },
      },
    ]);
    // console.log(taskCounts, adminId);

    res.json(taskCounts);
  } catch (error) {
    console.error("Error fetching task counts:", error);
    res.status(500).json({ message: "Error fetching task counts" });
  }
};
