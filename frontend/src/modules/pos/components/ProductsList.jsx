import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { formatCurrency } from "../utils/formatters";

const ProductsList = ({ productos, onAddProduct, loading }) => {
  if (loading) {
    return <div style={{ padding: 20, color: "#888", fontSize: 16 }}>Cargando productos...</div>;
  }
  if (!productos || productos.length === 0) {
    return <div style={{ padding: 20, color: "#888", fontSize: 16 }}>No hay productos disponibles</div>;
  }

  return (
    <div>
      {productos.map((item) => {
        const nombre = item.nombre || item.producto;
        return (
          <div
            key={item.id || nombre}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 8px",
              minHeight: 60,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span style={{ flex: 1, fontSize: 17, fontWeight: 500 }}>{nombre}</span>
            <span style={{ fontSize: 16, color: "#444", marginRight: 16, fontWeight: 500 }}>
              {formatCurrency(item.precio)}
            </span>
            <button
              onClick={() => onAddProduct(nombre)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                border: "2px solid #000",
                backgroundColor: "#000",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 18,
              }}
            >
              <PlusOutlined />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsList;
