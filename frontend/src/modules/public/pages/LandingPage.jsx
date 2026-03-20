import React from "react";
import { Layout, Typography, Row, Col, Card, Button, Divider, Space, Tag } from "antd";
import { ShopOutlined, PhoneOutlined, EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import dinaLogo from "../../../../public/assets/menu/Dina.png";
import burgerClasica from "../../../../public/assets/menu/hamburguesa clasica.png";
import chiliBurger from "../../../../public/assets/menu/chili burger.jpeg";
import hawaiBurger from "../../../../public/assets/menu/hawai burger.jpeg";
import chiliDog from "../../../../public/assets/menu/chili dog.jpeg";
import hawaiDog from "../../../../public/assets/menu/hot dog hawaiano.jpeg";

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

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
        <Layout className="layout" style={{ minHeight: '100vh', background: '#000' }}>
            <PublicNavbar />

            <Content style={{ paddingTop: '64px' }}>
                {/* Hero Section */}
                <div style={{
                    padding: '120px 10% 160px',
                    background: 'radial-gradient(circle at top right, #333 0%, #000 100%)',
                    color: '#fff',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} md={12} style={{ textAlign: 'left', zIndex: 2 }}>
                            <Title style={{ color: '#fff', fontSize: 'clamp(3rem, 7vw, 5rem)', marginBottom: '16px', lineHeight: 1, fontWeight: 900, textTransform: 'uppercase' }}>
                                Calidad <br />
                                <span style={{
                                    background: '#ffd666',
                                    color: '#000',
                                    padding: '0 15px',
                                    display: 'inline-block',
                                    transform: 'skewX(-10deg)',
                                    borderRadius: '5px'
                                }}>Irresistible.</span>
                            </Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.4rem', marginBottom: '40px', maxWidth: '550px', fontWeight: 300, letterSpacing: '0.5px' }}>
                                Street food artesanal de verdad. En Antojo24 no solo matas el hambre, sacias el antojo con el mejor sabor de la ciudad.
                            </Paragraph>
                            <Space size="large">
                                <Button type="primary" size="large" onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })} style={{ height: '64px', padding: '0 45px', background: '#ffd666', borderColor: '#ffd666', color: '#000', fontWeight: 900, fontSize: '1.2rem', borderRadius: '15px' }}>
                                    VER MENÚ
                                </Button>
                                <Button ghost size="large" style={{ height: '64px', padding: '0 45px', color: '#ffd666', borderColor: '#ffd666', borderRadius: '15px', fontWeight: 700 }} onClick={() => navigate("/login")}>
                                    STAFF
                                </Button>
                            </Space>
                        </Col>
                        <Col xs={24} md={12}>
                            <div style={{
                                position: 'relative',
                                display: 'inline-block'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    width: '120%',
                                    height: '120%',
                                    top: '-10%',
                                    left: '-10%',
                                    background: 'rgba(255, 214, 102, 0.1)',
                                    borderRadius: '50%',
                                    filter: 'blur(60px)',
                                    zIndex: 1
                                }}></div>
                                <img src={dinaLogo} alt="Dina Logo" style={{ width: '100%', maxWidth: '500px', filter: 'drop-shadow(0 0 30px rgba(255,214,102,0.4))', position: 'relative', zIndex: 2 }} />
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Menu Section */}
                <div id="menu-section" style={{ padding: '100px 10%', background: '#fff', borderRadius: '40px 40px 0 0', marginTop: '-60px', zIndex: 10, position: 'relative' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <Title level={2} style={{ textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 800, marginBottom: 0 }}>Nuestro Menú</Title>
                        <div style={{ width: '80px', height: '6px', background: '#ffd666', margin: '20px auto', borderRadius: '3px' }}></div>
                        <Title level={4} type="secondary" style={{ fontWeight: 400 }}>LO MÁS PEDIDO DE LA SEDE</Title>
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
                <div style={{ padding: '100px 10%', background: '#000', color: '#fff', textAlign: 'center' }}>
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} md={12} style={{ textAlign: 'left' }}>
                            <Title style={{ color: '#fff', fontWeight: 800 }}>¿QUÉ ESPERAS?</Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>
                                Estamos listos para preparar tu orden. Pasa por nuestra sucursal y vive la experiencia Antojo.
                            </Paragraph>
                            <div style={{ marginTop: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                    <EnvironmentOutlined style={{ fontSize: '24px', color: '#ffd666', marginRight: '15px' }} />
                                    <Text style={{ color: '#fff', fontSize: '1.1rem' }}>Plaza Santa María, Nivel 1</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <PhoneOutlined style={{ fontSize: '24px', color: '#ffd666', marginRight: '15px' }} />
                                    <Text style={{ color: '#fff', fontSize: '1.1rem' }}>Llámanos y pide antes de llegar</Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div style={{ width: '100%', height: '300px', background: '#333', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#ffd666' }}>[ MAPA DE UBICACIÓN ]</Text>
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
