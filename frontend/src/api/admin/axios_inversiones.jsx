
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const obtenerInversiones = async () => {
    const response = await axios.get(`${API_URL}/api/inversiones`, { withCredentials: true });
    return response.data;
};

export const agregarInversion = async (data) => {
    const response = await axios.post(`${API_URL}/api/inversiones`, data, { withCredentials: true });
    return response.data;
};

export const eliminarInversion = async (id) => {
    const response = await axios.delete(`${API_URL}/api/inversiones/${id}`, { withCredentials: true });
    return response.data;
};
