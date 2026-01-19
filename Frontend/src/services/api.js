import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/api", // backend URL
});

// Axios interceptors to inject auth headers globally.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Add the token to every request automatically
  }
  return config;
});

export default api;