import React, { useState, useEffect, useMemo } from "react";
import { Table, Card, Typography, Tag } from "antd";
import { obtenerDashboard } from "../../../api/admin/axios_dashboard";
import { useStore } from "../../../context/StoreContext";

const { Title } = Typography;

function SalesHistory() {
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);
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
    }, [selectedStoreId]);

    // Agrupar historial diario por mes para la tabla expandible
    const dataAgrupada = useMemo(() => {
        if (!datos || !datos.historial_diario) return [];

        const meses = {};
        datos.historial_diario.forEach(dia => {
            const mesKey = dia.dia.substring(0, 7); // YYYY-MM
            if (!meses[mesKey]) {
                meses[mesKey] = {
                    key: mesKey,
                    mes: mesKey,
                    total_ventas: 0,
                    detalles: []
                };
            }
            meses[mesKey].total_ventas += dia.total_ventas;
            meses[mesKey].detalles.push({
                ...dia,
                key: dia.dia
            });
        });

        return Object.values(meses).sort((a, b) => b.mes.localeCompare(a.mes));
    }, [datos]);

    const expandedRowRender = (record) => {
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
                dataSource={record.detalles}
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
                    }}
                    pagination={{ pageSize: 12 }}
                />
            </Card>
        </div>
    );
}

export default SalesHistory;
