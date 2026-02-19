
import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Space, Divider, Tag, InputNumber, Row, Col, Alert } from "antd";
import { CalculatorOutlined, DollarOutlined, PieChartOutlined, ArrowUpOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/core/axios_base";

const { Title, Text } = Typography;

const CosteoProductos = () => {
    const [costeos, setCosteos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [targetMargin, setTargetMargin] = useState(60); // 60% margen por defecto

    const fetchCosteos = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/costeo/productos");
            setCosteos(response.data);
        } catch (error) {
            console.error("Error al obtener costeo:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCosteos();
    }, []);

    const columns = [
        {
            title: 'Producto',
            dataIndex: 'producto',
            key: 'producto',
            render: (text) => <strong style={{ textTransform: 'capitalize', fontSize: '1.2em' }}>{text}</strong>
        },
        {
            title: 'Costo de Producción',
            dataIndex: 'costo_total',
            key: 'costo_total',
            render: (val) => <Tag color="blue" style={{ fontSize: '1.1em' }}>${parseFloat(val).toFixed(2)}</Tag>
        },
        {
            title: `Precio Sugerido (${targetMargin}% Margen)`,
            key: 'sugerido',
            render: (_, record) => {
                const costo = parseFloat(record.costo_total);
                // Fórmula: Precio = Costo / (1 - Margen/100)
                const sugerido = costo / (1 - targetMargin / 100);
                return <strong style={{ color: '#52c41a', fontSize: '1.2em' }}>${sugerido.toFixed(2)}</strong>;
            }
        }
    ];

    const expandedRowRender = (record) => {
        const subColumns = [
            { title: 'Ingrediente', dataIndex: 'nombre_insumo', key: 'nombre', render: (t) => <span style={{ textTransform: 'capitalize' }}>{t}</span> },
            { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad', render: (v, r) => `${v} ${r.unidad}` },
            { title: 'Costo Unitario', dataIndex: 'costo_unitario', key: 'unitario', render: (v) => `$${parseFloat(v).toFixed(4)}` },
            { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal', render: (v) => <strong>$${parseFloat(v).toFixed(2)}</strong> },
        ];
        return <Table columns={subColumns} dataSource={record.ingredientes} pagination={false} size="small" />;
    };

    return (
        <div style={{ padding: 30 }}>
            <Title level={2}><PieChartOutlined /> Análisis de Costos y Rentabilidad</Title>
            <Text type="secondary">Calcula automáticamente cuánto te cuesta producir cada plato basándose en las recetas y precios de insumos actuales.</Text>

            <Divider />

            <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="Simulador de Margen de Ganancia" bordered={false} className="card-shadow">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>Define tu margen objetivo (%) para ver los precios sugeridos:</Text>
                            <InputNumber
                                min={1}
                                max={99}
                                value={targetMargin}
                                onChange={setTargetMargin}
                                style={{ width: 150, fontSize: '1.5em', height: 45 }}
                                addonAfter="%"
                            />
                            <Alert
                                type="info"
                                showIcon
                                message="El margen bruto se calcula sobre el precio de venta."
                            />
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card bordered={false} className="card-shadow" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffd60a' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Text strong style={{ fontSize: '1.5em', display: 'block' }}>MÁRGENES ACTUALIZADOS</Text>
                            <Text>Si el precio de la Mayonesa sube en Insumos, estos costos se actualizan solos.</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} className="card-shadow">
                <Table
                    columns={columns}
                    dataSource={costeos}
                    loading={loading}
                    rowKey="producto"
                    expandable={{ expandedRowRender }}
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default CosteoProductos;
