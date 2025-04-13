import axiosInstance from "./axios_base";

export const autenticarPin = async (pin) => {

    try {
        const response = await axiosInstance.post("/login", { pin });
        return response;
    } catch (error) {
        console.error("Error en autenticarPin:", error);
        throw error;
    }
};
