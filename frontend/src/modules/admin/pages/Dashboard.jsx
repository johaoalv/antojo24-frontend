import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Typography, Table } from "antd";
import { obtenerDashboard } from "../../../api/admin/axios_dashboard";
import CardInfo from "../components/Cards";
import { io } from "socket.io-client";
import { useStore } from "../../../context/StoreContext";

const { Title } = Typography;

function Dashboard() {
  const [datos, setDatos] = useState(null);
  const socketRef = useRef(null);
  const { selectedStoreId } = useStore();

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

  const cargarDatos = async () => {
    try {
      const data = await obtenerDashboard(selectedStoreId);
      setDatos(data);
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error);
    }
  };

  // Cargar datos cuando cambia la sucursal seleccionada
  useEffect(() => {
    cargarDatos();
  }, [selectedStoreId]);

  // Conexión WebSocket
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_WEBSOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("dashboard_update", (updatedData) => {
      // Solo actualizamos si el update viene sin filtro (global) o si coincide con nuestra sucursal
      // Por simplicidad, recargamos los datos para asegurar coherencia con el filtro
      cargarDatos();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedStoreId]);

  if (!datos) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <p style={{ fontSize: '1.5em', color: '#bfbfbf' }}>Cargando datos del dashboard...</p>
      </div>
    );
  }

  return (
    <div className="responsive-container">
      <Title
        level={1}
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: '#1a1a1a',
          fontSize: 'clamp(1.5em, 5vw, 2.5em)',
          fontWeight: 800
        }}
      >
        {selectedStoreId === "global" ? "Resumen General del Negocio" : `Panel: ${datos.nombre_sucursal || "Sucursal"}`}
      </Title>

      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={8}>
          <CardInfo title="Ventas Totales" value={datos.total_ventas} />
        </Col>
        <Col xs={24} sm={8}>
          <CardInfo title="Inversión / Facturas" value={datos.total_invertido} />
        </Col>
        <Col xs={24} sm={8}>
          <CardInfo title="Ganancia Neta" value={datos.ganancia_bruta} />
        </Col>
      </Row>

      <Card
        title={<span style={{ fontSize: '1.2em', fontWeight: 600 }}>Historial de Ventas Diario</span>}
        style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      >
        <Table
          columns={columns}
          dataSource={datos.historial}
          rowKey="fecha"
          pagination={{ pageSize: 7 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}

export default Dashboard;
