import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, "Nama supplier wajib diisi"),
  contact_person: z.string().min(1, "Nama kontak person wajib diisi"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon terlalu panjang"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
});
