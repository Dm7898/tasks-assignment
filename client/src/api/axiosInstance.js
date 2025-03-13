import axios from "axios";
// api no need write every axios.get etc..
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000/api",
  withCredentials: true, // Ensure cookies/auth headers are included
});

console.log(import.meta.env.VITE_API_URL);
export default api;
