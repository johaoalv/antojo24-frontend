
import axiosInstance from "../core/axios_base";

export const obtenerInyecciones = async (sucursal_id) => {
    try {
        const response = await axiosInstance.get(`/inyecciones?sucursal_id=${sucursal_id || "global"}`);
        return response.data;
    } catch (error) {
        console.error("Error en obtenerInyecciones:", error);
        throw error;
    }
};

export const agregarInyeccion = async (datos) => {
    try {
        const response = await axiosInstance.post("/inyecciones", datos);
        return response.data;
    } catch (error) {
        console.error("Error en agregarInyeccion:", error);
        throw error;
    }
};

export const eliminarInyeccion = async (id) => {
    try {
        const response = await axiosInstance.delete(`/inyecciones/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error en eliminarInyeccion:", error);
        throw error;
    }
};
