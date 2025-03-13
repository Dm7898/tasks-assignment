import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" }, // Assigned agent
});
// 🔹 Prevent duplicate tasks (same firstname, phone, and notes)
taskSchema.index({ firstname: 1, phone: 1, notes: 1 }, { unique: true });
const Task = mongoose.model("Task", taskSchema);
export default Task;
