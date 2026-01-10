import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nama menu harus diisi"),
  category_id: z.string().min(1, "Pilih kategori"),
  is_active: z.boolean(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, "Nama varian wajib diisi"),
        price: z.coerce.number().min(500, "Harga minimal Rp 500"),
      })
    )
    .min(1, "Minimal harus ada satu varian harga"),
});
