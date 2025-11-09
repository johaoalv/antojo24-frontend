import React, { useState } from "react";
import Navbar from "./Navbar";
import { Button, notification, Select, Modal, InputNumber, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import productosData from "../data/productos.json";
import { generateUUID } from "../utils/uuid-generetaro";
import { enviarPedido } from "../data/axios_pedidos";
import { imprimirTicket } from "../utils/print";
import { getPanamaTime } from "../utils/get_time";

const { Text } = Typography;



const PRECIOS = productosData.reduce((acc, item) => {
  acc[item.producto] = item.precio;
  return acc;
}, {});

const buscarProducto = (nombre) =>
  productosData.find((p) => p.producto === nombre);

const Index = () => {
  const navigate = useNavigate();
  const [pedido, setPedido] = useState({});
  const [metodoPago, setMetodoPago] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [montoRecibido, setMontoRecibido] = useState(null);
  const [vuelto, setVuelto] = useState(0);


  const agregarAlPedido = (producto) => {
    setPedido((prevPedido) => ({
      ...prevPedido,
      [producto]: (prevPedido[producto] || 0) + 1,
    }));
  };

  const ajustarCantidad = (producto, cantidad) => {
    setPedido((prevPedido) => {
      const nuevoPedido = { ...prevPedido };
      if (cantidad <= 0) {
        delete nuevoPedido[producto];
      } else {
        nuevoPedido[producto] = cantidad;
      }
      return nuevoPedido;
    });
  };

  const calcularTotal = () => {
    return Object.entries(pedido).reduce((total, [producto, cantidad]) => {
      return total + PRECIOS[producto] * cantidad;
    }, 0);
  };

  const handleMetodoPagoChange = (value) => {
    setMetodoPago(value);
    if (value === 'efectivo') {
      setIsModalVisible(true);
    }
  };

  const handleMontoRecibidoChange = (value) => {
    setMontoRecibido(value);
    const total = calcularTotal();
    if (value >= total) {
      setVuelto(value - total);
    } else {
      setVuelto(0);
    }
  };

  const handleModalOk = () => {
    const total = calcularTotal();
    if (montoRecibido >= total) {
      setIsModalVisible(false);
    } else {
      message.error("El monto recibido no puede ser menor al total del pedido.");
    }
  };
  
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setMetodoPago(""); 
    setMontoRecibido(null);
    setVuelto(0);
  };
  

  const confirmarPedido = async () => {
    const pedido_id = generateUUID();
    const fecha = getPanamaTime();
    const total = calcularTotal();
    const sucursal_id = localStorage.getItem("sucursal_id");

  
    const pedidoFormateado = Object.entries(pedido).map(([producto, cantidad]) => ({
      producto,
      cantidad,
      total_item: cantidad * PRECIOS[producto],
      pedido_id
    }));
  
    const datos = {
      pedido_id,
      pedido: pedidoFormateado,
      total_pedido: total,
      metodo_pago: metodoPago,
      fecha, 
      sucursal_id
    };

    if (metodoPago === 'efectivo') {
      datos.monto_recibido = montoRecibido;
    }
  
    try {
      const response = await enviarPedido(datos);
      await imprimirTicket(datos);
  
      notification.success({
        message: <span style={{ fontSize: '1.5em' }}>Venta Registrada</span>,
        description: response.monto_vuelto ? <span style={{ fontSize: '1.2em' }}>{`Cambio a entregar: $${response.monto_vuelto.toFixed(2)}`}</span> : null,
        placement: "bottom",
        duration: 4,
      });
  
      setPedido({});
      setMetodoPago("");
      setMontoRecibido(null);
      setVuelto(0);

    } catch (error) {
      notification.error({
        message: <span style={{ fontSize: '1.5em' }}>Error de Conexión</span>,
        description: <span style={{ fontSize: '1.2em' }}>No se pudo conectar con el servidor. Revisa tu conexión.</span>,
        placement: "topRight",
      });
    }
  };
  
  
  return (
    <>
    <Navbar />
    <div style={{ display: "flex", padding: 30, gap: 30 }}>
    {/* Panel izquierdo */}
    <div style={{ width: "60%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", // Grid responsivo
          gap: 30,
        }}
      >
        {productosData.map((item) => (
          <div
            key={item.producto}
            onClick={() => agregarAlPedido(item.producto)}
            style={{
              border: "1px solid #ddd",
              borderRadius: 16,
              padding: 20,
              textAlign: "center",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
            }}
          >
            <img
              src={item.imagen}
              alt={item.producto}
              style={{ height: 150 }}
            />
            <div style={{ marginTop: 15, fontSize: "1.3em", fontWeight: "500" }}>{item.producto}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <Select
          placeholder="Método de Pago"
          style={{ width: "100%", height: 60 }}
          onChange={handleMetodoPagoChange}
          value={metodoPago || undefined}
          size="large"
        >
          <Select.Option value="efectivo">
            <img src="/assets/efectivo.png" alt="efectivo" style={{ height: 30, marginRight: 15 }} />
            Efectivo
          </Select.Option>
          <Select.Option value="tarjeta">
            <img src="/assets/tarjeta.png" alt="tarjeta" style={{ height: 30, marginRight: 15 }} />
            Tarjeta
          </Select.Option>
          <Select.Option value="yappy">
            <img src="/assets/yappy.png" alt="yappy" style={{ height: 30, marginRight: 15 }} />
            Yappy
          </Select.Option>
        </Select>
      </div>
    </div>

    {/* Carrito derecho */}
    <div
      style={{
        width: "40%",
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: 25,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <h3 style={{ fontSize: "2.5em", marginBottom: "20px", textAlign: "center" }}>Carrito</h3>
      {Object.entries(pedido).map(([producto, cantidad]) => {
        const productoInfo = buscarProducto(producto);
        return (
          <div
            key={producto}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #eee",
              padding: "15px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={productoInfo?.imagen}
                alt={producto}
                style={{ height: 50, marginRight: 15 }}
              />
              <div>
                <strong style={{ fontSize: "1.2em" }}>{producto}</strong>
                <div style={{ fontSize: "1.1em", color: "#555" }}>${PRECIOS[producto]}</div>
              </div>
            </div>
            <div>
              <Button style={{ width: 40, height: 40, fontSize: '1.2em' }} onClick={() => ajustarCantidad(producto, cantidad - 1)}>
                -
              </Button>
              <span style={{ margin: "0 15px", fontSize: "1.4em", minWidth: '30px', display: 'inline-block', textAlign: 'center' }}>{cantidad}</span>
              <Button style={{ width: 40, height: 40, fontSize: '1.2em' }} onClick={() => ajustarCantidad(producto, cantidad + 1)}>
                +
              </Button>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 30, fontWeight: "bold", fontSize: "2em", display: "flex", justifyContent: "space-between" }}>
        <span>Total:</span>
        <span>${calcularTotal().toFixed(2)}</span>
      </div>

      <Button
        type="primary"
        block
        style={{ marginTop: 25, height: 70, fontSize: '2em' }}
        onClick={confirmarPedido}
        disabled={Object.keys(pedido).length === 0 || !metodoPago}
      >
        Continuar
      </Button>
      <Button
        type="default"
        block
        style={{ marginTop: 20, height: 50, fontSize: '1.2em' }}
        onClick={() => navigate("/cierre")}
      >
        Ir al Cierre de Caja
      </Button>
    </div>
    <Modal
        title={<span style={{ fontSize: '1.8em' }}>Pago en Efectivo</span>}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okButtonProps={{ disabled: montoRecibido < calcularTotal(), style: { height: 45, fontSize: '1.2em' } }}
        cancelButtonProps={{ style: { height: 45, fontSize: '1.2em' } }}
        width={500}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          <Text strong style={{ fontSize: '1.5em' }}>Total del Pedido: ${calcularTotal().toFixed(2)}</Text>
          <InputNumber
            style={{ width: '100%', padding: '10px', fontSize: '1.5em' }}
            placeholder="Monto recibido del cliente"
            min={0}
            size="large"
            value={montoRecibido}
            onChange={handleMontoRecibidoChange}
            autoFocus
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
          {montoRecibido >= calcularTotal() && (
            <Text strong style={{ color: 'green', fontSize: '1.8em' }}>
              Vuelto: ${vuelto.toFixed(2)}
            </Text>
          )}
          {montoRecibido < calcularTotal() && montoRecibido !== null && (
            <Text strong style={{ color: 'red', fontSize: '1.2em' }}>
              El monto es insuficiente.
            </Text>
          )}
        </div>
      </Modal>
  </div>
  </>
  );
};

export default Index;
