import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Space, Divider, Tag, Button, Modal, Form, Select, InputNumber, Row, Col, Popconfirm, message, Tabs, Input } from "antd";
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

    const [modalNuevaRecetaVisible, setModalNuevaRecetaVisible] = useState(false);
    const [modalNuevoInsumoVisible, setModalNuevoInsumoVisible] = useState(false);
    const [nuevaRecetaForm] = Form.useForm();
    const [nuevoInsumoForm] = Form.useForm();
    const [tempIngredientes, setTempIngredientes] = useState([{ id: Date.now(), insumo_id: null, cantidad: 0 }]);

    const handleCreateOriginalRecipe = async (values) => {
        try {
            const ingredientesValidos = tempIngredientes.filter(i => i.insumo_id && i.cantidad > 0);
            if (ingredientesValidos.length === 0) {
                message.warning("Añade al menos un ingrediente válido");
                return;
            }

            await axiosInstance.post("/recetas/bulk", {
                producto: values.nombre_producto,
                ingredientes: ingredientesValidos.map(i => ({
                    insumo_id: i.insumo_id,
                    cantidad_requerida: i.cantidad
                }))
            });

            message.success("¡Receta creada con éxito!");
            setModalNuevaRecetaVisible(false);
            nuevaRecetaForm.resetFields();
            setTempIngredientes([{ id: Date.now(), insumo_id: null, cantidad: 0 }]);
            fetchData();
        } catch (error) {
            console.error(error);
            message.error("Error al crear la receta");
        }
    };

    const handleQuickAddInsumo = async (values) => {
        try {
            // Calculamos costo unidad
            const costo_unidad = values.costo_total / values.stock;
            const res = await axiosInstance.post("/insumos", {
                nombre: values.nombre,
                stock: values.stock,
                costo_unidad: costo_unidad,
                unidad_medida: values.unidad_medida,
                sucursal_id: values.sucursal_id
            });
            message.success("Insumo creado y listo para usar");
            setModalNuevoInsumoVisible(false);
            nuevoInsumoForm.resetFields();
            // Recargamos insumos para que aparezca en el select de la receta
            const insumosRes = await axiosInstance.get("/insumos");
            setInsumos(insumosRes.data);
        } catch (error) {
            message.error("Error al crear insumo rápido");
        }
    };

    // Filtrar los productos excluyendo las sodas
    const productosFiltrados = Object.keys(recetas).filter(
        p => !productosExcluidos.includes(p.toLowerCase())
    );

    return (
        <div style={{ padding: 30 }}>
            <Row justify="space-between" align="middle">
                <Col>
                    <Title level={2}><BookOutlined /> Configurador de Recetas</Title>
                    <Text type="secondary">Gestiona qué ingredientes lleva cada producto y cada salsa. Estos datos afectan directamente al Costeo e Inventario.</Text>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => setModalNuevaRecetaVisible(true)}
                        style={{ backgroundColor: '#ffd60a', color: '#000', borderColor: '#ffd60a', fontWeight: 'bold' }}
                    >
                        CREAR NUEVA RECETA
                    </Button>
                </Col>
            </Row>

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

            {/* Modal para CREAR NUEVA RECETA (PRODUCTO COMPLETO) */}
            <Modal
                title={<Title level={3}>🚀 Crear Nueva Receta</Title>}
                open={modalNuevaRecetaVisible}
                onCancel={() => setModalNuevaRecetaVisible(false)}
                onOk={() => nuevaRecetaForm.submit()}
                width={800}
                okText="Guardar Receta Completa"
                cancelText="Cancelar"
                destroyOnClose
            >
                <Form form={nuevaRecetaForm} layout="vertical" onFinish={handleCreateOriginalRecipe}>
                    <Form.Item
                        name="nombre_producto"
                        label="Nombre del Nuevo Producto"
                        rules={[{ required: true, message: 'Ej: Chili Burger' }]}
                    >
                        <Input size="large" placeholder="Nombre que aparecerá en el sistema..." />
                    </Form.Item>

                    <Divider orientation="left">Ingredientes de la Receta</Divider>

                    {tempIngredientes.map((ing, index) => (
                        <Row key={ing.id} gutter={12} align="middle" style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Select
                                    showSearch
                                    placeholder="Selecciona Insumo..."
                                    size="large"
                                    style={{ width: '100%' }}
                                    value={ing.insumo_id}
                                    onChange={(val) => {
                                        const newIngs = [...tempIngredientes];
                                        newIngs[index].insumo_id = val;
                                        setTempIngredientes(newIngs);
                                    }}
                                    optionFilterProp="children"
                                >
                                    {insumos.map(i => (
                                        <Option key={i.id} value={i.id}>
                                            {i.nombre} ({i.unidad_medida})
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={8}>
                                <InputNumber
                                    placeholder="Cant."
                                    size="large"
                                    style={{ width: '100%' }}
                                    value={ing.cantidad}
                                    onChange={(val) => {
                                        const newIngs = [...tempIngredientes];
                                        newIngs[index].cantidad = val;
                                        setTempIngredientes(newIngs);
                                    }}
                                    min={0}
                                />
                            </Col>
                            <Col span={4}>
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => setTempIngredientes(tempIngredientes.filter((_, idx) => idx !== index))}
                                    disabled={tempIngredientes.length === 1}
                                />
                            </Col>
                        </Row>
                    ))}

                    <Space>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => setTempIngredientes([...tempIngredientes, { id: Date.now(), insumo_id: null, cantidad: 0 }])}
                        >
                            Añadir otro ingrediente
                        </Button>
                        <Button
                            icon={<ExperimentOutlined />}
                            onClick={() => setModalNuevoInsumoVisible(true)}
                        >
                            Crear Insumo que no existe
                        </Button>
                    </Space>
                </Form>
            </Modal>

            {/* Modal Rápido para Nuevo Insumo */}
            <Modal
                title="Añadir Nuevo Insumo a la Base de Datos"
                open={modalNuevoInsumoVisible}
                onCancel={() => setModalNuevoInsumoVisible(false)}
                onOk={() => nuevoInsumoForm.submit()}
                destroyOnClose
            >
                <Form form={nuevoInsumoForm} layout="vertical" onFinish={handleQuickAddInsumo}>
                    <Form.Item name="nombre" label="Nombre del Insumo" rules={[{ required: true }]}>
                        <Input placeholder="Ej: Salsa Chile" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="stock" label="Stock Inicial" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="costo_total" label="Costo Total Compra" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} min={0} prefix="$" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="unidad_medida" label="Unidad de Medida" rules={[{ required: true }]}>
                        <Input placeholder="Ej: gramos, unidades" />
                    </Form.Item>
                    <Form.Item name="sucursal_id" label="Sucursal" initialValue={1}>
                        <Select>
                            <Option value={1}>Sucursal 1 (Principal)</Option>
                            {/* Aquí se podrían mapear más sucursales si existieran dinámicamente */}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal para Añadir Ingrediente a Producto Existente (el original) */}
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
