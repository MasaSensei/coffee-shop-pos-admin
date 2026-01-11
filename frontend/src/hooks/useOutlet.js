import { useState, useEffect, useMemo, useCallback } from "preact/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { outletService } from "../core/services/outlet.service";
import { outletSchema } from "../core/schemas/outlet.schema";
import { toast } from "sonner";

export function useOutlet() {
  const [outlets, setOutlets] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal & Submit States
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(outletSchema),
    defaultValues: { name: "", address: "", phone: "" },
  });

  const fetchOutlets = async (page = 1) => {
    try {
      setLoading(true);
      const res = await outletService.getAll(page);
      setMeta(res.data.meta);
      const cleanData = res.data.data.map((item) => ({
        ...item,
        phone: item.phone.Valid ? item.phone.String : "-",
      }));
      setOutlets(cleanData);
    } catch (err) {
      toast.error("Gagal sinkronisasi data outlet");
    } finally {
      setLoading(false);
    }
  };

  // LOGIC SEARCH: Memfilter data secara lokal untuk kecepatan respons
  const filteredOutlets = useMemo(() => {
    const term = search.toLowerCase();
    return outlets.filter(
      (o) =>
        o.name.toLowerCase().includes(term) ||
        o.address.toLowerCase().includes(term)
    );
  }, [search, outlets]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (selectedOutlet) {
        await outletService.update(selectedOutlet.id, data);
        toast.success("Informasi cabang diperbarui!");
      } else {
        await outletService.create(data);
        toast.success("Cabang baru berhasil didaftarkan! ☕");
      }
      handleCloseModal();
      fetchOutlets(1);
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal memproses data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (outlet) => {
    setSelectedOutlet(outlet);
    reset({
      name: outlet.name,
      address: outlet.address,
      phone: outlet.phone === "-" ? "" : outlet.phone,
    });
    setIsAdding(true);
  };

  const handleCloseModal = () => {
    setIsAdding(false);
    setSelectedOutlet(null);
    reset({ name: "", address: "", phone: "" });
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await outletService.delete(deleteId);
      toast.success("Cabang telah dihapus");
      setDeleteId(null);
      fetchOutlets(1);
    } catch (err) {
      toast.error("Gagal menghapus data");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchOutlets(1);
  }, []);

  return {
    outlets: filteredOutlets,
    meta,
    loading,
    search,
    setSearch,
    register,
    handleSubmit,
    onSubmit,
    errors,
    submitting,
    isAdding,
    setIsAdding,
    handleCloseModal,
    handleEdit,
    deleteId,
    setDeleteId,
    confirmDelete,
  };
}

export function useOutletDetail(id) {
  const [data, setData] = useState(null);
  const [metaShifts, setMetaShifts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shiftPage, setShiftPage] = useState(1);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    // Pastikan ID ada dan bukan string kosong
    if (!id) return;

    try {
      setLoading(true);
      const res = await outletService.getDetail(id, shiftPage);

      console.log("Response Raw:", res); // Cek apakah axios merespon

      if (res.data) {
        // Sesuaikan dengan mapping database Go Anda
        setData(res.data.data || res.data);
        setMetaShifts(res.data.meta_shifts || null);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.error || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [id, shiftPage]); // Fungsi hanya berubah jika ID atau Page berubah

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]); // Panggil fungsi saat fungsi berubah

  return { data, metaShifts, loading, error, shiftPage, setShiftPage };
}
