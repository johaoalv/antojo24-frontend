// El ticket detalla productos del combo, nunca ingredientes de las recetas.
export const prepararItemsTicket = (pedido, productos = []) => {
  const porId = new Map(productos.map((p) => [String(p.id), p]));
  const porNombre = new Map(productos.map((p) => [
    (p.nombre || p.producto || '').toLowerCase(), p,
  ]));

  return pedido.map((item) => {
    const producto = porNombre.get(item.producto.toLowerCase());
    if (!producto?.es_combo) return item;

    let componentes = producto.combo_items;
    if (typeof componentes === 'string') {
      try {
        componentes = JSON.parse(componentes);
      } catch {
        componentes = [];
      }
    }

    const incluidos = (Array.isArray(componentes) ? componentes : []).flatMap((componente) => {
      if (!componente) return [];
      const base = porId.get(String(componente.id));
      const cantidad = Number(componente.cantidad ?? 1) * Number(item.cantidad);
      if (!Number.isFinite(cantidad) || cantidad <= 0) return [];
      return [{
        producto: base?.nombre || base?.producto || 'Producto no disponible',
        cantidad,
      }];
    });

    return { ...item, incluidos };
  });
};
