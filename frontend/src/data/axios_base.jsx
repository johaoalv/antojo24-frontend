import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Manejo global de errores
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error("Error en la API:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
