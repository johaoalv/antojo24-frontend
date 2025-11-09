import { message } from "antd";
import { useCallback, useState } from "react";

const useMetodoPago = (calcularTotal) => {
  const [metodoPago, setMetodoPago] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [montoRecibido, setMontoRecibido] = useState(null);
  const [vuelto, setVuelto] = useState(0);

  const resetPagoState = useCallback(() => {
    setMetodoPago("");
    setIsModalVisible(false);
    setMontoRecibido(null);
    setVuelto(0);
  }, []);

  const handleMetodoPagoChange = useCallback((value) => {
    setMetodoPago(value);
    if (value === "efectivo") {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
      setMontoRecibido(null);
      setVuelto(0);
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

  const handleModalOk = useCallback(() => {
    const total = calcularTotal();
    if ((montoRecibido ?? 0) >= total) {
      setIsModalVisible(false);
    } else {
      message.error("El monto recibido no puede ser menor al total del pedido.");
    }
  }, [calcularTotal, montoRecibido]);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    setMontoRecibido(null);
    setVuelto(0);
    if (metodoPago === "efectivo") {
      setMetodoPago("");
    }
  }, [metodoPago]);

  return {
    metodoPago,
    isModalVisible,
    montoRecibido,
    vuelto,
    handleMetodoPagoChange,
    handleMontoRecibidoChange,
    handleModalOk,
    handleModalCancel,
    resetPagoState,
  };
};

export default useMetodoPago;
