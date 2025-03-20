import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const AuthGuard = ({ children }) => {
  const { user } = useContext(AuthContext);
  // If user is logged in, redirect to dashboard
  console.log(user);
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AuthGuard;
