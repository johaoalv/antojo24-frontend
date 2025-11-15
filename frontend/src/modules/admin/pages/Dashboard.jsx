import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "antd"
import { obtenerDashboard } from "../../../api/admin/axios_dashboard";
import CardInfo from "../components/Cards";
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
    });

    socketRef.current.on("dashboard_update", (data) => {
      setDatos(data);
    });

    socketRef.current.on("disconnect", () => {
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <>
      <div style={{ padding: '20px' }}>
        {datos ? (
          <div>
            <h1 style={{ fontSize: '3em', textAlign: 'center', marginBottom: '30px' }}>Global Stats</h1>
            <Row gutter={[32, 32]} justify="center">
              <Col xs={24} sm={12} md={12} lg={8}>
                <CardInfo title="Ventas Hoy" value={datos.ventas_hoy} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <CardInfo title="Ventas Ayer" value={datos.ventas_ayer} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <CardInfo title="Producto Más Vendido" value={datos.producto_mas_vendido} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
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
