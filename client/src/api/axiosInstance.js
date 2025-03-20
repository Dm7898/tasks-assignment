import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Ensure cookies/auth headers are included
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Always fetch the latest token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// console.log(localStorage.getItem("token"));
// console.log(import.meta.env.VITE_API_URL);
export default api;
