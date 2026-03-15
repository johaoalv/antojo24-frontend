import axiosInstance from "../core/axios_base";

export const fetchProductos = async () => {
  try {
    const response = await axiosInstance.get(`/productos/`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo productos", error);
    throw error;
  }
};
