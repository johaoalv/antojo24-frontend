import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Button, Modal, Form, Input, InputNumber, Space, message, Popconfirm, Select, Tag } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { obtenerGastos, agregarGasto, eliminarGasto } from "../../../api/admin/axios_gastos";
import { useStore } from "../../../context/StoreContext";

const { Title } = Typography;

const CATEGORIAS_GASTO = [
    { label: "Operativo (Luz, Agua, etc.)", value: "operativo" },
    { label: "Personal (Salarios, Bonos)", value: "personal" },
    { label: "Publicidad / Marketing", value: "publicidad" },
    { label: "Inversión (Equipos, Mobiliario)", value: "inversion" },
    { label: "Otro", value: "otro" },
];

function Gastos() {
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { selectedStoreId, stores } = useStore();

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await obtenerGastos(selectedStoreId);
            setGastos(data);
        } catch (error) {
            message.error("Error al cargar gastos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [selectedStoreId]);

    const handleAdd = async (values) => {
        try {
            await agregarGasto(values);
            message.success("Gasto registrado");
            setIsModalOpen(false);
            form.resetFields();
            cargarDatos();
        } catch (error) {
            message.error("Error al registrar gasto");
        }
    };

    const handleDelete = async (id) => {
        try {
            await eliminarGasto(id);
            message.success("Gasto eliminado");
            cargarDatos();
        } catch (error) {
            message.error("Error al eliminar gasto");
        }
    };

    const columns = [
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
        {
            title: 'Categoría',
            dataIndex: 'categoria',
            key: 'categoria',
            render: (cat) => {
                const colors = {
                    operativo: 'blue',
                    personal: 'orange',
                    publicidad: 'magenta',
                    inversion: 'purple',
                    otro: 'default'
                };
                return <Tag color={colors[cat] || 'default'}>{cat.toUpperCase()}</Tag>;
            }
        },
        { title: 'Concepto / Descripción', dataIndex: 'descripcion', key: 'descripcion' },
        {
            title: 'Sucursal',
            dataIndex: 'sucursal_id',
            key: 'sucursal_id',
            render: (id) => stores.find(t => t.sucursal_id === id)?.nombre || "Global / Central"
        },
        { title: 'Monto', dataIndex: 'monto', key: 'monto', render: (val) => `$${Number(val || 0).toFixed(2)}` },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Popconfirm title="¿Eliminar este gasto?" onConfirm={() => handleDelete(record.id)}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>
                    Gastos: {selectedStoreId === "global" ? "Todas las Sedes" : (stores.find(t => t.sucursal_id === selectedStoreId)?.nombre || "Sucursal")}
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setIsModalOpen(true);
                    form.setFieldsValue({
                        sucursal_id: selectedStoreId === "global" ? undefined : selectedStoreId,
                        categoria: 'operativo'
                    });
                }}>
                    Registrar Gasto
                </Button>
            </div>

            <Card>
                <Table
                    dataSource={gastos}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 12 }}
                />
            </Card>

            <Modal
                title="Nuevo Gasto"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAdd}>
                    <Form.Item name="categoria" label="Categoría de Gasto" rules={[{ required: true }]}>
                        <Select options={CATEGORIAS_GASTO} />
                    </Form.Item>
                    <Form.Item name="descripcion" label="Descripción / Factura" rules={[{ required: true }]}>
                        <Input placeholder="Ej: Pago de luz local 1" />
                    </Form.Item>
                    <Form.Item name="monto" label="Monto ($)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} precision={2} min={0} />
                    </Form.Item>
                    <Form.Item name="sucursal_id" label="Sucursal (Opcional)">
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

export default Gastos;
