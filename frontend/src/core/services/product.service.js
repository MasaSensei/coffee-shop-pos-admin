import { api } from "../api";

export const productService = {
  getAll: (page = 1) => api.get(`/menus?page=${page}`),
  create: (data) => api.post("/menus", data),
  update: (id, data) => api.put(`/menus/${id}`, data),
  getCategories: () => api.get("/categories"),
};
