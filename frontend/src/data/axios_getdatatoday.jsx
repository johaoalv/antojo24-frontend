import axiosInstance from "./axios_base";

export const obtenerPedidosHoy = async () => {
  try {
    const sucursal_id = localStorage.getItem("sucursal_id");
    const response = await axiosInstance.get(`/pedidos-hoy?sucursal_id=${sucursal_id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    throw error;
  }
};