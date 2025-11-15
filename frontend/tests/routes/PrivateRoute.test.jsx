import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../src/routes/PrivateRoute.jsx';

const PosPage = () => <div>POS Home</div>;
const AdminPage = () => <div>Admin Dashboard</div>;
const LoginPage = () => <div>Login Screen</div>;

const renderWithRoute = (initialPath) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<PosPage />} />
          <Route path="/admin/inicio" element={<AdminPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('PrivateRoute role restrictions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirige al login cuando no hay token', () => {
    renderWithRoute('/admin/inicio');
    expect(screen.getByText('Login Screen')).toBeInTheDocument();
  });

  it('permite acceder a rutas admin con rol admin', () => {
    localStorage.setItem('app_token', 'token');
    localStorage.setItem('user_role', 'admin');

    renderWithRoute('/admin/inicio');

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('bloquea el acceso de un rol tienda a rutas admin', () => {
    localStorage.setItem('app_token', 'token');
    localStorage.setItem('user_role', 'tienda');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderWithRoute('/admin/inicio');

    expect(
      screen.getByText('No tienes permiso para acceder a esta sección.')
    ).toBeInTheDocument();

    warnSpy.mockRestore();
  });
});
