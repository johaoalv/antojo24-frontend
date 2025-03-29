import axios from "axios";

const API_BASE_URL_CLOUD = "https://rapid-food-backend-production.up.railway.app/api"; 
const API_BASE_URL_LOCAL = "http://127.0.0.1:5000/api"
const API_BASE_BACKEND_LOCAL = "https://a267-186-188-142-25.ngrok-free.app "

const axiosInstance = axios.create({
  baseURL: API_BASE_BACKEND_LOCAL,
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
