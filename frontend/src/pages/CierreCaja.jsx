import React, { useEffect, useState } from "react";
import { hacerCierreCaja, getResumenVentas } from "../data/axios_cierre";



const CierreCaja = () => {
  const [pedidos, setPedidos] = useState([]); 
  const [cargando, setCargando] = useState(true);

 useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const datos = await getResumenVentas();
        console.log(datos);
        setPedidos(datos);
      } catch (error) {
        console.error("Error al cargar:", error);
      } finally {
        setCargando(false);
      }
    };
       cargarPedidos();
  }, []);
  

  // Función para ejecutar el cierre (POST)
const handleCierre = async () => {
  try {
    const resultado = await hacerCierreCaja();
    alert(`✅ Cierre exitoso!\nTotal: $${resultado.resumen.total_general}`);
  } catch (error) {
    if (error.response?.status === 409) {
      alert("Ya existe un cierre de caja hoy");
    } else {
      alert(`❌ Error: ${error.message}`);
    }
    console.error("Detalle error:", error.response?.data || error);
  }
};

  if (cargando) return <div>Cargando pedidos...</div>;


  return (
      <div style={{ margin: '20px' }}>
      <h2>Pedidos de Hoy</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Método Pago</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.producto}</td>
              <td style={{ textAlign: 'center' }}>{pedido.cantidad}</td>
              <td style={{ textAlign: 'right' }}>${pedido.total_item.toFixed(2)}</td>
              <td>{pedido.metodo_pago}</td>
            </tr>
          ))}
        </tbody>
      </table> <br /> <br />
      <button onClick={handleCierre}>cierre de caja</button>
    </div>
  );
 };


export default CierreCaja;