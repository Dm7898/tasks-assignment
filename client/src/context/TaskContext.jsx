import { createContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

// Create Task Context
const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  // Function to fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks/assigned-tasks");

      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, loading }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
