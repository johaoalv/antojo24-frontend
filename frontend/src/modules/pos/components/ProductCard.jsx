import React from "react";

const ProductCard = ({ product, onAdd }) => {
  return (
    <div
      onClick={() => onAdd(product.producto)}
      style={{
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: 20,
        textAlign: "center",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img src={product.imagen} alt={product.producto} style={{ height: 150 }} />
      <div style={{ marginTop: 15, fontSize: "1.3em", fontWeight: "500" }}>
        {product.producto}
      </div>
    </div>
  );
};

export default ProductCard;
