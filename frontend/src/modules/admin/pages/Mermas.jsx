import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Space, Divider, Tag, Button, Modal, Form, Select, InputNumber, Input, Row, Col, Statistic, message } from "antd";
import { WarningOutlined, PlusOutlined, DollarOutlined, FireOutlined, DropboxOutlined } from "@ant-design/icons";
import axiosInstance from "../../../api/core/axios_base";
import { useStore } from "../../../context/StoreContext";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const MOTIVOS = ["Derrame", "Vencimiento", "Daño", "Ajuste Manual", "Robo", "Otro"];

const MOTIVO_COLORS = {
    "Derrame": "blue",
    "Vencimiento": "orange",
    "Daño": "red",
    "Ajuste Manual": "purple",
    "Robo": "volcano",
    "Otro": "default"
};

const Mermas = () => {
    const [mermas, setMermas] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { selectedStoreId } = useStore();

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = selectedStoreId !== "global" ? `?sucursal_id=${selectedStoreId}` : "";
            const [mermasRes, resumenRes, insumosRes] = await Promise.all([
                axiosInstance.get(`/mermas${params}`),
                axiosInstance.get(`/mermas/resumen${params}`),
                axiosInstance.get("/insumos")
            ]);
            setMermas(mermasRes.data);
            setResumen(resumenRes.data);
            setInsumos(insumosRes.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedStoreId]);

    const handleRegistrar = async (values) => {
        try {
            await axiosInstance.post("/mermas", {
                ...values,
                sucursal_id: selectedStoreId === "global" ? undefined : selectedStoreId
            });
            message.success("Merma registrada correctamente");
            setModalVisible(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error(error.response?.data?.error || "Error al registrar merma");
        }
    };

    const totalPerdido = resumen.reduce((acc, r) => acc + parseFloat(r.total_perdido || 0), 0);
    const totalRegistros = resumen.reduce((acc, r) => acc + parseInt(r.total_registros || 0), 0);

    const columns = [
        {
            title: "Insumo",
            dataIndex: "nombre_insumo",
            key: "nombre",
            render: (text) => <Text strong style={{ textTransform: "capitalize" }}>{text}</Text>
        },
        {
            title: "Cantidad Perdida",
            dataIndex: "cantidad",
            key: "cantidad",
            render: (val, record) => (
                <Tag color="red" style={{ fontSize: '1em', padding: '3px 10px' }}>
                    -{parseFloat(val)} {record.unidad_medida}
                </Tag>
            )
        },
        {
            title: "Costo Perdido",
            dataIndex: "costo_perdido",
            key: "costo",
            render: (val) => <Text type="danger" strong>${parseFloat(val).toFixed(2)}</Text>
        },
        {
            title: "Motivo",
            dataIndex: "motivo",
            key: "motivo",
            render: (motivo) => <Tag color={MOTIVO_COLORS[motivo] || "default"}>{motivo}</Tag>
        },
        {
            title: "Nota",
            dataIndex: "observacion",
            key: "obs",
            render: (text) => <Text type="secondary">{text || "—"}</Text>
        },
        {
            title: "Fecha",
            dataIndex: "fecha",
            key: "fecha",
            render: (fecha) => new Date(fecha).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
        }
    ];

    return (
        <div style={{ padding: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}><WarningOutlined /> Control de Mermas</Title>
                    <Text type="secondary">Registra las pérdidas de inventario para mantener tu stock sincronizado con la realidad.</Text>
                </div>
                <Button
                    type="primary"
                    danger
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => setModalVisible(true)}
                    style={{ fontSize: '1.1em', height: 48, padding: '0 24px' }}
                >
                    Registrar Merma
                </Button>
            </div>

            <Divider />

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card className="card-shadow" style={{ borderLeft: '4px solid #ff4d4f' }}>
                        <Statistic
                            title="Pérdida Total (30 días)"
                            value={totalPerdido}
                            precision={2}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#ff4d4f', fontSize: '1.5em' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="card-shadow" style={{ borderLeft: '4px solid #faad14' }}>
                        <Statistic
                            title="Incidentes Registrados"
                            value={totalRegistros}
                            prefix={<FireOutlined />}
                            valueStyle={{ color: '#faad14', fontSize: '1.5em' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="card-shadow" style={{ borderLeft: '4px solid #1890ff' }}>
                        <Statistic
                            title="Motivo Principal"
                            value={resumen.length > 0 ? resumen[0].motivo : "Sin datos"}
                            prefix={<DropboxOutlined />}
                            valueStyle={{ color: '#1890ff', fontSize: '1.2em' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Historial de Mermas" className="card-shadow">
                <Table
                    dataSource={mermas}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title="Registrar Pérdida de Insumo"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                okText="Registrar Merma"
                okButtonProps={{ danger: true }}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleRegistrar}>
                    <Form.Item name="insumo_id" label="¿Qué se perdió?" rules={[{ required: true, message: "Selecciona un insumo" }]}>
                        <Select showSearch placeholder="Busca el insumo..." optionFilterProp="children" size="large">
                            {insumos.map(i => (
                                <Option key={i.id} value={i.id}>
                                    <span style={{ textTransform: 'capitalize' }}>{i.nombre}</span> — Stock: {i.stock} {i.unidad_medida}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="cantidad" label="¿Cuánto se perdió?" rules={[{ required: true, message: "Indica la cantidad" }]}>
                        <InputNumber style={{ width: "100%" }} min={0.01} size="large" placeholder="Ej: 200" />
                    </Form.Item>
                    <Form.Item name="motivo" label="Motivo" rules={[{ required: true, message: "Selecciona un motivo" }]}>
                        <Select size="large" placeholder="¿Por qué se perdió?">
                            {MOTIVOS.map(m => (
                                <Option key={m} value={m}>{m}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="observacion" label="Nota adicional (opcional)">
                        <TextArea rows={2} placeholder="Ej: Se cayó el bote grande de mayo" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Mermas;
