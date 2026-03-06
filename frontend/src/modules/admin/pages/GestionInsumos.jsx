
import React, { useEffect, useState } from "react";
import {
    Table, Button, Modal, Form, Input, InputNumber, Space, Typography,
    Card, Tag, Select, Alert
} from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/core/axios_base";
import { notifySuccess, notifyError } from "../../common/components/notifications";
import { useStore } from "../../../context/StoreContext";

const { Title } = Typography;

const GestionInsumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingInsumo, setEditingInsumo] = useState(null);
    const [form] = Form.useForm();
    const porcionEstandar = Form.useWatch('porcion_estandar', form);
    const unidadMedida = Form.useWatch('unidad_medida', form);
    const { selectedStoreId, stores } = useStore();

    const fetchInsumos = async () => {
        setLoading(true);
        try {
            const params = selectedStoreId !== "global" ? { sucursal_id: selectedStoreId } : {};
            const response = await axiosInstance.get("/insumos", { params });
            setInsumos(response.data);
        } catch (error) {
            notifyError({ message: "Error al cargar insumos", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsumos();
    }, [selectedStoreId]);

    const handleValuesChange = (changedValues, allValues) => {
        const { stock, costo_total, costo_unidad, porcion_estandar } = allValues;
        const perPortion = porcion_estandar > 0;

        // Si cambió el stock, la porción o el costo, actualizamos el total
        if (changedValues.hasOwnProperty('stock') || changedValues.hasOwnProperty('costo_unidad') || changedValues.hasOwnProperty('porcion_estandar')) {
            if (stock !== undefined && costo_unidad !== undefined) {
                // Si hay porción, el costo_unidad en el form representa el costo por porción
                if (perPortion && porcion_estandar > 0) {
                    const numPortions = stock / porcion_estandar;
                    const calculatedTotal = (numPortions * costo_unidad).toFixed(2);
                    form.setFieldsValue({ costo_total: parseFloat(calculatedTotal) });
                } else {
                    const calculatedTotal = (stock * costo_unidad).toFixed(2);
                    form.setFieldsValue({ costo_total: parseFloat(calculatedTotal) });
                }
            }
        }
        // Si el usuario edita el total de compra directamente, recalculamos el costo (unidad o porción)
        else if (changedValues.hasOwnProperty('costo_total')) {
            if (stock && stock > 0 && costo_total !== undefined) {
                if (perPortion && porcion_estandar > 0) {
                    const numPortions = stock / porcion_estandar;
                    const calculatedPortionCost = (costo_total / numPortions).toFixed(4);
                    form.setFieldsValue({ costo_unidad: parseFloat(calculatedPortionCost) });
                } else {
                    const calculatedUnidad = (costo_total / stock).toFixed(4);
                    form.setFieldsValue({ costo_unidad: parseFloat(calculatedUnidad) });
                }
            }
        }
    };

    const handleAdd = () => {
        setEditingInsumo(null);
        form.resetFields();
        form.setFieldsValue({ sucursal_id: selectedStoreId === "global" ? undefined : selectedStoreId });
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingInsumo(record);
        const stock = parseFloat(record.stock || 0);
        const dbCosto = parseFloat(record.costo_unidad || 0);
        const porcion = parseFloat(record.porcion_estandar || 0);

        let displayCosto = dbCosto;
        if (porcion > 0) {
            displayCosto = dbCosto * porcion;
        }

        const costo_total = stock * dbCosto;
        form.setFieldsValue({
            ...record,
            costo_unidad: parseFloat(displayCosto.toFixed(4)),
            costo_total: parseFloat(costo_total.toFixed(2))
        });
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
            const { costo_total, ...dataToSave } = values;

            // Si hay porción estándar, convertimos el "costo por porción" del form 
            // al "costo por gramo/ml" que espera el backend
            if (dataToSave.porcion_estandar > 0) {
                dataToSave.costo_unidad = dataToSave.costo_unidad / dataToSave.porcion_estandar;
            }

            if (editingInsumo) {
                await axiosInstance.put(`/insumos/${editingInsumo.id}`, dataToSave);
                notifySuccess({ message: "Insumo actualizado" });
            } else {
                await axiosInstance.post("/insumos", dataToSave);
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
            title: "Sucursal",
            dataIndex: "sucursal_id",
            key: "sucursal_id",
            render: (id) => stores.find(t => t.sucursal_id === id)?.nombre || "Global / Central"
        },
        {
            title: "Stock Actual",
            dataIndex: "stock",
            key: "stock",
            render: (stock, record) => (
                <Space direction="vertical" size={0}>
                    <Tag color={stock < 10 ? "red" : stock < 25 ? "orange" : "green"} style={{ fontSize: '1.2em', padding: '5px 10px' }}>
                        {record.porcion_estandar && record.porcion_estandar > 0
                            ? `${Math.floor(stock / record.porcion_estandar)} unid.`
                            : `${stock} ${record.unidad_medida}`}
                    </Tag>
                    {record.porcion_estandar && record.porcion_estandar > 0 && (
                        <Typography.Text type="secondary" style={{ fontSize: '0.85em' }}>
                            ({stock} {record.unidad_medida})
                        </Typography.Text>
                    )}
                </Space>
            ),
        },
        {
            title: "Costo por Medida",
            dataIndex: "costo_unidad",
            key: "costo_unidad",
            render: (costo, record) => {
                const c = parseFloat(costo);
                if (record.porcion_estandar > 0) {
                    return (
                        <Space direction="vertical" size={0}>
                            <Typography.Text strong>${(c * record.porcion_estandar).toFixed(2)} / porción</Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: '0.85em' }}>($${c.toFixed(4)} / {record.unidad_medida})</Typography.Text>
                        </Space>
                    );
                }
                return `$${c.toFixed(4)}`;
            }
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
                <Title level={2}>
                    Insumos: {selectedStoreId === "global" ? "Todas las Sedes" : (stores.find(t => t.sucursal_id === selectedStoreId)?.nombre || "Sucursal")}
                </Title>
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
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: 20 }}
                    onValuesChange={handleValuesChange}
                >
                    <Form.Item name="nombre" label="Nombre del Insumo" rules={[{ required: true }]}>
                        <Input placeholder="Ej: Pan de hamburguesa" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Form.Item name="stock" label="Cantidad (Unidades/Kg/ml)" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <InputNumber style={{ width: "100%" }} min={0} placeholder="Ej: 10" />
                        </Form.Item>
                        <Form.Item name="costo_total" label="Precio Total Compra ($)" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <InputNumber style={{ width: "100%" }} min={0} step={0.01} placeholder="Ej: 50.00" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="costo_unidad"
                        label={porcionEstandar > 0 ? "Costo por Porción ($)" : "Costo por Unidad de Medida ($)"}
                        rules={[{ required: true }]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            prefix="$"
                            precision={4}
                            placeholder={porcionEstandar > 0 ? "Costo de una ración" : "Costo de 1g/1ml/1u"}
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Form.Item name="unidad_medida" label="U. Medida (g, ml, unid)" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <Input placeholder="Ej: g" />
                        </Form.Item>
                        <Form.Item name="porcion_estandar" label="Porción Estándar (opcional)" style={{ flex: 1 }}>
                            <InputNumber style={{ width: "100%" }} min={0} placeholder="Ej: 30" />
                        </Form.Item>
                    </div>
                    {porcionEstandar > 0 && (
                        <Alert
                            type="info"
                            showIcon
                            message={`Se mostrará el stock en unidades de ${porcionEstandar} ${unidadMedida || ''}`}
                            style={{ marginBottom: 20 }}
                        />
                    )}

                    <Form.Item name="sucursal_id" label="Sucursal" rules={[{ required: true }]}>
                        <Select placeholder="Selecciona una sucursal">
                            {stores.map(t => (
                                <Select.Option key={t.sucursal_id} value={t.sucursal_id}>{t.nombre}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default GestionInsumos;
