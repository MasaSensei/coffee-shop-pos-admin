import { api } from "../api";

export const ingredientService = {
  /**
   * Mengambil semua bahan baku (biasanya untuk dropdown)
   */
  getAll: async (page = 1, limit = 100) => {
    return await api.get("/ingredients", {
      params: { page, limit },
    });
  },

  /**
   * Mengambil bahan baku berdasarkan outlet_id dengan pagination
   */
  getByOutlet: async (outletId, page = 1, limit = 10) => {
    return await api.get("/ingredients", {
      params: {
        outlet_id: outletId,
        page: page,
        limit: limit,
      },
    });
  },

  /**
   * Mendaftarkan bahan baku baru
   */
  store: async (payload) => {
    return await api.post("/ingredients", payload);
  },

  /**
   * Mengambil riwayat stok GLOBAL (Semua bahan)
   * Digunakan di halaman /stock-history
   */
  getAllHistory: async (page = 1, limit = 10) => {
    return await api.get("/ingredients/history", {
      params: { page, limit },
    });
  },

  /**
   * Mengambil riwayat stok spesifik per Bahan
   * Digunakan di Modal Detail Bahan
   */
  getHistoryByIngredient: async (id) => {
    return await api.get(`/ingredients/${id}/history`);
  },

  /**
   * Melakukan penyesuaian stok manual (ADJUST, WASTE, dll)
   */
  adjustStock: async (payload) => {
    // payload: { ingredient_id, quantity, type }
    return await api.post("/ingredients/adjust", payload);
  },
};
