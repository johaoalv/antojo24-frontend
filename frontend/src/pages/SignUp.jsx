import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Cuenta creada exitosamente");
        navigate("/login"); // Redirige al login
      } else {
        message.error(data.error || "Error al crear cuenta");
      }
    } catch (error) {
      message.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, textAlign: "center" }}>
      <h2>Crear Cuenta</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[{ required: true, message: "Ingrese su nombre" }]}
        >
          <Input placeholder="Juan" />
        </Form.Item>

        <Form.Item
          label="Apellido"
          name="apellido"
          rules={[{ required: true, message: "Ingrese su apellido" }]}
        >
          <Input placeholder="Pérez" />
        </Form.Item>

        <Form.Item
          label="Cédula"
          name="cedula"
          rules={[{ required: true, message: "Ingrese su cédula" }]}
        >
          <Input placeholder="12345678" />
        </Form.Item>

        <Form.Item
          label="PIN (6 dígitos)"
          name="pin"
          rules={[
            { required: true, message: "Ingrese un PIN de 6 dígitos" },
            { pattern: /^\d{6}$/, message: "El PIN debe tener 6 números" },
          ]}
        >
          <Input.Password placeholder="******" maxLength={6} />
        </Form.Item>

        <Form.Item
          label="Tienda"
          name="tienda"
          rules={[{ required: true, message: "Ingrese la tienda" }]}
        >
          <Input placeholder="Sucursal A" />
        </Form.Item>

        <Form.Item
          label="Teléfono"
          name="telefono"
          rules={[{ required: true, message: "Ingrese su teléfono" }]}
        >
          <Input placeholder="987654321" />
        </Form.Item>

        <Form.Item
          label="Correo"
          name="correo"
          rules={[
            { required: true, message: "Ingrese su correo" },
            { type: "email", message: "Ingrese un correo válido" },
          ]}
        >
          <Input placeholder="correo@ejemplo.com" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Registrarse
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;
