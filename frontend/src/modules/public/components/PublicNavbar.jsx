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
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 214, 10, 0.2)', // Bordecito amarillo sutil
      padding: '0 5%',
      height: '70px'
    }}>
      <div className="logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%' }} onClick={() => navigate("/")}>
        <img src={dinaLogo} alt="Antojo24 Logo" style={{ height: '45px', objectFit: 'contain' }} />
      </div>
      <Menu
        mode="horizontal"
        disabledOverflow
        theme="dark"
        style={{ border: 'none', background: 'transparent', flex: 1, justifyContent: 'center' }}
        onClick={({ key }) => {
          if (key === 'login') return navigate("/login");
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
        style={{ background: '#FFD60A', borderColor: '#FFD60A', color: '#000', fontWeight: 'bold' }}
      >
        Staff Login
      </Button>
    </Header>
  );
};

export default PublicNavbar;
