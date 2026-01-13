import { api } from "./api";

export const productService = {
  getAll: (page = 1) => api.get(`/menus?page=${page}`),
};
