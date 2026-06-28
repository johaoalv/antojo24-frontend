import React from "react";
import { Select } from "antd";

const renderOptionLabel = (option) => {
  // Manejar iconos que podrían no existir
  const iconStyle = { height: 30 };
  const fallbackIcon = option.icon;

  return (
    <span style={{ display: "flex", alignItems: "center", gap: 15, fontSize: "1.1em" }}>
      {option.icon ? (
        <img src={option.icon} alt={option.label} style={iconStyle} onError={(e) => {
          // Si falla la imagen, ocultar
          e.target.style.display = "none";
        }} />
      ) : null}
      {option.label}
    </span>
  );
};

const PaymentsSelect = ({ value, options, onChange }) => (
  <Select
    placeholder="Método de Pago"
    style={{ width: "100%", height: 60 }}
    size="large"
    value={value || undefined}
    onChange={onChange}
    options={options.map((option) => ({
      value: option.value,
      label: renderOptionLabel(option),
    }))}
  />
);

export default PaymentsSelect;
