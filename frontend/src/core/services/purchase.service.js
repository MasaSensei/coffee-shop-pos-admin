import { api } from "../api";

export const purchaseService = {
  // Mengambil riwayat PO (untuk tabel utama)
  getAll: async (page = 1, limit = 10) => {
    return await api.get(`/purchasing/orders?page=${page}&limit=${limit}`);
  },

  // Mengambil detail PO berdasarkan ID (jika nanti butuh view detail)
  getById: async (id) => {
    return await api.get(`/purchasing/${id}`);
  },

  // Mengirim data PO baru ke repository Go
  create: async (payload) => {
    // Payload di sini sudah bersih karena sudah diproses di Hook
    return await api.post("/purchasing/orders", payload);
  },

  // Opsional: Update status PO (misal dari PENDING ke RECEIVED)
  updateStatus: async (id, status) => {
    return await api.patch(`/purchasing/${id}/status`, { status });
  },
};
