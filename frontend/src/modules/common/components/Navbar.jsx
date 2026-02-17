import React from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import { DownOutlined, ShopOutlined } from "@ant-design/icons";

const cerrarSesion = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login";
};

const nombreTienda = JSON.parse(localStorage.getItem("user"))?.nombre_tienda || "Sucursal";

const menu = {
  items: [
    {
      key: 'sucursal',
      icon: <ShopOutlined />,
      label: <span style={{ fontSize: '1.2em' }}>{nombreTienda}</span>,
    },
    {
      key: 'logout',
      danger: true,
      label: <span style={{ fontSize: '1.2em' }}>Cerrar Sesión</span>,
      onClick: cerrarSesion,
    },
  ],
};

const Navbar = () => {
  return (
    <div
      className="smooth-transition"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "clamp(10px, 3vw, 20px) 30px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "white",
        flexWrap: "wrap",
        gap: "10px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        <img src="/assets/a244.png" alt="a24 Logo" style={{ width: "clamp(60px, 10vw, 120px)" }} />
        <a href="/" className="hide-mobile">
          <h3 style={{ fontSize: 'clamp(1.2em, 2vw, 2em)', margin: 0 }}>Antojo24</h3>
        </a>
      </div>

      <Dropdown menu={menu} placement="bottomRight">
        <Button style={{ height: "clamp(40px, 5vw, 50px)", fontSize: 'clamp(0.9em, 2vw, 1.3em)', padding: '0 15px' }}>
          Options <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Navbar;