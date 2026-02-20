import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Space, Divider, Tag, Button, Modal, Form, Select, InputNumber, Row, Col, Popconfirm, message, Tabs } from "antd";
import { BookOutlined, PlusOutlined, DeleteOutlined, ExperimentOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/core/axios_base";

const { Title, Text } = Typography;
const { Option } = Select;

const ConfiguradorRecetas = () => {
    const [recetas, setRecetas] = useState({});
    const [composiciones, setComposiciones] = useState([]);
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalComposicionVisible, setModalComposicionVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingComposicion, setEditingComposicion] = useState(null);
    const [form] = Form.useForm();
    const [formComp] = Form.useForm();

    // Productos que NO son recetas reales (se excluyen del listado)
    const productosExcluidos = ["coca cola", "canada dry"];

    const fetchData = async () => {
        setLoading(true);
        try {
            const [recetasRes, insumosRes, composicionesRes] = await Promise.all([
                axiosInstance.get("/recetas"),
                axiosInstance.get("/insumos"),
                axiosInstance.get("/produccion/recetas")
            ]);
            setRecetas(recetasRes.data);
            setInsumos(insumosRes.data);
            setComposiciones(composicionesRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            message.error("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ===================== RECETAS DE PRODUCTOS =====================
    const handleAddIngredient = async (values) => {
        try {
            await axiosInstance.post("/recetas", {
                producto: editingProduct,
                insumo_id: values.insumo_id,
                cantidad_requerida: values.cantidad
            });
            message.success("Ingrediente añadido");
            setModalVisible(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error("Error al añadir ingrediente");
        }
    };

    const handleDeleteIngredient = async (id) => {
        try {
            await axiosInstance.delete(`/recetas/${id}`);
            message.success("Ingrediente eliminado");
            fetchData();
        } catch (error) {
            message.error("Error al eliminar");
        }
    };

    const handleUpdateQuantity = async (id, cantidad) => {
        try {
            await axiosInstance.put(`/recetas/${id}`, { cantidad_requerida: cantidad });
            message.success("Cantidad actualizada");
            fetchData();
        } catch (error) {
            message.error("Error al actualizar");
        }
    };

    // ===================== COMPOSICIONES DE SALSAS =====================
    const [detalleComposicion, setDetalleComposicion] = useState([]);
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [selectedSalsa, setSelectedSalsa] = useState(null);

    const fetchDetalleComposicion = async (insumoId) => {
        setLoadingDetalle(true);
        try {
            const res = await axiosInstance.get(`/produccion/receta/${insumoId}`);
            setDetalleComposicion(res.data);
            setSelectedSalsa(insumoId);
        } catch (error) {
            message.error("Error al cargar composición");
        } finally {
            setLoadingDetalle(false);
        }
    };

    const handleAddComposicionIngredient = async (values) => {
        try {
            // Obtenemos la composición actual y le sumamos el nuevo ingrediente
            const currentIngredients = detalleComposicion.map(d => ({
                insumo_base_id: d.insumo_base_id,
                cantidad_proporcional: d.cantidad_proporcional
            }));
            currentIngredients.push({
                insumo_base_id: values.insumo_id,
                cantidad_proporcional: values.cantidad
            });

            await axiosInstance.post("/produccion/receta", {
                insumo_compuesto_id: editingComposicion,
                ingredientes: currentIngredients
            });
            message.success("Ingrediente añadido a la composición");
            setModalComposicionVisible(false);
            formComp.resetFields();
            fetchDetalleComposicion(editingComposicion);
        } catch (error) {
            message.error("Error al añadir ingrediente");
        }
    };

    const handleDeleteComposicionIngredient = async (insumoBaseId) => {
        try {
            const updatedIngredients = detalleComposicion
                .filter(d => d.insumo_base_id !== insumoBaseId)
                .map(d => ({
                    insumo_base_id: d.insumo_base_id,
                    cantidad_proporcional: d.cantidad_proporcional
                }));

            await axiosInstance.post("/produccion/receta", {
                insumo_compuesto_id: selectedSalsa,
                ingredientes: updatedIngredients
            });
            message.success("Ingrediente eliminado de la composición");
            fetchDetalleComposicion(selectedSalsa);
        } catch (error) {
            message.error("Error al eliminar");
        }
    };

    // ===================== COLUMNAS =====================
    const recetaColumns = [
        {
            title: 'Ingrediente',
            dataIndex: 'nombre_insumo',
            key: 'nombre',
            render: (text) => <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{text}</span>
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad_requerida',
            key: 'cantidad',
            render: (val, record) => (
                <Space>
                    <InputNumber
                        min={0}
                        defaultValue={parseFloat(val)}
                        onBlur={(e) => {
                            const newVal = parseFloat(e.target.value);
                            if (!isNaN(newVal) && newVal !== parseFloat(val)) {
                                handleUpdateQuantity(record.id, newVal);
                            }
                        }}
                        style={{ width: 100 }}
                    />
                    <Text type="secondary">{record.unidad_medida}</Text>
                </Space>
            )
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 80,
            render: (_, record) => (
                <Popconfirm title="¿Eliminar de la receta?" onConfirm={() => handleDeleteIngredient(record.id)}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            )
        }
    ];

    const composicionColumns = [
        {
            title: 'Ingrediente Base',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text) => <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{text}</span>
        },
        {
            title: 'Cantidad por Tanda',
            dataIndex: 'cantidad_proporcional',
            key: 'cantidad',
            render: (val, record) => (
                <Space>
                    <Tag color="blue" style={{ fontSize: '1.1em', padding: '4px 12px' }}>{parseFloat(val)}</Tag>
                    <Text type="secondary">{record.unidad_medida}</Text>
                </Space>
            )
        },
        {
            title: 'Stock Disponible',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <Tag color={stock < 50 ? "red" : stock < 200 ? "orange" : "green"}>
                    {parseFloat(stock)}
                </Tag>
            )
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 80,
            render: (_, record) => (
                <Popconfirm title="¿Eliminar de la composición?" onConfirm={() => handleDeleteComposicionIngredient(record.insumo_base_id)}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            )
        }
    ];

    // Filtrar los productos excluyendo las sodas
    const productosFiltrados = Object.keys(recetas).filter(
        p => !productosExcluidos.includes(p.toLowerCase())
    );

    return (
        <div style={{ padding: 30 }}>
            <Title level={2}><BookOutlined /> Configurador de Recetas</Title>
            <Text type="secondary">Gestiona qué ingredientes lleva cada producto y cada salsa. Estos datos afectan directamente al Costeo e Inventario.</Text>

            <Divider />

            <Tabs defaultActiveKey="1" size="large" items={[
                {
                    key: "1",
                    label: <span style={{ fontSize: '1.2em' }}>🍔 Productos</span>,
                    children: (
                        <div style={{ columnCount: 2, columnGap: 24 }}>
                            {productosFiltrados.map(producto => (
                                <div key={producto} style={{ breakInside: 'avoid', marginBottom: 24 }}>
                                    <Card
                                        title={<span style={{ textTransform: 'uppercase', fontSize: '1.1em', fontWeight: 700 }}>{producto}</span>}
                                        extra={
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                size="small"
                                                onClick={() => {
                                                    setEditingProduct(producto);
                                                    setModalVisible(true);
                                                }}
                                            >
                                                Añadir
                                            </Button>
                                        }
                                        className="card-shadow"
                                    >
                                        <Table
                                            dataSource={recetas[producto]}
                                            columns={recetaColumns}
                                            pagination={false}
                                            size="small"
                                            rowKey="id"
                                        />
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )
                },
                {
                    key: "2",
                    label: <span style={{ fontSize: '1.2em' }}>🧪 Composiciones (Salsas)</span>,
                    children: (
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={8}>
                                <Card title="Salsas Registradas" className="card-shadow">
                                    {composiciones.map(salsa => (
                                        <Card.Grid
                                            key={salsa.id}
                                            style={{
                                                width: '100%',
                                                cursor: 'pointer',
                                                backgroundColor: selectedSalsa === salsa.id ? '#e6f7ff' : '#fff',
                                                borderLeft: selectedSalsa === salsa.id ? '4px solid #1890ff' : '4px solid transparent'
                                            }}
                                            onClick={() => fetchDetalleComposicion(salsa.id)}
                                        >
                                            <Space direction="vertical" size={0}>
                                                <Text strong style={{ textTransform: 'capitalize', fontSize: '1.1em' }}>{salsa.nombre}</Text>
                                                <Text type="secondary">Stock: {parseFloat(salsa.stock)} {salsa.unidad_medida}</Text>
                                            </Space>
                                        </Card.Grid>
                                    ))}
                                </Card>
                            </Col>
                            <Col xs={24} lg={16}>
                                {selectedSalsa ? (
                                    <Card
                                        title={
                                            <span style={{ textTransform: 'capitalize', fontSize: '1.1em' }}>
                                                <ExperimentOutlined /> Composición de: {composiciones.find(c => c.id === selectedSalsa)?.nombre}
                                            </span>
                                        }
                                        extra={
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                size="small"
                                                onClick={() => {
                                                    setEditingComposicion(selectedSalsa);
                                                    setModalComposicionVisible(true);
                                                }}
                                            >
                                                Añadir Ingrediente
                                            </Button>
                                        }
                                        className="card-shadow"
                                    >
                                        <Table
                                            dataSource={detalleComposicion}
                                            columns={composicionColumns}
                                            pagination={false}
                                            size="small"
                                            rowKey="insumo_base_id"
                                            loading={loadingDetalle}
                                        />
                                    </Card>
                                ) : (
                                    <Card className="card-shadow" style={{ textAlign: 'center', padding: 40 }}>
                                        <ExperimentOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                                        <br /><br />
                                        <Text type="secondary" style={{ fontSize: '1.2em' }}>
                                            Selecciona una salsa de la lista para ver y editar su composición
                                        </Text>
                                    </Card>
                                )}
                            </Col>
                        </Row>
                    )
                }
            ]} />

            {/* Modal para Añadir Ingrediente a Producto */}
            <Modal
                title={<span style={{ textTransform: 'capitalize' }}>Añadir ingrediente a {editingProduct}</span>}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAddIngredient}>
                    <Form.Item name="insumo_id" label="Selecciona el Insumo" rules={[{ required: true }]}>
                        <Select showSearch placeholder="Busca un insumo..." optionFilterProp="children" size="large">
                            {insumos.map(i => (
                                <Option key={i.id} value={i.id}>
                                    <span style={{ textTransform: 'capitalize' }}>{i.nombre}</span> ({i.unidad_medida})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="cantidad" label="Cantidad Requerida" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} size="large" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal para Añadir Ingrediente a Composición */}
            <Modal
                title="Añadir ingrediente a la composición"
                open={modalComposicionVisible}
                onCancel={() => setModalComposicionVisible(false)}
                onOk={() => formComp.submit()}
                destroyOnClose
            >
                <Form form={formComp} layout="vertical" onFinish={handleAddComposicionIngredient}>
                    <Form.Item name="insumo_id" label="Selecciona el Insumo Base" rules={[{ required: true }]}>
                        <Select showSearch placeholder="Busca un insumo..." optionFilterProp="children" size="large">
                            {insumos.map(i => (
                                <Option key={i.id} value={i.id}>
                                    <span style={{ textTransform: 'capitalize' }}>{i.nombre}</span> ({i.unidad_medida})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="cantidad" label="Cantidad por Tanda (gramos/ml)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} size="large" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ConfiguradorRecetas;
