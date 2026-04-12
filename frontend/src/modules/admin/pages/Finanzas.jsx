import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Row, Col, Tag } from "antd";
import { obtenerMovimientos } from "../../../api/admin/axios_finanzas";
import { useStore } from "../../../context/StoreContext";
import { ArrowUpOutlined, ArrowDownOutlined, WalletOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const CATEGORIA_COLORS = {
    venta: 'green',
    inversion: 'purple',
    inventario: 'orange',
    operativo: 'blue',
    personal: 'cyan',
    otro: 'default'
};

const CATEGORIA_LABELS = {
    venta: 'Venta',
    inversion: 'Capital Externo',
    inventario: 'Inventario',
    operativo: 'Gasto Operativo',
    personal: 'Sueldos',
    otro: 'Otro'
};

function Finanzas() {
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { selectedStoreId } = useStore();

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await obtenerMovimientos(selectedStoreId);
            setMovimientos(data);
        } catch (error) {
            console.error("Error al cargar movimientos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [selectedStoreId]);

    const saldoTotal = movimientos.reduce((acc, mov) => {
        return mov.tipo === 'entrada' ? acc + Number(mov.monto) : acc - Number(mov.monto);
    }, 0);

    const columns = [
        { 
            title: 'Fecha', 
            dataIndex: 'fecha', 
            key: 'fecha',
            render: (text) => text.split(' ')[0]
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            render: (tipo) => (
                <Tag color={tipo === 'entrada' ? 'green' : 'volcano'} icon={tipo === 'entrada' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}>
                    {tipo.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Categoría',
            dataIndex: 'categoria',
            key: 'categoria',
            render: (cat) => <Tag color={CATEGORIA_COLORS[cat] || 'default'}>{CATEGORIA_LABELS[cat] || cat.toUpperCase()}</Tag>
        },
        { 
            title: 'Descripción', 
            dataIndex: 'descripcion', 
            key: 'descripcion' 
        },
        {
            title: 'Monto',
            dataIndex: 'monto',
            key: 'monto',
            align: 'right',
            render: (val, record) => (
                <Text strong style={{ color: record.tipo === 'entrada' ? '#52c41a' : '#f5222d' }}>
                    {record.tipo === 'entrada' ? '+' : '-'}${Number(val).toFixed(2)}
                </Text>
            )
        }
    ];

    return (
        <div style={{ padding: '30px' }}>
            <Title level={2} style={{ marginBottom: '24px' }}>
                <WalletOutlined /> Libro de Caja
            </Title>

            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                <Col xs={24} md={8}>
                    <Card style={{ textAlign: 'center', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} bordered={false}>
                        <Text type="secondary">Saldo Actual en Caja</Text>
                        <Title level={2} style={{ margin: 0, color: saldoTotal >= 0 ? '#52c41a' : '#f5222d' }}>
                            ${saldoTotal.toFixed(2)}
                        </Title>
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card style={{ borderRadius: '12px' }} bordered={false}>
                        <Text strong>Registro de todos los movimientos de caja</Text>
                        <p style={{ margin: 0, color: '#666' }}>
                            Aquí puedes ver todas las entradas y salidas de dinero. Para registrar aportes de capital, usa la sección "Aporte Capital" en el menú lateral.
                        </p>
                    </Card>
                </Col>
            </Row>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Table 
                    dataSource={movimientos} 
                    columns={columns} 
                    rowKey="id" 
                    loading={loading}
                    pagination={{ pageSize: 15 }}
                />
            </Card>
        </div>
    );
}

export default Finanzas;

