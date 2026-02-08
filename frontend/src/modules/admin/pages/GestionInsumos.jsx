
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Space, Typography, Card, Tag } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/core/axios_base";
import { notifySuccess, notifyError } from "../../common/components/notifications";

const { Title } = Typography;

const GestionInsumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingInsumo, setEditingInsumo] = useState(null);
    const [form] = Form.useForm();

    const fetchInsumos = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/insumos");
            setInsumos(response.data);
        } catch (error) {
            notifyError({ message: "Error al cargar insumos", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsumos();
    }, []);

    const handleAdd = () => {
        setEditingInsumo(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingInsumo(record);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/insumos/${id}`);
            notifySuccess({ message: "Insumo eliminado correctamente" });
            fetchInsumos();
        } catch (error) {
            notifyError({ message: "Error al eliminar", description: error.message });
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingInsumo) {
                await axiosInstance.put(`/insumos/${editingInsumo.id}`, values);
                notifySuccess({ message: "Insumo actualizado" });
            } else {
                await axiosInstance.post("/insumos", values);
                notifySuccess({ message: "Insumo creado" });
            }
            setModalVisible(false);
            fetchInsumos();
        } catch (error) {
            notifyError({ message: "Error al guardar", description: error.message });
        }
    };

    const columns = [
        {
            title: "Insumo",
            dataIndex: "nombre",
            key: "nombre",
            render: (text) => <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{text}</span>,
        },
        {
            title: "Stock Actual",
            dataIndex: "stock",
            key: "stock",
            render: (stock) => (
                <Tag color={stock < 10 ? "red" : stock < 25 ? "orange" : "green"} style={{ fontSize: '1.2em', padding: '5px 10px' }}>
                    {stock}
                </Tag>
            ),
        },
        {
            title: "Costo x Unidad",
            dataIndex: "costo_unidad",
            key: "costo_unidad",
            render: (costo) => `$${parseFloat(costo).toFixed(2)}`,
        },
        {
            title: "Medida",
            dataIndex: "unidad_medida",
            key: "unidad_medida",
        },
        {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
                <Title level={2}>Gestión de Insumos</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
                    Agregar Insumo
                </Button>
            </div>

            <Table
                dataSource={insumos}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false}
                bordered
            />

            <Modal
                title={editingInsumo ? "Editar Insumo" : "Nuevo Insumo"}
                open={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
                    <Form.Item name="nombre" label="Nombre del Insumo" rules={[{ required: true }]}>
                        <Input placeholder="Ej: Pan de hamburguesa" />
                    </Form.Item>
                    <Form.Item name="stock" label="Stock Inicial / Actual" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                    <Form.Item name="costo_unidad" label="Costo por Unidad ($)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item name="unidad_medida" label="Unidad de Medida" rules={[{ required: true }]}>
                        <Input placeholder="Ej: unidad, kg, litro" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default GestionInsumos;
