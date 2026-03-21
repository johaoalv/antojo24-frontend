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
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 214, 10, 0.2)',
      padding: '0 20px',
      height: '70px',
      margin: 0
    }}>
      <div className="logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate("/")}>
        <img src={dinaLogo} alt="Antojo24 Logo" style={{ height: '45px', objectFit: 'contain' }} />
      </div>
      
      {/* Menu - Hidden on mobile via inline style for simplicity since we don't have a separate CSS file for this component */}
      <Menu
        mode="horizontal"
        disabledOverflow
        theme="dark"
        className="desktop-menu"
        style={{ 
          border: 'none', 
          background: 'transparent', 
          flex: 1, 
          justifyContent: 'center',
          display: window.innerWidth < 768 ? 'none' : 'flex' 
        }}
        onClick={({ key }) => {
          const el = document.getElementById(key + '-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
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
        style={{ 
            background: '#FFD60A', 
            borderColor: '#FFD60A', 
            color: '#000', 
            fontWeight: 'bold',
            fontSize: window.innerWidth < 768 ? '12px' : '14px',
            padding: window.innerWidth < 768 ? '0 15px' : '0 20px'
        }}
      >
        Staff Login
      </Button>
    </Header>
  );
};

export default PublicNavbar;
