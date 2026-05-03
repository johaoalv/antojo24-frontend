import axiosInstance from "../core/axios_base";

export const getResumenVentas = async () => {
  const sucursal_id = localStorage.getItem("sucursal_id");
  const response = await axiosInstance.get(`/pedidos-hoy?sucursal_id=${sucursal_id}`);
  return response.data;
};

export const getPedidoDetalle = async (pedido_id) => {
  const response = await axiosInstance.get(`/finanzas/pedido-detalle/${pedido_id}`);
  return response.data;
};

export const getMovimientosHoy = async () => {
  const sucursal_id = localStorage.getItem("sucursal_id");
  const hoy = new Date();
  // Fecha Panama (UTC-5)
  const fechaPanama = new Date(hoy.getTime() - 5 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const response = await axiosInstance.get("/finanzas/libro-caja", {
    params: { sucursal_id, fecha: fechaPanama },
  });
  return response.data;
};

export const hacerCierreCaja = async (total_real) => {

  const sucursal_id = localStorage.getItem("sucursal_id");
  const creado_por = sucursal_id.replace("sucursal_", "");
  const payload = { sucursal_id, creado_por, total_real };
  const response = await axiosInstance.post("/cierre-caja", payload);

  return response.data;

};
