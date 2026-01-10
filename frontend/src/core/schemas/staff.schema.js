// core/validation/staff.schema.js
import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(3, "NAMA MINIMAL 3 KARAKTER"),
  username: z.string().min(4, "USERNAME MINIMAL 4 KARAKTER"),
  password: z
    .string()
    .min(6, "PASSWORD MINIMAL 6 KARAKTER")
    .optional()
    .or(z.literal("")),
  role: z.enum(["Admin", "Manager", "Barista", "Cashier"], {
    errorMap: () => ({ message: "PILIH ROLE YANG VALID" }),
  }),
  outlet_id: z.string().min(1, "PILIH OUTLET PENEMPATAN"),
});
