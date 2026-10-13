import React from "react";
import { CheckCircleFilled, DollarCircleOutlined, ShopOutlined, CarOutlined } from "@ant-design/icons";
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
      padding: "12px 16px",
      backgroundColor: "#fff",
      boxSizing: "border-box",
    }}
  >
    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#777", margin: "0 0 10px" }}>
      Carrito
    </h3>
    <div role="group" aria-label="Tipo de pedido" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 16 }}>
      {[
        { label: "Local", value: "local", icon: <ShopOutlined /> },
        { label: "PedidosYa", value: "pedidosya", icon: <CarOutlined /> },
        { label: "Uber", value: "uber", icon: <CarOutlined /> },
      ].map((option) => {
        const selected = tipoPedido === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => {
              if (!selected) onTipoPedidoChange(option.value);
            }}
            style={{
              position: "relative",
              minWidth: 0,
              minHeight: 76,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 4px",
              border: selected ? "2px solid #222" : "2px solid #eaeaea",
              borderRadius: 12,
              backgroundColor: selected ? "#fff3d6" : "#fafafa",
              color: selected ? "#222" : "#666",
              fontFamily: "inherit",
              fontSize: "clamp(12px, 1.4vw, 16px)",
              fontWeight: selected ? 800 : 600,
              cursor: "pointer",
              transition: "background-color 0.15s, border-color 0.15s",
            }}
          >
            <span style={{ fontSize: 22 }}>{option.icon}</span>
            <span>{option.label}</span>
            {selected && <CheckCircleFilled style={{ position: "absolute", top: 6, right: 6, fontSize: 13 }} />}
          </button>
        );
      })}
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
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
