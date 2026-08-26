import React from "react";
import { Layout, Typography, Row, Col, Card, Button, Divider, Space, Tag } from "antd";
import { ShopOutlined, PhoneOutlined, EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import dinaLogo from "../../../../public/assets/menu/Dina.png";
import heroImg from "../../../../public/assets/menu/Photoroom_20260309_233038.jpeg";
import duoBurgerClasica from "../../../../public/assets/duos/duo burger clasica y sodas.png";
import duoChiliBurger from "../../../../public/assets/duos/duo_chili_burger_sodas.png";
import comboHawaiBurger from "../../../../public/assets/duos/combo_hawai_burger.png";
import duoHotDogClasico from "../../../../public/assets/duos/duo_hot_dogs_clasico.png";
import duoChiliDog from "../../../../public/assets/duos/duo_chili_dog.png";
import hotDogHawaiano from "../../../../public/assets/menu/hot dog hawaiano.jpeg";
import qrYappy from "../../../../public/assets/qr_yappy.png";
import yappyLogo from "../../../../public/assets/yappy.png";
import { WhatsAppOutlined } from "@ant-design/icons";

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const WHATSAPP_URL = "https://wa.me/c/50764829340";

const MENU_HIGHLIGHTS = [
    { title: "Dúo Burger Clásica", img: duoBurgerClasica, price: "8" },
    { title: "Dúo Chili Burger", img: duoChiliBurger, price: "9" },
    { title: "Combo Hawai Burger", img: comboHawaiBurger, price: "4.5" },
    { title: "Dúo Hot Dog Clásico", img: duoHotDogClasico, price: "6" },
    { title: "Dúo Chili Dog", img: duoChiliDog, price: "7.5" },
    { title: "Hot Dog Hawaiano", img: hotDogHawaiano, price: "2.5" },
];

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Layout className="layout" style={{ 
            minHeight: '100vh', 
            background: '#000', 
            margin: 0, 
            padding: 0,
            overflowX: 'hidden' 
        }}>
            <style>
                {`
                    body { margin: 0 !important; padding: 0 !important; background: #000 !important; }
                    .ant-layout { background: #000 !important; }
                    .ant-layout-content { margin: 0 !important; padding: 0 !important; }
                `}
            </style>
            <PublicNavbar />
            
            <Content style={{ margin: 0, padding: 0 }}>
                {/* Hero Section */}
                <div style={{
                    padding: '60px 5% 50px',
                    background: 'radial-gradient(circle at top right, #333 0%, #000 100%)',
                    color: '#fff',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    margin: 0
                }}>
                    <Row gutter={[32, 32]} align="middle">
                        <Col xs={24} md={12} style={{ textAlign: window.innerWidth < 768 ? 'center' : 'left', zIndex: 2 }}>
                            <Title style={{ 
                                color: '#fff', 
                                fontSize: 'clamp(2.2rem, 8vw, 4rem)', 
                                marginBottom: '12px', 
                                lineHeight: 1.1, 
                                fontWeight: 900, 
                                textTransform: 'uppercase' 
                            }}>
                                Calidad <br />
                                <span style={{ 
                                    background: '#FFD60A', 
                                    color: '#000', 
                                    padding: '4px 12px', 
                                    display: 'inline-block',
                                    transform: 'skewX(-10deg)',
                                    borderRadius: '5px',
                                    marginTop: '8px'
                                }}>Irresistible.</span>
                            </Title>
                            <Paragraph style={{ 
                                color: 'rgba(255,255,255,0.7)', 
                                fontSize: 'clamp(0.95rem, 3.5vw, 1.2rem)', 
                                marginBottom: '25px', 
                                maxWidth: window.innerWidth < 768 ? '100%' : '550px', 
                                fontWeight: 300, 
                                letterSpacing: '0.5px' 
                            }}>
                                Street Food para llevar. Nuestra cocina está diseñada para que recibas el mejor sabor, recién hecho y listo para retirar.
                            </Paragraph>
                            <Space size="middle" wrap style={{ justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })} 
                                    style={{ height: '50px', padding: '0 25px', background: '#FFD60A', borderColor: '#FFD60A', color: '#000', fontWeight: 900, fontSize: '1rem', borderRadius: '12px' }}
                                >
                                    VER MENÚ
                                </Button>
                                <Button 
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    type="primary"
                                    size="large"
                                    icon={<WhatsAppOutlined />}
                                    style={{ height: '50px', padding: '0 25px', background: '#25D366', borderColor: '#25D366', color: '#fff', fontWeight: 900, fontSize: '1rem', borderRadius: '12px' }}
                                >
                                    WhatsApp
                                </Button>
                            </Space>
                        </Col>
                        <Col xs={24} md={12}>
                            <div style={{
                                position: 'relative',
                                display: 'inline-block',
                                width: '100%'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    top: 0,
                                    left: 0,
                                    background: 'rgba(255, 214, 102, 0.15)',
                                    borderRadius: '50%',
                                    filter: 'blur(60px)',
                                    zIndex: 1
                                }}></div>
                                <img src={heroImg} alt="Hero Product" style={{ 
                                    width: '100%', 
                                    maxWidth: '460px', 
                                    filter: 'drop-shadow(0 0 25px rgba(255,214,102,0.3))', 
                                    position: 'relative', 
                                    zIndex: 2, 
                                    borderRadius: '20px' 
                                }} />
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Menu Section */}
                <div id="menu-section" style={{ padding: '50px 6%', background: '#fff', borderRadius: '35px 35px 0 0', marginTop: '-30px', zIndex: 10, position: 'relative' }}>
                    <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                        <Title level={2} style={{ textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 800, marginBottom: 0 }}>Nuestro Menú</Title>
                        <div style={{ width: '60px', height: '5px', background: '#FFD60A', margin: '12px auto', borderRadius: '3px' }}></div>
                        <Title level={5} type="secondary" style={{ fontWeight: 500, margin: 0 }}>LO MÁS PEDIDO - PIDE Y RETIRA</Title>
                    </div>

                    <Row gutter={[20, 20]}>
                        {MENU_HIGHLIGHTS.map((item, index) => (
                            <Col xs={24} sm={12} md={12} lg={12} key={index}>
                                <Card
                                    hoverable
                                    cover={
                                        <div style={{ width: '100%', aspectRatio: '3 / 2', overflow: 'hidden', borderRadius: '20px 20px 0 0', background: '#000' }}>
                                            <img 
                                                alt={item.title} 
                                                src={item.img} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} 
                                            />
                                        </div>
                                    }
                                    style={{ borderRadius: '25px', overflow: 'hidden', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.06)', height: '100%' }}
                                    bodyStyle={{ padding: '20px' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        <Title level={3} style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}>{item.title}</Title>
                                        <Text strong style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: '#000', whiteSpace: 'nowrap' }}>{item.price}</Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Final CTA / Yappy QR & Info */}
                <div id="ubicacion-section" style={{ padding: '50px 6%', background: '#0a0a0a', color: '#fff' }}>
                    <Row gutter={[36, 36]} align="middle" justify="center">
                        <Col xs={24} md={13} style={{ textAlign: window.innerWidth < 768 ? 'center' : 'left' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(0, 174, 239, 0.15)', padding: '6px 16px', borderRadius: '30px', marginBottom: '15px' }}>
                                <img src={yappyLogo} alt="Yappy" style={{ height: '24px', objectFit: 'contain' }} />
                                <Text strong style={{ color: '#00AEEF', fontSize: '0.95rem', letterSpacing: '1px' }}>PAGA FÁCIL Y RÁPIDO CON YAPPY</Text>
                            </div>
                            <Title style={{ color: '#fff', fontWeight: 800, margin: '0 0 12px 0', fontSize: 'clamp(1.8rem, 5vw, 2.6rem)' }}>PIDE, RETIRA Y PAGA</Title>
                            <Paragraph id="contacto-section" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', marginBottom: '24px' }}>
                                Somos una cocina especializada en despacho rápido. Haz tu pedido y paga directamente escaneando nuestro código QR de Yappy.
                            </Paragraph>
                            <Space direction="vertical" size="small" style={{ display: 'flex', alignItems: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <EnvironmentOutlined style={{ fontSize: '20px', color: '#FFD60A', marginRight: '12px' }} />
                                    <Text style={{ color: '#fff', fontSize: '1.05rem' }}>Santa Maria, Betania</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <PhoneOutlined style={{ fontSize: '20px', color: '#FFD60A', marginRight: '12px' }} />
                                    <Text style={{ color: '#fff', fontSize: '1.05rem' }}>+507 6482-9340</Text>
                                </div>
                            </Space>
                        </Col>
                        <Col xs={24} md={11} style={{ textAlign: 'center' }}>
                            <div style={{
                                background: '#fff',
                                padding: '20px',
                                borderRadius: '24px',
                                display: 'inline-block',
                                boxShadow: '0 15px 40px rgba(0, 174, 239, 0.25)',
                                maxWidth: '280px',
                                width: '100%'
                            }}>
                                <img 
                                    src={qrYappy} 
                                    alt="Código QR Yappy" 
                                    style={{ width: '100%', maxWidth: '220px', height: 'auto', borderRadius: '12px', display: 'block', margin: '0 auto' }} 
                                />
                                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <img src={yappyLogo} alt="Yappy" style={{ height: '22px' }} />
                                    <Text strong style={{ fontSize: '1.05rem', color: '#000' }}>Escanea con Yappy</Text>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', background: '#000', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 0' }}>
                Antojo24 © {new Date().getFullYear()} - Hecho con 🔥 en Panamá.
            </Footer>
        </Layout>
    );
};

export default LandingPage;
