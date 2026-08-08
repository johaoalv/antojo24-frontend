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

export const obtenerTesoreria = async (sucursalId = "global") => {
  try {
    const params = sucursalId !== "global" ? { sucursal_id: sucursalId } : {};
    const response = await axiosInstance.get("/dashboard/tesoreria", { params });
    return response.data;
  } catch (error) {
    console.error("Error en obtenerTesoreria:", error);
    throw error;
  }
};

export const obtenerHistorialDiarioMes = async (mes, sucursalId = "global") => {
  try {
    const params = { mes };
    if (sucursalId !== "global") params.sucursal_id = sucursalId;
    const response = await axiosInstance.get("/dashboard/historial-diario-mes", { params });
    return response.data;
  } catch (error) {
    console.error("Error en obtenerHistorialDiarioMes:", error);
    throw error;
  }
};

export const obtenerTiendas = async () => {
  try {
    const response = await axiosInstance.get("/tiendas");
    if (!response.data) {
      console.warn("Respuesta vacía en /tiendas");
      return [];
    }
    return response.data.map(t => ({ nombre: t.nombre, sucursal_id: t.sucursal_id }));
  } catch (error) {
    console.error("Error en obtenerTiendas:", error);
    return []; // Return empty array instead of throwing to avoid breaking Promise.all
  }
};
