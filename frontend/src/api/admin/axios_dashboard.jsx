import axiosInstance from "../core/axios_base";

export const obtenerDashboard = async (sucursalId = "global") => {
  try {
    const params = sucursalId !== "global" ? { sucursal_id: sucursalId } : {};
    const response = await axiosInstance.get("/dashboard", { params });
    return response.data;
  } catch (error) {
    console.error("Error en obtenerDashboard:", error);
    throw error;
  }
};

export const obtenerTiendas = async () => {
  try {
    const response = await axiosInstance.get("/dashboard");
    if (!response.data || !response.data.por_tienda) {
      console.warn("No por_tienda in dashboard response");
      return [];
    }
    return response.data.por_tienda.map(t => ({ nombre: t.nombre, sucursal_id: t.sucursal_id }));
  } catch (error) {
    console.error("Error en obtenerTiendas:", error);
    return []; // Return empty array instead of throwing to avoid breaking Promise.all
  }
};
