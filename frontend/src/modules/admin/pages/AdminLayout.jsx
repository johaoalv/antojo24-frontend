
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ShopOutlined,
  SettingOutlined,
  LogoutOutlined,
  BlockOutlined
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../../common/components/Navbar";

const { Sider, Content, Footer } = Layout;

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
      icon: <DashboardOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Inicio</span>,
    },
    {
      key: "productos",
      icon: <ShopOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Productos</span>,
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
        {/* SIDEBAR */}
        <Sider width={300} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[currentPath.split("/")[2] || "inicio"]}
            style={{ height: "100%", borderRight: 0, padding: '20px 0' }}
            items={menuItems}
            onClick={handleMenuClick}
            itemPadding="30px"
          />
        </Sider>

        {/* CONTENIDO CENTRAL */}
        <Layout style={{ padding: "30px" }}>
          <Content
            style={{
              background: "#fff",
              padding: 40,
              margin: 0,
              minHeight: 280,
              borderRadius: 16,
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
