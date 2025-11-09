import React, { useMemo } from "react";
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

const Index = () => {
  const navigate = useNavigate();
  const priceMap = useMemo(() => buildPriceMap(productosData), []);
  const buscarProducto = useMemo(
    () => createProductoFinder(productosData),
    []
  );

  const {
    pedido,
    agregarAlPedido,
    ajustarCantidad,
    calcularTotal,
    resetPedido,
  } = usePedidoState(priceMap);

  const metodoPagoState = useMetodoPago(calcularTotal);

  const { confirmarPedido } = usePedidoActions({
    pedido,
    metodoPago: metodoPagoState.metodoPago,
    montoRecibido: metodoPagoState.montoRecibido,
    calcularTotal,
    resetPedido,
    resetPagoState: metodoPagoState.resetPagoState,
    priceMap,
  });

  const total = calcularTotal();
  const isPedidoVacio = Object.keys(pedido).length === 0;

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
    </>
  );
};

export default Index;
