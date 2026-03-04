import axiosInstance from "../core/axios_base";

export const enviarPedido = async (datos) => {

  try {
    const response = await axiosInstance.post("/pedido", datos);
    return response.data;
  } catch (error) {
    console.error("Error en enviarPedido:", error);
    throw error;
  }

};
export const eliminarPedido = async (pedido_id) => {
  try {
    const response = await axiosInstance.delete(`/pedido/${pedido_id}`);
    return response.data;
  } catch (error) {
    console.error("Error en eliminarPedido:", error);
    throw error;
  }
};
