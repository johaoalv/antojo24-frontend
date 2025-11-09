import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Typography, message, notification } from "antd";
import axios from "axios";
import { autenticarPin } from "../data/axios_auth";
import a24logo from "../../public/assets/A_24_LOGO_OFICIAL.png"

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
      let ip_cliente = null;
      try {
        const { data } = await axios.get("https://api.ipify.org?format=json");
        ip_cliente = data.ip;
      } catch (ipError) {
        console.error("Error al obtener la IP pública:", ipError);
        message.error("No se pudo obtener la dirección IP. Revisa tu conexión a internet.");
        return;
      }

      const response = await autenticarPin(pin, ip_cliente);
      const { nombre_tienda, sucursal_id, rol } = response.data;

      localStorage.setItem("app_token", response.token); // ✅ Guardar token
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
      let errorMessage = "Error al autenticar"; // Mensaje genérico por defecto

      if (error.response && error.response.data && error.response.data.error) {
        // Si el backend envía un mensaje de error específico (incluyendo para 403), lo usamos.
        // Esto cumple con "no personalices el msj, solo el que llegue del backend".
        errorMessage = error.response.data.error;
      }
      message.error(errorMessage);
      setInputs(Array(maxLength).fill(""));
      inputsRef.current[0].focus();
    }
  };
  

  return (
    <div className="pin-container" style={{ textAlign: "center", padding: 30 }}>
      <img src={a24logo} style={{ width:250 }} />
      <Typography.Title level={2} style={{ marginBottom: 30 }}>
        Enter the code
      </Typography.Title>

      <div style={{ display: "flex", justifyContent: "center", gap: 15, marginBottom: 30 }}>
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
              width: 60,
              height: 70,
              textAlign: "center",
              fontSize: 32,
              borderRadius: 8,
              borderColor: idx === inputs.findIndex(i => i === "") ? "#91caff" : "#d9d9d9",
              boxShadow: idx === inputs.findIndex(i => i === "") ? "0 0 0 2px #bae7ff" : "none",
            }}
          />
        ))}
      </div>

      <Button
        type="primary"
        style={{ marginTop: 30, width: "300px", fontWeight: "bold", padding: '20px 0', height: 'auto', fontSize: '1.5em' }}
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
