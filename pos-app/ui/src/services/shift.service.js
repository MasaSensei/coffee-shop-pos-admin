import { api } from "./api"; // Pastikan path import sesuai dengan struktur folder kamu

export const shiftService = {
  /**
   * Mengambil data shift yang sedang aktif untuk user tertentu
   * Digunakan untuk pengecekan saat aplikasi pertama kali dibuka
   */
  checkActive: (userId) => api.get(`/shifts/active?user_id=${userId}`),

  /**
   * Membuka shift baru (Open Shift)
   * data: { user_id, outlet_id, opening_cash, opened_at }
   */
  open: (data) => api.post(`/shifts/open`, data),

  /**
   * Menutup shift yang sedang berjalan (Close Shift)
   * data: { shift_id, actual_closing_cash, note }
   */
  close: (data) => api.post(`/shifts/close`, data),

  /**
   * Opsional: Mengambil riwayat shift (jika nanti dibutuhkan untuk laporan)
   */
  getHistory: (userId) => api.get(`/shifts/history?user_id=${userId}`),
};
