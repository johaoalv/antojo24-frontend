import React from "react";
import ProductCard from "./ProductCard";

const ProductsGrid = ({ productos, onAddProduct, loading }) => {
  const productosArray = Array.isArray(productos) ? productos : [];
  
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 30,
      }}
    >
      {loading ? (
        <div style={{ padding: "20px", color: "white" }}>Cargando productos...</div>
      ) : productosArray.length === 0 ? (
        <div style={{ padding: "20px", color: "white" }}>No hay productos disponibles</div>
      ) : (
        productosArray.map((item) => (
          <ProductCard key={item.id || item.producto} product={item} onAdd={onAddProduct} />
        ))
      )}
    </div>
  );
};

export default ProductsGrid;
