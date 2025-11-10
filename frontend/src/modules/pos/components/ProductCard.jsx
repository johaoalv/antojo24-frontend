import React from "react";

const ProductCard = ({ product, onAdd }) => {
  return (
    <div
      className="pos-product-card"
      onClick={() => onAdd(product.producto)}
      style={{
        borderRadius: 16,
        padding: 20,
        textAlign: "center",
        cursor: "pointer",
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
