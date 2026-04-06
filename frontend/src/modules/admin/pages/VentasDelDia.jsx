import React, { useState, useEffect } from "react";
import { Table, Card, Row, Col, Statistic, Spin, Tabs } from "antd";
import { DollarOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/core/axios_base";
import { formatCurrency } from "../../pos/utils/formatters";
import { useStore } from "../../../context/StoreContext";

const ORIGEN_LABELS = { local: "Local", pedidosya: "PedidosYa", uber: "Uber" };

const MetodoPagoCards = ({ porMetodo }) => (
  <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
    {Object.entries(porMetodo).map(([metodo, monto]) => (
      <Col xs={12} sm={8} md={6} key={metodo}>
        <Card size="small" style={{ textAlign: "center" }}>
          <Statistic
            title={metodo.charAt(0).toUpperCase() + metodo.slice(1)}
            value={monto}
            prefix="$"
            precision={2}
            valueStyle={{ fontSize: "1.1em" }}
          />
        </Card>
      </Col>
    ))}
  </Row>
);

// ────────────────────────────────────────────────────────────
// TAB: HOY
// ────────────────────────────────────────────────────────────
const VentasHoy = ({ selectedStoreId }) => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [desglose, setDesglose] = useState({ porMetodo: {}, porOrigen: {}, total: 0, cantidad: 0 });

  useEffect(() => { cargar(); }, [selectedStoreId]);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/pedidos-hoy?sucursal_id=${selectedStoreId}`);
      const data = Array.isArray(res.data) ? res.data : [];

      const porPedido = {};
      data.forEach(item => {
        if (!porPedido[item.pedido_id]) {
          porPedido[item.pedido_id] = {
            key: item.pedido_id,
            pedido_id: item.pedido_id,
            fecha: item.fecha,
            monto: parseFloat(item.total_pedido || item.total_item || 0),
            metodo_pago: item.metodo_pago,
            tipo_pedido: item.tipo_pedido || "local",
            estado_pago: item.estado_pago || "pagado",
            productos: []
          };
        }
        porPedido[item.pedido_id].productos.push(item.producto);
      });

      const lista = Object.values(porPedido);
      const porMetodo = {};
      const porOrigen = {};
      let total = 0;

      lista.forEach(v => {
        total += v.monto;
        porMetodo[v.metodo_pago] = (porMetodo[v.metodo_pago] || 0) + v.monto;
        porOrigen[v.tipo_pedido] = (porOrigen[v.tipo_pedido] || 0) + v.monto;
      });

      setVentas(lista);
      setDesglose({ porMetodo, porOrigen, total, cantidad: lista.length });
    } catch {
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Hora", dataIndex: "fecha", key: "fecha", width: 100,
      render: f => f ? new Date(f).toLocaleTimeString("es-PA", { hour: "2-digit", minute: "2-digit" }) : "-"
    },
    {
      title: "Monto", dataIndex: "monto", key: "monto", width: 110, align: "right",
      render: m => formatCurrency(m)
    },
    {
      title: "Método", dataIndex: "metodo_pago", key: "metodo_pago", width: 110,
      render: m => m ? m.charAt(0).toUpperCase() + m.slice(1) : "-"
    },
    {
      title: "Origen", dataIndex: "tipo_pedido", key: "tipo_pedido", width: 110,
      render: t => ORIGEN_LABELS[t] || t
    },
    {
      title: "Estado", dataIndex: "estado_pago", key: "estado_pago", width: 100,
      render: e => e ? e.charAt(0).toUpperCase() + e.slice(1) : "-"
    },
    {
      title: "Productos", dataIndex: "productos", key: "productos",
      render: p => Array.isArray(p) ? p.join(", ") : "-"
    }
  ];

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>;

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic title="Total Hoy" value={desglose.total} prefix={<DollarOutlined />} formatter={v => formatCurrency(v)} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic title="Pedidos" value={desglose.cantidad} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="Por Método de Pago" size="small" style={{ marginBottom: 16 }}>
        <MetodoPagoCards porMetodo={desglose.porMetodo} />
      </Card>

      <Card title="Por Origen" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          {Object.entries(desglose.porOrigen).map(([origen, monto]) => (
            <Col xs={12} sm={8} md={6} key={origen}>
              <Card size="small" style={{ textAlign: "center" }}>
                <Statistic title={ORIGEN_LABELS[origen] || origen} value={monto} prefix="$" precision={2} valueStyle={{ fontSize: "1.1em" }} />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="Detalle" size="small">
        <Table columns={columns} dataSource={ventas} pagination={{ pageSize: 20 }} size="small" bordered rowKey="pedido_id" />
      </Card>
    </>
  );
};

// ────────────────────────────────────────────────────────────
// TAB: MES
// ────────────────────────────────────────────────────────────
const VentasMes = ({ selectedStoreId }) => {
  const [data, setData] = useState({ pedidos: [], resumen: { total: 0, cantidad: 0, por_metodo: {} } });
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargar(); }, [selectedStoreId]);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/pedidos-mes?sucursal_id=${selectedStoreId}`);
      setData(res.data);
    } catch {
      setData({ pedidos: [], resumen: { total: 0, cantidad: 0, por_metodo: {} } });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Fecha", dataIndex: "fecha", key: "fecha", width: 140,
      render: f => f ? new Date(f).toLocaleString("es-PA", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "-"
    },
    {
      title: "Monto", dataIndex: "total_pedido", key: "total_pedido", width: 110, align: "right",
      render: m => formatCurrency(m)
    },
    {
      title: "Método", dataIndex: "metodo_pago", key: "metodo_pago", width: 110,
      render: m => m ? m.charAt(0).toUpperCase() + m.slice(1) : "-"
    },
    {
      title: "Origen", dataIndex: "tipo_pedido", key: "tipo_pedido", width: 110,
      render: t => ORIGEN_LABELS[t] || t
    },
    {
      title: "Estado", dataIndex: "estado_pago", key: "estado_pago", width: 100,
      render: e => e ? e.charAt(0).toUpperCase() + e.slice(1) : "-"
    }
  ];

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>;

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic title="Total del Mes" value={data.resumen.total} prefix={<DollarOutlined />} formatter={v => formatCurrency(v)} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic title="Pedidos del Mes" value={data.resumen.cantidad} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="Por Método de Pago" size="small" style={{ marginBottom: 16 }}>
        <MetodoPagoCards porMetodo={data.resumen.por_metodo} />
      </Card>

      <Card title="Detalle del Mes" size="small">
        <Table
          columns={columns}
          dataSource={data.pedidos.map((p, i) => ({ ...p, key: p.pedido_id || i }))}
          pagination={{ pageSize: 20 }}
          size="small"
          bordered
        />
      </Card>
    </>
  );
};

// ────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ────────────────────────────────────────────────────────────
const VentasDelDia = () => {
  const { selectedStoreId } = useStore();

  const items = [
    { key: "hoy", label: "Hoy", children: <VentasHoy selectedStoreId={selectedStoreId} /> },
    { key: "mes", label: "Este Mes", children: <VentasMes selectedStoreId={selectedStoreId} /> }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ventas</h2>
      <Tabs defaultActiveKey="hoy" items={items} />
    </div>
  );
};

export default VentasDelDia;
