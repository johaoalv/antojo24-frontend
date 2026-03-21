import React from "react";
import { Layout, Typography, Row, Col, Card, Button, Divider, Space, Tag } from "antd";
import { ShopOutlined, PhoneOutlined, EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import dinaLogo from "../../../../public/assets/menu/Dina.png";
import heroImg from "../../../../public/assets/menu/Photoroom_20260309_233038.jpeg";
import burgerClasica from "../../../../public/assets/menu/hamburguesa clasica.png";
import chiliBurger from "../../../../public/assets/menu/chili burger.jpeg";
import hawaiBurger from "../../../../public/assets/menu/hawai burger.jpeg";
import chiliDog from "../../../../public/assets/menu/chili dog.jpeg";
import hawaiDog from "../../../../public/assets/menu/hot dog hawaiano.jpeg";
import { WhatsAppOutlined } from "@ant-design/icons";

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const WHATSAPP_URL = "https://wa.me/c/50764829340";

const MENU_HIGHLIGHTS = [
    { title: "Hamburguesa Clásica", img: burgerClasica, price: "$3" },
    { title: "Chili Burger", img: chiliBurger, price: "$3.5" },
    { title: "Hawaiana", img: hawaiBurger, price: "$3.75" },
    { title: "Chili Dog", img: chiliDog, price: "$2.75" },
    { title: "Hot Dog Hawaiano", img: hawaiDog, price: "$2.5" },
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
                    padding: '120px 5% 100px',
                    background: 'radial-gradient(circle at top right, #333 0%, #000 100%)',
                    color: '#fff',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    margin: 0
                }}>
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} md={12} style={{ textAlign: window.innerWidth < 768 ? 'center' : 'left', zIndex: 2 }}>
                            <Title style={{ 
                                color: '#fff', 
                                fontSize: 'clamp(2.5rem, 10vw, 5rem)', 
                                marginBottom: '16px', 
                                lineHeight: 1, 
                                fontWeight: 900, 
                                textTransform: 'uppercase' 
                            }}>
                                Calidad <br />
                                <span style={{ 
                                    background: '#FFD60A', 
                                    color: '#000', 
                                    padding: '5px 15px', 
                                    display: 'inline-block',
                                    transform: 'skewX(-10deg)',
                                    borderRadius: '5px',
                                    marginTop: '10px'
                                }}>Irresistible.</span>
                            </Title>
                            <Paragraph style={{ 
                                color: 'rgba(255,255,255,0.7)', 
                                fontSize: 'clamp(1rem, 4vw, 1.4rem)', 
                                marginBottom: '40px', 
                                maxWidth: window.innerWidth < 768 ? '100%' : '550px', 
                                fontWeight: 300, 
                                letterSpacing: '0.5px' 
                            }}>
                                Street Food para llevar. Nuestra cocina está diseñada para que recibas el mejor sabor, recién hecho y listo para retirar.
                            </Paragraph>
                            <Space size="large" wrap style={{ justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })} 
                                    style={{ height: '60px', padding: '0 30px', background: '#FFD60A', borderColor: '#FFD60A', color: '#000', fontWeight: 900, fontSize: '1.1rem', borderRadius: '15px' }}
                                >
                                    VER MENÚ
                                </Button>
                                <Button 
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    type="primary"
                                    size="large"
                                    icon={<WhatsAppOutlined />}
                                    style={{ height: '60px', padding: '0 30px', background: '#25D366', borderColor: '#25D366', color: '#fff', fontWeight: 900, fontSize: '1.1rem', borderRadius: '15px' }}
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
                                    filter: 'blur(80px)',
                                    zIndex: 1
                                }}></div>
                                <img src={heroImg} alt="Hero Product" style={{ 
                                    width: '100%', 
                                    maxWidth: '550px', 
                                    filter: 'drop-shadow(0 0 30px rgba(255,214,102,0.3))', 
                                    position: 'relative', 
                                    zIndex: 2, 
                                    borderRadius: '20px' 
                                }} />
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Menu Section */}
                <div id="menu-section" style={{ padding: '100px 10%', background: '#fff', borderRadius: '40px 40px 0 0', marginTop: '-60px', zIndex: 10, position: 'relative' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <Title level={2} style={{ textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 800, marginBottom: 0 }}>Nuestro Menú</Title>
                        <div style={{ width: '80px', height: '6px', background: '#FFD60A', margin: '20px auto', borderRadius: '3px' }}></div>
                        <Title level={4} type="secondary" style={{ fontWeight: 400 }}>LO MÁS PEDIDO - PIDE Y RETIRA</Title>
                    </div>

                    <Row gutter={[30, 30]}>
                        {MENU_HIGHLIGHTS.map((item, index) => (
                            <Col xs={24} sm={12} lg={8} key={index}>
                                <Card
                                    hoverable
                                    cover={<div style={{ height: '300px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                                        <img alt={item.title} src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                                    </div>}
                                    style={{ borderRadius: '25px', overflow: 'hidden', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.06)' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <Title level={4} style={{ margin: 0, fontWeight: 700 }}>{item.title}</Title>
                                            <Tag color="orange" style={{ marginTop: '8px', borderRadius: '5px' }}>ESPECIALIDAD</Tag>
                                        </div>
                                        <Text strong style={{ fontSize: '1.4rem', color: '#000' }}>{item.price}</Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Final CTA / Location */}
                <div id="ubicacion-section" style={{ padding: '100px 10%', background: '#000', color: '#fff', textAlign: 'center' }}>
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} md={12} style={{ textAlign: 'left' }}>
                            <Title style={{ color: '#fff', fontWeight: 800 }}>PIDE, RETIRA Y DISFRUTA</Title>
                            <Paragraph id="contacto-section" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>
                                Somos una cocina especializada en despacho rápido. Haz tu pedido por WhatsApp y pasa a retirarlo en pocos minutos.
                            </Paragraph>
                            <div style={{ marginTop: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                    <EnvironmentOutlined style={{ fontSize: '24px', color: '#FFD60A', marginRight: '15px' }} />
                                    <Text style={{ color: '#fff', fontSize: '1.1rem' }}>Santa Maria, Betania</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <PhoneOutlined style={{ fontSize: '24px', color: '#FFD60A', marginRight: '15px' }} />
                                    <Text style={{ color: '#fff', fontSize: '1.1rem' }}>+507 6482-9340</Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div style={{ width: '100%', height: '400px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.4739674119!2d-79.53259052417299!3d9.020454389121031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca974fb5049cb%3A0xf768df2c1ed785c8!2sAntojo%2024!5e0!3m2!1ses-419!2sus!4v1774047769548!5m2!1ses-419!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', background: '#000', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 0' }}>
                Antojo24 © {new Date().getFullYear()} - Hecho con 🔥 en Panamá.
            </Footer>
        </Layout>
    );
};

export default LandingPage;
