import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Select, InputNumber, Space, Typography, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatCurrency } from "../utils/formatters";
import { AVAILABLE_PAYMENT_METHODS } from "../constants/payments";

const { Text } = Typography;

const MixedPaymentModal = ({
  visible,
  total,
  onOk,
  onCancel,
  onMethodsChange,
}) => {
  const [methods, setMethods] = useState([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    if (visible) {
      setMethods([]);
      setNextId(0);
    }
  }, [visible]);

  const calcularSuma = (items) => {
    return items.reduce((sum, item) => sum + (parseFloat(item.monto) || 0), 0);
  };

  const suma = calcularSuma(methods);
  const diferencia = parseFloat(total) - suma;
  const esValido = Math.abs(diferencia) < 0.01 && methods.length >= 2;

  const handleAddMethod = () => {
    if (methods.length >= 3) {
      message.warning("Máximo 3 métodos de pago por transacción");
      return;
    }

    const newMethod = {
      id: nextId,
      metodo_pago: "",
      monto: 0,
    };
    setMethods([...methods, newMethod]);
    setNextId(nextId + 1);
  };

  const handleMethodChange = (id, key, value) => {
    const updated = methods.map((m) =>
      m.id === id ? { ...m, [key]: value } : m
    );
    setMethods(updated);

    if (key === "monto" || (key === "metodo_pago" && value)) {
      onMethodsChange(updated);
    }
  };

  const handleRemoveMethod = (id) => {
    const updated = methods.filter((m) => m.id !== id);
    setMethods(updated);
    onMethodsChange(updated);
  };

  const handleConfirm = () => {
    if (!esValido) {
      const msg =
        methods.length < 2
          ? "Se requieren al menos 2 métodos de pago"
          : `La suma no coincide. Total: ${formatCurrency(total)}, Ingresado: ${formatCurrency(suma)}`;
      message.error(msg);
      return;
    }

    // Convertir a formato esperado por backend
    const metodos_pago_detalles = methods.map((m) => ({
      metodo_pago: m.metodo_pago,
      monto: parseFloat(m.monto),
    }));

    onOk(metodos_pago_detalles);
  };

  const columns = [
    {
      title: "Método",
      dataIndex: "metodo_pago",
      key: "metodo_pago",
      render: (_, record) => (
        <Select
          style={{ width: "100%" }}
          placeholder="Seleccionar"
          value={record.metodo_pago || undefined}
          onChange={(value) =>
            handleMethodChange(record.id, "metodo_pago", value)
          }
          options={AVAILABLE_PAYMENT_METHODS.filter(
            (m) =>
              !methods.some(
                (method) =>
                  method.metodo_pago === m.value && method.id !== record.id
              )
          )}
        />
      ),
    },
    {
      title: "Monto",
      dataIndex: "monto",
      key: "monto",
      render: (_, record) => (
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          step={0.01}
          precision={2}
          value={record.monto}
          onChange={(value) =>
            handleMethodChange(record.id, "monto", value || 0)
          }
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      ),
    },
    {
      title: "Acción",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveMethod(record.id)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={<span style={{ fontSize: "1.8em" }}>💳 Pago Mixto</span>}
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel} style={{ height: 45, fontSize: "1.1em" }}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={!esValido}
          onClick={handleConfirm}
          style={{ height: 45, fontSize: "1.1em" }}
        >
          Confirmar Pago
        </Button>,
      ]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ padding: "10px", backgroundColor: "#f0f2f5", borderRadius: "4px" }}>
          <Text strong style={{ fontSize: "1.3em" }}>
            Total del Pedido: {formatCurrency(total)}
          </Text>
        </div>

        <Table
          dataSource={methods}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="id"
          style={{ marginBottom: 20 }}
        />

        <Button
          type="dashed"
          onClick={handleAddMethod}
          disabled={methods.length >= 3}
          style={{ width: "100%", height: 40, fontSize: "1.1em" }}
          icon={<PlusOutlined />}
        >
          Agregar Método de Pago
        </Button>

        <div style={{ padding: "10px", backgroundColor: "#fafafa", borderRadius: "4px" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text>Suma de pagos: </Text>
              <Text strong style={{ fontSize: "1.2em", color: "#1890ff" }}>
                {formatCurrency(suma)}
              </Text>
            </div>
            {diferencia !== 0 && (
              <div>
                <Text>Diferencia: </Text>
                <Text
                  strong
                  style={{
                    fontSize: "1.2em",
                    color: Math.abs(diferencia) < 0.01 ? "green" : "red",
                  }}
                >
                  {diferencia > 0 ? "Falta " : "Sobra "}
                  {formatCurrency(Math.abs(diferencia))}
                </Text>
              </div>
            )}
          </Space>
        </div>

        {methods.length < 2 && (
          <Text type="warning" style={{ fontSize: "1em" }}>
            ⚠️ Se requieren al menos 2 métodos de pago
          </Text>
        )}
      </div>
    </Modal>
  );
};

export default MixedPaymentModal;
