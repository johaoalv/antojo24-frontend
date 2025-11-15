import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import ErrorPage from "../modules/common/pages/ErrorPage";

const rolePermissions = {
  admin: ["/admin"],
  tienda: ["/", "/cierre"],
};

const PrivateRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("app_token");
  const userRole = localStorage.getItem("user_role");
  const currentPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");

  if (!token) return <Navigate to="/login" replace />;

  if (!userRole || !rolePermissions[userRole]) {
    return (
      <ErrorPage
        status="403"
        title="Rol no reconocido"
        subtitle="Tu sesión puede estar dañada. Intenta iniciar sesión nuevamente."
      />
    );
  }

  const allowedPaths = rolePermissions[userRole];
  const isAllowed = allowedPaths.some(
    (path) => currentPath === path || currentPath.startsWith(path + "/")
  );

  if (!isAllowed) {
    console.warn("❌ Ruta NO permitida para el rol:", userRole, "→", currentPath);
    return (
      <ErrorPage
        status="403"
        title="403"
        subtitle="No tienes permiso para acceder a esta sección."
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
