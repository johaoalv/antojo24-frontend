import React from "react";
import { Modal, InputNumber, Typography } from "antd";
import { formatCurrency } from "../utils/formatters";

const { Text } = Typography;

const CashModal = ({
  visible,
  total,
  montoRecibido,
  vuelto,
  onMontoChange,
  onOk,
  onCancel,
}) => {
  const isMontoSuficiente =
    typeof montoRecibido === "number" && montoRecibido >= total;
  const isMontoInsuficiente =
    typeof montoRecibido === "number" && montoRecibido < total;

  return (
    <Modal
      title={<span style={{ fontSize: "1.8em" }}>Pago en Efectivo</span>}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={{
        disabled: !isMontoSuficiente,
        style: { height: 45, fontSize: "1.2em" },
      }}
      cancelButtonProps={{ style: { height: 45, fontSize: "1.2em" } }}
      width={500}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: 20,
        }}
      >
        <Text strong style={{ fontSize: "1.5em" }}>
          Total del Pedido: {formatCurrency(total)}
        </Text>
        <InputNumber
          style={{ width: "100%", padding: "10px", fontSize: "1.5em" }}
          placeholder="Monto recibido del cliente"
          min={0}
          size="large"
          value={montoRecibido}
          onChange={onMontoChange}
          autoFocus
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
        {isMontoSuficiente && (
          <Text strong style={{ color: "green", fontSize: "1.6em" }}>
            Vuelto: {formatCurrency(vuelto)}
          </Text>
        )}
        {isMontoInsuficiente && (
          <Text strong style={{ color: "red", fontSize: "1.2em" }}>
            El monto es insuficiente.
          </Text>
        )}
      </div>
    </Modal>
  );
};

export default CashModal;
