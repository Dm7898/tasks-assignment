import axios from "axios";
// api no need write every axios.get etc..
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default api;
