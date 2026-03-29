import React, { useState, useEffect, useRef } from "react";
import { Badge, Popover, List, Tag, Button, Typography, Space, Empty } from "antd";
import { BellOutlined, WarningOutlined, CheckOutlined } from "@ant-design/icons";
import { io } from "socket.io-client";
import axiosInstance from "../../../api/core/axios_base";

const { Text } = Typography;

const nivelConfig = {
    critico: { color: "red", label: "SIN STOCK", icon: "🔴" },
    alto: { color: "orange", label: "MUY BAJO", icon: "🟠" },
    bajo: { color: "gold", label: "BAJO", icon: "🟡" },
};

let loopInterval = null;

const startAlertLoop = () => {
    stopAlertLoop();
    // Suena inmediatamente
    try {
        const audio = new Audio("/assets/sounds/mixkit-bell-notification-933.wav");
        audio.play();
    } catch (e) {}
    // Repite cada 15 segundos
    loopInterval = setInterval(() => {
        try {
            const audio = new Audio("/assets/sounds/mixkit-bell-notification-933.wav");
            audio.play();
        } catch (e) {}
    }, 15000);
};

const stopAlertLoop = () => {
    if (loopInterval) {
        clearInterval(loopInterval);
        loopInterval = null;
    }
};

const AlertasStock = () => {
    const [alertas, setAlertas] = useState([]);
    const [visible, setVisible] = useState(false);
    const socketRef = useRef(null);
    const prevAlertCountRef = useRef(0);

    // Carga inicial via API
    const cargarAlertas = async () => {
        try {
            const res = await axiosInstance.get("/insumos/alertas");
            setAlertas(res.data);
            if (res.data.length > 0) {
                startAlertLoop();
            }
            prevAlertCountRef.current = res.data.length;
        } catch (error) {
            console.error("Error al cargar alertas de stock:", error);
        }
    };

    useEffect(() => {
        cargarAlertas();

        // WebSocket para alertas en tiempo real
        socketRef.current = io(import.meta.env.VITE_WEBSOCKET_URL, {
            transports: ["websocket"],
        });

        socketRef.current.on("stock_alert", (data) => {
            if (data.alertas && data.alertas.length > 0) {
                // Suena si hay alertas nuevas o diferentes
                if (data.alertas.length > prevAlertCountRef.current) {
                    startAlertLoop();
                }
                prevAlertCountRef.current = data.alertas.length;
                setAlertas(data.alertas);
            }
        });

        return () => {
            stopAlertLoop();
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const marcarVista = async (insumoId) => {
        try {
            await axiosInstance.put(`/insumos/${insumoId}/alerta-vista`);
            const nuevas = alertas.filter((a) => a.id !== insumoId);
            setAlertas(nuevas);
            prevAlertCountRef.current = nuevas.length;
            if (nuevas.length === 0) {
                stopAlertLoop();
            }
        } catch (error) {
            console.error("Error al marcar alerta como vista:", error);
        }
    };

    const contenido = (
        <div style={{ width: 350, maxHeight: 400, overflow: "auto" }}>
            {alertas.length === 0 ? (
                <Empty
                    description="Sin alertas de stock"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ padding: 20 }}
                />
            ) : (
                <List
                    size="small"
                    dataSource={alertas}
                    renderItem={(alerta) => {
                        const config = nivelConfig[alerta.nivel] || nivelConfig.bajo;
                        return (
                            <List.Item
                                style={{
                                    borderLeft: `4px solid ${alerta.nivel === "critico" ? "#ff4d4f" : alerta.nivel === "alto" ? "#fa8c16" : "#faad14"}`,
                                    paddingLeft: 12,
                                    marginBottom: 4,
                                }}
                                actions={[
                                    <Button
                                        key="dismiss"
                                        type="text"
                                        size="small"
                                        icon={<CheckOutlined />}
                                        onClick={() => marcarVista(alerta.id)}
                                        title="Marcar como vista"
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Space>
                                            <span>{config.icon}</span>
                                            <Text strong style={{ textTransform: "capitalize" }}>
                                                {alerta.nombre}
                                            </Text>
                                            <Tag color={config.color}>{config.label}</Tag>
                                        </Space>
                                    }
                                    description={
                                        <Text type="secondary">
                                            Stock: <Text strong>{alerta.stock}</Text> {alerta.unidad_medida}
                                            {" · "}
                                            Min: {alerta.stock_minimo} {alerta.unidad_medida}
                                        </Text>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            )}
        </div>
    );

    const hayAlertasCriticas = alertas.some((a) => a.nivel === "critico");

    return (
        <Popover
            content={contenido}
            title={
                <Space>
                    <WarningOutlined style={{ color: "#faad14" }} />
                    <span>Alertas de Stock</span>
                    {alertas.length > 0 && (
                        <Tag color="red">{alertas.length}</Tag>
                    )}
                </Space>
            }
            trigger="click"
            open={visible}
            onOpenChange={setVisible}
            placement="bottomRight"
        >
            <Badge
                count={alertas.length}
                offset={[-2, 2]}
                color={hayAlertasCriticas ? "red" : "gold"}
                style={{ cursor: "pointer" }}
            >
                <BellOutlined
                    style={{
                        fontSize: 22,
                        color: alertas.length > 0 ? (hayAlertasCriticas ? "#ff4d4f" : "#faad14") : "#999",
                        cursor: "pointer",
                        padding: 8,
                    }}
                />
            </Badge>
        </Popover>
    );
};

export default AlertasStock;
