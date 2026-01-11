import { api } from "../api";

export const outletService = {
  getAll: () => api.get("/outlets"),
  create: (data) => api.post("/outlets", data),
  update: (id, data) => api.put(`/outlets/${id}`, data),
  delete: (id) => api.delete(`/outlets/${id}`),
  getDetail: (id, shiftPage = 1) =>
    api.get(`/outlets/${id}?shift_page=${shiftPage}`),
};
