import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const obtenerMovimientos = async (sucursal_id) => {
    const params = sucursal_id && sucursal_id !== "global" ? { sucursal_id } : {};
    const response = await instance.get("/api/finanzas/movimientos", { params });
    return response.data;
};
