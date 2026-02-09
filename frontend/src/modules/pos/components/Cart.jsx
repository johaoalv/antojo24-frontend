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
      width: "40%",
      border: "1px solid #ddd",
      borderRadius: 16,
      padding: 25,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      marginBottom: 100,
    }}
  >
    <h3 style={{ fontSize: "2.5em", textAlign: "center" }}>
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
