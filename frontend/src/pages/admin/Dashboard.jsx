import React, { useState, useEffect } from "react";
import { Row, Col} from "antd"
import { obtenerDashboard } from "../../data/axios_dashboard";
import CardInfo from "../../components/Cards";


function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerDashboard();
        setDatos(data);
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      }
    };
    cargarDatos();
  }, []);
  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <>
    <div>
    {datos ? (
      <div>
        <h1>Dashboard</h1>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8} lg={6}>
            <CardInfo title="Ventas Hoy" value={datos.ventas_hoy} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <CardInfo title="Ventas Ayer" value={datos.ventas_ayer} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <CardInfo title="Producto Más Vendido" value={datos.producto_mas_vendido} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <CardInfo title="Método de Pago Más Usado" value={datos.metodo_pago_mas_usado} />
          </Col>
        </Row>
      </div>
    ) : (
      <p>Cargando datos...</p>
    )}
  </div>
  </>
  );
}

export default Dashboard;
