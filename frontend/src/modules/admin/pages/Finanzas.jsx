import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Row, Col, Tag, Space, Input, Select, Button, Modal, Form, InputNumber, message } from "antd";
import { obtenerMovimientos } from "../../../api/admin/axios_finanzas";
import { agregarInyeccion } from "../../../api/admin/axios_inyecciones";
import { useStore } from "../../../context/StoreContext";
import { ArrowUpOutlined, ArrowDownOutlined, WalletOutlined, PlusOutlined } from "@ant-design/icons";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { selectedStoreId, stores } = useStore();

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

    const handleAdd = async (values) => {
        try {
            await agregarInyeccion(values);
            message.success("Aporte de capital registrado correctamente");
            setIsModalOpen(false);
            form.resetFields();
            cargarDatos();
        } catch (error) {
            message.error("Error al registrar aporte");
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>
                    <WalletOutlined /> Libro de Caja Centralizado
                </Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    size="large"
                    onClick={() => {
                        setIsModalOpen(true);
                        form.setFieldsValue({ sucursal_id: selectedStoreId === "global" ? undefined : selectedStoreId });
                    }}
                >
                    Registrar Aporte (Capital)
                </Button>
            </div>

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
                        <Text strong>¿Cómo registrar tu base?</Text>
                        <p style={{ margin: 0, color: '#666' }}>
                            Usa el botón de arriba para registrar tu base diaria para cambios (ej. $20) como un **Aporte**. 
                            También úsalo para registrar dinero que entra al negocio y NO es por una venta.
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

            <Modal
                title="Nuevo Aporte de Capital"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAdd}>
                    <Form.Item name="descripcion" label="Descripción (Ej: Base para cambios)" rules={[{ required: true }]}>
                        <Input placeholder="Ej: Aporte inicial para el día" />
                    </Form.Item>
                    <Form.Item name="monto" label="Monto ($)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} precision={2} min={0} />
                    </Form.Item>
                    <Form.Item name="sucursal_id" label="Sucursal Destino (Opcional)">
                        <Select placeholder="Selecciona una sucursal" allowClear>
                            {stores.map(t => (
                                <Select.Option key={t.sucursal_id} value={t.sucursal_id}>{t.nombre}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="fecha" label="Fecha (Opcional)">
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Finanzas;
