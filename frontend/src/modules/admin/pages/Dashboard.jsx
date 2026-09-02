import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Typography, Table, Statistic, Space, Spin, Button, message } from "antd";
import { obtenerDashboard, obtenerTesoreria } from "../../../api/admin/axios_dashboard";
import CardInfo from "../components/Cards";
import { io } from "socket.io-client";
import { useStore } from "../../../context/StoreContext";
import { ShoppingOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";


const { Title } = Typography;

function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [tesoreria, setTesoreria] = useState(null);
  const [tesoreriaVisible, setTesoreriaVisible] = useState(false);
  const [tesoreriaLoading, setTesoreriaLoading] = useState(false);
  const socketRef = useRef(null);
  const dashboardUpdateDebounceRef = useRef(null);
  const { selectedStoreId } = useStore();

  const columns = [
    { title: 'Fecha', dataIndex: 'dia', key: 'dia' },
    { title: 'Total Ventas', dataIndex: 'total_ventas', key: 'total_ventas', render: (val) => `$${Number(val || 0).toFixed(2)}` },
  ];

  const rentabilidadColumns = [
    { title: 'Mes', dataIndex: 'mes', key: 'mes' },
    { title: 'Ingresos', dataIndex: 'ingresos', key: 'ingresos', align: 'right', render: (val) => <Typography.Text strong style={{ color: '#52c41a' }}>${Number(val || 0).toFixed(2)}</Typography.Text> },
    { title: 'Gastos', dataIndex: 'gastos', key: 'gastos', align: 'right', render: (val) => <Typography.Text strong style={{ color: '#f5222d' }}>${Number(val || 0).toFixed(2)}</Typography.Text> },
    { title: 'Utilidad neta', dataIndex: 'utilidad_neta', key: 'utilidad_neta', align: 'right', render: (val) => <Typography.Text strong>${Number(val || 0).toFixed(2)}</Typography.Text> },
    { title: 'Rentabilidad', dataIndex: 'rentabilidad_pct', key: 'rentabilidad_pct', align: 'right', render: (val) => <Typography.Text strong style={{ color: Number(val) >= 0 ? '#389e0d' : '#cf1322' }}>{Number(val || 0).toFixed(1)}%</Typography.Text> },
  ];

  const cargarDatos = async () => {
    try {
      const data = await obtenerDashboard(selectedStoreId);
      setDatos(data);
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error);
    }
  };

  const handleToggleTesoreria = async () => {
    if (tesoreriaVisible) {
      setTesoreriaVisible(false);
      return;
    }
    setTesoreriaLoading(true);
    try {
      const data = await obtenerTesoreria(selectedStoreId);
      setTesoreria(data);
      setTesoreriaVisible(true);
    } catch (error) {
      message.error("Error al cargar la tesorería");
    } finally {
      setTesoreriaLoading(false);
    }
  };

  // Cargar datos cuando cambia la sucursal seleccionada
  useEffect(() => {
    cargarDatos();
  }, [selectedStoreId]);

  // La tesorería es a demanda: al cambiar de sucursal se oculta y se descarta,
  // para nunca mostrar (ni dejar cacheado) el número de una sucursal distinta
  useEffect(() => {
    setTesoreria(null);
    setTesoreriaVisible(false);
  }, [selectedStoreId]);

  // Conexión WebSocket
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_WEBSOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("dashboard_update", () => {
      // Debounce: una ráfaga de ventas dispara varios eventos seguidos; agrupamos
      // esas ráfagas en una sola recarga en lugar de una petición HTTP por evento.
      if (dashboardUpdateDebounceRef.current) {
        clearTimeout(dashboardUpdateDebounceRef.current);
      }
      dashboardUpdateDebounceRef.current = setTimeout(() => {
        dashboardUpdateDebounceRef.current = null;
        cargarDatos();
      }, 1500);
    });

    return () => {
      if (dashboardUpdateDebounceRef.current) {
        clearTimeout(dashboardUpdateDebounceRef.current);
      }
      socketRef.current.disconnect();
    };
  }, [selectedStoreId]);

  if (!datos) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Cargando datos del dashboard..." />
      </div>
    );
  }

    const { Title, Text } = Typography;

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ marginBottom: '30px' }}>
                <Title level={2} style={{ margin: 0 }}>Dashboard - {datos.nombre_sucursal}</Title>
            </div>

            {/* SECCIÓN 1: SALDO TOTAL (TESORERÍA ACUMULADA) */}
            <div style={{ marginBottom: '40px' }}>
                {/* <Title level={3} style={{ marginBottom: '20px', color: '#001529' }}>Estado General Historico</Title> */}
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
                            <Space align="center" style={{ marginBottom: 4 }}>
                                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2em' }}>Tesorería</Text>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={tesoreriaVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    loading={tesoreriaLoading}
                                    onClick={handleToggleTesoreria}
                                    style={{ color: 'white' }}
                                />
                            </Space>
                            {tesoreriaVisible ? (
                                <Statistic
                                    value={tesoreria?.saldo_caja ?? 0}
                                    precision={2}
                                    prefix="$"
                                    valueStyle={{ color: 'white', fontSize: '2.5em', fontWeight: 'bold' }}
                                />
                            ) : (
                                <div style={{ fontSize: '2.5em', fontWeight: 'bold', letterSpacing: '4px', margin: '4px 0' }}>
                                    ••••••
                                </div>
                            )}
                            <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                                Todo el efectivo histórico acumulado (Entradas - Salidas)
                            </Text>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card style={{ borderRadius: '15px', height: '100%', display: 'flex', alignItems: 'center' }} bordered={false}>
                            <div>
                                <Text strong style={{ fontSize: '1.1em' }}>¿Qué significa este número?</Text>
                                <p style={{ margin: 0, color: '#666' }}>Es el fondo total de tu negocio. Cuentas de banco del mes, fondos y efectivo del mes.</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* SECCIÓN 2: MÉTRICAS DEL MES */}
            <div style={{ marginBottom: '40px' }}>
                <Title level={3} style={{ marginBottom: '20px' }}>Rendimiento del Mes Actual</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <CardInfo title="Ventas del Mes" value={datos.mes_actual.ventas} icon={<ShoppingOutlined />} />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <CardInfo
                          title="Gastos Operativos"
                          value={(datos.mes_actual.compras_inventario || 0) + (datos.mes_actual.gastos_operativos || 0) + (datos.mes_actual.mermas || 0)}
                          color="#f5222d"
                          info="Inventario + Operativos + Mermas (OPEX)"
                          subItems={datos.mes_actual.gastos_por_metodo ? [
                            { label: "yappy", value: datos.mes_actual.gastos_por_metodo.yappy || 0 },
                            { label: "efectivo", value: datos.mes_actual.gastos_por_metodo.efectivo || 0 }
                          ] : null}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <CardInfo
                          title="Flujo Caja del Mes"
                          value={100 + (datos.mes_actual.saldo_caja_mes || 0)}
                          color="#d48d68"
                          info="Inicia con $50 yappy + $50 efectivo. Se mueve con entradas y salidas reales del mes. No incluye gastos pagados con Fondos."
                          subItems={datos.mes_actual.flujo_por_metodo ? [
                            { label: "yappy", value: 50 + (datos.mes_actual.flujo_por_metodo.yappy || 0) },
                            { label: "efectivo", value: 50 + (datos.mes_actual.flujo_por_metodo.efectivo || 0) }
                          ] : null}
                        />
                    </Col>
                    {datos.mes_actual.gastos_fondos > 0 && (
                        <Col xs={24} sm={12} md={8}>
                            <CardInfo
                              title="Gastos con Fondos (Tesorería)"
                              value={datos.mes_actual.gastos_fondos}
                              color="#d4a017"
                              info="Compras grandes pagadas con la cuenta de Fondos Antojo24. No afectan la utilidad ni el flujo de caja del mes: solo reducen la Tesorería total."
                            />
                        </Col>
                    )}
                </Row>
            </div>

            <Card
              title={<span style={{ fontSize: '1.2em', fontWeight: 600 }}>Rentabilidad — últimos 3 meses</span>}
              style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' }}
            >
              <Table
                columns={rentabilidadColumns}
                dataSource={datos.rentabilidad_mensual || []}
                rowKey="mes"
                pagination={false}
                scroll={{ x: 'max-content' }}
              />
              <Typography.Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 12 }}>
                No incluye movimientos pagados con Fondos (Tesorería).
              </Typography.Text>
            </Card>

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
