import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axiosInstance";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!validateEmail(email)) {
      toast.warning("Invalid email format");
      return;
    }

    try {
      setLoading(true); // Show loading state
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      login(res.data);
      localStorage.setItem("userRole", JSON.stringify(res.data.userRole));
      localStorage.setItem("token", res.data.token);

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false); // Remove loading state
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 shadow-sm text-gray-600 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 shadow-sm text-gray-600 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
          <button
            type="submit"
            className="w-full lightpink font-bold py-3 rounded-lg shadow-md hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-3 text-center text-gray-600">
            <Link to="#" className="text-[#8d1cdd] hover:underline">
              Forgot Your Password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
