import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Select, Tag } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { obtenerInyecciones, agregarInyeccion, eliminarInyeccion } from "../../../api/admin/axios_inyecciones";
import { useStore } from "../../../context/StoreContext";

const { Title } = Typography;

function Inyecciones() {
    const [inyecciones, setInyecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { selectedStoreId, stores } = useStore();

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await obtenerInyecciones(selectedStoreId);
            setInyecciones(data);
        } catch (error) {
            message.error("Error al cargar inyecciones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [selectedStoreId]);

    const handleAdd = async (values) => {
        try {
            await agregarInyeccion(values);
            message.success("Inyección de capital registrada");
            setIsModalOpen(false);
            form.resetFields();
            cargarDatos();
        } catch (error) {
            message.error("Error al registrar inyección");
        }
    };

    const handleDelete = async (id) => {
        try {
            await eliminarInyeccion(id);
            message.success("Registro eliminado");
            cargarDatos();
        } catch (error) {
            message.error("Error al eliminar registro");
        }
    };

    const columns = [
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
        { title: 'Descripción / Origen', dataIndex: 'descripcion', key: 'descripcion' },
        {
            title: 'Sucursal Destino',
            dataIndex: 'sucursal_id',
            key: 'sucursal_id',
            render: (id) => stores.find(t => t.sucursal_id === id)?.nombre || "Global / Central"
        },
        {
            title: 'Método',
            dataIndex: 'metodo_pago',
            key: 'metodo_pago',
            render: (metodo) => <Tag color={metodo === 'yappy' ? 'purple' : 'green'}>{metodo?.toUpperCase() || 'EFECTIVO'}</Tag>
        },
        {
            title: 'Monto',
            dataIndex: 'monto',
            key: 'monto',
            render: (val) => <Typography.Text strong style={{ color: '#52c41a' }}>+${Number(val || 0).toFixed(2)}</Typography.Text>
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Popconfirm title="¿Eliminar este registro?" onConfirm={() => handleDelete(record.id)}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Title level={2} style={{ margin: 0 }}>
                    Inyecciones de Capital
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setIsModalOpen(true);
                    form.setFieldsValue({ sucursal_id: selectedStoreId === "global" ? undefined : selectedStoreId, metodo_pago: 'efectivo' });
                }}>
                    Registrar Aporte
                </Button>
            </div>
            <Typography.Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                Dinero que entra al negocio y NO proviene de ventas (ej. aportes propios, préstamos).
            </Typography.Text>

            <Card>
                <Table
                    dataSource={inyecciones}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 12 }}
                />
            </Card>

            <Modal
                title="Nueva Inyección de Capital"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAdd}>
                    <Form.Item name="descripcion" label="Descripción (Ej: Inyección para Publicidad)" rules={[{ required: true }]}>
                        <Input placeholder="Ej: Aporte socio para compra de insumos" />
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
                    <Form.Item name="metodo_pago" label="Método de Pago" rules={[{ required: true }]}>
                        <Select options={[
                            { label: "Efectivo", value: "efectivo" },
                            { label: "Yappy", value: "yappy" }
                        ]} />
                    </Form.Item>
                    <Form.Item name="fecha" label="Fecha (Opcional)">
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Inyecciones;
