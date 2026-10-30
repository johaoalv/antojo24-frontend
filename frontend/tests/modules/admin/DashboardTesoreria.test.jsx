import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import Dashboard from '../../../src/modules/admin/pages/Dashboard';
import { obtenerDashboard, obtenerTesoreria } from '../../../src/api/admin/axios_dashboard';

const estado = vi.hoisted(() => ({ sucursal: 'a', update: null }));
vi.mock('../../../src/context/StoreContext', () => ({ useStore: () => ({ selectedStoreId: estado.sucursal }) }));
vi.mock('../../../src/api/admin/axios_dashboard', () => ({ obtenerDashboard: vi.fn(), obtenerTesoreria: vi.fn() }));
vi.mock('../../../src/modules/admin/components/Cards', () => ({ default: ({ title, value }) => <div>{title}: {value}</div> }));
vi.mock('../../../src/modules/admin/components/TraspasosFondos', () => ({ default: () => null }));
vi.mock('socket.io-client', () => ({ io: () => ({ on: (_, callback) => { estado.update = callback; }, disconnect: vi.fn() }) }));
vi.setConfig({ testTimeout: 15000 });

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((media) => ({ matches: false, media,
    addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
});
beforeEach(() => {
  vi.clearAllMocks();
  estado.sucursal = 'a';
  obtenerDashboard.mockResolvedValue({ nombre_sucursal: 'Prueba', mes_actual: {}, historial_diario: [], rentabilidad_mensual: [], saldo_operativo_total: 195.25 });
  obtenerTesoreria.mockResolvedValue({ saldo_caja: 611.67, saldo_fondos: 416.42 });
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

async function iniciar() {
  const vista = render(<Dashboard />);
  await screen.findByText('Dashboard - Prueba');
  return vista;
}

test('actualiza Tesorería visible tras una venta sin ocultarla y mostrarla otra vez', async () => {
  await iniciar();
  fireEvent.click(screen.getByLabelText('Mostrar tesorería'));
  await screen.findByText('Fondos Antojo24: $416.42');
  obtenerTesoreria.mockResolvedValueOnce({ saldo_caja: 621.67, saldo_fondos: 416.42 });
  vi.useFakeTimers();
  await act(async () => { estado.update(); await vi.advanceTimersByTimeAsync(1500); });
  expect(obtenerTesoreria).toHaveBeenCalledTimes(2);
  expect(screen.getByText('621')).toBeInTheDocument();
});

test('no consulta Tesorería mientras está oculta', async () => {
  await iniciar();
  vi.useFakeTimers();
  await act(async () => { estado.update(); await vi.advanceTimersByTimeAsync(1500); });
  expect(obtenerTesoreria).not.toHaveBeenCalled();
});

test('una respuesta demorada de otra sucursal no revela su saldo', async () => {
  const vista = await iniciar();
  let resolver;
  obtenerTesoreria.mockImplementationOnce(() => new Promise((resolve) => { resolver = resolve; }));
  fireEvent.click(screen.getByLabelText('Mostrar tesorería'));
  estado.sucursal = 'b';
  vista.rerender(<Dashboard />);
  await act(async () => { resolver({ saldo_caja: 999, saldo_fondos: 888 }); });
  expect(screen.queryByText('Fondos Antojo24: $888.00')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Mostrar tesorería')).toBeInTheDocument();
});
