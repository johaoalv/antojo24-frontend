
import axiosInstance from "../core/axios_base";

export const obtenerInversiones = async (sucursalId = "global") => {
    try {
        const params = sucursalId !== "global" ? { sucursal_id: sucursalId } : {};
        const response = await axiosInstance.get("/inversiones", { params });
        return response.data;
    } catch (error) {
        console.error("Error en obtenerInversiones:", error);
        throw error;
    }
};

export const agregarInversion = async (data) => {
    try {
        const response = await axiosInstance.post("/inversiones", data);
        return response.data;
    } catch (error) {
        console.error("Error en agregarInversion:", error);
        throw error;
    }
};

export const eliminarInversion = async (id) => {
    try {
        const response = await axiosInstance.delete(`/inversiones/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error en eliminarInversion:", error);
        throw error;
    }
};
