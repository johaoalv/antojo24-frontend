export const normalizeProductName = (name = "") =>
  name.trim().toLocaleLowerCase("es");

export const buildIngredientsByProduct = (recipes) => {
  if (!recipes || typeof recipes !== "object" || Array.isArray(recipes)) return {};

  return Object.entries(recipes).reduce((result, [productName, ingredients]) => {
    const names = Array.isArray(ingredients)
      ? ingredients
          .map((ingredient) => ingredient?.nombre_insumo?.trim())
          .filter(Boolean)
      : [];

    result[normalizeProductName(productName)] = [...new Set(names)];
    return result;
  }, {});
};

export const getProductIngredients = (product, ingredientsByProduct) =>
  ingredientsByProduct[normalizeProductName(product?.nombre || product?.producto)] || [];
