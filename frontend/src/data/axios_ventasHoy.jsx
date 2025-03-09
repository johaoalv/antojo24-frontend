import axiosInstance from "./axios_base";

export const obtenerVentasHoy = async () => {
  try {
    const response = await axiosInstance.get("/ventas-hoy");
    console.log("Respuesta de Axios:", response.data);
    return response.data; // Retorna el total de ventas
  } catch (error) {
    console.error("Error en obtenerVentasHoy:", error);
    throw error;
  }
};
