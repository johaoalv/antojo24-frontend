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
    { title: 'Fecha', dataIndex: 'dia', key: 'dia' },
    { title: 'Total Ventas', dataIndex: 'total_ventas', key: 'total_ventas', render: (val) => `$${Number(val || 0).toFixed(2)}` },
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
    <div className="responsive-container" style={{ padding: '20px' }}>
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

      <div style={{ marginBottom: '20px' }}>
        <Title level={3} style={{ marginBottom: '20px' }}>Métricas del Mes Actual</Title>
        <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
          <Col xs={24} sm={12} md={8} lg={4}>
            <CardInfo title="Ventas Mes" value={datos.mes_actual.ventas} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <CardInfo title="Gastos" value={datos.mes_actual.gastos_operativos} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <CardInfo title="Inversiones" value={datos.mes_actual.inversiones} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <CardInfo title="Mermas" value={datos.mes_actual.mermas} color="#ff4d4f" />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <CardInfo title="Inyecciones" value={datos.mes_actual.inyecciones} color="#52c41a" />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <CardInfo title="Ganancia" value={datos.mes_actual.ganancia_neta} color="#1890ff" />
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ fontSize: '1.2em', fontWeight: 600 }}>Historial de Ventas Diario (Últimos 15 días)</span>}
            style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <Table
              columns={columns}
              dataSource={datos.historial_diario}
              rowKey="dia"
              pagination={{ pageSize: 7 }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontSize: '1.2em', fontWeight: 600 }}>Ventas por Mes</span>}
            style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <Table
              columns={[
                { title: 'Mes', dataIndex: 'mes', key: 'mes' },
                { title: 'Total', dataIndex: 'total_ventas', key: 'total_ventas', align: 'right', render: (val) => <Typography.Text strong>${Number(val || 0).toFixed(2)}</Typography.Text> }
              ]}
              dataSource={datos.historial_mensual}
              rowKey="mes"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
