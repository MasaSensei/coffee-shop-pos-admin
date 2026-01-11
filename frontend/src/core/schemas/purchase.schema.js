import { z } from "zod";

export const purchaseSchema = z.object({
  supplier_id: z.string().min(1, "Pilih supplier"),
  status: z.enum(["PENDING", "RECEIVED", "CANCELLED"]).default("RECEIVED"),
  items: z
    .array(
      z.object({
        ingredient_id: z.string().min(1, "Pilih bahan baku"),
        qty_received: z.number().min(0.01, "Qty minimal 0.01"),
        cost_per_unit: z.number().min(1, "Harga minimal Rp 1"),
        subtotal: z.number().default(0),
      })
    )
    .min(1, "Minimal harus ada 1 item"),
  total_cost: z.number().default(0),
});
