import React from "react";
import ProductCard from "./ProductCard";

const ProductsGrid = ({ productos, onAddProduct }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: 30,
    }}
  >
    {productos.map((item) => (
      <ProductCard key={item.producto} product={item} onAdd={onAddProduct} />
    ))}
  </div>
);

export default ProductsGrid;
