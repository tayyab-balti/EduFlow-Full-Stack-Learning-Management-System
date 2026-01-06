import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/api", // backend URL
});

// Add the token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // If token exists, attach it to the request
  }
  return config;
});

export default api;