import React, { useMemo } from "react";

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const CategoryTabs = ({ productos, selectedCategory, onCategoryChange }) => {
  const categorias = useMemo(() => {
    const unique = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
    return ["todos", ...unique];
  }, [productos]);

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
      {categorias.map((cat) => {
        const active = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            style={{
              padding: "10px 20px",
              fontSize: 15,
              fontWeight: active ? 700 : 500,
              border: active ? "2px solid #000" : "2px solid #d9d9d9",
              borderRadius: 8,
              backgroundColor: active ? "#000" : "#fff",
              color: active ? "#fff" : "#333",
              cursor: "pointer",
              transition: "all 0.15s",
              minHeight: 44,
            }}
          >
            {cat === "todos" ? "Todos" : capitalize(cat)}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
