
import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Button, Modal, Form, Input, InputNumber, Space, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { obtenerInversiones, agregarInversion, eliminarInversion } from "../../../api/admin/axios_inversiones";

const { Title } = Typography;

function Inversiones() {
    const [inversiones, setInversiones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await obtenerInversiones();
            setInversiones(data);
        } catch (error) {
            message.error("Error al cargar inversiones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleAdd = async (values) => {
        try {
            await agregarInversion(values);
            message.success("Inversión agregada");
            setIsModalOpen(false);
            form.resetFields();
            cargarDatos();
        } catch (error) {
            message.error("Error al agregar inversión");
        }
    };

    const handleDelete = async (id) => {
        try {
            await eliminarInversion(id);
            message.success("Inversión eliminada");
            cargarDatos();
        } catch (error) {
            message.error("Error al eliminar inversión");
        }
    };

    const columns = [
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
        { title: 'Concepto / Descripción', dataIndex: 'descripcion', key: 'descripcion' },
        { title: 'Monto', dataIndex: 'monto', key: 'monto', render: (val) => `$${parseFloat(val).toFixed(2)}` },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Popconfirm title="¿Eliminar esta inversión?" onConfirm={() => handleDelete(record.id)}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>Gestión de Inversiones / Facturas</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Agregar Inversión
                </Button>
            </div>

            <Card>
                <Table
                    dataSource={inversiones}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title="Nueva Inversión"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleAdd}>
                    <Form.Item name="descripcion" label="Descripción / Factura" rules={[{ required: true }]}>
                        <Input placeholder="Ej: Factura Proveedor Bebidas" />
                    </Form.Item>
                    <Form.Item name="monto" label="Monto ($)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} precision={2} min={0} />
                    </Form.Item>
                    <Form.Item name="fecha" label="Fecha (Opcional)">
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Inversiones;
