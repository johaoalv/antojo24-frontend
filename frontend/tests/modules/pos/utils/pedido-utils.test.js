import {
  buildPriceMap,
  createProductoFinder,
} from '../../../../src/modules/pos/utils/pedido-utils.js';

describe('pedido-utils', () => {
  const productos = [
    { producto: 'hamburguesa', precio: 7.5 },
    { producto: 'papas', precio: 3.25 },
  ];

  it('construye un mapa de precios a partir de la lista de productos', () => {
    const priceMap = buildPriceMap(productos);
    expect(priceMap).toEqual({ hamburguesa: 7.5, papas: 3.25 });
  });

  it('crea una función que localiza productos por nombre', () => {
    const findProducto = createProductoFinder(productos);
    expect(findProducto('papas')).toEqual({ producto: 'papas', precio: 3.25 });
    expect(findProducto('inexistente')).toBeUndefined();
  });
});
