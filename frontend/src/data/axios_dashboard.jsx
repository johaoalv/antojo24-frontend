import axiosInstance from "./axios_base";

export const obtenerDashboard = async () => {
  try {
    const response = await axiosInstance.get("/dashboard");
    return response.data; 
  } catch (error) {
    console.error("Error en obtenerDashboard:", error);
    throw error;
  }
};
