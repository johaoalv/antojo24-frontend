import React from "react";
import { Modal, Typography, InputNumber, Divider } from "antd";
import { formatCurrency } from "../utils/formatters";
import PrimaryButton from "../../common/components/PrimaryButton";
import SecondaryButton from "../../common/components/SecondaryButton";

const { Text, Title } = Typography;

const ClosingSummaryModal = ({
  visible,
  saldoYappy,
  saldoEfectivo,
  totalReal,
  onTotalRealChange,
  onConfirm,
  onCancel,
  loading,
}) => {
  const diferencia = totalReal - saldoEfectivo;
  const tieneDiferencia = Math.abs(diferencia) > 0.001;
  const esSobrante = diferencia > 0;

  return (
    <Modal open={visible} footer={null} onCancel={onCancel} destroyOnClose centered>
      <div style={{ padding: "10px 0" }}>
        <Title level={4} style={{ textAlign: "center", marginBottom: 24 }}>
          Resumen de Cierre
        </Title>

        {/* Saldos del día */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, background: "#e6f4ff", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Saldo Yappy</Text>
            <div style={{ fontSize: "1.4em", fontWeight: "bold", color: "#1890ff" }}>
              {formatCurrency(saldoYappy)}
            </div>
          </div>
          <div style={{ flex: 1, background: "#f6ffed", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Saldo Efectivo</Text>
            <div style={{ fontSize: "1.4em", fontWeight: "bold", color: "#52c41a" }}>
              {formatCurrency(saldoEfectivo)}
            </div>
          </div>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        {/* Conteo físico de efectivo */}
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          Efectivo contado físicamente:
        </Text>
        <InputNumber
          style={{ width: "100%", marginBottom: 16 }}
          size="large"
          min={0}
          value={totalReal}
          onChange={onTotalRealChange}
          placeholder="Ingresa el monto contado"
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />

        {/* Diferencia efectivo */}
        <div style={{ backgroundColor: "#f5f5f5", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
          <Text strong style={{ display: "block", marginBottom: 6 }}>Diferencia Efectivo</Text>
          {tieneDiferencia ? (
            <Text strong style={{ color: esSobrante ? "green" : "red", fontSize: "1.1em" }}>
              {esSobrante ? "Sobrante" : "Faltante"}: {formatCurrency(Math.abs(diferencia))}
            </Text>
          ) : (
            <Text style={{ fontSize: "1.1em" }}>Sin diferencia</Text>
          )}
        </div>

        <PrimaryButton onClick={onConfirm} disabled={totalReal < 0} loading={loading}>
          Confirmar Cierre
        </PrimaryButton>
        <SecondaryButton style={{ marginTop: 12 }} onClick={onCancel} disabled={loading}>
          Cancelar
        </SecondaryButton>
      </div>
    </Modal>
  );
};

export default ClosingSummaryModal;
