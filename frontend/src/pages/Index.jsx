import React, { useState } from "react";
import { Button, Modal, List, notification, Select } from "antd";
import productosData from "../data/productos.json";
import { generateUUID } from "../utils/uuid-generetaro";
import { enviarPedido } from "../data/axios_pedidos";

const PRECIOS = productosData.reduce((acc, item) => {
  acc[item.producto] = item.precio;
  return acc;
}, {});

const Index = () => {
  const [pedido, setPedido] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
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
  
    try {
      const response = await enviarPedido({ 
        pedido: pedidoFormateado,
        total_pedido: calcularTotal(),
        pedido_id,
        metodo_pago: metodoPago
      });
  
      notification.success({
        message: "Pedido Recibido",
        description: "El pedido fue enviado correctamente a la cocina.",
        placement: "bottomLeft",
      });
  
      setPedido({});
      setModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Error de Conexión",
        description: "No se pudo conectar con el servidor. Revisa tu conexión.",
        placement: "topRight",
      });
    }
  };
  
  

  return (
    <div className="index-container">
      <h1>Rapid Food</h1>
      <Button type="primary" className="food-button" onClick={() => agregarAlPedido("Hot Dog")}>
        Hot Dog 
      </Button>
      <Button type="primary" className="food-button" onClick={() => agregarAlPedido("Hamburguesa")}>
        Hamburguesa 
      </Button>
      <Button type="primary" className="food-button" onClick={() => agregarAlPedido("Soda")}>
        Soda 
      </Button>

      {Object.keys(pedido).length > 0 && (
        <Button type="default" className="checkout-button" onClick={() => setModalVisible(true)}>
          Ver Pedido
        </Button>
      )}

      <Modal
        title="Resumen del Pedido"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={confirmarPedido}
        okText="Confirmar Pedido"
      >
        <List
          bordered
          dataSource={Object.entries(pedido)}
          renderItem={([producto, cantidad]) => (
            <List.Item>
              <span>{`${producto}: ${cantidad} x $${PRECIOS[producto]} = $${cantidad * PRECIOS[producto]}`}</span>
              <div>
                <Button size="small" onClick={() => ajustarCantidad(producto, cantidad - 1)}>-</Button>
                <Button size="small" onClick={() => ajustarCantidad(producto, cantidad + 1)}>+</Button>
              </div>
            </List.Item>
          )}
        />
        <h3>Total: ${calcularTotal()}</h3>
        <Select
  placeholder="Selecciona el método de pago"
  style={{ width: "100%", marginBottom: "1rem" }}
  onChange={(value) => setMetodoPago(value)}
>
  <Select.Option value="visa">Visa</Select.Option>
  <Select.Option value="yappy">Yappy</Select.Option>
  <Select.Option value="efectivo">Efectivo</Select.Option>
</Select>

      </Modal>
    </div>
  );
};

export default Index;
