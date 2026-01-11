import { useState, useEffect } from "preact/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ingredientSchema } from "../core/schemas/ingredients.schema";
import { ingredientService } from "../core/services/ingridient.service"; // Pastikan typo ingridient/ingredient konsisten
import { useApp } from "../core/context/AppContext";
import { toast } from "sonner";

export function useIngredient() {
  const { activeOutletId } = useApp();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Inisialisasi React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: "",
      unit: "",
      min_stock: 0,
      stock_qty: 0,
      avg_cost_price: 0,
    },
  });

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const response = await ingredientService.getByOutlet(activeOutletId);
      setIngredients(response.data.data || []);
    } catch (err) {
      toast.error("Gagal sinkronisasi data bahan baku");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeOutletId) loadIngredients();
  }, [activeOutletId]);

  // 2. Fungsi Submit yang akan dipanggil oleh form.onSubmit
  const onSubmit = async (data) => {
    try {
      const payload = {
        outlet_id: parseInt(activeOutletId),
        name: data.name,
        unit: data.unit,
        min_stock: Number(data.min_stock || 0),
        stock_qty: Number(data.stock_qty || 0),
        avg_cost_price: Number(data.avg_cost_price || 0),
      };

      await ingredientService.store(payload);
      toast.success("Bahan baku berhasil disimpan!");
      setIsModalOpen(false); // Tutup modal setelah sukses
      reset(); // Reset form
      loadIngredients(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menyimpan");
    }
  };

  // 3. Kembalikan objek 'form' agar UI tidak error
  return {
    ingredients,
    loading,
    isModalOpen,
    setIsModalOpen,
    form: {
      // Modifikasi register agar menangani angka dengan benar
      register: (name, options) => {
        // Jika field adalah salah satu dari field angka, tambahkan valueAsNumber
        const numberFields = ["min_stock", "stock_qty", "avg_cost_price"];
        if (numberFields.includes(name)) {
          return register(name, { ...options, valueAsNumber: true });
        }
        return register(name, options);
      },
      errors,
      onSubmit: handleSubmit(onSubmit), // Ini yang dicari oleh index.jsx
      isLoading: isSubmitting,
    },
  };
}
