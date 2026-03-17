//recorrer productos
export const buildPriceMap = (productos) => {
  if (!Array.isArray(productos)) return {};
  return productos.reduce((acc, item) => {
    acc[item.producto || item.nombre] = item.precio;
    return acc;
  }, {});
};

export const createProductoFinder = (productos) => (nombre) => {
  if (!Array.isArray(productos)) return undefined;
  return productos.find((producto) => (producto.producto || producto.nombre) === nombre);
};
