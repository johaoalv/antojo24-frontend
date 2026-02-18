import React from "react";
import { DollarCircleOutlined } from "@ant-design/icons";
import { Input } from "antd";
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
    <h3 style={{ fontSize: "clamp(1.5em, 5vw, 2.5em)", textAlign: "center", marginBottom: 20 }}>
      Carrito
    </h3>
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

    <div style={{ marginTop: 30 }}>
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
