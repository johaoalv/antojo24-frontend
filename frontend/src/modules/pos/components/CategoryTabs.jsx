import React, { useMemo } from "react";
import { Tabs } from "antd";

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const CategoryTabs = ({ productos, selectedCategory, onCategoryChange }) => {
  const items = useMemo(() => {
    const categorias = [...new Set(
      productos.map((p) => p.categoria).filter(Boolean)
    )];
    return [
      { key: "todos", label: "Todos" },
      ...categorias.map((cat) => ({ key: cat, label: capitalize(cat) })),
    ];
  }, [productos]);

  return (
    <Tabs
      activeKey={selectedCategory}
      onChange={onCategoryChange}
      items={items}
      style={{ marginBottom: 8 }}
    />
  );
};

export default CategoryTabs;
