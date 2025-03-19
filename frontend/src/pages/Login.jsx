import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Space, Typography, message } from "antd";
import { autenticarPin } from "../data/axios_auth";
import { DeleteOutlined } from "@ant-design/icons";

const PinLogin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const maxLength = 6;

  const handleButtonClick = (value) => {
    if (pin.length < maxLength) {
      setPin(pin + value);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    try {
      const response = await autenticarPin(pin);
      message.success(`Bienvenido, ${response.data.nombre} ${response.data.apellido}`);
      localStorage.setItem("user", JSON.stringify(response));
      setPin("");
      navigate("/");
    } catch (error) {
      message.error(error.response?.data?.error || "Error al autenticar");
      setPin("");
    }
  };

  return (
    <div className="pin-container">
    <Typography.Title level={2} className="pin-title">Ingrese PIN</Typography.Title>
    <Input.Password
      value={"●".repeat(pin.length)}
      readOnly
      className="pin-input"
    />
    <div className="pin-keypad">
      {["123", "456", "789", "⌫0"].map((row, rowIndex) => (
        <div key={rowIndex} className="pin-row">
          {row.split("").map((num) => (
            <Button
              key={num}
              type="default"
              shape="circle"
              className="pin-button"
              size="large"
              onClick={() => (num === "⌫" ? handleDelete() : handleButtonClick(num))}
            >
              {num === "⌫" ? <DeleteOutlined /> : num}
            </Button>
          ))}
        </div>
      ))}
    </div>
    <Button type="primary" className="pin-submit" onClick={handleSubmit} disabled={pin.length < maxLength}>
      Confirmar
    </Button> <br />

    <Link to="/signup">Crear Cuenta</Link>
  </div>
  );
};

export default PinLogin;