import axios from "axios";

// Your Spring Boot backend runs on port 9090.
// withCredentials is required so the authToken cookie is sent with every request.
const api = axios.create({
  baseURL: "http://localhost:9090",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
