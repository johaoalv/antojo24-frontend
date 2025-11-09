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
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 30px", // Aumentado
      borderBottom: "1px solid #ddd",
      backgroundColor: "white"
    }}>
      <img src="/assets/a244.png" alt="a24 Logo" style={{ width: 120 }} /> 
      <a href="/"><h3 style={{ fontSize: '2em', margin: 0 }}>Antojo24</h3></a> 

      <Dropdown menu={menu} placement="bottomRight">
        <Button style={{ height: 50, fontSize: '1.3em', padding: '0 25px' }}> 
          Options <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Navbar;