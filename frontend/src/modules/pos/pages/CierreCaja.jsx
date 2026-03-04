import React, { useEffect, useMemo, useState } from "react";
import { Popconfirm, Table, Typography, Button, Space } from "antd";
import { DollarCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { hacerCierreCaja, getResumenVentas } from "../../../api/pos/axios_cierre";
import { eliminarPedido } from "../../../api/pos/axios_pedidos";
import Navbar from "../../common/components/Navbar";
import SecondaryButton from "../../common/components/SecondaryButton";
import Loader from "../../common/components/Loader";
import ClosingSummaryModal from "../components/ClosingSummaryModal";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../../common/components/notifications.jsx";

const { Title } = Typography;

const CierreCaja = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [loadingCierre, setLoadingCierre] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalReal, setTotalReal] = useState(0);
  const nombreSucursal = JSON.parse(localStorage.getItem("user"))?.nombre_tienda;

  const totalCalculado = useMemo(
    () =>
      pedidos.reduce(
        (acc, current) => acc + parseFloat(current.total_item || 0),
        0
      ),
    [pedidos]
  );

  const subtotales = useMemo(() => {
    return pedidos.reduce((acc, current) => {
      const metodo = current.metodo_pago || "otro";
      acc[metodo] = (acc[metodo] || 0) + parseFloat(current.total_item || 0);
      return acc;
    }, {});
  }, [pedidos]);

  const cargarPedidos = async () => {
    setCargando(true);
    try {
      const datos = await getResumenVentas();
      setPedidos(datos);
    } catch (error) {
      console.error("Error al cargar:", error);
      notifyError({
        message: "Error al cargar los pedidos",
        description: "Intenta nuevamente en unos momentos.",
        placement: "topRight",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const handleDeletePedido = async (pedido_id) => {
    try {
      const response = await eliminarPedido(pedido_id);

      console.log("-----------------------------------------");
      console.log(`🗑️ Venta eliminada: ${pedido_id}`);
      if (response.restored_items && response.restored_items.length > 0) {
        console.log("♻️ Insumos retornados al stock:");
        response.restored_items.forEach(item => {
          console.log(`   - ${item.insumo}: +${item.cantidad} (de producto: ${item.producto})`);
        });
      } else {
        console.log("⚠️ No se encontraron insumos para restaurar en este pedido.");
      }
      console.log("-----------------------------------------");

      notifySuccess({
        message: "Pedido eliminado",
        description: "El pedido ha sido eliminado y el stock restaurado.",
        placement: "bottomRight",
      });
      cargarPedidos(); // Recargar la lista
    } catch (error) {
      notifyError({
        message: "Error al eliminar",
        description: error.response?.data?.error || "No se pudo eliminar el pedido.",
        placement: "topRight",
      });
    }
  };

  const handleOpenModal = () => {
    setTotalReal(totalCalculado);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    if (!loadingCierre) {
      setModalVisible(false);
    }
  };

  const handleCierre = async () => {
    setLoadingCierre(true);
    try {
      const resultado = await hacerCierreCaja(totalReal);
      notifySuccess({
        message: "Cierre exitoso",
        description: `Total reportado: $${resultado.resumen.total_general}`,
        placement: "bottomRight",
      });
      setModalVisible(false);
    } catch (error) {
      if (error.response?.status === 409) {
        notifyWarning({
          message: "Cierre existente",
          description: "Ya registraste un cierre hoy.",
          placement: "topRight",
        });
      } else {
        notifyError({
          message: "Error al cerrar caja",
          description: error.message,
          placement: "topRight",
        });
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
      render: text => <span style={{ fontSize: '1.1em', textTransform: 'capitalize' }}>{text}</span>
    },
    {
      title: <strong style={{ fontSize: '1.2em' }}>Acciones</strong>,
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="¿Estás seguro de eliminar esta venta?"
          description="Se restaurará el inventario automáticamente."
          onConfirm={() => handleDeletePedido(record.pedido_id)}
          okText="Sí, eliminar"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined style={{ fontSize: '1.2em' }} />}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div style={{ padding: 40 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>Resumen de Pedidos - {nombreSucursal}</Title>

        {cargando ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Loader size={64} />
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
            summary={() => (
              <Table.Summary fixed="bottom">
                {Object.entries(subtotales).map(([metodo, total]) => (
                  <Table.Summary.Row key={metodo} style={{ backgroundColor: '#fafafa' }}>
                    <Table.Summary.Cell index={0}>
                      <span style={{ fontSize: "1.1em", textTransform: 'capitalize' }}>Subtotal {metodo}</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="right">
                      <span style={{ fontSize: "1.1em" }}>${total.toFixed(2)}</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                  </Table.Summary.Row>
                ))}
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <strong style={{ fontSize: "1.4em" }}>Total General</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    <Typography.Text strong style={{ fontSize: "1.4em" }}>
                      ${totalCalculado.toFixed(2)}
                    </Typography.Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}></Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        )}

        <div style={{ textAlign: "right", marginTop: 40 }}>
          <SecondaryButton
            icon={<DollarCircleOutlined />}
            onClick={handleOpenModal}
            disabled={cargando || pedidos.length === 0}
          >
            Cierre de Caja
          </SecondaryButton>
        </div>
      </div>
      <ClosingSummaryModal
        visible={modalVisible}
        totalCalculado={totalCalculado}
        subtotales={subtotales}
        totalReal={totalReal}
        onTotalRealChange={(value) => setTotalReal(value || 0)}
        onConfirm={handleCierre}
        onCancel={handleCloseModal}
        loading={loadingCierre}
      />
    </>
  );
};

export default CierreCaja;
