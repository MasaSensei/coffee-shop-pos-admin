import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite"; // Import plugin v4

export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(), // Tambahkan ini di sini
  ],
  server: {
    port: 5174,
    strictPort: true,
  },
});
