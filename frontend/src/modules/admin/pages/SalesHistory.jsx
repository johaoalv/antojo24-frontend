import React, { useState, useEffect, useMemo } from "react";
import { Table, Card, Typography, Tag, Spin } from "antd";
import { obtenerDashboard, obtenerHistorialDiarioMes } from "../../../api/admin/axios_dashboard";
import { useStore } from "../../../context/StoreContext";

const { Title } = Typography;

function SalesHistory() {
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);
    // Caché de detalle diario por mes, cargado bajo demanda al expandir una fila: { "YYYY-MM": { loading, dias } }
    const [detallesPorMes, setDetallesPorMes] = useState({});
    const { selectedStoreId } = useStore();

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await obtenerDashboard(selectedStoreId);
            setDatos(data);
        } catch (error) {
            console.error("Error al obtener historial de ventas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
        setDetallesPorMes({});
    }, [selectedStoreId]);

    // Filas de nivel mes: vienen directo de historial_mensual (rápido, hasta 12 meses)
    const dataAgrupada = useMemo(() => {
        if (!datos || !datos.historial_mensual) return [];
        return datos.historial_mensual.map(h => ({
            key: h.mes,
            mes: h.mes,
            total_ventas: Number(h.total_ventas) || 0,
        }));
    }, [datos]);

    const cargarDetalleMes = async (mes) => {
        if (detallesPorMes[mes]) return; // ya cargado o cargando
        setDetallesPorMes(prev => ({ ...prev, [mes]: { loading: true, dias: [] } }));
        try {
            const dias = await obtenerHistorialDiarioMes(mes, selectedStoreId);
            setDetallesPorMes(prev => ({ ...prev, [mes]: { loading: false, dias } }));
        } catch (error) {
            setDetallesPorMes(prev => ({ ...prev, [mes]: { loading: false, dias: [] } }));
        }
    };

    const expandedRowRender = (record) => {
        const detalle = detallesPorMes[record.mes];

        if (!detalle || detalle.loading) {
            return <Spin size="small" />;
        }

        const columns = [
            { title: 'Día', dataIndex: 'dia', key: 'dia' },
            {
                title: 'Ventas del Día',
                dataIndex: 'total_ventas',
                key: 'total_ventas',
                align: 'right',
                render: (val) => <Typography.Text strong>${Number(val || 0).toFixed(2)}</Typography.Text>
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={detalle.dias.map(d => ({ ...d, key: d.dia }))}
                pagination={false}
                size="small"
                bordered
            />
        );
    };

    const columns = [
        {
            title: 'Mes',
            dataIndex: 'mes',
            key: 'mes',
            render: (text) => {
                const [year, month] = text.split("-");
                const date = new Date(year, month - 1);
                return <Typography.Text strong style={{ fontSize: '1.2em', textTransform: 'capitalize' }}>
                    {date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                </Typography.Text>;
            }
        },
        {
            title: 'Ventas Totales del Mes',
            dataIndex: 'total_ventas',
            key: 'total_ventas',
            align: 'right',
            render: (val) => <Tag color="green" style={{ fontSize: '1.1em', padding: '5px 10px' }}>
                ${Number(val || 0).toFixed(2)}
            </Tag>
        },
    ];

    return (
        <div style={{ padding: '30px' }}>
            <Title level={2} style={{ marginBottom: '24px' }}>Historial de Ventas</Title>
            <Card style={{ borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <Table
                    dataSource={dataAgrupada}
                    columns={columns}
                    rowKey="mes"
                    loading={loading}
                    expandable={{
                        expandedRowRender,
                        defaultExpandAllRows: false,
                        onExpand: (expanded, record) => {
                            if (expanded) cargarDetalleMes(record.mes);
                        },
                    }}
                    pagination={{ pageSize: 12 }}
                />
            </Card>
        </div>
    );
}

export default SalesHistory;
