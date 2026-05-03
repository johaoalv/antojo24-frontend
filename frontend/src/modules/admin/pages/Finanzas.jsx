import React, { useState, useEffect } from "react";
import { Table, Card, Typography, DatePicker, Tag, Space } from "antd";
import { WalletOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { getLibroCaja } from "../../../api/admin/axios_finanzas";
import { useStore } from "../../../context/StoreContext";
import dayjs from "dayjs";

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
    const filas = [];
    let saldoYappy = saldoInicial.yappy;
    let saldoEfectivo = saldoInicial.efectivo;

    // Fila 0: inicio del día
    filas.push({
        key: "inicio",
        hora: "12:00 AM",
        descripcion: "Inicio del día",
        metodo: "ambos",
        tipo: "inicio",
        monto: null,
        saldo_yappy: saldoYappy,
        saldo_efectivo: saldoEfectivo,
    });

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
            monto,
            saldo_yappy: saldoYappy,
            saldo_efectivo: saldoEfectivo,
        });
    }

    return { filas, saldoYappy, saldoEfectivo };
}

function Finanzas() {
    const [movimientos, setMovimientos] = useState([]);
    const [saldoInicial, setSaldoInicial] = useState(SALDO_INICIAL_DEFAULT);
    const [fecha, setFecha] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const { selectedStoreId } = useStore();

    const cargarDatos = async (f) => {
        if (!selectedStoreId || selectedStoreId === "global") return;
        setLoading(true);
        try {
            const data = await getLibroCaja(selectedStoreId, f.format("YYYY-MM-DD"));
            setMovimientos(data.movimientos || []);
            setSaldoInicial({
                yappy: data.saldo_inicial_yappy ?? 50,
                efectivo: data.saldo_inicial_efectivo ?? 50,
            });
        } catch (error) {
            console.error("Error al cargar libro de caja:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos(fecha);
    }, [selectedStoreId, fecha]);

    const { filas, saldoYappy, saldoEfectivo } = buildFilas(movimientos, saldoInicial);

    const columns = [
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
            width: 120,
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
                if (r.tipo === "inicio") {
                    return (
                        <Text style={{ color: "#52c41a", fontSize: 13 }}>
                            +$50.00 / +$50.00
                        </Text>
                    );
                }
                const color = r.tipo === "entrada" ? "#52c41a" : "#f5222d";
                const icon = r.tipo === "entrada" ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
                return (
                    <Text strong style={{ color }}>
                        {icon} ${v.toFixed(2)}
                    </Text>
                );
            },
        },
        {
            title: "Saldo Yappy",
            dataIndex: "saldo_yappy",
            key: "saldo_yappy",
            align: "right",
            width: 120,
            render: (v) => (
                <Text style={{ color: v < 0 ? "#f5222d" : "#1a1a1a" }}>
                    ${v.toFixed(2)}
                </Text>
            ),
        },
        {
            title: "Saldo Efectivo",
            dataIndex: "saldo_efectivo",
            key: "saldo_efectivo",
            align: "right",
            width: 120,
            render: (v) => (
                <Text style={{ color: v < 0 ? "#f5222d" : "#1a1a1a" }}>
                    ${v.toFixed(2)}
                </Text>
            ),
        },
    ];

    const esGlobal = !selectedStoreId || selectedStoreId === "global";

    return (
        <div style={{ padding: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    <WalletOutlined style={{ marginRight: 8 }} />
                    Libro de Caja
                </Title>
                <DatePicker
                    value={fecha}
                    onChange={(d) => d && setFecha(d)}
                    allowClear={false}
                    style={{ width: 160 }}
                    format="DD/MM/YYYY"
                />
            </div>

            {esGlobal ? (
                <Card bordered={false} style={{ borderRadius: 12, textAlign: "center", padding: 40 }}>
                    <Text type="secondary">Seleccioná una sucursal para ver el libro de caja del día.</Text>
                </Card>
            ) : (
                <>
                    <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                        <Card bordered={false} style={{ borderRadius: 12, flex: 1, textAlign: "center" }}>
                            <Text type="secondary" style={{ fontSize: 13 }}>Saldo Yappy al cierre</Text>
                            <Title level={3} style={{ margin: 0, color: saldoYappy >= 0 ? "#1890ff" : "#f5222d" }}>
                                ${saldoYappy.toFixed(2)}
                            </Title>
                        </Card>
                        <Card bordered={false} style={{ borderRadius: 12, flex: 1, textAlign: "center" }}>
                            <Text type="secondary" style={{ fontSize: 13 }}>Saldo Efectivo al cierre</Text>
                            <Title level={3} style={{ margin: 0, color: saldoEfectivo >= 0 ? "#52c41a" : "#f5222d" }}>
                                ${saldoEfectivo.toFixed(2)}
                            </Title>
                        </Card>
                        <Card bordered={false} style={{ borderRadius: 12, flex: 1, textAlign: "center" }}>
                            <Text type="secondary" style={{ fontSize: 13 }}>Total del día</Text>
                            <Title level={3} style={{ margin: 0 }}>
                                ${(saldoYappy + saldoEfectivo).toFixed(2)}
                            </Title>
                        </Card>
                    </div>

                    <Card
                        style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        bordered={false}
                    >
                        <Table
                            dataSource={filas}
                            columns={columns}
                            loading={loading}
                            pagination={false}
                            rowKey="key"
                            rowClassName={(r) => r.tipo === "inicio" ? "fila-inicio" : ""}
                            size="middle"
                        />
                    </Card>
                </>
            )}
        </div>
    );
}

export default Finanzas;
