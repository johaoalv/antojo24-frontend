import React from "react";
import { DollarCircleOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import CartItem from "./CartItem";
import { formatCurrency } from "../utils/formatters";
import PrimaryButton from "../../common/components/PrimaryButton";
import SecondaryButton from "../../common/components/SecondaryButton";
import { getProductImage } from "../utils/imageMapper";

const Cart = ({
  pedido,
  buscarProducto,
  priceMap,
  onAjustarCantidad,
  total,
  metodoPago,
  paymentOptions,
  onMetodoPagoChange,
  onConfirmar,
  disabled,
  onNavigateToCierre,
  nombreCliente,
  onNombreClienteChange,
  loading,
  tipoPedido,
  onTipoPedidoChange,
  bolsas,
  onBolsasChange,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "20px 16px",
      backgroundColor: "#fff",
      boxSizing: "border-box",
    }}
  >
    <h3 style={{ fontSize: "clamp(1.5em, 5vw, 2.5em)", textAlign: "center", marginBottom: 10 }}>
      Carrito
    </h3>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <Select
        value={tipoPedido}
        onChange={onTipoPedidoChange}
        style={{ width: 200 }}
        options={[
          { label: "Local", value: "local" },
          { label: "PedidosYa", value: "pedidosya" },
          { label: "Uber", value: "uber" }
        ]}
      />
    </div>
    {Object.entries(pedido).map(([producto, cantidad]) => {
      const productoInfo = buscarProducto(producto);
      const precio = priceMap[producto] || 0;
      return (
        <CartItem
          key={producto}
          producto={producto}
          cantidad={cantidad}
          imagen={getProductImage(productoInfo || { nombre: producto })}
          precio={precio}
          onDecrease={() => onAjustarCantidad(producto, cantidad - 1)}
          onIncrease={() => onAjustarCantidad(producto, cantidad + 1)}
        />
      );
    })}

    <div style={{
      marginTop: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      backgroundColor: "#f5f5f5",
      borderRadius: 10,
      border: "1px dashed #d9d9d9"
    }}>
      <span style={{ fontSize: "1.1em", fontWeight: 500 }}>Bolsas de entrega</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => onBolsasChange(Math.max(0, bolsas - 1))}
          style={{
            width: 32, height: 32, borderRadius: 6, border: "1px solid #d9d9d9",
            backgroundColor: bolsas === 0 ? "#f5f5f5" : "#fff", cursor: bolsas === 0 ? "default" : "pointer",
            fontSize: "1.2em", display: "flex", alignItems: "center", justifyContent: "center"
          }}
          disabled={bolsas === 0}
        >-</button>
        <span style={{ fontSize: "1.3em", fontWeight: "bold", minWidth: 24, textAlign: "center" }}>{bolsas}</span>
        <button
          onClick={() => onBolsasChange(bolsas + 1)}
          style={{
            width: 32, height: 32, borderRadius: 6, border: "1px solid #d9d9d9",
            backgroundColor: "#fff", cursor: "pointer", fontSize: "1.2em",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >+</button>
      </div>
    </div>

    <div style={{ marginTop: 20 }}>
      <h4 style={{ margin: "0 0 12px 0", fontSize: "1.1em", textAlign: "center", color: "#555" }}>
        Método de Pago
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {paymentOptions.map((opt) => {
          const isSelected = metodoPago === opt.value;
          return (
            <div
              key={opt.value}
              onClick={() => onMetodoPagoChange(opt.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 10px",
                borderRadius: "14px",
                cursor: "pointer",
                border: isSelected ? "4px solid #000" : "2px solid #eaeaea",
                backgroundColor: isSelected ? "#fff9e6" : "#fff",
                boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.1s ease-in-out"
              }}
            >
              {opt.isComponent ? (
                opt.icon
              ) : (
                <img 
                  src={opt.icon} 
                  alt={opt.label} 
                  style={{ height: "45px", marginBottom: "8px", objectFit: "contain" }} 
                />
              )}
              <span style={{ fontSize: "1.15em", fontWeight: isSelected ? 800 : 500, color: "#111" }}>
                {opt.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>

    <div
      style={{
        marginTop: 30,
        fontWeight: "bold",
        fontSize: "2em",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>Total:</span>
      <span>{formatCurrency(total)}</span>
    </div>

    <PrimaryButton
      style={{ marginTop: 25 }}
      onClick={onConfirmar}
      disabled={disabled}
      loading={loading}
    >
      CONTINUAR
    </PrimaryButton>
    <SecondaryButton
      style={{ marginTop: 20 }}
      onClick={onNavigateToCierre}
      icon={<DollarCircleOutlined />}
    >
      CIERRE DE CAJA
    </SecondaryButton>
  </div>
);

export default Cart;
