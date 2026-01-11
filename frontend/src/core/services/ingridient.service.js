import { api } from "../api";

export const ingredientService = {
  getAll: async (outletId, page = 1, limit = 100) => {
    return await ingredientService.getByOutlet(outletId, page, limit);
  },
  /**
   * Mengambil bahan baku berdasarkan outlet_id
   * Endpoint: GET {{base_url}}/ingredients?outlet_id=1
   */
  getByOutlet: async (outletId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return await api.get("/ingredients", {
      params: {
        outlet_id: outletId,
        limit: limit,
        offset: offset,
      },
    });
  },

  /**
   * Mendaftarkan bahan baku baru
   * Endpoint: POST {{base_url}}/ingredients
   */
  store: async (payload) => {
    // Payload: { outlet_id, name, unit, stock_qty, avg_cost_price }
    return await api.post("/ingredients", payload);
  },
};
