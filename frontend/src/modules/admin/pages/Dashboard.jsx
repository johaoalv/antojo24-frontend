import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Table, Card, Typography } from "antd"
import { obtenerDashboard } from "../../../api/admin/axios_dashboard";
import CardInfo from "../components/Cards";
import { io } from "socket.io-client";

const { Title } = Typography;

function Dashboard() {
  const [datos, setDatos] = useState(null);
  const socketRef = useRef(null);

  const columns = [
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Total Ventas', dataIndex: 'total_ventas', key: 'total_ventas', render: (val) => `$${val.toFixed(2)}` },
    { title: 'Efectivo', dataIndex: 'efectivo', key: 'efectivo', render: (val) => `$${val.toFixed(2)}` },
    { title: 'Tarjeta', dataIndex: 'tarjeta', key: 'tarjeta', render: (val) => `$${val.toFixed(2)}` },
    { title: 'Yappy', dataIndex: 'yappy', key: 'yappy', render: (val) => `$${val.toFixed(2)}` },
    {
      title: 'Total Cierre',
      dataIndex: 'total_cierre',
      key: 'total_cierre',
      render: (val) => val > 0 ? `$${val.toFixed(2)}` : <span style={{ color: '#999' }}>No cerrado</span>
    },
  ];

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

    socketRef.current.on("dashboard_update", (data) => {
      setDatos(data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {datos ? (
        <>
          <Title level={1} style={{ textAlign: 'center', marginBottom: '40px', color: '#1a1a1a' }}>Resumen Global del Negocio</Title>
          <Card title="Información Estratégica" style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <p>Bienvenido al resumen global. Aquí puedes ver la salud financiera general de Antojo24 basada en las facturas registradas y las ventas totales.</p>
          </Card>
          <Row gutter={[24, 24]} style={{ marginBottom: '40px', marginTop: '40px' }}>
            <Col xs={24} md={8}>
              <CardInfo title="Monto Total Invertido" value={`$${datos.total_invertido}`} />
            </Col>
            <Col xs={24} md={8}>
              <CardInfo title="Ventas Totales" value={`$${datos.total_ventas}`} />
            </Col>
            <Col xs={24} md={8}>
              <CardInfo title="Ganancia Bruta" value={`$${datos.ganancia_bruta}`} />
            </Col>
          </Row>


        </>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando datos estratégicos...</p>
      )}
    </div>
  );
}

export default Dashboard;
