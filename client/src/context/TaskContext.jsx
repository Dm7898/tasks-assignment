import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { AuthContext } from "./authContext";

// Create Task Context
const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agentTaskCounts, setAgentTaskCounts] = useState([]);
  // Function to fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks/assigned-tasks", {
        params: { createdBy: user.userId },
      });
      // console.log(res);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    if (user?.userId) {
      // console.log(user.userId);
      // Ensure userId exists before calling API
      fetchTasks();
    }
  }, [user]);

  const fetchAgentTaskCounts = async () => {
    try {
      const res = await api.get(`/tasks/agent-task-counts/${user.userId}`);
      // console.log("Agent Task Counts:", res.data);
      setAgentTaskCounts(res.data);
    } catch (error) {
      console.error("Error fetching agent task counts:", error);
    }
  };

  // Fetch task counts when component mounts
  useEffect(() => {
    if (user?.userId) {
      fetchAgentTaskCounts();
    }
  }, [user]);
  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        loading,
        agentTaskCounts,
        fetchAgentTaskCounts,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
