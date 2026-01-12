// src/schemas/recipeSchema.js
import { z } from "zod";

export const recipeItemSchema = z.object({
  menu_variant_id: z.number(),
  ingredient_id: z.number({ required_error: "Bahan harus dipilih" }),
  quantity_needed: z.number().min(0.01, "Jumlah harus lebih dari 0"),
});

export const recipeBatchSchema = z.array(recipeItemSchema);
