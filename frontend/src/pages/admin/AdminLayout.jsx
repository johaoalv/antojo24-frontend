import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ShopOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleMenuClick = ({ key }) => {
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
      icon: <DashboardOutlined />,
      label: "Inicio",
    },
    {
      key: "productos",
      icon: <ShopOutlined />,
      label: "Productos",
    },
    {
      key: "configuracion",
      icon: <SettingOutlined />,
      label: "Configuración",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Salir",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      {/* <Header style={{ background: "#fff", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 22, fontWeight: "bold" }}>Antojo24 Admin</div>
        <div style={{ fontSize: 14, color: "#999" }}>Panel Administrativo</div>
      </Header> */}
      <Navbar />
      

      {/* LAYOUT INTERNO */}
      <Layout>
        {/* SIDEBAR */}
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[currentPath.split("/")[2] || "inicio"]}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>

        {/* CONTENIDO CENTRAL */}
        <Layout style={{ padding: "24px" }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              margin: 0,
              minHeight: 280,
              borderRadius: 10,
            }}
          >
            <Outlet />
          </Content>

          {/* FOOTER */}
          <Footer style={{ textAlign: "center", marginTop: 20 }}>
            Antojo24 ©{new Date().getFullYear()} - Todos los derechos reservados
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
