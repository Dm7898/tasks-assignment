import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Retrieve token and user data from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userRole")); // Assuming { role: "admin" } is stored
  // Check if the user is logged in and is an admin
  if (!token || user !== "admin") {
    return <Navigate to="/not-authorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
