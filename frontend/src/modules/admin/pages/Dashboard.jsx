import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Typography, Table, Statistic, Space } from "antd";
import { obtenerDashboard } from "../../../api/admin/axios_dashboard";
import CardInfo from "../components/Cards";
import { io } from "socket.io-client";
import { useStore } from "../../../context/StoreContext";
import { ShoppingOutlined } from "@ant-design/icons";

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

    const { Title, Text } = Typography;

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ marginBottom: '30px' }}>
                <Title level={2} style={{ margin: 0 }}>Dashboard - {datos.nombre_sucursal}</Title>
            </div>

            {/* SECCIÓN 1: SALDO TOTAL (PLATA REAL ACUMULADA) */}
            <div style={{ marginBottom: '40px' }}>
                <Title level={3} style={{ marginBottom: '20px', color: '#001529' }}>Estado General de Caja (Acumulado)</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card 
                            style={{ 
                                borderRadius: '15px', 
                                background: 'linear-gradient(135deg, #722ed1 0%, #391085 100%)',
                                color: 'white',
                                boxShadow: '0 4px 20px rgba(114, 46, 209, 0.3)'
                            }}
                            bordered={false}
                        >
                            <Statistic 
                                title={<Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2em' }}>Plata Real en Mano (Total)</Text>}
                                value={datos.mes_actual.saldo_caja}
                                precision={2}
                                prefix="$"
                                valueStyle={{ color: 'white', fontSize: '2.5em', fontWeight: 'bold' }}
                            />
                            <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                                Todo el efectivo histórico acumulado (Entradas - Salidas)
                            </Text>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card style={{ borderRadius: '15px', height: '100%', display: 'flex', alignItems: 'center' }} bordered={false}>
                            <div>
                                <Text strong style={{ fontSize: '1.1em' }}>¿Qué significa este número?</Text>
                                <p style={{ margin: 0, color: '#666' }}>Es el fondo total de tu negocio. Si abres el cajón y cuentas cada moneda, el total debería ser este monto. Incluye tus ventas y tus aportes propios, menos todo lo que has gastado.</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* SECCIÓN 2: MÉTRICAS DEL MES */}
            <div style={{ marginBottom: '40px' }}>
                <Title level={3} style={{ marginBottom: '20px' }}>Rendimiento del Mes Actual</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <CardInfo title="Ventas del Mes" value={datos.mes_actual.ventas} icon={<ShoppingOutlined />} />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <CardInfo title="Utilidad neta (Mes)" value={datos.mes_actual.ganancia_neta} color="#52c41a" info="Rentabilidad operativa real de este mes" />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <CardInfo title="Costo Insumos" value={datos.mes_actual.cogs} color="#fa8c16" info="Lo que costó la materia prima de las ventas del mes" />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <CardInfo title="Gastos Operativos" value={datos.mes_actual.gastos_operativos} color="#1890ff" info="Luz, agua, sueldos, alquiler pagados en el mes" />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <CardInfo title="Mermas (Mes)" value={datos.mes_actual.mermas} color="#f5222d" info="Pérdida por desperdicios este mes" />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <CardInfo title="Aporte Capital (Mes)" value={datos.mes_actual.inyecciones} color="#eb2f96" info="Dinero extra que pusiste este mes" />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <CardInfo title="Compras Inventario" value={datos.mes_actual.compras_inventario} color="#13c2c2" info="Gasto en materia prima acumulada este mes" />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <CardInfo title="Flujo Caja del Mes" value={datos.mes_actual.saldo_caja_mes} color="#d48d68" info="Balance neto de dinero solo de este mes" />
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
