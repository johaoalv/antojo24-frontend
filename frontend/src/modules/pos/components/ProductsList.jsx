import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { formatCurrency } from "../utils/formatters";

const INITIAL_LIMIT = 8;

const ProductsList = ({ productos, onAddProduct, loading }) => {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return <div style={{ padding: "20px", color: "#888" }}>Cargando productos...</div>;
  }

  if (!productos || productos.length === 0) {
    return <div style={{ padding: "20px", color: "#888" }}>No hay productos disponibles</div>;
  }

  const visible = expanded ? productos : productos.slice(0, INITIAL_LIMIT);
  const hasMore = productos.length > INITIAL_LIMIT;

  return (
    <div>
      {visible.map((item) => {
        const nombre = item.nombre || item.producto;
        return (
          <div
            key={item.id || nombre}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 4px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span style={{ flex: 1, fontWeight: 500 }}>{nombre}</span>
            <span style={{ minWidth: 60, textAlign: "right", color: "#555", marginRight: 16 }}>
              {formatCurrency(item.precio)}
            </span>
            <button
              onClick={() => onAddProduct(nombre)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: "none",
                backgroundColor: "#52c41a",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <PlusOutlined />
            </button>
          </div>
        );
      })}

      {hasMore && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "10px",
            border: "1px solid #d9d9d9",
            borderRadius: 8,
            backgroundColor: "#fafafa",
            cursor: "pointer",
            color: "#555",
            fontWeight: 500,
          }}
        >
          {expanded ? "Ver menos ▲" : `Ver más productos ▼ (${productos.length - INITIAL_LIMIT} más)`}
        </button>
      )}
    </div>
  );
};

export default ProductsList;
