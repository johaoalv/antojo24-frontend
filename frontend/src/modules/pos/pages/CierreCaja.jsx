import React, { useEffect, useMemo, useState } from "react";
import { Table, Typography, Button, Tag, Space, Popconfirm } from "antd";
import { DollarCircleOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { hacerCierreCaja, getMovimientosHoy, getPedidoDetalle } from "../../../api/pos/axios_cierre";
import { eliminarPedido } from "../../../api/pos/axios_pedidos";
import Navbar from "../../common/components/Navbar";
import SecondaryButton from "../../common/components/SecondaryButton";
import Loader from "../../common/components/Loader";
import ClosingSummaryModal from "../components/ClosingSummaryModal";
import { notifyError, notifySuccess, notifyWarning } from "../../common/components/notifications.jsx";

const { Title, Text } = Typography;

const SALDO_INICIAL_DEFAULT = { yappy: 50, efectivo: 50 };

const METODO_LABEL = {
  yappy: "Yappy",
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

const CATEGORIA_LABEL = {
  venta: "Venta",
  operativo: "Gasto Operativo",
  inventario: "Inventario",
  inversion: "Capital",
};

function formatHora(fechaStr) {
  if (!fechaStr) return "-";
  const d = new Date(fechaStr);
  return d.toLocaleTimeString("es-PA", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function buildFilas(movimientos, saldoInicial = SALDO_INICIAL_DEFAULT) {
  let saldoYappy = saldoInicial.yappy;
  let saldoEfectivo = saldoInicial.efectivo;

  const filas = [
    {
      key: "inicio",
      hora: "12:00 AM",
      descripcion: "Inicio del día",
      metodo: "ambos",
      tipo: "inicio",
      monto: null,
      saldo_yappy: saldoYappy,
      saldo_efectivo: saldoEfectivo,
      referencia_id: null,
    },
  ];

  for (const m of movimientos) {
    const monto = parseFloat(m.monto || 0);
    const esEntrada = m.tipo === "entrada";

    if (m.metodo_pago === "yappy") {
      saldoYappy = esEntrada ? saldoYappy + monto : saldoYappy - monto;
    } else if (m.metodo_pago === "efectivo") {
      saldoEfectivo = esEntrada ? saldoEfectivo + monto : saldoEfectivo - monto;
    }

    filas.push({
      key: m.id,
      hora: formatHora(m.fecha),
      descripcion: m.descripcion || CATEGORIA_LABEL[m.categoria] || m.categoria,
      metodo: m.metodo_pago,
      tipo: m.tipo,
      categoria: m.categoria,
      monto,
      saldo_yappy: saldoYappy,
      saldo_efectivo: saldoEfectivo,
      referencia_id: m.referencia_id || null,
    });
  }

  return { filas, saldoYappy, saldoEfectivo };
}

const CierreCaja = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [saldoInicial, setSaldoInicial] = useState(SALDO_INICIAL_DEFAULT);
  const [detalles, setDetalles] = useState({});
  const [cargando, setCargando] = useState(true);
  const [loadingCierre, setLoadingCierre] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalReal, setTotalReal] = useState(0);
  const nombreSucursal = JSON.parse(localStorage.getItem("user"))?.nombre_tienda;

  const cargarMovimientos = async () => {
    setCargando(true);
    try {
      const data = await getMovimientosHoy();
      setMovimientos(data.movimientos || []);
      setSaldoInicial({
        yappy: data.saldo_inicial_yappy ?? 50,
        efectivo: data.saldo_inicial_efectivo ?? 50,
      });
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
      notifyError({ message: "Error al cargar los movimientos del día", placement: "topRight" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const { filas, saldoYappy, saldoEfectivo } = useMemo(
    () => buildFilas(movimientos, saldoInicial),
    [movimientos, saldoInicial]
  );

  const handleExpand = async (expanded, record) => {
    if (!expanded || !record.referencia_id || detalles[record.referencia_id]) return;
    try {
      const items = await getPedidoDetalle(record.referencia_id);
      setDetalles((prev) => ({ ...prev, [record.referencia_id]: items }));
    } catch {
      setDetalles((prev) => ({ ...prev, [record.referencia_id]: [] }));
    }
  };

  const handleDeleteVenta = async (referencia_id) => {
    try {
      await eliminarPedido(referencia_id);
      notifySuccess({ message: "Venta eliminada y stock restaurado", placement: "bottomRight" });
      cargarMovimientos();
    } catch (error) {
      notifyError({
        message: "Error al eliminar",
        description: error.response?.data?.error || "No se pudo eliminar la venta.",
        placement: "topRight",
      });
    }
  };

  const handleOpenModal = () => {
    setTotalReal(saldoEfectivo);
    setModalVisible(true);
  };

  const handleCierre = async () => {
    setLoadingCierre(true);
    try {
      const resultado = await hacerCierreCaja(totalReal);
      notifySuccess({
        message: "Cierre exitoso",
        description: `Efectivo: $${resultado.resumen?.total_efectivo?.toFixed(2) ?? "0.00"}`,
        placement: "bottomRight",
      });
      setModalVisible(false);
    } catch (error) {
      if (error.response?.status === 409) {
        notifyWarning({ message: "Ya registraste un cierre hoy.", placement: "topRight" });
      } else {
        notifyError({ message: "Error al cerrar caja", description: error.message, placement: "topRight" });
      }
    } finally {
      setLoadingCierre(false);
    }
  };

  const columnas = [
    {
      title: "Hora",
      dataIndex: "hora",
      key: "hora",
      width: 90,
      render: (v, r) => (
        <Text style={{ fontSize: 13, color: r.tipo === "inicio" ? "#722ed1" : undefined }}>
          {v}
        </Text>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      render: (v, r) => (
        <Text strong={r.tipo === "inicio"} style={{ color: r.tipo === "inicio" ? "#722ed1" : undefined }}>
          {v}
        </Text>
      ),
    },
    {
      title: "Método",
      dataIndex: "metodo",
      key: "metodo",
      width: 130,
      render: (v) =>
        v === "ambos" ? (
          <Space size={4}>
            <Tag color="blue" style={{ margin: 0 }}>Yappy</Tag>
            <Tag color="green" style={{ margin: 0 }}>Efectivo</Tag>
          </Space>
        ) : (
          <Tag color={v === "yappy" ? "blue" : v === "efectivo" ? "green" : "default"}>
            {METODO_LABEL[v] || v}
          </Tag>
        ),
    },
    {
      title: "Monto",
      dataIndex: "monto",
      key: "monto",
      align: "right",
      width: 120,
      render: (v, r) => {
        if (r.tipo === "inicio") return null;
        const color = r.tipo === "entrada" ? "#52c41a" : "#f5222d";
        const icon = r.tipo === "entrada" ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
        return <Text strong style={{ color }}>{icon} ${v.toFixed(2)}</Text>;
      },
    },
    {
      title: "Saldo Yappy",
      dataIndex: "saldo_yappy",
      key: "saldo_yappy",
      align: "right",
      width: 110,
      render: (v) => <Text style={{ color: v < 0 ? "#f5222d" : undefined }}>${v.toFixed(2)}</Text>,
    },
    {
      title: "Saldo Efectivo",
      dataIndex: "saldo_efectivo",
      key: "saldo_efectivo",
      align: "right",
      width: 120,
      render: (v) => <Text style={{ color: v < 0 ? "#f5222d" : undefined }}>${v.toFixed(2)}</Text>,
    },
    {
      title: "",
      key: "acciones",
      width: 50,
      render: (_, record) => {
        if (record.categoria !== "venta" || !record.referencia_id) return null;
        return (
          <Popconfirm
            title="¿Eliminar esta venta?"
            description="Se restaurará el inventario automáticamente."
            onConfirm={() => handleDeleteVenta(record.referencia_id)}
            okText="Sí"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        );
      },
    },
  ];

  const hayMovimientos = movimientos.length > 0;

  return (
    <>
      <Navbar />
      <div style={{ padding: 40 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Cierre de Caja — {nombreSucursal}
        </Title>

        {/* Cards resumen */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, justifyContent: "center" }}>
          <div style={{ background: "#e6f4ff", borderRadius: 12, padding: "16px 32px", textAlign: "center", minWidth: 140 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Saldo Yappy</Text>
            <div style={{ fontSize: "1.6em", fontWeight: "bold", color: saldoYappy < 0 ? "#f5222d" : "#1890ff" }}>
              ${saldoYappy.toFixed(2)}
            </div>
          </div>
          <div style={{ background: "#f6ffed", borderRadius: 12, padding: "16px 32px", textAlign: "center", minWidth: 140 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Saldo Efectivo</Text>
            <div style={{ fontSize: "1.6em", fontWeight: "bold", color: saldoEfectivo < 0 ? "#f5222d" : "#52c41a" }}>
              ${saldoEfectivo.toFixed(2)}
            </div>
          </div>
          <div style={{ background: "#f9f0ff", borderRadius: 12, padding: "16px 32px", textAlign: "center", minWidth: 140 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Total del Día</Text>
            <div style={{ fontSize: "1.6em", fontWeight: "bold", color: "#722ed1" }}>
              ${(saldoYappy + saldoEfectivo).toFixed(2)}
            </div>
          </div>
        </div>

        {cargando ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Loader size={64} />
          </div>
        ) : (
          <Table
            dataSource={filas}
            columns={columnas}
            rowKey="key"
            pagination={{ pageSize: 20, showSizeChanger: false }}
            bordered={false}
            size="middle"
            rowClassName={(r) => r.tipo === "inicio" ? "fila-inicio" : ""}
            expandable={{
              onExpand: handleExpand,
              rowExpandable: (r) => r.categoria === "venta" && !!r.referencia_id,
              expandedRowRender: (r) => {
                const items = detalles[r.referencia_id];
                if (!items) return <Text type="secondary">Cargando...</Text>;
                if (items.length === 0) return <Text type="secondary">Sin detalle disponible.</Text>;
                return (
                  <Table
                    dataSource={items}
                    rowKey={(i) => i.producto + i.cantidad}
                    size="small"
                    pagination={false}
                    style={{ margin: "0 48px" }}
                    columns={[
                      { title: "Producto", dataIndex: "producto", key: "producto" },
                      { title: "Cantidad", dataIndex: "cantidad", key: "cantidad", align: "center", width: 80 },
                      { title: "Total", dataIndex: "total_item", key: "total_item", align: "right", width: 100,
                        render: (v) => `$${parseFloat(v).toFixed(2)}` },
                    ]}
                  />
                );
              },
            }}
          />
        )}

        <div style={{ textAlign: "right", marginTop: 32 }}>
          <SecondaryButton
            icon={<DollarCircleOutlined />}
            onClick={handleOpenModal}
            disabled={cargando || !hayMovimientos}
          >
            Cierre de Caja
          </SecondaryButton>
        </div>
      </div>

      <ClosingSummaryModal
        visible={modalVisible}
        saldoYappy={saldoYappy}
        saldoEfectivo={saldoEfectivo}
        totalReal={totalReal}
        onTotalRealChange={(value) => setTotalReal(value || 0)}
        onConfirm={handleCierre}
        onCancel={() => { if (!loadingCierre) setModalVisible(false); }}
        loading={loadingCierre}
      />
    </>
  );
};

export default CierreCaja;
