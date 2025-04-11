import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // ✅ change this to your backend URL if deployed
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token automatically if available
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const loginUser = (data: { email: string; password: string }) =>
  API.post("/login", data);

export const registerUser = (data: { email: string; password: string; role: string }) =>
  API.post("/register", data);

export const getUserProfile = () => API.get("/user");

export const updateUserProfile = (data: any) => API.put("/user", data);

export const fetchJobs = () => API.get("/jobs");

export const postJob = (data: any) => API.post("/jobs", data);

export const applyToJob = (jobId: string) => API.post(`/apply/${jobId}`);

export const getMatches = () => API.get("/match");

export default API;
