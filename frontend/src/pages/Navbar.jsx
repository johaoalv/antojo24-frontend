import React from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import { DownOutlined, ShopOutlined } from "@ant-design/icons";


const cerrarSesion = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login"; // o redirige donde quieras
  };

const nombreTienda = JSON.parse(localStorage.getItem("user"))?.nombre_tienda || "Sucursal";

  
  const menu = (
    <Menu>
      <Menu.Item key="sucursal" icon={<ShopOutlined />}>
      <span>{nombreTienda}</span>
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
        backgroundColor: "white"
      }}
    >
       
      <img src="/assets/a244.png" alt="a24 Logo" style={{ width:80 }} />
    <a href="/"> <h3>Antojo24</h3></a> 

      <Dropdown overlay={menu} placement="bottomRight">
        <Button>
          Opciones <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Navbar;