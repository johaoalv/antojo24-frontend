import React, { useState } from "react";
import Navbar from "./Navbar";
import { Button, notification, Select } from "antd";
import productosData from "../data/productos.json";
import { generateUUID } from "../utils/uuid-generetaro";
import { enviarPedido } from "../data/axios_pedidos";
import { imprimirTicket } from "../data/axios_print";

const PRECIOS = productosData.reduce((acc, item) => {
  acc[item.producto] = item.precio;
  return acc;
}, {});

const buscarProducto = (nombre) =>
  productosData.find((p) => p.producto === nombre);

const Index = () => {
  const [pedido, setPedido] = useState({});
  const [metodoPago, setMetodoPago] = useState("");

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

  const confirmarPedido = async () => {
    const pedido_id = generateUUID();
    const pedidoFormateado = Object.entries(pedido).map(([producto, cantidad]) => ({
      producto,
      cantidad,
      total_item: cantidad * PRECIOS[producto],
      pedido_id
    }));

    const datos = {
      pedido:pedidoFormateado,
      total_pedido: calcularTotal(),
      metodo_pago:metodoPago
    };
  
    try {
       await enviarPedido({ 
        pedido: pedidoFormateado,
        total_pedido: calcularTotal(),
        pedido_id,
        metodo_pago: metodoPago
      });

      await imprimirTicket(datos);
  
      notification.success({
        message: "Venta Registrada",
        placement: "bottom",
      });
  
      setPedido({});
    } catch (error) {
      notification.error({
        message: "Error de Conexión",
        description: "No se pudo conectar con el servidor. Revisa tu conexión.",
        placement: "topRight",
      });
    }
  };
  
  return (
    <>
    <Navbar />
    <div style={{ display: "flex", padding: 20 }}>
    {/* Panel izquierdo */}
    <div style={{ width: "70%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
        }}
      >
        {productosData.map((item) => (
          <div
            key={item.producto}
            onClick={() => agregarAlPedido(item.producto)}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 10,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={item.imagen}
              alt={item.producto}
              style={{ height: 100 }}
            />
            <div style={{ marginTop: 10 }}>{item.producto}</div>
          </div>
        ))}
      </div>

      {/* Método de pago */}
      <div style={{ marginTop: 30 }}>
        <Select
          placeholder="Método de Pago"
          style={{ width: "100%" }}
          onChange={(value) => setMetodoPago(value)}
        >
          <Select.Option value="efectivo">
            <img src="/assets/efectivo.png" alt="efectivo" style={{ height: 20, marginRight: 10 }} />
            Efectivo
          </Select.Option>
          <Select.Option value="tarjeta">
            <img src="/assets/tarjeta.png" alt="tarjeta" style={{ height: 20, marginRight: 10 }} />
            Tarjeta
          </Select.Option>
          <Select.Option value="yappy">
            <img src="/assets/yappy.png" alt="yappy" style={{ height: 20, marginRight: 10 }} />
            Yappy
          </Select.Option>
        </Select>
      </div>
    </div>

    {/* Carrito derecho */}
    <div
      style={{
        width: "30%",
        marginLeft: 20,
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 15,
      }}
    >
      <h3>Carrito</h3>
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
              padding: "10px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={productoInfo?.imagen}
                alt={producto}
                style={{ height: 30, marginRight: 10 }}
              />
              <div>
                <strong>{producto}</strong>
                <div>${PRECIOS[producto]}</div>
              </div>
            </div>
            <div>
              <Button size="small" onClick={() => ajustarCantidad(producto, cantidad - 1)}>
                -
              </Button>
              <span style={{ margin: "0 10px" }}>{cantidad}</span>
              <Button size="small" onClick={() => ajustarCantidad(producto, cantidad + 1)}>
                +
              </Button>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 20, fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
        <span>Total:</span>
        <span>${calcularTotal().toFixed(2)}</span>
      </div>

      <Button
        type="primary"
        block
        style={{ marginTop: 15 }}
        onClick={confirmarPedido}
        disabled={Object.keys(pedido).length === 0 || !metodoPago}
      >
        REGISTRAR
      </Button>
    </div>
  </div>
  </>
  );
};

export default Index;
