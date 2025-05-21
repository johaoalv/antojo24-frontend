import React, { useEffect, useState } from "react";
import { Table, Button, Spin, Typography, message } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { hacerCierreCaja, getResumenVentas } from "../data/axios_cierre";
import Navbar from "./Navbar";

const { Title } = Typography;

const CierreCaja = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [loadingCierre, setLoadingCierre] = useState(false);
  const nombreSucursal = JSON.parse(localStorage.getItem("user"))?.nombre_tienda;


  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const datos = await getResumenVentas();
        setPedidos(datos);
      } catch (error) {
        console.error("Error al cargar:", error);
        message.error("Error al cargar los pedidos");
      } finally {
        setCargando(false);
      }
    };
    cargarPedidos();
  }, []);

  const handleCierre = async () => {
    setLoadingCierre(true);
    try {
      const resultado = await hacerCierreCaja();
      message.success(`Cierre exitoso. Total: $${resultado.resumen.total_general}`);
    } catch (error) {
      if (error.response?.status === 409) {
        message.warning("Ya existe un cierre de caja hoy");
      } else {
        message.error(`❌ Error: ${error.message}`);
      }
      console.error("Detalle error:", error.response?.data || error);
    } finally {
      setLoadingCierre(false);
    }
  };

  const columnas = [
    {
      title: "Producto",
      dataIndex: "producto",
      key: "producto",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
    },
    {
      title: "Precio",
      dataIndex: "total_item",
      key: "precio",
      align: "right",
      render: (precio) => `$${precio.toFixed(2)}`,
    },
    {
      title: "Método de Pago",
      dataIndex: "metodo_pago",
      key: "metodo_pago",
    },
  ];

  return (
    <>
    <Navbar />
    <div style={{ padding: 24 }}>
      <Title level={3}>Resumen de Pedidos - {nombreSucursal}</Title>

      {cargando ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={pedidos}
          columns={columnas}
          rowKey="id"
          pagination={false}
          bordered
        />
      )}

      <div style={{ textAlign: "right", marginTop: 24 }}>
        <Button
          type="primary"
          icon={<DollarCircleOutlined />}
          loading={loadingCierre}
          onClick={handleCierre}
          size="large"
        >
          Cierre de Caja
        </Button>
      </div>
    </div></>
  );
};

export default CierreCaja;
