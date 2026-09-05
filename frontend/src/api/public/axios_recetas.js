import axiosInstance from "../core/axios_base";

export const fetchRecetas = async () => {
  const response = await axiosInstance.get("/recetas");
  return response.data;
};
