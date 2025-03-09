import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Input, Button, message } from "antd";
import axios from "axios";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://rapidfood.app.n8n.cloud/webhook-test/login", { pin });
      console.log(response.data)
      if (response.data.valid === true) {
        navigate("/");
      } else {
        message.error("PIN incorrecto. Inténtalo de nuevo.");
      }
    } catch (error) {
      message.error("Error al validar el PIN.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <Title level={2}>Rapid Food</Title>
      <Input.OTP length={4} value={pin} onChange={setPin} className="otp-input" />
      <Button type="primary" onClick={handleLogin} loading={loading} className="login-button">
        Ingresar
      </Button>
    </div>
  );
};

export default Login;
