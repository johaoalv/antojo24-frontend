import axiosInstance from "../core/axios_base";

export const autenticarPin = async (pin, ip_cliente) => {

    try {
        const response = await axiosInstance.post("/login", { pin, ip_cliente });
        return response;
    } catch (error) {
        console.error("Error en autenticarPin:", error);
        throw error;
    }
};
