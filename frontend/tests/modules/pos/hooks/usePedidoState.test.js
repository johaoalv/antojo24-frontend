import { renderHook, act } from '@testing-library/react';
import usePedidoState from '../../../../src/modules/pos/hooks/usePedidoState.js';

describe('usePedidoState', () => {
  const priceMap = { burger: 5, fries: 3 };

  it('agrega productos, calcula total y reinicia el pedido', () => {
    const { result } = renderHook(() => usePedidoState(priceMap));

    act(() => {
      result.current.agregarAlPedido('burger');
      result.current.agregarAlPedido('burger');
      result.current.agregarAlPedido('fries');
    });

    expect(result.current.pedido).toEqual({ burger: 2, fries: 1 });
    expect(result.current.calcularTotal()).toBe(13);

    act(() => {
      result.current.ajustarCantidad('burger', 1);
    });

    expect(result.current.pedido.burger).toBe(1);

    act(() => {
      result.current.resetPedido();
    });

    expect(result.current.pedido).toEqual({});
  });
});
