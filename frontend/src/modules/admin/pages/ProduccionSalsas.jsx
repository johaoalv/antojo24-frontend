
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select, InputNumber, Button, Table, Typography, Space, Divider, Tag, message, Modal, Form } from "antd";
import { PlusOutlined, ExperimentOutlined, CheckCircleOutlined, CalculatorOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/core/axios_base";
import { useStore } from "../../../context/StoreContext";

const { Title, Text } = Typography;

const ProduccionSalsas = () => {
    const { selectedStoreId, stores } = useStore();
    const [insumos, setInsumos] = useState([]);
    const [recetas, setRecetas] = useState([]);
    const [selectedSauceId, setSelectedSauceId] = useState(null);
    const [recipeDetails, setRecipeDetails] = useState([]);
    const [productionQty, setProductionQty] = useState(0);
    const [loading, setLoading] = useState(false);

    // Modal para definir receta
    const [recipeModalVisible, setRecipeModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchAllData = async () => {
        try {
            const params = selectedStoreId !== "global" ? { sucursal_id: selectedStoreId } : {};
            const [insumosRes, recetasRes] = await Promise.all([
                axiosInstance.get("/insumos", { params }),
                axiosInstance.get("/produccion/recetas")
            ]);
            setInsumos(insumosRes.data);
            setRecetas(recetasRes.data);
        } catch (error) {
            message.error("Error al cargar datos");
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [selectedStoreId]);

    const fetchRecipeDetails = async (id) => {
        if (!id) return;
        try {
            const response = await axiosInstance.get(`/produccion/receta/${id}`);
            setRecipeDetails(response.data);
        } catch (error) {
            message.error("Error al cargar la receta");
        }
    };

    const handleSauceChange = (id) => {
        setSelectedSauceId(id);
        fetchRecipeDetails(id);
        setProductionQty(0);
    };

    const handleProduction = async () => {
        if (!selectedSauceId || productionQty <= 0) {
            return message.warning("Ingresa una cantidad válida para producir");
        }

        setLoading(true);
        try {
            await axiosInstance.post("/produccion/fabricar", {
                insumo_compuesto_id: selectedSauceId,
                cantidad_a_producir: productionQty,
                sucursal_id: selectedStoreId
            });
            message.success("Producción completada y stock actualizado");
            fetchAllData();
            fetchRecipeDetails(selectedSauceId);
        } catch (error) {
            message.error(error.response?.data?.error || "Error en la producción");
        } finally {
            setLoading(false);
        }
    };

    // Lógica de simulación (Regla de tres)
    const handleSimulation = (ingredientId, amount) => {
        const triggerIngredient = recipeDetails.find(i => i.insumo_base_id === ingredientId);
        if (!triggerIngredient || triggerIngredient.cantidad_proporcional <= 0) return;

        // Si X cantidad de ingrediente hace Y de salsa
        // Proporción = CantSalsa / CantIngredienteBase
        const newTotalProduction = amount / triggerIngredient.cantidad_proporcional;
        setProductionQty(parseFloat(newTotalProduction.toFixed(2)));
    };

    const columns = [
        { title: 'Ingrediente', dataIndex: 'nombre', key: 'nombre' },
        {
            title: 'Cant. Requerida',
            key: 'requerido',
            render: (_, record) => (record.cantidad_proporcional * productionQty).toFixed(2) + " " + record.unidad_medida
        },
        {
            title: 'Stock Actual',
            dataIndex: 'stock',
            key: 'stock',
            render: (val, record) => (
                <Tag color={val < (record.cantidad_proporcional * productionQty) ? "red" : "green"}>
                    {val} {record.unidad_medida}
                </Tag>
            )
        },
        {
            title: 'Simulador',
            key: 'simulador',
            render: (_, record) => (
                <InputNumber
                    placeholder="Tengo..."
                    style={{ width: 120 }}
                    onChange={(val) => handleSimulation(record.insumo_base_id, val)}
                />
            )
        }
    ];

    return (
        <div style={{ padding: 30 }}>
            <Title level={2}><ExperimentOutlined /> Producción de Salsas y Mezclas</Title>
            <Divider />

            <Row gutter={24}>
                <Col xs={24} lg={8}>
                    <Card title="Paso 1: Seleccionar Mezcla" bordered={false} className="card-shadow">
                        <Select
                            style={{ width: '100%', marginBottom: 20 }}
                            placeholder="Selecciona una salsa"
                            onChange={handleSauceChange}
                            value={selectedSauceId}
                        >
                            {recetas.map(r => (
                                <Select.Option key={r.id} value={r.id}>{r.nombre}</Select.Option>
                            ))}
                        </Select>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            block
                            onClick={() => setRecipeModalVisible(true)}
                        >
                            Definir Nueva Receta
                        </Button>
                    </Card>

                    {selectedSauceId && (
                        <Card title="Paso 2: Cantidad de Tandas/Lotes" style={{ marginTop: 24 }} bordered={false} className="card-shadow">
                            <Text block style={{ marginBottom: 10 }}>¿Cuántas veces vas a preparar la receta original?</Text>
                            <InputNumber
                                style={{ width: '100%', fontSize: '1.5em', height: 50, display: 'flex', alignItems: 'center' }}
                                min={0}
                                precision={1}
                                value={productionQty}
                                onChange={setProductionQty}
                            />
                            <div style={{ marginTop: 15 }}>
                                <Text type="secondary">Total que se sumará al stock: </Text>
                                <Tag color="blue">{(recipeDetails.reduce((acc, curr) => acc + parseFloat(curr.cantidad_proporcional), 0) * productionQty).toFixed(0)} ml/g</Tag>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                block
                                style={{ marginTop: 20, height: 60, fontSize: '1.2em' }}
                                icon={<CheckCircleOutlined />}
                                onClick={handleProduction}
                                loading={loading}
                            >
                                COMPLETAR PRODUCCIÓN
                            </Button>
                        </Card>
                    )}
                </Col>

                <Col xs={24} lg={16}>
                    {selectedSauceId ? (
                        <Card title="Análisis de Receta e Inteligencia" bordered={false} className="card-shadow">
                            <Table
                                columns={columns}
                                dataSource={recipeDetails}
                                rowKey="insumo_base_id"
                                pagination={false}
                            />
                            <div style={{ marginTop: 20, padding: 20, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                                <CalculatorOutlined /> <Text strong>Tip de Inteligencia:</Text>
                                <br />
                                <Text type="secondary">
                                    ¿Tienes un bote abierto? Pon cuántos ml tienes de ese ingrediente en el "Simulador" y el software te dirá cuántas tandas puedes preparar para que la receta no pierda el sabor.
                                </Text>
                            </div>
                        </Card>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 50, color: '#ccc' }}>
                            <ExperimentOutlined style={{ fontSize: 64, marginBottom: 20 }} />
                            <h3>Selecciona una mezcla para empezar la producción</h3>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Modal para Definir Receta */}
            <Modal
                title="Configurar Receta de Mezcla"
                open={recipeModalVisible}
                onCancel={() => setRecipeModalVisible(false)}
                onOk={() => form.submit()}
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={async (values) => {
                    try {
                        await axiosInstance.post("/produccion/receta", {
                            insumo_compuesto_id: values.insumo_compuesto_id,
                            ingredientes: values.ingredientes
                        });
                        message.success("Receta guardada");
                        setRecipeModalVisible(false);
                        fetchAllData();
                    } catch (e) { message.error("Error al guardar receta"); }
                }}>
                    <Form.Item name="insumo_compuesto_id" label="Insumo Compuesto (La Mezcla)" rules={[{ required: true }]}>
                        <Select placeholder="Selecciona el insumo que se va a fabricar">
                            {insumos.map(i => <Select.Option key={i.id} value={i.id}>{i.nombre} ({i.unidad_medida})</Select.Option>)}
                        </Select>
                    </Form.Item>

                    <Form.List name="ingredientes">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'insumo_base_id']}
                                            rules={[{ required: true, message: 'Falta ingrediente' }]}
                                        >
                                            <Select placeholder="Ingrediente Base" style={{ width: 300 }}>
                                                {insumos.map(i => <Select.Option key={i.id} value={i.id}>{i.nombre}</Select.Option>)}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'cantidad_proporcional']}
                                            rules={[{ required: true, message: 'Falta proporción' }]}
                                        >
                                            <InputNumber placeholder="Cantidad base" style={{ width: 150 }} />
                                        </Form.Item>
                                        <Text type="secondary">x 1 unidad de mezcla</Text>
                                        <Button type="link" onClick={() => remove(name)} danger>Eliminar</Button>
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Agregar Ingrediente a la Receta
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default ProduccionSalsas;
