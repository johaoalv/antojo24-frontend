import { vi, describe, it, expect, beforeEach } from 'vitest';

const axiosMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('../../../../src/api/core/axios_base.jsx', () => ({
  default: axiosMock,
}));

import {
  getResumenVentas,
  hacerCierreCaja,
} from '../../../../src/api/pos/axios_cierre.jsx';

describe('axios_cierre', () => {
  beforeEach(() => {
    axiosMock.get.mockReset();
    axiosMock.post.mockReset();
    localStorage.clear();
  });

  it('getResumenVentas consulta la sucursal y retorna la data', async () => {
    localStorage.setItem('sucursal_id', 'sucursal_99');
    axiosMock.get.mockResolvedValueOnce({ data: { pedidos: 10 } });

    const data = await getResumenVentas();

    expect(axiosMock.get).toHaveBeenCalledWith('/pedidos-hoy?sucursal_id=sucursal_99');
    expect(data).toEqual({ pedidos: 10 });
  });

  it('hacerCierreCaja arma el payload con creado_por y total_real', async () => {
    localStorage.setItem('sucursal_id', 'sucursal_25');
    axiosMock.post.mockResolvedValueOnce({ data: { ok: true } });

    const response = await hacerCierreCaja(123.45);

    expect(axiosMock.post).toHaveBeenCalledWith('/cierre-caja', {
      sucursal_id: 'sucursal_25',
      creado_por: '25',
      total_real: 123.45,
    });
    expect(response).toEqual({ ok: true });
  });
});
