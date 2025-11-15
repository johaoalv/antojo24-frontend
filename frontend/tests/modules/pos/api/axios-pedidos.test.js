import { vi, describe, it, expect, beforeEach } from 'vitest';

const axiosMock = vi.hoisted(() => ({
  post: vi.fn(),
}));

vi.mock('../../../../src/api/core/axios_base.jsx', () => ({
  default: axiosMock,
}));

import { enviarPedido } from '../../../../src/api/pos/axios_pedidos.jsx';

describe('enviarPedido', () => {
  beforeEach(() => {
    axiosMock.post.mockReset();
  });

  it('envía el payload al endpoint y retorna la data', async () => {
    const payload = { pedido: [] };
    axiosMock.post.mockResolvedValueOnce({ data: { ok: true } });

    const result = await enviarPedido(payload);

    expect(axiosMock.post).toHaveBeenCalledWith('/pedido', payload);
    expect(result).toEqual({ ok: true });
  });

  it('propaga errores si la API falla', async () => {
    const error = new Error('fallo');
    axiosMock.post.mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(enviarPedido({})).rejects.toThrow('fallo');

    consoleSpy.mockRestore();
  });
});
