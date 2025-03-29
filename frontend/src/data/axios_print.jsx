import axiosInstance from "./axios_base";

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
