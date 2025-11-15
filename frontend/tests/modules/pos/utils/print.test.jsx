import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest';

const reactDomMocks = vi.hoisted(() => ({
  render: vi.fn(),
  unmountComponentAtNode: vi.fn(),
}));

vi.mock('react-dom', () => ({
  default: reactDomMocks,
}));

vi.mock('../../../../src/modules/pos/pages/PrintTicket.jsx', () => ({
  default: function MockPrintTicket(props) {
    return props;
  },
}));

import { imprimirTicket } from '../../../../src/modules/pos/utils/print.jsx';

describe('imprimirTicket', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    reactDomMocks.render.mockReset();
    reactDomMocks.unmountComponentAtNode.mockReset();
    reactDomMocks.render.mockImplementation((_element, _container, callback) => {
      callback?.();
    });
    window.print = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('crea un contenedor, renderiza el ticket y limpia el DOM tras imprimir', () => {
    const datos = {
      pedido: [{ producto: 'burger', cantidad: 1 }],
      total_pedido: 12,
      metodo_pago: 'efectivo',
    };

    imprimirTicket(datos);

    const container = document.getElementById('print-root');
    expect(container).not.toBeNull();
    expect(reactDomMocks.render).toHaveBeenCalledTimes(1);

    const [element, passedContainer] = reactDomMocks.render.mock.calls[0];
    expect(passedContainer).toBe(container);
    expect(element.props).toMatchObject({
      pedido: datos.pedido,
      total_pedido: 12,
      metodo_pago: 'efectivo',
    });

    expect(window.print).toHaveBeenCalled();
    expect(reactDomMocks.unmountComponentAtNode).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(reactDomMocks.unmountComponentAtNode).toHaveBeenCalledWith(container);
    expect(document.getElementById('print-root')).toBeNull();
  });
});
