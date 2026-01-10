// hooks/useStaff.js
import { useState, useEffect } from "preact/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffSchema } from "../core/schemas/staff.schema";
import { staffService } from "../core/services/staff.service";
import { toast } from "sonner";

export function useStaff() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: { role: "Barista", outlet_id: "" },
  });

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const res = await staffService.getAll();
      setStaffs(res.data || []);
    } catch (err) {
      toast.error("Gagal mengambil data tim");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, outlet_id: parseInt(data.outlet_id) };
      if (selectedStaff) {
        await staffService.update(selectedStaff.id, payload);
        toast.success("Data staff diperbarui");
      } else {
        await staffService.create(payload);
        toast.success("Barista baru berhasil didaftarkan");
      }
      handleClose();
      fetchStaffs();
    } catch (err) {
      toast.error(err.response?.data?.error || "Terjadi kesalahan");
    }
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    reset({
      name: staff.name,
      username: staff.username,
      role: staff.role,
      outlet_id: staff.outlet_id.toString(),
      password: "", // Kosongkan password saat edit kecuali ingin ganti
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await staffService.delete(deleteId);
      toast.success("Staff telah dihapus");
      setDeleteId(null);
      fetchStaffs();
    } catch (err) {
      toast.error("Gagal menghapus staff");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
    reset();
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  return {
    staffs,
    loading,
    isModalOpen,
    setIsModalOpen,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleEdit,
    deleteId,
    setDeleteId,
    confirmDelete,
    handleClose,
    selectedStaff,
    setValue,
  };
}
