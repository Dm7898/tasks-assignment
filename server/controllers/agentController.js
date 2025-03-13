import Agent from "../models/Agent.js";
// import bcrypt from "bcryptjs";

export const createAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = new Agent({
      name,
      email,
      mobile,
      password,
    });

    await newAgent.save();
    res.status(201).json({ message: "Agent added successfully" });
  } catch (error) {
    if (error.code === 11000) {
      // Extract duplicate key field
      const duplicateField = Object.keys(error.keyPattern)[0];

      let errorMessage = "Some field value already !"; // Default error message

      if (duplicateField === "name") {
        errorMessage = "Name already exists!";
      } else if (duplicateField === "email") {
        errorMessage = "Email already exists!";
      } else if (duplicateField === "mobile") {
        errorMessage = "Mobile number already exists!";
      }

      return res.status(400).json({ error: errorMessage });
    }
    res.status(500).json({ error: error.message });
  }
};
//get all agents
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agents" });
  }
};
