import { useCallback, useState } from "react";
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
  nombreCliente,
  metodoPago,
  montoRecibido,
  calcularTotal,
  resetPedido,
  resetPagoState,
  priceMap,
  tipoPedido = "local",
  bolsas = 0,
  resetBolsas,
}) => {
  const [loading, setLoading] = useState(false);

  const confirmarPedido = useCallback(async () => {
    if (loading || !metodoPago || Object.keys(pedido).length === 0) {
      return;
    }

    setLoading(true);
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
      tipo_pedido: tipoPedido,
      bolsas,
      fecha,
      sucursal_id,
    };

    if (nombreCliente && nombreCliente.trim()) {
      datos.nombre_cliente = nombreCliente;
    }

    if (metodoPago === "efectivo" && typeof montoRecibido === "number") {
      datos.monto_recibido = montoRecibido;
    }

    try {
      const response = await enviarPedido(datos);

      console.log("-----------------------------------------");
      console.log(`✅ Venta exitosa: ${pedido_id}`);
      console.log("⚠️ Limpiando estado de memoria para evitar duplicados...");

      // Limpiar estado inmediatamente después del éxito para evitar doble envío
      resetPedido();
      resetPagoState();
      if (resetBolsas) resetBolsas();

      console.log("✅ Estado de carrito y pago reiniciado.");
      console.log("-----------------------------------------");

      await imprimirTicket(datos);

      notifySuccess({
        message: "Venta Registrada",
        description: response?.monto_vuelto
          ? `Cambio a entregar: ${formatCurrency(response.monto_vuelto)}`
          : null,
        placement: "bottom",
      });

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
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    calcularTotal,
    metodoPago,
    montoRecibido,
    priceMap,
    pedido,
    resetPagoState,
    resetPedido,
    nombreCliente,
    tipoPedido,
    bolsas,
    resetBolsas,
  ]);

  return { confirmarPedido, loading };
};

export default usePedidoActions;
