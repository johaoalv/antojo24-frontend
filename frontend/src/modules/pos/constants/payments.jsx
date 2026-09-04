import React from "react";
import { AppstoreAddOutlined } from "@ant-design/icons";

export const PAYMENT_OPTIONS = [
  {
    value: "efectivo",
    label: "Efectivo",
    icon: "/assets/efectivo.png",
    isComponent: false
  },
  {
    value: "yappy",
    label: "Yappy",
    icon: "/assets/yappy.png",
    isComponent: false
  },
  {
    value: "mixto",
    label: "Pago Mixto",
    icon: <AppstoreAddOutlined style={{ fontSize: "40px", color: "#333", marginBottom: "8px" }} />,
    isComponent: true
  },
];

export const AVAILABLE_PAYMENT_METHODS = [
  { value: "efectivo", label: "Efectivo" },
  { value: "yappy", label: "Yappy" },
  { value: "mixto", label: "Pago Mixto" }
];
