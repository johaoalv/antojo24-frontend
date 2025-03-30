import axiosInstance from "./axios_base";
import axios  from "axios";

const axiosPrint = axios.create({
  baseUrl: import.meta.env.VITE_API_BASE_URL_NGROK,
  headers: {
    "Content-Type": "application/json",
  },

})

export const imprimirTicket = async (datos) => {
    console.log("enviando datos al backend para impresion:", datos)
  try {
    const response = await axiosInstance.post("/imprimir-ticket", datos);
    return response.data;
  } catch (error) {
    console.error("Error en imprimir ticket:", error);
    throw error;
  }
};
