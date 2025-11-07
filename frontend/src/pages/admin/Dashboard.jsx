import React, { useState, useEffect, useRef } from "react";
import { Row, Col} from "antd"
import { obtenerDashboard } from "../../data/axios_dashboard";
import CardInfo from "../../components/Cards";
import { io } from "socket.io-client";

function Dashboard() {
  const [datos, setDatos] = useState(null);
   const socketRef = useRef(null);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerDashboard();
        setDatos(data);
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      }
    };
    cargarDatos();
  }, []);

  // Conexión WebSocket
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_WEBSOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 WebSocket conectado");
    });

    socketRef.current.on("dashboard_update", (data) => {
      console.log("📡 Actualización en vivo:", data);
      setDatos(data);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 WebSocket desconectado");
    });

    return () => {
      socketRef.current.disconnect();
      console.log("🧹 WebSocket cerrado");
    };
  }, []);

  return (
    <>
    <div>
    {datos ? (
      <div>
        <h1>Global Stats</h1>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8} lg={6}>
            <CardInfo title="Ventas Hoy" value={datos.ventas_hoy} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <CardInfo title="Ventas Ayer" value={datos.ventas_ayer} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <CardInfo title="Producto Más Vendido" value={datos.producto_mas_vendido} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <CardInfo title="Método de Pago Más Usado" value={datos.metodo_pago_mas_usado} />
          </Col>
        </Row>
      </div>
    ) : (
      <p>Cargando datos...</p>
    )}
  </div>
  </>
  );
}

export default Dashboard;
