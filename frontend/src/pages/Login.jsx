import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Typography, message, notification } from "antd";
import { autenticarPin } from "../data/axios_auth";
import { LockOutlined } from "@ant-design/icons";

const PinLogin = () => {
  const navigate = useNavigate();
  const maxLength = 6;
  const [inputs, setInputs] = useState(Array(maxLength).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/\D/g, ""); // solo números
    if (!value) return;

    const newInputs = [...inputs];
    newInputs[idx] = value[0];
    setInputs(newInputs);

    if (idx < maxLength - 1) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (inputs[idx]) {
        const newInputs = [...inputs];
        newInputs[idx] = "";
        setInputs(newInputs);
      } else if (idx > 0) {
        inputsRef.current[idx - 1].focus();
      }
    }
  };

  const handleSubmit = async () => {
    const pin = inputs.join("");
    if (pin.length < maxLength) return;
  
    try {
      const response = await autenticarPin(pin);
      const { nombre_tienda, sucursal_id, rol } = response.data;
      console.log(response.data.rol);
  
      notification.success({
        message: `Bienvenido, ${nombre_tienda}`,
        placement: "bottomLeft",
      });
  
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("user_role", rol);
      localStorage.setItem("sucursal_id", sucursal_id);
      localStorage.setItem("lastLoginDate", new Date().toISOString().split("T")[0]);
  
      setInputs(Array(maxLength).fill("")); // limpio los inputs antes de navegar
  
      // 🔁 Redirección según rol
      if (rol === "admin") {
        navigate("/admin/inicio");
      } else {
        navigate("/");
      }
  
    } catch (error) {
      message.error(error.response?.data?.error || "Error al autenticar");
      setInputs(Array(maxLength).fill(""));
      inputsRef.current[0].focus();
    }
  };
  

  return (
    <div className="pin-container" style={{ textAlign: "center", padding: 30 }}>
      <LockOutlined style={{ fontSize: 32, marginBottom: 10, color: "#8c8c8c" }} />
      <Typography.Title level={4} style={{ marginBottom: 20 }}>
        Enter the code
      </Typography.Title>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
        {inputs.map((value, idx) => (
          <Input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            maxLength={1}
            value={value}
            autoFocus={idx === 0}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            style={{
              width: 45,
              height: 50,
              textAlign: "center",
              fontSize: 24,
              borderRadius: 8,
              borderColor: idx === inputs.findIndex(i => i === "") ? "#91caff" : "#d9d9d9",
              boxShadow: idx === inputs.findIndex(i => i === "") ? "0 0 0 2px #bae7ff" : "none",
            }}
          />
        ))}
      </div>

      <Button
        type="primary"
        style={{ marginTop: 20, width: "200px", fontWeight: "bold" }}
        size="large"
        onClick={handleSubmit}
        disabled={inputs.join("").length < maxLength}
      >
        Confirmar
      </Button>
    </div>
  );
};

export default PinLogin;
