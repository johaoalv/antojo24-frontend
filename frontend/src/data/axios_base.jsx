import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_NGROK || 
  import.meta.env.VITE_API_BASE_URL_LOCAL || 
  import.meta.env.VITE_API_BASE_URL_CLOUD; 

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
