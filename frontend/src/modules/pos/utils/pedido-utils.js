//recorrer productos
export const buildPriceMap = (productos, tipoPedido = "local") => {
  if (!Array.isArray(productos)) return {};
  return productos.reduce((acc, item) => {
    const nombre = item.producto || item.nombre;
    if (tipoPedido === "delivery") {
      if (item.precio_delivery != null) {
        acc[nombre] = item.precio_delivery;
      }
    } else {
      acc[nombre] = item.precio;
    }
    return acc;
  }, {});
};

export const createProductoFinder = (productos) => (nombre) => {
  if (!Array.isArray(productos)) return undefined;
  return productos.find((producto) => (producto.producto || producto.nombre) === nombre);
};
