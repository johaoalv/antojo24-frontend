import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({ status = "403", title = "Acceso denegado", subtitle = "No tienes permiso para acceder a esta sección." }) => {
  const navigate = useNavigate();

  return (
    <Result
      status={status}
      title={title}
      subTitle={subtitle}
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Ir al inicio
        </Button>
      }
    />
  );
};

export default ErrorPage;
