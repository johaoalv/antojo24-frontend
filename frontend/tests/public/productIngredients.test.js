import {
  buildIngredientsByProduct,
  getProductIngredients,
  normalizeProductName,
} from "../../src/modules/public/utils/productIngredients";

describe("product ingredients", () => {
  it("normaliza nombres para cruzar productos y recetas", () => {
    expect(normalizeProductName("  Hamburguesa Clásica ")).toBe("hamburguesa clásica");
  });

  it("extrae nombres reales, descarta vacíos y evita duplicados", () => {
    const result = buildIngredientsByProduct({
      "Hamburguesa Clásica": [
        { nombre_insumo: "Pan brioche" },
        { nombre_insumo: " Carne " },
        { nombre_insumo: "Carne" },
        { nombre_insumo: "" },
      ],
    });

    expect(result["hamburguesa clásica"]).toEqual(["Pan brioche", "Carne"]);
  });

  it("encuentra ingredientes sin depender de mayúsculas o espacios", () => {
    const recipes = buildIngredientsByProduct({
      "Hot Dog": [{ nombre_insumo: "Salchicha" }],
    });

    expect(getProductIngredients({ nombre: " hot dog " }, recipes)).toEqual(["Salchicha"]);
    expect(getProductIngredients({ nombre: "Soda" }, recipes)).toEqual([]);
  });
});
