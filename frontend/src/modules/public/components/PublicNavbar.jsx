import React from "react";
import { Layout, Menu, Button } from "antd";
import { useNavigate } from "react-router-dom";
import dinaLogo from "../../../../public/assets/menu/Dina.png";

const { Header } = Layout;

const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <Header style={{ 
      position: 'fixed', 
      zIndex: 1000, 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0 5%'
    }}>
      <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate("/")}>
        <img src={dinaLogo} alt="Antojo24 Logo" style={{ height: '40px' }} />
      </div>
      <Menu
        mode="horizontal"
        disabledOverflow
        theme="dark"
        style={{ border: 'none', background: 'transparent', flex: 1, justifyContent: 'center' }}
        items={[
          { key: 'menu', label: 'Menú' },
          { key: 'ubicacion', label: 'Ubicación' },
          { key: 'contacto', label: 'Contacto' },
        ]}
      />
      <Button 
        type="primary" 
        shape="round" 
        onClick={() => navigate("/login")}
        style={{ background: '#ffd666', borderColor: '#ffd666', color: '#000', fontWeight: 'bold' }}
      >
        Ingresar
      </Button>
    </Header>
  );
};

export default PublicNavbar;
