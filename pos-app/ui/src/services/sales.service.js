import { api } from "./api";

export const salesService = {
  /**
   * Mengirim data transaksi ke backend
   * Endpoint: {{base_url}}/sales/checkout
   */
  create: (data) => api.post("/sales/checkout", data),

  /**
   * Mengambil riwayat transaksi (opsional)
   */
  getAll: () => api.get("/sales"),

  /**
   * Mendapatkan detail transaksi berdasarkan ID
   */
  getById: (id) => api.get(`/sales/${id}`),
};
