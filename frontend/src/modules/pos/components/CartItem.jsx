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
      padding: "12px 0",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
      {imagen && (
        <img src={imagen} alt={producto} style={{ height: 44, marginRight: 12, flexShrink: 0 }} />
      )}
      <div style={{ minWidth: 0 }}>
        <strong style={{ fontSize: "1.1em", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {producto}
        </strong>
        <div style={{ fontSize: "1em", color: "#555" }}>{formatCurrency(precio)}</div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", flexShrink: 0, marginLeft: 8 }}>
      <Button style={{ width: 48, height: 48, fontSize: "1.3em" }} onClick={onDecrease}>-</Button>
      <span style={{ margin: "0 12px", fontSize: "1.4em", minWidth: 28, textAlign: "center", fontWeight: 700 }}>
        {cantidad}
      </span>
      <Button style={{ width: 48, height: 48, fontSize: "1.3em" }} onClick={onIncrease}>+</Button>
    </div>
  </div>
);

export default CartItem;
