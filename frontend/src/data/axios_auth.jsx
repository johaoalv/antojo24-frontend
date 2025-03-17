import axiosInstance from "./axios_base";

export const autenticarPin = async (pin) => {
    console.log("Enviando PIN al backend:", pin);
    try {
        const response = await axiosInstance.post("/login", { pin });
        console.log("Respuesta de Axios:", response);
        return response;
    } catch (error) {
        console.error("Error en autenticarPin:", error);
        throw error;
    }
};
