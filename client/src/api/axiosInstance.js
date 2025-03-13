import axios from "axios";
// api no need write every axios.get etc..
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://tasks-assignment.onrender.com/api",
});

export default api;
