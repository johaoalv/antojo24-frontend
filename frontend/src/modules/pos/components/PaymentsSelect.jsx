import React from "react";
import { Select } from "antd";

const renderOptionLabel = (option) => (
  <span style={{ display: "flex", alignItems: "center", gap: 15, fontSize: "1.1em" }}>
    <img src={option.icon} alt={option.label} style={{ height: 30 }} />
    {option.label}
  </span>
);

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
