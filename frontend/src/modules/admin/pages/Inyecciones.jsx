import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Select, Tag, Switch, Tooltip } from "antd";
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { obtenerInyecciones, agregarInyeccion, eliminarInyeccion } from "../../../api/admin/axios_inyecciones";
import { useStore } from "../../../context/StoreContext";

const { Title, Text } = Typography;

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
            message.success("Aporte / Inyección de fondo registrado correctamente");
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
            title: 'Monto Entrada',
            dataIndex: 'monto',
            key: 'monto',
            render: (val) => <Text strong style={{ color: '#52c41a' }}>+${Number(val || 0).toFixed(2)}</Text>
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
                    Inyecciones y Fondos de Reserva
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setIsModalOpen(true);
                    form.setFieldsValue({ 
                        sucursal_id: selectedStoreId === "global" ? undefined : selectedStoreId, 
                        metodo_pago: 'yappy',
                        crear_salida_inversion: true
                    });
                }}>
                    Registrar Aporte / Fondo
                </Button>
            </div>
            <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                Ingreso de dinero que NO proviene de ventas del mes (ej. Fondos de Reserva acumulados, aportes de socios o préstamos).
            </Text>

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
                title="Nueva Inyección de Fondos / Aporte"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAdd}>
                    <Form.Item name="descripcion" label="Descripción / Concepto" rules={[{ required: true }]}>
                        <Input placeholder="Ej: Traslado de Fondos de Reserva para congelador" />
                    </Form.Item>
                    <Form.Item name="monto" label="Monto ($)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} precision={2} min={0} placeholder="300.00" />
                    </Form.Item>
                    <Form.Item name="metodo_pago" label="Cuenta / Método donde ingresa" rules={[{ required: true }]}>
                        <Select options={[
                            { label: "Yappy (Cuenta Antojo24 Operativa)", value: "yappy" },
                            { label: "Efectivo (Caja Chica Operativa)", value: "efectivo" }
                        ]} />
                    </Form.Item>

                    <Form.Item 
                        name="crear_salida_inversion" 
                        label={
                            <span>
                                ¿Crear salida de inversión/equipo pareada? &nbsp;
                                <Tooltip title="Si vas a usar este dinero inmediatamente para comprar un equipo o activo, al activar esto se registrará la salida del gasto de inversión al mismo tiempo. Esto mantiene neutro ($0 neto) el flujo operativo del mes.">
                                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                                </Tooltip>
                            </span>
                        }
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Sí (Entrada + Salida CAPEX)" unCheckedChildren="Solo Entrada de Fondo" />
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

export default Inyecciones;
