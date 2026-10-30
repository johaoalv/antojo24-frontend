import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import TraspasosFondos from '../../../src/modules/admin/components/TraspasosFondos';
import { obtenerTesoreria } from '../../../src/api/admin/axios_dashboard';
import { crearTraspaso, obtenerTraspasos } from '../../../src/api/admin/axios_finanzas';

vi.mock('../../../src/api/admin/axios_dashboard', () => ({ obtenerTesoreria: vi.fn() }));
vi.mock('../../../src/api/admin/axios_finanzas', () => ({ crearTraspaso: vi.fn(), obtenerTraspasos: vi.fn() }));

vi.setConfig({ testTimeout: 15000 });

beforeAll(() => {
  const computedStyle = window.getComputedStyle.bind(window);
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => computedStyle(element));
  window.matchMedia = vi.fn().mockImplementation((query) => ({ matches: false, media: query,
    addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
});
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  obtenerTesoreria.mockResolvedValue({ saldos_operativos: { yappy: 300, efectivo: 200 } });
  crearTraspaso.mockResolvedValue({});
  obtenerTraspasos.mockResolvedValue([]);
});

const abrir = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'Traspasar a fondos' }));
  await screen.findByLabelText('Conservar Efectivo');
};
const editar = () => {
  fireEvent.change(screen.getByLabelText('Conservar Efectivo'), { target: { value: '80' } });
  fireEvent.change(screen.getByLabelText('Conservar Yappy'), { target: { value: '50' } });
};

test('conserva todo inicialmente y solo traspasa al confirmar el monto calculado', async () => {
  const confirmado = vi.fn();
  render(<TraspasosFondos sucursalId="a" onConfirmado={confirmado} />);
  await abrir();
  expect(screen.getByRole('button', { name: 'Confirmar traspaso de $0.00' })).toBeDisabled();
  editar();
  expect(crearTraspaso).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar traspaso de $370.00' }));
  await waitFor(() => expect(confirmado).toHaveBeenCalledTimes(1));
  expect(crearTraspaso).toHaveBeenCalledWith(expect.objectContaining({ sucursal_id: 'a',
    conservar: { yappy: 50, efectivo: 80 }, saldos_esperados: { yappy: 300, efectivo: 200 } }));
});

test('si se pierde la respuesta reintenta el mismo identificador sin cambiar los montos', async () => {
  crearTraspaso.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce({});
  render(<TraspasosFondos sucursalId="a" onConfirmado={vi.fn()} />);
  await abrir(); editar();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar traspaso de $370.00' }));
  await screen.findByText(/No se pudo confirmar la respuesta/);
  expect(screen.getByLabelText('Conservar Efectivo')).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar confirmación' }));
  await waitFor(() => expect(crearTraspaso).toHaveBeenCalledTimes(2));
  expect(crearTraspaso.mock.calls[0][0]).toEqual(crearTraspaso.mock.calls[1][0]);
});

test('si hubo una venta recarga saldos y exige otra confirmación', async () => {
  crearTraspaso.mockRejectedValueOnce({ response: { status: 409, data: { error: 'Los saldos cambiaron' } } });
  render(<TraspasosFondos sucursalId="a" onConfirmado={vi.fn()} />);
  await abrir(); editar();
  obtenerTesoreria.mockResolvedValueOnce({ saldos_operativos: { yappy: 305, efectivo: 200 } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar traspaso de $370.00' }));
  await screen.findByText('Los saldos cambiaron');
  expect(screen.getByRole('button', { name: 'Confirmar traspaso de $0.00' })).toBeDisabled();
  expect(screen.getByLabelText('Conservar Yappy')).toHaveValue('305.00');
  expect(crearTraspaso).toHaveBeenCalledTimes(1);
});

test('vista global permite historial pero exige una sucursal para traspasar', () => {
  render(<TraspasosFondos sucursalId="global" onConfirmado={vi.fn()} />);
  expect(screen.getByRole('button', { name: 'Traspasar a fondos' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Ver historial de traspasos' })).toBeEnabled();
});
