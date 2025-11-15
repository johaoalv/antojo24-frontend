import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../../../../src/modules/common/pages/Login.jsx';
import axios from 'axios';
import { autenticarPin } from '../../../../src/api/auth/axios_auth.jsx';
import { notifySuccess } from '../../../../src/modules/common/components/notifications.jsx';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../../../../src/api/auth/axios_auth.jsx', () => ({
  autenticarPin: vi.fn(),
}));

vi.mock('../../../../src/modules/common/components/notifications.jsx', () => ({
  notifySuccess: vi.fn(),
}));

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/inicio" element={<div>Admin Landing</div>} />
        <Route path="/" element={<div>POS Landing</div>} />
      </Routes>
    </MemoryRouter>
  );

const fillPinInputs = () => {
  const inputs = document.querySelectorAll('input');
  '123456'.split('').forEach((digit, idx) => {
    fireEvent.change(inputs[idx], { target: { value: digit } });
  });
};

describe('Login redirections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('redirige a /admin/inicio cuando el rol es admin', async () => {
    axios.get.mockResolvedValueOnce({ data: { ip: '1.1.1.1' } });
    autenticarPin.mockResolvedValueOnce({
      data: { nombre_tienda: 'Admin Shop', sucursal_id: 'sucursal_1', rol: 'admin' },
      token: 'admin-token',
    });

    renderLogin();
    fillPinInputs();
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await screen.findByText('Admin Landing');

    expect(autenticarPin).toHaveBeenCalledWith('123456', '1.1.1.1');
    expect(notifySuccess).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Bienvenido') })
    );
  });

  it('redirige al POS cuando el rol es tienda', async () => {
    axios.get.mockResolvedValueOnce({ data: { ip: '2.2.2.2' } });
    autenticarPin.mockResolvedValueOnce({
      data: { nombre_tienda: 'Sucursal POS', sucursal_id: 'sucursal_2', rol: 'tienda' },
      token: 'tienda-token',
    });

    renderLogin();
    fillPinInputs();
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await screen.findByText('POS Landing');

    expect(autenticarPin).toHaveBeenCalledWith('123456', '2.2.2.2');
  });
});
