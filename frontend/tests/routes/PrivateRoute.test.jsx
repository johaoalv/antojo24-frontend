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
          <Route path="/admin" element={<AdminPage />} />
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

  it('redirige a un admin a su página de inicio (/admin) si intenta entrar al POS', () => {
    localStorage.setItem('app_token', 'token');
    localStorage.setItem('user_role', 'admin');

    renderWithRoute('/');

    // El admin no tiene permiso para "/", debería ser redirigido a "/admin"
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('redirige a un usuario tienda a la raíz si intenta entrar a admin', () => {
    localStorage.setItem('app_token', 'token');
    localStorage.setItem('user_role', 'tienda');

    renderWithRoute('/admin/inicio');

    // Debería ser redirigido a "/"
    expect(screen.getByText('POS Home')).toBeInTheDocument();
  });
});
