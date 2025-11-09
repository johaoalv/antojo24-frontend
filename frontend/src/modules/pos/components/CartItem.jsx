import React from "react";
import { Button } from "antd";
import { formatCurrency } from "../utils/formatters";

const CartItem = ({
  producto,
  cantidad,
  imagen,
  precio,
  onDecrease,
  onIncrease,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #eee",
      padding: "15px 0",
    }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>
      {imagen && (
        <img src={imagen} alt={producto} style={{ height: 50, marginRight: 15 }} />
      )}
      <div>
        <strong style={{ fontSize: "1.2em" }}>{producto}</strong>
        <div style={{ fontSize: "1.1em", color: "#555" }}>
          {formatCurrency(precio)}
        </div>
      </div>
    </div>
    <div>
      <Button
        style={{ width: 40, height: 40, fontSize: "1.2em" }}
        onClick={onDecrease}
      >
        -
      </Button>
      <span
        style={{
          margin: "0 15px",
          fontSize: "1.4em",
          minWidth: "30px",
          display: "inline-block",
          textAlign: "center",
        }}
      >
        {cantidad}
      </span>
      <Button
        style={{ width: 40, height: 40, fontSize: "1.2em" }}
        onClick={onIncrease}
      >
        +
      </Button>
    </div>
  </div>
);

export default CartItem;
