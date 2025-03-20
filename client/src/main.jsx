import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { TaskProvider } from "./context/TaskContext.jsx";
import { AuthProvider } from "./context/authContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Task Provider */}
    <AuthProvider>
      <TaskProvider>
        {/* Router */}

        <Router>
          {/* notifiactions messages */}
          <Toaster richColors position="top-center" />
          <App />
        </Router>
      </TaskProvider>
    </AuthProvider>
  </StrictMode>
);
