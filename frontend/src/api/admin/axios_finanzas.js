import axiosInstance from "../core/axios_base";

export const obtenerMovimientos = async (sucursal_id) => {
    try {
        const params = sucursal_id && sucursal_id !== "global" ? { sucursal_id } : {};
        const response = await axiosInstance.get("/finanzas/movimientos", { params });
        return response.data;
    } catch (error) {
        console.error("Error en obtenerMovimientos:", error);
        throw error;
    }
};

export const getLibroCaja = async (sucursal_id, fecha) => {
    const response = await axiosInstance.get("/finanzas/libro-caja", {
        params: { sucursal_id, fecha },
    });
    return response.data;
};
