import React from "react";
import { Layout, Menu, Drawer, Button, Select } from "antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  BlockOutlined,
  HistoryOutlined,
  FileTextOutlined,
  MenuOutlined,
  ExperimentOutlined,
  PieChartOutlined
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../../common/components/Navbar";
import { StoreProvider, useStore } from "../../../context/StoreContext";
import { obtenerTiendas } from "../../../api/admin/axios_dashboard";

const { Sider, Content, Footer } = Layout;

const AdminLayoutContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const { selectedStoreId, setSelectedStoreId, stores, setStores } = useStore();

  const currentPath = location.pathname;

  React.useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await obtenerTiendas();
        setStores(data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, [setStores]);

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
      key: "produccion",
      icon: <ExperimentOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Producción</span>,
    },
    {
      key: "costeo",
      icon: <PieChartOutlined style={{ fontSize: '1.5em' }} />,
      label: <span style={{ fontSize: '1.3em' }}>Costeo</span>,
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <div className="show-mobile">
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

            <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <span style={{ marginRight: 10, fontWeight: 600, fontSize: '1.1em' }}>📍 Sucursal:</span>
              <Select
                style={{ width: '200px' }}
                value={selectedStoreId}
                onChange={setSelectedStoreId}
                options={[
                  { label: "🌎 Todas las Sedes", value: "global" },
                  ...stores.map(s => ({ label: s.nombre, value: s.sucursal_id }))
                ]}
              />
            </div>
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

const AdminLayout = () => {
  return (
    <StoreProvider>
      <AdminLayoutContent />
    </StoreProvider>
  );
};

export default AdminLayout;
