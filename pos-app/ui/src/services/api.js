import axios from "axios";

// Buat instance axios agar tidak perlu menulis URL berulang-ulang
export const api = axios.create({
  baseURL: "http://127.0.0.1:3000/api/v1", // Karena kita pakai proxy di vite.config.js
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan Token secara otomatis ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error secara global (misal token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized, redirecting to login...");
      localStorage.removeItem("token");
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
