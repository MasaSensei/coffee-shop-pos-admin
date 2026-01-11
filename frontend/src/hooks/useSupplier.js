import { useState, useEffect } from "preact/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierService } from "../core/services/supplier.service";
import { supplierSchema } from "../core/schemas/suppliers.schema";
import { toast } from "sonner";

export function useSupplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // State Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contact_person: "",
      phone: "",
      address: "",
    },
  });

  const fetchSuppliers = async (p = 1, q = "") => {
    try {
      setLoading(true);
      const res = await supplierService.getAll(p, q);
      setSuppliers(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      toast.error("Gagal sinkronisasi data");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuppliers(1, search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchSuppliers(page, search);
  }, [page]);

  // FUNGSI UNTUK MODAL TAMBAH (RESET SEMUA)
  const openAddModal = () => {
    setSelectedSupplier(null);
    reset({ name: "", contact_person: "", phone: "", address: "" });
    setIsModalOpen(true);
  };

  const onEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setValue("name", supplier.name);
    setValue("contact_person", supplier.contact_person);
    setValue("phone", supplier.phone);
    setValue("address", supplier.address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
    reset({ name: "", contact_person: "", phone: "", address: "" });
  };

  const onSubmit = async (data) => {
    try {
      if (selectedSupplier) {
        await supplierService.update(selectedSupplier.id, data);
        toast.success("Supplier diperbarui");
      } else {
        await supplierService.create(data);
        toast.success("Supplier ditambahkan");
      }
      closeModal();
      fetchSuppliers(page, search);
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal memproses data");
    }
  };

  const handleDelete = async () => {
    try {
      await supplierService.delete(selectedSupplier.id);
      toast.success("Supplier dihapus");
      setIsDeleteModalOpen(false);
      setSelectedSupplier(null);
      fetchSuppliers(page, search);
    } catch (err) {
      toast.error("Gagal menghapus");
    }
  };

  return {
    suppliers,
    meta,
    loading,
    page,
    setPage,
    search,
    setSearch,
    isModalOpen,
    openAddModal, // Digunakan di tombol Tambah Supplier
    setIsModalOpen: (val) => {
      if (!val) closeModal();
      else setIsModalOpen(true);
    },
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedSupplier,
    onEdit,
    onDelete: (s) => {
      setSelectedSupplier(s);
      setIsDeleteModalOpen(true);
    },
    handleDelete,
    formProps: {
      register,
      errors,
      isLoading: isSubmitting,
      onSubmit: handleSubmit(onSubmit),
    },
  };
}
