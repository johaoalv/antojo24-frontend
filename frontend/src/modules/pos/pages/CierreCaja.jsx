import React, { useEffect, useState } from "react";
import { Table, Button, Spin, Typography, message } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { hacerCierreCaja, getResumenVentas } from "../../../api/pos/axios_cierre";
import Navbar from "../../common/components/Navbar";

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
      console.log("Resultado del cierre:", resultado);
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
      title: <strong style={{ fontSize: '1.2em' }}>Producto</strong>,
      dataIndex: "producto",
      key: "producto",
      render: text => <span style={{ fontSize: '1.1em' }}>{text}</span>
    },
    {
      title: <strong style={{ fontSize: '1.2em' }}>Cantidad</strong>,
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      render: text => <span style={{ fontSize: '1.1em' }}>{text}</span>
    },
    {
      title: <strong style={{ fontSize: '1.2em' }}>Precio</strong>,
      dataIndex: "total_item",
      key: "precio",
      align: "right",
      render: (precio) => <span style={{ fontSize: '1.1em' }}>{`$${parseFloat(precio).toFixed(2)}`}</span>,
    },
    {
      title: <strong style={{ fontSize: '1.2em' }}>Método de Pago</strong>,
      dataIndex: "metodo_pago",
      key: "metodo_pago",
      render: text => <span style={{ fontSize: '1.1em' }}>{text}</span>
    },
  ];

  return (
    <>
    <Navbar />
    <div style={{ padding: 40 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>Resumen de Pedidos - {nombreSucursal}</Title>

      {cargando ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={pedidos}
          columns={columnas}
          rowKey="id"
          pagination={{
            pageSize: 15, 
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} items`
          }}
          bordered
          summary={(pageData) => {
            const total = pedidos.reduce((acc, current) => acc + parseFloat(current.total_item), 0);
            return (
              <Table.Summary fixed="bottom">
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><strong style={{ fontSize: '1.4em' }}>Total General</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    <Typography.Text strong style={{ fontSize: '1.4em' }}>${total.toFixed(2)}</Typography.Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}></Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      )}

      <div style={{ textAlign: "right", marginTop: 40 }}>
        <Button
          type="primary"
          icon={<DollarCircleOutlined style={{ fontSize: '1.2em' }}/>}
          loading={loadingCierre}
          onClick={handleCierre}
          style={{ height: 60, fontSize: '1.5em', padding: '0 30px' }}
        >
          Cierre de Caja
        </Button>
      </div>
    </div></>
  );
};

export default CierreCaja;
