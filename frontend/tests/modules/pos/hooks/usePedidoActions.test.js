import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import usePedidoActions from '../../../../src/modules/pos/hooks/usePedidoActions.js';
import { enviarPedido } from '../../../../src/api/pos/axios_pedidos.jsx';
import { imprimirTicket } from '../../../../src/modules/pos/utils/print.jsx';
import {
  notifySuccess,
  notifyError,
} from '../../../../src/modules/common/components/notifications.jsx';
import { getPanamaTime } from '../../../../src/modules/pos/utils/get_time.js';
import { generateUUID } from '../../../../src/modules/pos/utils/uuid-generetaro.js';

vi.mock('../../../../src/api/pos/axios_pedidos.jsx', () => ({
  enviarPedido: vi.fn(),
}));

vi.mock('../../../../src/modules/pos/utils/print.jsx', () => ({
  imprimirTicket: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../../../src/modules/common/components/notifications.jsx', () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

vi.mock('../../../../src/modules/pos/utils/get_time.js', () => ({
  getPanamaTime: vi.fn(),
}));

vi.mock('../../../../src/modules/pos/utils/uuid-generetaro.js', () => ({
  generateUUID: vi.fn(),
}));

describe('usePedidoActions', () => {
  const priceMap = { burger: 10, fries: 5 };
  const pedido = { burger: 2, fries: 1 };

  const baseProps = () => ({
    pedido,
    metodoPago: 'efectivo',
    montoRecibido: 30,
    calcularTotal: vi.fn(() => 25),
    resetPedido: vi.fn(),
    resetPagoState: vi.fn(),
    priceMap,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    getPanamaTime.mockReturnValue('2024-01-01T10:00:00');
    generateUUID.mockReturnValue('uuid-123');
    enviarPedido.mockResolvedValue({ monto_vuelto: 5 });
    imprimirTicket.mockResolvedValue();
    localStorage.clear();
    localStorage.setItem('sucursal_id', 'sucursal-1');
  });

  it('no procesa el pedido si falta el método de pago o el pedido está vacío', async () => {
    const propsSinMetodo = {
      ...baseProps(),
      metodoPago: '',
    };
    const { result: resultSinMetodo } = renderHook(() =>
      usePedidoActions(propsSinMetodo)
    );

    await act(async () => {
      await resultSinMetodo.current.confirmarPedido();
    });

    expect(enviarPedido).not.toHaveBeenCalled();

    vi.clearAllMocks();

    const propsPedidoVacio = {
      ...baseProps(),
      pedido: {},
    };
    const { result: resultPedidoVacio } = renderHook(() =>
      usePedidoActions(propsPedidoVacio)
    );

    await act(async () => {
      await resultPedidoVacio.current.confirmarPedido();
    });

    expect(enviarPedido).not.toHaveBeenCalled();
  });

  it('envía el pedido y muestra una notificación de éxito', async () => {
    const props = baseProps();
    const { result } = renderHook(() => usePedidoActions(props));

    await act(async () => {
      await result.current.confirmarPedido();
    });

    const expectedPedido = [
      { producto: 'burger', cantidad: 2, total_item: 20, pedido_id: 'uuid-123' },
      { producto: 'fries', cantidad: 1, total_item: 5, pedido_id: 'uuid-123' },
    ];

    expect(enviarPedido).toHaveBeenCalledWith({
      pedido_id: 'uuid-123',
      pedido: expectedPedido,
      total_pedido: 25,
      metodo_pago: 'efectivo',
      fecha: '2024-01-01T10:00:00',
      sucursal_id: 'sucursal-1',
      monto_recibido: 30,
    });

    expect(imprimirTicket).toHaveBeenCalledWith({
      pedido_id: 'uuid-123',
      pedido: expectedPedido,
      total_pedido: 25,
      metodo_pago: 'efectivo',
      fecha: '2024-01-01T10:00:00',
      sucursal_id: 'sucursal-1',
      monto_recibido: 30,
    });

    expect(notifySuccess).toHaveBeenCalledWith({
      message: 'Venta Registrada',
      description: 'Cambio a entregar: $5.00',
      placement: 'bottom',
    });
    expect(props.resetPedido).toHaveBeenCalled();
    expect(props.resetPagoState).toHaveBeenCalled();
    expect(notifyError).not.toHaveBeenCalled();
  });

  it('muestra una notificación de error cuando la API falla', async () => {
    enviarPedido.mockRejectedValueOnce(new Error('network'));
    const props = baseProps();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => usePedidoActions(props));

    await act(async () => {
      await result.current.confirmarPedido();
    });

    expect(notifyError).toHaveBeenCalledWith({
      message: 'Error de Conexión',
      description: 'No se pudo conectar con el servidor. Revisa tu conexión.',
      placement: 'topRight',
    });
    expect(notifySuccess).not.toHaveBeenCalled();
    expect(props.resetPedido).not.toHaveBeenCalled();
    expect(props.resetPagoState).not.toHaveBeenCalled();
    expect(imprimirTicket).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
