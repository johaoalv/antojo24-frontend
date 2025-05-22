import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import CierreCaja from "../pages/CierreCaja";
import PrivateRoute from "./PrivateRoute";

import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Productos from "../pages/admin/Products";
import Configuracion from "../pages/admin/Config";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Index />} /> {/* Ruta para rol "tienda" */}
          <Route path="/cierre" element={<CierreCaja />} /> 
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} /> {/* 👉 Maneja /admin */}
            <Route path="inicio" element={<Dashboard />} />
            <Route path="productos" element={<Productos />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
