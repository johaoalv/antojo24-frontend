import React from "react";
import { Modal, Typography, InputNumber } from "antd";
import { formatCurrency } from "../utils/formatters";
import PrimaryButton from "../../common/components/PrimaryButton";
import SecondaryButton from "../../common/components/SecondaryButton";

const { Text, Title } = Typography;

const ClosingSummaryModal = ({
  visible,
  totalCalculado,
  totalReal,
  onTotalRealChange,
  onConfirm,
  onCancel,
  loading,
}) => {
  const diferencia = totalReal - totalCalculado;
  const tieneDiferencia = diferencia !== 0;
  const esSobrante = diferencia > 0;

  return (
    <Modal
      open={visible}
      footer={null}
      onCancel={onCancel}
      destroyOnClose
      centered
    >
      <div style={{ padding: "10px 0" }}>
        <Title level={4} style={{ textAlign: "center", marginBottom: 24 }}>
          Resumen de Cierre
        </Title>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <Text strong>Total Sistema:</Text>
          <Text>{formatCurrency(totalCalculado)}</Text>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <Text strong>Monto Contado:</Text>
          <Text>{formatCurrency(totalReal)}</Text>
        </div>
        <InputNumber
          style={{ width: "100%", marginBottom: 16 }}
          size="large"
          min={0}
          value={totalReal}
          onChange={onTotalRealChange}
          placeholder="Ingresa el monto contado"
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />

        <div
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 20,
          }}
        >
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Diferencia
          </Text>
          {tieneDiferencia ? (
            <Text
              strong
              style={{
                color: esSobrante ? "green" : "red",
                fontSize: "1.2em",
              }}
            >
              {esSobrante ? "Sobrante" : "Faltante"}:{" "}
              {formatCurrency(Math.abs(diferencia))}
            </Text>
          ) : (
            <Text style={{ fontSize: "1.1em" }}>Sin diferencia</Text>
          )}
        </div>

        <PrimaryButton
          onClick={onConfirm}
          disabled={totalReal <= 0}
          loading={loading}
        >
          Confirmar Cierre
        </PrimaryButton>
        <SecondaryButton
          style={{ marginTop: 12 }}
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </SecondaryButton>
      </div>
    </Modal>
  );
};

export default ClosingSummaryModal;
