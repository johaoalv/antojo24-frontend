import { message } from "antd";
import { useCallback, useState } from "react";

const useMetodoPago = (calcularTotal) => {
  const [metodoPago, setMetodoPago] = useState("");
  const [isCashModalVisible, setIsCashModalVisible] = useState(false);
  const [isMixedModalVisible, setIsMixedModalVisible] = useState(false);
  const [montoRecibido, setMontoRecibido] = useState(null);
  const [vuelto, setVuelto] = useState(0);
  const [metodosPagoDetalles, setMetodosPagoDetalles] = useState([]);

  const resetPagoState = useCallback(() => {
    setMetodoPago("");
    setIsCashModalVisible(false);
    setIsMixedModalVisible(false);
    setMontoRecibido(null);
    setVuelto(0);
    setMetodosPagoDetalles([]);
  }, []);

  const handleMetodoPagoChange = useCallback((value) => {
    setMetodoPago(value);

    if (value === "efectivo") {
      setIsCashModalVisible(true);
      setIsMixedModalVisible(false);
    } else if (value === "mixto") {
      setIsMixedModalVisible(true);
      setIsCashModalVisible(false);
      setMontoRecibido(null);
      setVuelto(0);
    } else {
      setIsCashModalVisible(false);
      setIsMixedModalVisible(false);
      setMontoRecibido(null);
      setVuelto(0);
      setMetodosPagoDetalles([]);
    }
  }, []);

  const handleMontoRecibidoChange = useCallback(
    (value) => {
      setMontoRecibido(value);
      const total = calcularTotal();
      if (typeof value === "number" && value >= total) {
        setVuelto(value - total);
      } else {
        setVuelto(0);
      }
    },
    [calcularTotal]
  );

  const handleCashModalOk = useCallback(() => {
    const total = calcularTotal();
    if ((montoRecibido ?? 0) >= total) {
      setIsCashModalVisible(false);
    } else {
      message.error("El monto recibido no puede ser menor al total del pedido.");
    }
  }, [calcularTotal, montoRecibido]);

  const handleCashModalCancel = useCallback(() => {
    setIsCashModalVisible(false);
    setMontoRecibido(null);
    setVuelto(0);
    if (metodoPago === "efectivo") {
      setMetodoPago("");
    }
  }, [metodoPago]);

  const handleMixedPaymentChange = useCallback((methods) => {
    setMetodosPagoDetalles(methods);
  }, []);

  const handleMixedModalOk = useCallback(
    (metodos_pago_detalles) => {
      const total = calcularTotal();

      // Calcular vuelto si hay efectivo en la mezcla
      let newVuelto = 0;
      for (const metodo of metodos_pago_detalles) {
        if (metodo.metodo_pago === "efectivo") {
          const montoEfectivo = parseFloat(montoRecibido) || metodo.monto;
          newVuelto = montoEfectivo - metodo.monto;
          break;
        }
      }

      setVuelto(newVuelto);
      setIsMixedModalVisible(false);
    },
    [calcularTotal, montoRecibido]
  );

  const handleMixedModalCancel = useCallback(() => {
    setIsMixedModalVisible(false);
    setMetodosPagoDetalles([]);
    setMetodoPago("");
  }, []);

  return {
    metodoPago,
    isCashModalVisible,
    isMixedModalVisible,
    montoRecibido,
    vuelto,
    metodosPagoDetalles,
    handleMetodoPagoChange,
    handleMontoRecibidoChange,
    handleCashModalOk,
    handleCashModalCancel,
    handleMixedPaymentChange,
    handleMixedModalOk,
    handleMixedModalCancel,
    resetPagoState,
  };
};

export default useMetodoPago;
