import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout, Typography, Row, Col, Card, Button, Space } from "antd";
import { PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import { WhatsAppOutlined } from "@ant-design/icons";
import qrYappy from "../../../../public/assets/qr_yappy.png";
import yappyLogo from "../../../../public/assets/yappy.png";
import { fetchProductos } from "../../../api/pos/axios_productos";
import { getProductImage } from "../../pos/utils/imageMapper";
import useProductosRealtime from "../../../hooks/useProductosRealtime";

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const WHATSAPP_URL = "https://wa.me/c/50764829340";

// Componente de tarjeta de producto reutilizable
const ProductCard = ({ item, colSize }) => (
    <Col xs={24} sm={12} {...colSize}>
        <Card
            hoverable
            cover={
                <div style={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    overflow: "hidden",
                    borderRadius: "20px 20px 0 0",
                    background: "#111",
                }}>
                    <img
                        alt={item.nombre}
                        src={getProductImage(item)}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.45s ease",
                        }}
                        onMouseOver={e => (e.currentTarget.style.transform = "scale(1.06)")}
                        onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                </div>
            }
            style={{
                borderRadius: "24px",
                overflow: "hidden",
                border: "none",
                boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
                height: "100%",
            }}
            styles={{ body: { padding: "18px 20px 20px" } }}
        >
            {/* Nombre + Precio */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
                <Title
                    level={4}
                    style={{
                        margin: 0,
                        fontWeight: 900,
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                        lineHeight: 1.2,
                        color: "#111",
                    }}
                >
                    {item.nombre}
                </Title>
                <Text
                    strong
                    style={{
                        fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)",
                        color: "#FFD60A",
                        background: "#111",
                        padding: "2px 10px",
                        borderRadius: "8px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}
                >
                    ${Number(item.precio || 0).toFixed(2)}
                </Text>
            </div>

            {/* Ingredientes */}
            <Text style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.6, display: "block" }}>
                {item.categoria || "Nuestro menú"}
            </Text>
        </Card>
    </Col>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetchProductos()
            .then((data) => setProductos(Array.isArray(data) ? data.filter((p) => p.disponible !== false) : []))
            .catch((error) => console.error("Error cargando menú público", error));
    }, []);

    const handleProductUpdated = useCallback((updatedProduct) => {
        setProductos((current) => {
            if (updatedProduct.disponible === false) {
                return current.filter((product) => product.id !== updatedProduct.id);
            }
            const exists = current.some((product) => product.id === updatedProduct.id);
            return exists
                ? current.map((product) => product.id === updatedProduct.id ? updatedProduct : product)
                : [...current, updatedProduct];
        });
    }, []);

    useProductosRealtime(handleProductUpdated);

    const categorias = useMemo(() => {
        const grouped = productos.reduce((result, product) => {
            const categoria = product.categoria || "Otros";
            if (!result[categoria]) result[categoria] = [];
            result[categoria].push(product);
            return result;
        }, {});
        return Object.entries(grouped);
    }, [productos]);

    return (
        <Layout
            className="layout"
            style={{
                minHeight: "100vh",
                background: "#000",
                margin: 0,
                padding: 0,
                overflowX: "hidden",
            }}
        >
            <style>
                {`
                    body { margin: 0 !important; padding: 0 !important; background: #000 !important; }
                    .ant-layout { background: #000 !important; }
                    .ant-layout-content { margin: 0 !important; padding: 0 !important; }
                `}
            </style>
            <PublicNavbar />

            <Content style={{ margin: 0, padding: 0 }}>
                {/* ── Hero Section ── */}
                <div
                    style={{
                        padding: "45px 5% 40px",
                        background: "radial-gradient(circle at center, #222 0%, #000 100%)",
                        color: "#fff",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        margin: 0,
                    }}
                >
                    <div style={{ maxWidth: "750px", margin: "0 auto" }}>
                        <Title
                            style={{
                                color: "#fff",
                                fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
                                marginBottom: "12px",
                                lineHeight: 1.1,
                                fontWeight: 900,
                                textTransform: "uppercase",
                            }}
                        >
                            Calidad{" "}
                            <span
                                style={{
                                    background: "#FFD60A",
                                    color: "#000",
                                    padding: "4px 14px",
                                    display: "inline-block",
                                    transform: "skewX(-10deg)",
                                    borderRadius: "5px",
                                }}
                            >
                                Irresistible.
                            </span>
                        </Title>
                        <Paragraph
                            style={{
                                color: "rgba(255,255,255,0.75)",
                                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                                fontWeight: 300,
                                letterSpacing: "0.5px",
                                maxWidth: "620px",
                                margin: "0 auto 25px",
                            }}
                        >
                            Street Food para llevar. Nuestra cocina está diseñada para que recibas el mejor sabor, recién hecho y listo para retirar.
                        </Paragraph>
                        <Space size="middle" wrap style={{ justifyContent: "center" }}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() =>
                                    document.getElementById("menu-section").scrollIntoView({ behavior: "smooth" })
                                }
                                style={{
                                    height: "48px",
                                    padding: "0 28px",
                                    background: "#FFD60A",
                                    borderColor: "#FFD60A",
                                    color: "#000",
                                    fontWeight: 900,
                                    fontSize: "1rem",
                                    borderRadius: "12px",
                                }}
                            >
                                VER MENÚ
                            </Button>
                            <Button
                                href={WHATSAPP_URL}
                                target="_blank"
                                type="primary"
                                size="large"
                                icon={<WhatsAppOutlined />}
                                style={{
                                    height: "48px",
                                    padding: "0 28px",
                                    background: "#25D366",
                                    borderColor: "#25D366",
                                    color: "#fff",
                                    fontWeight: 900,
                                    fontSize: "1rem",
                                    borderRadius: "12px",
                                }}
                            >
                                WhatsApp
                            </Button>
                        </Space>
                    </div>
                </div>

                {/* ── Menu Section ── */}
                <div
                    id="menu-section"
                    style={{
                        padding: "50px 6% 60px",
                        background: "#fff",
                        borderRadius: "35px 35px 0 0",
                        marginTop: "-30px",
                        zIndex: 10,
                        position: "relative",
                    }}
                >
                    {/* Encabezado de sección */}
                    <div style={{ textAlign: "center", marginBottom: "40px" }}>
                        <Title
                            level={2}
                            style={{ textTransform: "uppercase", letterSpacing: "3px", fontWeight: 800, marginBottom: 0 }}
                        >
                            Nuestro Menú
                        </Title>
                        <div
                            style={{
                                width: "60px",
                                height: "5px",
                                background: "#FFD60A",
                                margin: "12px auto",
                                borderRadius: "3px",
                            }}
                        />
                        <Title level={5} type="secondary" style={{ fontWeight: 500, margin: 0 }}>
                            PIDE Y RETIRA
                        </Title>
                    </div>

                    {categorias.length === 0 ? (
                        <Text type="secondary">No hay productos disponibles en este momento.</Text>
                    ) : categorias.map(([categoria, items]) => (
                        <div key={categoria} style={{ marginBottom: "44px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                <span style={{ fontSize: "1.6rem" }}>🍔</span>
                                <Title level={3} style={{ margin: 0, fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase", fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)" }}>
                                    {categoria}
                                </Title>
                            </div>
                            <Row gutter={[20, 20]}>
                                {items.map((item) => <ProductCard key={item.id || item.nombre} item={item} colSize={{ md: 8 }} />)}
                            </Row>
                        </div>
                    ))}
                </div>

                {/* ── Final CTA / Yappy QR & Info ── */}
                <div id="ubicacion-section" style={{ padding: "50px 6%", background: "#0a0a0a", color: "#fff" }}>
                    <Row gutter={[36, 36]} align="middle" justify="center">
                        <Col xs={24} md={13} style={{ textAlign: window.innerWidth < 768 ? "center" : "left" }}>
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    background: "rgba(0, 174, 239, 0.15)",
                                    padding: "6px 16px",
                                    borderRadius: "30px",
                                    marginBottom: "15px",
                                }}
                            >
                                <img src={yappyLogo} alt="Yappy" style={{ height: "24px", objectFit: "contain" }} />
                                <Text strong style={{ color: "#00AEEF", fontSize: "0.95rem", letterSpacing: "1px" }}>
                                    PAGA FÁCIL Y RÁPIDO CON YAPPY
                                </Text>
                            </div>
                            <Title
                                style={{
                                    color: "#fff",
                                    fontWeight: 800,
                                    margin: "0 0 12px 0",
                                    fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
                                }}
                            >
                                PIDE, RETIRA Y PAGA
                            </Title>
                            <Paragraph
                                id="contacto-section"
                                style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", marginBottom: "24px" }}
                            >
                                Somos una cocina especializada en despacho rápido. Haz tu pedido y paga directamente
                                escaneando nuestro código QR de Yappy.
                            </Paragraph>
                            <Space
                                direction="vertical"
                                size="small"
                                style={{
                                    display: "flex",
                                    alignItems: window.innerWidth < 768 ? "center" : "flex-start",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <EnvironmentOutlined
                                        style={{ fontSize: "20px", color: "#FFD60A", marginRight: "12px" }}
                                    />
                                    <Text style={{ color: "#fff", fontSize: "1.05rem" }}>Santa Maria, Betania</Text>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <PhoneOutlined
                                        style={{ fontSize: "20px", color: "#FFD60A", marginRight: "12px" }}
                                    />
                                    <Text style={{ color: "#fff", fontSize: "1.05rem" }}>+507 6482-9340</Text>
                                </div>
                            </Space>
                        </Col>
                        <Col xs={24} md={11} style={{ textAlign: "center" }}>
                            <div
                                style={{
                                    background: "#fff",
                                    padding: "20px",
                                    borderRadius: "24px",
                                    display: "inline-block",
                                    boxShadow: "0 15px 40px rgba(0, 174, 239, 0.25)",
                                    maxWidth: "280px",
                                    width: "100%",
                                }}
                            >
                                <img
                                    src={qrYappy}
                                    alt="Código QR Yappy"
                                    style={{
                                        width: "100%",
                                        maxWidth: "220px",
                                        height: "auto",
                                        borderRadius: "12px",
                                        display: "block",
                                        margin: "0 auto",
                                    }}
                                />
                                <div
                                    style={{
                                        marginTop: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                    }}
                                >
                                    <img src={yappyLogo} alt="Yappy" style={{ height: "22px" }} />
                                    <Text strong style={{ fontSize: "1.05rem", color: "#000" }}>
                                        Escanea con Yappy
                                    </Text>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>

            <Footer
                style={{
                    textAlign: "center",
                    background: "#000",
                    color: "rgba(255,255,255,0.3)",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    padding: "24px 0",
                }}
            >
                Antojo24 © {new Date().getFullYear()} - Hecho con 🔥 en Panamá.
            </Footer>
        </Layout>
    );
};

export default LandingPage;
