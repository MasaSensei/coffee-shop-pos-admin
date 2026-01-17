import { api } from "./api";

export const outletService = {
  getByID: (id) => api.get(`/outlets/${id}`),
};
