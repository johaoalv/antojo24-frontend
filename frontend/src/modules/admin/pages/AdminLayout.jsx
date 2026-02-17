
import React from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import {
  DashboardOutlined,
  ShopOutlined,
  SettingOutlined,
  LogoutOutlined,
  BlockOutlined,
  HistoryOutlined,
  FileTextOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../../common/components/Navbar";

const { Sider, Content, Footer } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const currentPath = location.pathname;

  const handleMenuClick = ({ key }) => {
    setDrawerVisible(false);
    if (key === "logout") {
      localStorage.clear();
      navigate("/login");
    } else {
      navigate(`/admin/${key}`);
    }
  };

  const menuItems = [
    {
      key: "inicio",
      icon: <DashboardOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Inicio</span>,
    },
    {
      key: "productos",
      icon: <ShopOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Productos</span>,
    },
    {
      key: "ventas",
      icon: <HistoryOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Ventas</span>,
    },
    {
      key: "inversiones",
      icon: <FileTextOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Inversiones</span>,
    },
    {
      key: "insumos",
      icon: <BlockOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Insumos</span>,
    },
    {
      key: "configuracion",
      icon: <SettingOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Configuración</span>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Salir</span>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout>
        {/* SIDEBAR DESKTOP */}
        <Sider
          width={300}
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          trigger={null}
        >
          <Menu
            mode="inline"
            selectedKeys={[currentPath.split("/")[2] || "inicio"]}
            style={{ height: "100%", borderRight: 0, padding: '20px 0' }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>

        {/* DRAWER MOBILE */}
        <Drawer
          title="Menú Administrativo"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
          width={280}
        >
          <Menu
            mode="inline"
            selectedKeys={[currentPath.split("/")[2] || "inicio"]}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Drawer>

        {/* CONTENIDO CENTRAL */}
        <Layout className="smooth-transition" style={{ padding: "clamp(10px, 3vw, 30px)" }}>
          <div className="show-mobile" style={{ marginBottom: 20 }}>
            <Button
              type="primary"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              size="large"
              style={{ backgroundColor: '#000', borderColor: '#000' }}
            >
              Menú
            </Button>
          </div>

          <Content
            style={{
              background: "#fff",
              padding: "clamp(15px, 5vw, 40px)",
              margin: 0,
              minHeight: 280,
              borderRadius: 16,
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center", marginTop: 20, fontSize: '1.1em' }}>
            Antojo24 ©{new Date().getFullYear()} - Todos los derechos reservados
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
