import React, { useEffect, useMemo, useState } from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../../common/components/Navbar";
import productosData from "../../../api/productos.json";
import ProductsGrid from "../components/ProductsGrid";
import Cart from "../components/Cart";
import CashModal from "../components/CashModal";
import usePedidoState from "../hooks/usePedidoState";
import useMetodoPago from "../hooks/useMetodoPago";
import usePedidoActions from "../hooks/usePedidoActions";
import { buildPriceMap, createProductoFinder } from "../utils/pedido-utils";
import { PAYMENT_OPTIONS } from "../constants/payments";
import { getPanamaTime12h } from "../utils/get_time";

const { Text } = Typography;

const Index = () => {
  const navigate = useNavigate();
  const priceMap = useMemo(() => buildPriceMap(productosData), []);
  const buscarProducto = useMemo(
    () => createProductoFinder(productosData),
    []
  );

  const {
    pedido,
    nombreCliente,
    setNombreCliente,
    agregarAlPedido,
    ajustarCantidad,
    calcularTotal,
    resetPedido,
  } = usePedidoState(priceMap);

  const metodoPagoState = useMetodoPago(calcularTotal);

  const { confirmarPedido } = usePedidoActions({
    pedido,
    nombreCliente,
    metodoPago: metodoPagoState.metodoPago,
    montoRecibido: metodoPagoState.montoRecibido,
    calcularTotal,
    resetPedido,
    resetPagoState: metodoPagoState.resetPagoState,
    priceMap,
  });

  const total = calcularTotal();
  const isPedidoVacio = Object.keys(pedido).length === 0;
  const [panamaClock, setPanamaClock] = useState(getPanamaTime12h());

  useEffect(() => {
    const updateClock = () => setPanamaClock(getPanamaTime12h());
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", padding: 30, gap: 30 }}>
        <div style={{ width: "60%" }}>
          <ProductsGrid
            productos={productosData}
            onAddProduct={agregarAlPedido}
          />
        </div>
        <Cart
          pedido={pedido}
          buscarProducto={buscarProducto}
          priceMap={priceMap}
          onAjustarCantidad={ajustarCantidad}
          total={total}
          metodoPago={metodoPagoState.metodoPago}
          paymentOptions={PAYMENT_OPTIONS}
          onMetodoPagoChange={metodoPagoState.handleMetodoPagoChange}
          onConfirmar={confirmarPedido}
          disabled={isPedidoVacio || !metodoPagoState.metodoPago}
          onNavigateToCierre={() => navigate("/cierre")}
          nombreCliente={nombreCliente}
          onNombreClienteChange={setNombreCliente}
        />
      </div>
      <CashModal
        visible={metodoPagoState.isModalVisible}
        total={total}
        montoRecibido={metodoPagoState.montoRecibido}
        vuelto={metodoPagoState.vuelto}
        onMontoChange={metodoPagoState.handleMontoRecibidoChange}
        onOk={metodoPagoState.handleModalOk}
        onCancel={metodoPagoState.handleModalCancel}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#000",
          color: "#FFD60A",
          textAlign: "center",
          padding: "14px 0",
          fontSize: "1.6em",
          fontWeight: 600,
          letterSpacing: "0.05em",
          zIndex: 1000,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#FFD60A", fontSize: "1em" }}>
          Hora Panamá · {panamaClock}
        </Text>
      </div>
    </>
  );
};

export default Index;
