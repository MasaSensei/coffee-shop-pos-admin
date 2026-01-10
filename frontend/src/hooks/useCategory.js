// hooks/useCategory.js
import { useState, useEffect } from "preact/hooks";
import { categoryService } from "../core/services/category.service";
import { toast } from "sonner";

export function useCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // State baru untuk konfirmasi delete
  const [deleteId, setDeleteId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAll();
      setCategories(res.data.data || []);
    } catch (err) {
      toast.error("Gagal sinkronisasi data kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  // Fungsi hapus yang dipanggil setelah konfirmasi di modal
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await categoryService.delete(deleteId);
      toast.success("Kategori berhasil dihapus");
      setDeleteId(null); // Tutup konfirmasi
      fetchCategories();
    } catch (err) {
      toast.error("Gagal menghapus kategori");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await categoryService.update(selectedCategory.id, formData);
        toast.success("Kategori diperbarui");
      } else {
        await categoryService.create(formData);
        toast.success("Kategori baru ditambahkan");
      }
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
      fetchCategories();
    } catch (err) {
      toast.error("Gagal menyimpan data kategori");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    isModalOpen,
    setIsModalOpen: (val) => {
      if (!val) {
        setSelectedCategory(null);
        setFormData({ name: "", description: "" });
      }
      setIsModalOpen(val);
    },
    formData,
    setFormData,
    selectedCategory,
    handleEdit,
    // Ekspor state delete baru
    deleteId,
    setDeleteId,
    confirmDelete,
    handleSubmit,
  };
}
