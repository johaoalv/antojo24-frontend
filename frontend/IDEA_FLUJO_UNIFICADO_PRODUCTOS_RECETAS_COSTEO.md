# Idea: crear productos con receta, costo y precio en un mismo flujo

Estado: idea para evaluar posteriormente. No implementada.
Fecha: 26 de septiembre de 2026.

## Problema

Actualmente se crea el producto en Productos y Cajas y se exige un precio de venta antes de haber armado su receta. Después se trabaja en Recetas y finalmente se consulta Costeo. Esta separación obliga a saltar entre pantallas y decidir un precio sin conocer todavía el costo calculado.

Además, la receta se relaciona con el producto mediante su nombre escrito libremente. Un error de escritura o un cambio de nombre puede desconectarlos.

## Idea del usuario

Reunir la creación en **Productos y Cajas**:

1. Escribir el nombre del producto.
2. Agregar su receta con insumos y cantidades.
3. Ver cómo se actualiza el costo mientras se arma la receta.
4. Definir el precio de venta después de conocer ese costo.
5. Guardar y habilitar el producto cuando esté listo.

No confundir costo con precio: el costo se calcula a partir de los insumos; el precio de venta lo decide el usuario.

## Presentación sugerida

Para evitar una pantalla abrumadora, usar un asistente corto o secciones progresivas dentro del mismo formulario:

### Paso 1: Producto

- Nombre.
- Tipo: producto individual o combo/caja.
- Imagen y categoría como datos opcionales o secundarios.

### Paso 2: Receta o componentes

**Producto individual:** seleccionar insumos existentes y cantidades por unidad vendida. Mostrar unidad de medida, costo unitario y subtotal por ingrediente. Actualizar el costo total al añadir, editar o quitar una línea.

**Combo/caja:** seleccionar productos existentes y sus cantidades. Calcular el costo a partir de las recetas de esos productos, respetando sus cantidades. No pedir que se copien manualmente sus ingredientes.

Si un componente no tiene receta o falta información de costo, señalar que el cálculo está incompleto. No presentarlo como un costo total válido de cero.

### Paso 3: Precio y revisión

- Mostrar el costo calculado de forma destacada.
- Introducir precio local y, si corresponde, precio delivery.
- Mostrar diferencia entre precio y costo, y margen bruto estimado.
- Permitir volver a la receta para ajustar cantidades antes de terminar.
- Revisar nombre, composición, costo y precios antes de habilitar la venta.

La diferencia entre precio y costo de receta no representa por sí sola la utilidad neta: puede excluir gastos operativos, comisiones y otros costos. Mantener claras las etiquetas de los indicadores.

## Borradores

Propuesta: permitir **Guardar borrador** sin exigir todavía el precio final. El borrador no debe aparecer disponible en POS ni en el catálogo público.

La acción **Habilitar para venta** debe validar los datos obligatorios y la integridad de la receta o de los componentes. No usar un precio cero como sustituto silencioso de un precio pendiente.

## Relación entre producto y receta

- Crear el nombre una sola vez.
- Asociar la receta por el identificador del producto, no por un texto libre.
- Mostrar el nombre automáticamente durante la edición de la receta.
- Permitir renombrar el producto sin perder su receta.
- Revisar las recetas antiguas sin producto antes de migrarlas; no asociarlas automáticamente si hay coincidencias ambiguas.

## Papel de las pantallas existentes

- **Productos y Cajas:** entrada principal para crear y editar el conjunto completo.
- **Recetas:** puede conservarse como vista especializada de mantenimiento, usando la misma información y asociación por identificador.
- **Costeo:** vista de análisis que refleja lo guardado, sin exigir otro registro manual.
- **Insumos:** catálogo común de ingredientes, existencias, unidades y costos; no se duplican al crear productos.

El costo visible durante la edición es una estimación con los datos cargados. Al guardar, el backend debe validar y recalcular con los costos vigentes, informando si cambiaron durante la edición.

## Ejemplo ilustrativo

El usuario escribe **Hamburguesa de la casa**, añade pan, carne, queso y los demás insumos con sus cantidades. Mientras lo hace, ve sus subtotales y el costo acumulado. Si el costo calculado fuera $2.00, puede evaluar un precio de $3.50 y ver una diferencia de $1.50 y un margen bruto aproximado de 42.9 % antes de habilitarla.

Son importes ilustrativos, no los costos reales de producción.

## Implicaciones técnicas para una implementación futura

Aunque este documento se guarda en el frontend, el cambio requeriría coordinación con el backend:

- Guardado consistente de producto, receta y estado de borrador.
- Migración de la asociación por nombre a una relación por identificador.
- Actualización de consultas de inventario, Costeo y edición de recetas para usar esa relación.
- Reglas claras para creación, actualización, eliminación y productos incluidos en combos.
- Una transacción que evite guardar un producto habilitado con una receta incompleta por un fallo intermedio.
- Protección frente a doble envío y validación del lado del servidor.
- Conservación de las imágenes existentes cuando no se modifican.

## Criterios para evaluar la idea

- Se puede completar un producto sin saltar entre tres secciones.
- El nombre no se vuelve a escribir para crear su receta.
- El costo cambia al modificar ingredientes o cantidades.
- El usuario decide el precio después de ver el costo.
- Un combo reutiliza productos y recetas sin duplicarlos.
- Los cálculos incompletos se muestran claramente.
- Un borrador nunca se vende por accidente.
- Cambiar el nombre no desconecta la receta.
- Las vistas especializadas muestran los mismos datos guardados.

## Decisiones pendientes

- Asistente por pasos o formulario con secciones desplegables.
- Qué campos son obligatorios al habilitar la venta.
- Si guardar borradores en servidor o mantener una edición temporal hasta confirmar.
- Cómo tratar productos legítimos que no consumen inventario.
- Cómo presentar comisiones y precios sugeridos sin sobrecargar el flujo.
- Cómo migrar recetas existentes y resolver nombres duplicados o huérfanos.

## Alcance de este trabajo

Solo documentar la idea. No cambiar pantallas, endpoints, datos ni comportamiento de producción todavía.
