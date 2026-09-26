import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prepararItemsTicket } from '../../../../src/modules/pos/utils/ticket-items';
import PrintTicket from '../../../../src/modules/pos/pages/PrintTicket';

const componentes = [{ id: 3, cantidad: 1 }, { id: 25, cantidad: 2 }, { id: 1, cantidad: 1 }];
const catalogo = [
  { id: 26, nombre: 'Combo 1', es_combo: true, combo_items: componentes },
  { id: 3, nombre: 'Hamburguesa', receta: ['Carne', 'Papel antigrasa'] },
  { id: 25, nombre: 'Papas fritas' },
  { id: 1, nombre: 'Sodas', disponible: false },
];
const pedido = [{ producto: 'combo 1', cantidad: 2, total_item: 10.50 }];

describe('detalle de combos en el ticket', () => {
  it.each([componentes, JSON.stringify(componentes)])('multiplica las cantidades y conserva el precio', (comboItems) => {
    const productos = [{ ...catalogo[0], combo_items: comboItems }, ...catalogo.slice(1)];
    const resultado = prepararItemsTicket(pedido, productos);
    expect(resultado[0]).toEqual({
      ...pedido[0],
      incluidos: [
        { producto: 'Hamburguesa', cantidad: 2 },
        { producto: 'Papas fritas', cantidad: 4 },
        { producto: 'Sodas', cantidad: 2 },
      ],
    });
    expect(pedido[0]).not.toHaveProperty('incluidos');
  });

  it('imprime productos bajo el combo sin ingredientes ni precios adicionales', () => {
    render(<PrintTicket pedido={prepararItemsTicket(pedido, catalogo)} total_pedido={10.50} metodo_pago="efectivo" />);
    expect(screen.getByText('2x combo 1')).toBeInTheDocument();
    const detalle = screen.getByRole('list');
    expect(within(detalle).getByText('2x Hamburguesa')).toBeInTheDocument();
    expect(within(detalle).getByText('4x Papas fritas')).toBeInTheDocument();
    expect(within(detalle).getByText('2x Sodas')).toBeInTheDocument();
    expect(detalle).not.toHaveTextContent('$');
    expect(screen.queryByText(/Carne|Papel antigrasa/)).not.toBeInTheDocument();
    expect(screen.getByText('$10.50')).toBeInTheDocument();
    expect(screen.getByText('Total: $10.50')).toBeInTheDocument();
  });

  it('mantiene los productos simples y tolera datos de combo incompletos', () => {
    const simple = [{ producto: 'Hamburguesa', cantidad: 1, total_item: 3.50 }];
    expect(prepararItemsTicket(simple, catalogo)).toEqual(simple);
    expect(prepararItemsTicket(pedido)).toEqual(pedido);
    expect(prepararItemsTicket(pedido, [{ ...catalogo[0], combo_items: '{invalido' }])[0].incluidos).toEqual([]);
    const eliminado = prepararItemsTicket(pedido, [catalogo[0]])[0];
    expect(eliminado.incluidos[0]).toEqual({ producto: 'Producto no disponible', cantidad: 2 });
  });
});
