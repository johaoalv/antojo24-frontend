import React from "react";
import ReactDOM from "react-dom";
import PrintTicket from "../pages/PrintTicket";

export const imprimirTicket = (datos) => {
  const container = document.createElement("div");
  container.id = "print-root";
  document.body.appendChild(container);

  ReactDOM.render(
    <PrintTicket
      pedido={datos.pedido}
      total_pedido={datos.total_pedido}
      metodo_pago={datos.metodo_pago}
      nombre_cliente={datos.nombre_cliente}
    />,
    container,
    () => {
      window.print();
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
      }, 500);
    }
  );
};
