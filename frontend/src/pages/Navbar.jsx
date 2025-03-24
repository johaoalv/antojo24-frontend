import React from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

const cerrarSesion = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login"; // o redirige donde quieras
  };
  
  const menu = (
    <Menu>
      <Menu.Item key="dashboard">
        <a href="/dashboard">Dashboard</a>
      </Menu.Item>
      <Menu.Item key="logout" danger onClick={cerrarSesion}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

const Navbar = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        marginBottom: 20,
      }}
    >
       
      <img src="/assets/delivery-truck.png" alt="Rapid Food Logo" style={{ height: 40 }} />
      <h3>Rapid Food</h3>

      <Dropdown overlay={menu} placement="bottomRight">
        <Button>
          Opciones <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Navbar;