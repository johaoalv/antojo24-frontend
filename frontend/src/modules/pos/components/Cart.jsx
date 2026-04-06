import React from "react";
import { DollarCircleOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import CartItem from "./CartItem";
import PaymentsSelect from "./PaymentsSelect";
import { formatCurrency } from "../utils/formatters";
import PrimaryButton from "../../common/components/PrimaryButton";
import SecondaryButton from "../../common/components/SecondaryButton";

const Cart = ({
  pedido,
  buscarProducto,
  priceMap,
  onAjustarCantidad,
  total,
  metodoPago,
  paymentOptions,
  onMetodoPagoChange,
  onConfirmar,
  disabled,
  onNavigateToCierre,
  nombreCliente,
  onNombreClienteChange,
  loading,
  tipoPedido,
  onTipoPedidoChange,
  bolsas,
  onBolsasChange,
}) => (
  <div
    style={{
      width: "100%",
      border: "1px solid #ddd",
      borderRadius: 16,
      padding: "clamp(15px, 4vw, 25px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      marginBottom: 100,
      backgroundColor: "#fff"
    }}
  >
    <h3 style={{ fontSize: "clamp(1.5em, 5vw, 2.5em)", textAlign: "center", marginBottom: 10 }}>
      Carrito
    </h3>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <Select
        value={tipoPedido}
        onChange={onTipoPedidoChange}
        style={{ width: 200 }}
        options={[
          { label: "Local", value: "local" },
          { label: "PedidosYa", value: "pedidosya" },
          { label: "Uber", value: "uber" }
        ]}
      />
    </div>
    {Object.entries(pedido).map(([producto, cantidad]) => {
      const productoInfo = buscarProducto(producto);
      const precio = priceMap[producto] || 0;
      return (
        <CartItem
          key={producto}
          producto={producto}
          cantidad={cantidad}
          imagen={productoInfo?.imagen}
          precio={precio}
          onDecrease={() => onAjustarCantidad(producto, cantidad - 1)}
          onIncrease={() => onAjustarCantidad(producto, cantidad + 1)}
        />
      );
    })}

    <div style={{
      marginTop: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      backgroundColor: "#f5f5f5",
      borderRadius: 10,
      border: "1px dashed #d9d9d9"
    }}>
      <span style={{ fontSize: "1.1em", fontWeight: 500 }}>Bolsas de entrega</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => onBolsasChange(Math.max(0, bolsas - 1))}
          style={{
            width: 32, height: 32, borderRadius: 6, border: "1px solid #d9d9d9",
            backgroundColor: bolsas === 0 ? "#f5f5f5" : "#fff", cursor: bolsas === 0 ? "default" : "pointer",
            fontSize: "1.2em", display: "flex", alignItems: "center", justifyContent: "center"
          }}
          disabled={bolsas === 0}
        >-</button>
        <span style={{ fontSize: "1.3em", fontWeight: "bold", minWidth: 24, textAlign: "center" }}>{bolsas}</span>
        <button
          onClick={() => onBolsasChange(bolsas + 1)}
          style={{
            width: 32, height: 32, borderRadius: 6, border: "1px solid #d9d9d9",
            backgroundColor: "#fff", cursor: "pointer", fontSize: "1.2em",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >+</button>
      </div>
    </div>

    <div style={{ marginTop: 20 }}>
      <Input
        placeholder="Nombre del cliente (opcional)"
        value={nombreCliente}
        onChange={(e) => onNombreClienteChange(e.target.value)}
        style={{
          fontSize: "1.2em",
          padding: "10px",
          borderRadius: "8px"
        }}
      />
    </div>

    <div style={{ marginTop: 20 }}>
      <PaymentsSelect
        value={metodoPago}
        options={paymentOptions}
        onChange={onMetodoPagoChange}
      />
    </div>

    <div
      style={{
        marginTop: 30,
        fontWeight: "bold",
        fontSize: "2em",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>Total:</span>
      <span>{formatCurrency(total)}</span>
    </div>

    <PrimaryButton
      style={{ marginTop: 25 }}
      onClick={onConfirmar}
      disabled={disabled}
      loading={loading}
    >
      CONTINUAR
    </PrimaryButton>
    <SecondaryButton
      style={{ marginTop: 20 }}
      onClick={onNavigateToCierre}
      icon={<DollarCircleOutlined />}
    >
      CIERRE DE CAJA
    </SecondaryButton>
  </div>
);

export default Cart;
