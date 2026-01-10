import { api } from "../api";

export const staffService = {
  getAll: () => api.get(`/users`),
  create: (data) => api.post(`/users/register`, data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};
