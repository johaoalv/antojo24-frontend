import React, { useState, useEffect } from "react";
import { obtenerVentasHoy } from "../data/axios_ventasHoy";
import { Card, Typography, Spin } from "antd";

const { Title, Text } = Typography;

function Dashboard() {
  const [totalVentas, setTotalVentas] = useState(null);

  useEffect(() => {
    const cargarVentasHoy = async () => {
      try {
        const data = await obtenerVentasHoy();
        setTotalVentas(data.total_ventas);
      } catch (error) {
        console.error("Error al obtener ventas:", error);
      }
    };

    cargarVentasHoy();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <Card
        style={{
          width: 300,
          textAlign: "center",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Ventas Hoy
        </Text>
        <Title level={1} style={{ marginTop: 10, fontWeight: "bold", color: "#1890ff" }}>
          {totalVentas !== null ? `$${totalVentas}` : <Spin />}
        </Title>
      </Card>
    </div>
  );
}

export default Dashboard;
