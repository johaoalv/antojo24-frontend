
const PrintTicket = ({ pedido, total_pedido, metodo_pago }) => {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString();
  const hora = ahora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="ticket-container">
      <div className="titulo">Antojo24</div>
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
      <div className="center">¡Gracias por su compra!</div>
    </div>
  );
};

export default PrintTicket;
