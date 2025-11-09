export const buildPriceMap = (productos) =>
  productos.reduce((acc, item) => {
    acc[item.producto] = item.precio;
    return acc;
  }, {});

export const createProductoFinder = (productos) => (nombre) =>
  productos.find((producto) => producto.producto === nombre);
