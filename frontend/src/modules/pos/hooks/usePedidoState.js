import { useCallback, useState } from "react";

const usePedidoState = (priceMap) => {
  const [pedido, setPedido] = useState({});
  const [nombreCliente, setNombreCliente] = useState("");

  const agregarAlPedido = useCallback((producto) => {
    setPedido((prevPedido) => ({
      ...prevPedido,
      [producto]: (prevPedido[producto] || 0) + 1,
    }));
  }, []);

  const ajustarCantidad = useCallback((producto, cantidad) => {
    setPedido((prevPedido) => {
      const nuevoPedido = { ...prevPedido };
      if (cantidad <= 0) {
        delete nuevoPedido[producto];
      } else {
        nuevoPedido[producto] = cantidad;
      }
      return nuevoPedido;
    });
  }, []);

  const calcularTotal = useCallback(() => {
    return Object.entries(pedido).reduce((total, [producto, cantidad]) => {
      const precio = priceMap[producto] || 0;
      return total + precio * cantidad;
    }, 0);
  }, [pedido, priceMap]);

  const resetPedido = useCallback(() => {
    setPedido({});
    setNombreCliente("");
  }, []);

  return {
    pedido,
    nombreCliente,
    setNombreCliente,
    agregarAlPedido,
    ajustarCantidad,
    calcularTotal,
    resetPedido,
  };
};

export default usePedidoState;
