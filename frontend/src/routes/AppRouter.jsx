import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "../modules/pos/pages/Index";
import Login from "../modules/common/pages/Login";
import CierreCaja from "../modules/pos/pages/CierreCaja";
import PrivateRoute from "./PrivateRoute";

import AdminLayout from "../modules/admin/pages/AdminLayout";
import Dashboard from "../modules/admin/pages/Dashboard";
import GestionInsumos from "../modules/admin/pages/GestionInsumos";
import VentasDelDia from "../modules/admin/pages/VentasDelDia";
import Gastos from "../modules/admin/pages/Gastos";
import Finanzas from "../modules/admin/pages/Finanzas";
import Inyecciones from "../modules/admin/pages/Inyecciones";
import ProduccionSalsas from "../modules/admin/pages/ProduccionSalsas";
import CosteoProductos from "../modules/admin/pages/CosteoProductos";
import ConfigurarRecetas from "../modules/admin/pages/ConfiguradorRecetas";
import Mermas from "../modules/admin/pages/Mermas";
import GestionProductos from "../modules/admin/pages/GestionProductos";
import LandingPage from "../modules/public/pages/LandingPage";

const AppRouter = () => {
  // ...
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/pos" element={<Index />} />
          <Route path="/cierre" element={<CierreCaja />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inicio" element={<Dashboard />} />
            <Route path="ventas" element={<VentasDelDia />} />
            <Route path="gastos" element={<Gastos />} />
            <Route path="finanzas" element={<Finanzas />} />
            <Route path="inyecciones" element={<Inyecciones />} />
            <Route path="produccion" element={<ProduccionSalsas />} />
            <Route path="costeo" element={<CosteoProductos />} />
            <Route path="recetas" element={<ConfigurarRecetas />} />
            <Route path="mermas" element={<Mermas />} />
            <Route path="insumos" element={<GestionInsumos />} />
            <Route path="productos" element={<GestionProductos />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
