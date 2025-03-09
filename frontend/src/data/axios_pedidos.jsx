import axiosInstance from "./axios_base";

export const enviarPedido = async (datos) => {
    console.log("recibiendo datos del front:", datos)
  try {
    const response = await axiosInstance.post("/pedido", datos);
    return response.data;
  } catch (error) {
    console.error("Error en enviarPedido:", error);
    throw error;
  }
};
