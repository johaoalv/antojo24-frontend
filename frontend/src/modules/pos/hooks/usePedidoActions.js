import { useCallback } from "react";
import { enviarPedido } from "../../../api/pos/axios_pedidos";
import { getPanamaTime } from "../utils/get_time";
import { imprimirTicket } from "../utils/print";
import { generateUUID } from "../utils/uuid-generetaro";
import { formatCurrency } from "../utils/formatters";
import {
  notifyError,
  notifySuccess,
} from "../../common/components/notifications.jsx";

const usePedidoActions = ({
  pedido,
  metodoPago,
  montoRecibido,
  calcularTotal,
  resetPedido,
  resetPagoState,
  priceMap,
}) => {
  const confirmarPedido = useCallback(async () => {
    if (!metodoPago || Object.keys(pedido).length === 0) {
      return;
    }

    const pedido_id = generateUUID();
    const fecha = getPanamaTime();
    const total = calcularTotal();
    const sucursal_id = localStorage.getItem("sucursal_id");

    const pedidoFormateado = Object.entries(pedido).map(
      ([producto, cantidad]) => ({
        producto,
        cantidad,
        total_item: cantidad * (priceMap[producto] || 0),
        pedido_id,
      })
    );

    const datos = {
      pedido_id,
      pedido: pedidoFormateado,
      total_pedido: total,
      metodo_pago: metodoPago,
      fecha,
      sucursal_id,
    };

    if (metodoPago === "efectivo" && typeof montoRecibido === "number") {
      datos.monto_recibido = montoRecibido;
    }

    try {
      const response = await enviarPedido(datos);
      await imprimirTicket(datos);

      notifySuccess({
        message: "Venta Registrada",
        description: response?.monto_vuelto
          ? `Cambio a entregar: ${formatCurrency(response.monto_vuelto)}`
          : null,
        placement: "bottom",
      });

      resetPedido();
      resetPagoState();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        notifyError({
          message: error.response.data.error || "Agotado",
          description: error.response.data.detalles || "No hay stock suficiente.",
          placement: "topRight",
        });
      } else {
        notifyError({
          message: "Error de Conexión",
          description: "No se pudo conectar con el servidor. Revisa tu conexión.",
          placement: "topRight",
        });
      }
      console.error("Error en confirmarPedido:", error);
    }
  }, [
    calcularTotal,
    metodoPago,
    montoRecibido,
    priceMap,
    pedido,
    resetPagoState,
    resetPedido,
  ]);

  return { confirmarPedido };
};

export default usePedidoActions;
