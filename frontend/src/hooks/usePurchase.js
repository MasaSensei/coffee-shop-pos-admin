import { useState, useEffect } from "preact/hooks";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema } from "../core/schemas/purchase.schema";
import { purchaseService } from "../core/services/purchase.service";
import { supplierService } from "../core/services/supplier.service";
import { ingredientService } from "../core/services/ingridient.service";
import { useApp } from "../core/context/AppContext"; // 1. Ambil context outlet
import { toast } from "sonner";

export function usePurchase() {
  const { activeOutletId } = useApp(); // 2. Gunakan activeOutletId
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplier_id: "",
      status: "RECEIVED",
      items: [{ ingredient_id: "", qty_received: 1, cost_per_unit: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = useWatch({ control, name: "items" });

  const totalCost =
    watchedItems?.reduce(
      (acc, item) =>
        acc + Number(item.qty_received || 0) * Number(item.cost_per_unit || 0),
      0
    ) || 0;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, sRes, iRes] = await Promise.all([
        purchaseService.getAll(),
        supplierService.getAll(1, 100), // 3. Beri limit yang jelas
        // 4. Kirim activeOutletId agar Go FetchByOutlet bekerja
        // Jika null/0, Go akan FetchAll (sudah kita handle di Backend)
        ingredientService.getAll(0, 100),
      ]);

      setOrders(pRes.data.data || []);
      setSuppliers(sRes.data.data || []);
      setIngredients(iRes.data.data || []);
    } catch (err) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // 5. Trigger fetch saat outlet berubah atau komponen mount
  useEffect(() => {
    fetchData();
  }, [activeOutletId]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        // 6. Pastikan PO mencatat outlet_id mana yang menerima barang
        outlet_id: parseInt(activeOutletId),
        supplier_id: parseInt(data.supplier_id),
        total_cost: totalCost,
        items: data.items.map((item) => ({
          ...item,
          ingredient_id: parseInt(item.ingredient_id),
          subtotal: Number(item.qty_received) * Number(item.cost_per_unit),
        })),
      };

      await purchaseService.create(payload);
      toast.success("Purchase Order berhasil diproses");
      setIsModalOpen(false);
      reset();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menyimpan PO");
    }
  };

  return {
    orders,
    loading,
    suppliers,
    ingredients,
    isModalOpen,
    totalCost,
    setIsModalOpen: (val) => {
      if (!val) reset();
      setIsModalOpen(val);
    },
    form: {
      register,
      fields,
      append,
      remove,
      errors,
      onSubmit: handleSubmit(onSubmit),
      isLoading: isSubmitting,
    },
  };
}
