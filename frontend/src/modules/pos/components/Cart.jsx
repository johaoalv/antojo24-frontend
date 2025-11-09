import React from "react";
import { Button } from "antd";
import CartItem from "./CartItem";
import { formatCurrency } from "../utils/formatters";

const Cart = ({
  pedido,
  buscarProducto,
  priceMap,
  onAjustarCantidad,
  total,
  onConfirmar,
  disabled,
  onNavigateToCierre,
}) => (
  <div
    style={{
      width: "40%",
      border: "1px solid #ddd",
      borderRadius: 16,
      padding: 25,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h3 style={{ fontSize: "2.5em", marginBottom: 20, textAlign: "center" }}>
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

    <Button
      type="primary"
      block
      style={{ marginTop: 25, height: 70, fontSize: "2em" }}
      onClick={onConfirmar}
      disabled={disabled}
    >
      Continuar
    </Button>
    <Button
      type="default"
      block
      style={{ marginTop: 20, height: 50, fontSize: "1.2em" }}
      onClick={onNavigateToCierre}
    >
      Ir al Cierre de Caja
    </Button>
  </div>
);

export default Cart;
