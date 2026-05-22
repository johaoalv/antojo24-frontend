import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../../common/components/Navbar";

import ProductsList from "../components/ProductsList";
import CategoryTabs from "../components/CategoryTabs";
import Cart from "../components/Cart";
import CashModal from "../components/CashModal";
import usePedidoState from "../hooks/usePedidoState";
import useMetodoPago from "../hooks/useMetodoPago";
import usePedidoActions from "../hooks/usePedidoActions";
import { buildPriceMap, createProductoFinder } from "../utils/pedido-utils";
import { PAYMENT_OPTIONS } from "../constants/payments";
import { getPanamaTime12h } from "../utils/get_time";

const Index = () => {
  const navigate = useNavigate();
  const [productosData, setProductosData] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [tipoPedido, setTipoPedido] = useState("local");
  const [bolsas, setBolsas] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const { fetchProductos } = await import("../../../api/pos/axios_productos");
        const data = await fetchProductos();
        if (Array.isArray(data)) {
          setProductosData(data);
        } else {
          console.error("La respuesta de productos no es un arreglo válido", data);
          setProductosData([]);
        }
      } catch (error) {
        console.error("Error cargando productos", error);
      } finally {
        setLoadingProductos(false);
      }
    };
    loadProductos();
  }, []);

  const priceMap = useMemo(() => buildPriceMap(productosData, tipoPedido), [productosData, tipoPedido]);
  const buscarProducto = useMemo(
    () => createProductoFinder(productosData),
    [productosData]
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

  const { confirmarPedido, loading } = usePedidoActions({
    pedido,
    nombreCliente,
    metodoPago: metodoPagoState.metodoPago,
    montoRecibido: metodoPagoState.montoRecibido,
    calcularTotal,
    resetPedido,
    resetPagoState: metodoPagoState.resetPagoState,
    priceMap,
    tipoPedido,
    bolsas,
    resetBolsas: () => setBolsas(0),
  });

  const productosFiltrados = useMemo(() => {
    let lista = tipoPedido !== "local"
      ? productosData.filter((p) => p.precio_delivery != null)
      : productosData;
    if (selectedCategory !== "todos") {
      lista = lista.filter((p) => p.categoria === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      lista = lista.filter((p) =>
        (p.nombre || p.producto || "").toLowerCase().includes(q)
      );
    }
    return lista;
  }, [productosData, tipoPedido, selectedCategory, searchQuery]);

  const handleTipoPedidoChange = useCallback((valor) => {
    setTipoPedido(valor);
    resetPedido();
    setBolsas(0);
    setSelectedCategory("todos");
    setSearchQuery("");
    metodoPagoState.resetPagoState();
  }, [resetPedido, metodoPagoState]);

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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", backgroundColor: "#f0f0f0" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", overflow: "hidden", gap: 10, padding: 10 }}>
        {/* Panel izquierdo — productos */}
        <div style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: "16px 12px 0 12px",
          overflow: "hidden",
        }}>
          <Input.Search
            placeholder="Buscar producto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 12, fontSize: 16 }}
            size="large"
            allowClear
          />
          <CategoryTabs
            productos={productosData}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <div style={{ flex: 1, overflowY: "auto" }}>
            <ProductsList
              productos={productosFiltrados}
              onAddProduct={agregarAlPedido}
              loading={loadingProductos}
            />
          </div>
        </div>

        {/* Panel derecho — carrito */}
        <div style={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: 12,
          overflow: "hidden",
        }}>
          <div style={{ flex: 1, overflowY: "auto" }}>
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
              disabled={isPedidoVacio || !metodoPagoState.metodoPago || loading}
              loading={loading}
              onNavigateToCierre={() => navigate("/cierre")}
              nombreCliente={nombreCliente}
              onNombreClienteChange={setNombreCliente}
              tipoPedido={tipoPedido}
              onTipoPedidoChange={handleTipoPedidoChange}
              bolsas={bolsas}
              onBolsasChange={setBolsas}
            />
          </div>
        </div>
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
    </div>
  );
};

export default Index;
