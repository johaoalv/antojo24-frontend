import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "../modules/pos/pages/Index";
import Login from "../modules/common/pages/Login";
import CierreCaja from "../modules/pos/pages/CierreCaja";
import PrivateRoute from "./PrivateRoute";

import AdminLayout from "../modules/admin/pages/AdminLayout";
import Dashboard from "../modules/admin/pages/Dashboard";
import GestionInsumos from "../modules/admin/pages/GestionInsumos";
import SalesHistory from "../modules/admin/pages/SalesHistory";
import Inversiones from "../modules/admin/pages/Inversiones";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Index />} />
          <Route path="/cierre" element={<CierreCaja />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inicio" element={<Dashboard />} />
            <Route path="ventas" element={<SalesHistory />} />
            <Route path="inversiones" element={<Inversiones />} />
            <Route path="insumos" element={<GestionInsumos />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
