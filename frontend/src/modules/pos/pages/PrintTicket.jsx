

const PrintTicket = ({ pedido, total_pedido, metodo_pago, nombre_cliente }) => {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString();
  const hora = ahora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="ticket-container">
      <div className="titulo">Antojo24</div>
      {nombre_cliente && <div style={{ fontWeight: "bold", marginTop: 5 }}>Cliente: {nombre_cliente}</div>}
      <div>{fecha} {hora}</div>
      <div className="linea" />

      {pedido.map((item, index) => (
        <div key={index} className="producto">
          <span>{item.cantidad}x {item.producto}</span>
          <span>${item.total_item.toFixed(2)}</span>
        </div>
      ))}

      <div className="linea" />
      <div className="left">Método de pago: {metodo_pago}</div>
      <div className="right">Total: ${total_pedido.toFixed(2)}</div>
      <div className="linea" />
      <div className="center">Gracias por su compra :D</div>
      <div className="center" style={{ fontSize: '14px', marginTop: 3 }}>@antojo24.pa</div>
    </div>
  );
};

export default PrintTicket;
