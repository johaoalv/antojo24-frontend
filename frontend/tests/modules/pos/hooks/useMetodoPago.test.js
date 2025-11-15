import { renderHook, act } from '@testing-library/react';
import { message } from 'antd';
import useMetodoPago from '../../../../src/modules/pos/hooks/useMetodoPago.js';

vi.mock('antd', () => ({
  message: {
    error: vi.fn(),
  },
}));

describe('useMetodoPago', () => {
  it('maneja el flujo de pago en efectivo calculando el vuelto', () => {
    const calcularTotal = vi.fn(() => 10);
    const { result } = renderHook(() => useMetodoPago(calcularTotal));

    act(() => {
      result.current.handleMetodoPagoChange('efectivo');
    });

    expect(result.current.metodoPago).toBe('efectivo');
    expect(result.current.isModalVisible).toBe(true);

    act(() => {
      result.current.handleMontoRecibidoChange(20);
    });

    expect(result.current.montoRecibido).toBe(20);
    expect(result.current.vuelto).toBe(10);

    act(() => {
      result.current.handleModalOk();
    });

    expect(result.current.isModalVisible).toBe(false);

    act(() => {
      result.current.handleModalCancel();
    });

    expect(result.current.metodoPago).toBe('');
    expect(result.current.montoRecibido).toBeNull();
    expect(result.current.vuelto).toBe(0);
  });

  it('mantiene el modal abierto y muestra error si el monto recibido es insuficiente', () => {
    const calcularTotal = vi.fn(() => 20);
    const { result } = renderHook(() => useMetodoPago(calcularTotal));

    act(() => {
      result.current.handleMetodoPagoChange('efectivo');
    });

    act(() => {
      result.current.handleMontoRecibidoChange(10);
    });

    act(() => {
      result.current.handleModalOk();
    });

    expect(result.current.isModalVisible).toBe(true);
    expect(message.error).toHaveBeenCalledWith(
      'El monto recibido no puede ser menor al total del pedido.'
    );
  });
});
