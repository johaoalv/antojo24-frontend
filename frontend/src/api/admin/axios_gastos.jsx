import axiosInstance from "../core/axios_base";

export const obtenerGastos = async (sucursal_id) => {
    try {
        const response = await axiosInstance.get(`/gastos?sucursal_id=${sucursal_id || "global"}`);
        return response.data;
    } catch (error) {
        console.error("Error en obtenerGastos:", error);
        throw error;
    }
};

export const agregarGasto = async (datos) => {
    try {
        const response = await axiosInstance.post("/gastos", datos);
        return response.data;
    } catch (error) {
        console.error("Error en agregarGasto:", error);
        throw error;
    }
};

export const eliminarGasto = async (id) => {
    try {
        const response = await axiosInstance.delete(`/gastos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error en eliminarGasto:", error);
        throw error;
    }
};
