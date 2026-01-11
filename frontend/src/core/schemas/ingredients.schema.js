import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Nama bahan wajib diisi"),
  unit: z.string().min(1, "Satuan wajib diisi (Gram, Liter, Pcs, dll)"),
  // min_stock untuk alert jika bahan hampir habis
  min_stock: z
    .number({ invalid_type_error: "Harus angka" })
    .min(0, "Minimal 0"),
});
