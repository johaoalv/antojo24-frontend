import axiosInstance from "../core/axios_base";

export const getResumenVentas = async () => {
  const sucursal_id = localStorage.getItem("sucursal_id");
  const response = await axiosInstance.get(
    `/pedidos-hoy?sucursal_id=${sucursal_id}`
  );
  console.log(response.data);
  return response.data;
};

export const hacerCierreCaja = async (total_real) => {
  const sucursal_id = localStorage.getItem("sucursal_id");
  const creado_por = sucursal_id.replace("sucursal_", "");
  const payload = { sucursal_id, creado_por, total_real };
  console.log("payload",payload);
  const response = await axiosInstance.post("/cierre-caja", payload);
  return response.data;
};
