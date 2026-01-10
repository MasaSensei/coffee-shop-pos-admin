import { useState, useEffect } from "preact/hooks";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../core/schemas/product.schema";
import { productService } from "../core/services/product.service";
import { useCategory } from "./useCategory";
import { toast } from "sonner";

export function useProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { categories } = useCategory();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: "",
      is_active: true,
      variants: [{ name: "REGULAR", price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAll();

      // Sinkronisasi data dari API ke state lokal
      const enriched = res.data.data.map((menu) => ({
        ...menu,
        // Map variant_name dari BE menjadi name untuk FE
        variants:
          menu.variants?.map((v) => ({
            ...v,
            name: v.variant_name || v.name, // Fallback jika salah satu kosong
          })) || [],
        min_price: menu.variants?.length
          ? Math.min(...menu.variants.map((v) => v.price))
          : 0,
      }));
      setProducts(enriched);
    } catch (err) {
      toast.error("Gagal sinkronisasi menu");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || "",
        category_id: parseInt(data.category_id),
        is_active: data.is_active ? 1 : 0,
        // Kirim ke BE dengan key variant_name
        variants: data.variants.map((v) => ({
          variant_name: v.name,
          price: parseFloat(v.price),
        })),
      };

      if (selectedProduct) {
        await productService.update(selectedProduct.id, payload);
      } else {
        await productService.create(payload);
      }
      toast.success("Katalog diperbarui");
      handleClose();
      fetchProducts();
    } catch (err) {
      toast.error("Gagal menyimpan perubahan");
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);

    // Reset form dengan data produk yang sudah di-map variannya
    reset({
      name: product.name,
      category_id: product.category_id?.toString(),
      is_active: product.is_active === 1 || product.is_active === true,
      // Penting: Pastikan array variants menggunakan key 'name' agar muncul di input
      variants: product.variants?.map((v) => ({
        name: v.variant_name || v.name,
        price: v.price,
      })),
    });

    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await productService.delete(deleteId);
      toast.success("Menu berhasil dihapus dari katalog");
      setDeleteId(null); // Tutup modal
      fetchProducts();
    } catch (err) {
      toast.error("Gagal menghapus menu");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    reset({
      name: "",
      category_id: "",
      is_active: true,
      variants: [{ name: "REGULAR", price: 0 }],
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products: products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ),
    loading,
    search,
    setSearch,
    isModalOpen,
    setIsModalOpen,
    register,
    errors,
    handleSubmit,
    onSubmit,
    handleEdit,
    handleClose,
    variantFields: fields,
    addVariant: () => append({ name: "", price: 0 }),
    removeVariant: (index) => remove(index),
    isActive: watch("is_active"),
    selectedProduct,
    setValue,
    categories,
    confirmDelete,
    deleteId,
    setDeleteId,
    handleDelete: (id) => setDeleteId(id),
  };
}
