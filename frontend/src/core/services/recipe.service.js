// src/core/services/recipe.service.js
import { api } from "../api";

export const recipeService = {
  // GET /recipes/variant/1
  getByVariant: (variantId) => api.get(`/recipes/variant/${variantId}`),

  // GET /ingredients (Master data bahan baku)
  getIngredients: () => api.get(`/ingredients`),

  // GET /menus/1 (Detail produk & daftar variannya)
  getProductDetail: (productId) => api.get(`/menus/${productId}`),

  // POST /recipes (Mengirim Array untuk di-sync)
  sync: (data) => api.post(`/recipes`, data),
};
