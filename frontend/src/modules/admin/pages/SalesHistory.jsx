
import React, { useState, useEffect } from "react";
import { Table, Card, Typography } from "antd";
import { obtenerDashboard } from "../../../api/admin/axios_dashboard";

const { Title } = Typography;

function SalesHistory() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const data = await obtenerDashboard();
                setHistorial(data.historial || []);
            } catch (error) {
                console.error("Error al obtener historial de ventas:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    return (
        <div style={{ padding: '30px' }}>
            <Title level={2}>Historial de Ventas Diarias</Title>
            <Card borderRadius="15px" boxShadow="0 4px 12px rgba(0,0,0,0.05)">
                <Table
                    dataSource={historial}
                    columns={columns}
                    rowKey="fecha"
                    loading={loading}
                    pagination={{ pageSize: 12 }}
                />
            </Card>
        </div>
    );
}

export default SalesHistory;
