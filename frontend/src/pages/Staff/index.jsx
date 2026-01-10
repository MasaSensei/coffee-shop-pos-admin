import {
  Users,
  UserPlus,
  Edit3,
  Trash2,
  ShieldCheck,
  MapPin,
  AlertCircle, // Tambahkan ini untuk Modal Delete
} from "lucide-preact";
import { DataTable } from "../../components/shared/DataTable";
import { Modal } from "../../components/shared/Modal";
import { useStaff } from "../../hooks/useStaff";
import { PageHeader } from "../../components/shared/PageHeader"; // Import PageHeader

export function Staff() {
  const {
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
  } = useStaff();

  const columns = [
    {
      header: "Nama & Role",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-coffee-800 shadow-inner font-black">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-black text-stone-900 uppercase tracking-tight">
              {row.name}
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase tracking-widest">
              <ShieldCheck size={12} /> {row.role}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Penempatan",
      render: (row) => (
        <div className="flex items-center gap-2 text-stone-500">
          <MapPin size={14} className="text-coffee-600" />
          <span className="text-[10px] font-black uppercase tracking-widest bg-stone-100 px-3 py-1 rounded-lg">
            ID: #{row.outlet_id}
          </span>
        </div>
      ),
    },
    {
      header: "Username",
      render: (row) => (
        <code className="bg-stone-50 border border-stone-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-stone-600 tracking-wider">
          @{row.username}
        </code>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-widest border ${
            row.is_active
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-red-50 text-red-600 border-red-100"
          }`}
        >
          {row.is_active ? "AKTIF" : "NON-AKTIF"}
        </span>
      ),
    },
    {
      header: "Aksi",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-3 bg-stone-50 hover:bg-amber-100 text-stone-400 hover:text-coffee-900 rounded-2xl transition-all active:scale-90"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-3 bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-2xl transition-all active:scale-90"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Menggunakan PageHeader agar seragam */}
      <PageHeader
        title="Tim Barista"
        badge="Staffing"
        subtitle="Kelola hak akses dan penempatan staff BrewFlow"
        icon={Users}
        buttonLabel="Daftarkan Staff"
        onButtonClick={() => setIsModalOpen(true)}
      />

      <DataTable columns={columns} data={staffs} loading={loading} />

      {/* Modal Form Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={
          selectedStaff ? "Update Informasi Staff" : "Pendaftaran Staff Baru"
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-2">
                Nama Lengkap
              </label>
              <input
                {...register("name")}
                className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-100 rounded-[22px] text-sm font-black outline-none focus:bg-white focus:border-coffee-800 transition-all"
              />
              {errors.name && (
                <p className="text-[9px] text-red-500 font-bold ml-2">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-2">
                Username
              </label>
              <input
                {...register("username")}
                className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-100 rounded-[22px] text-sm font-black outline-none focus:bg-white focus:border-coffee-800 transition-all"
              />
              {errors.username && (
                <p className="text-[9px] text-red-500 font-bold ml-2">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-2">
              Kata Sandi
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder={
                selectedStaff ? "BIARKAN KOSONG JIKA TIDAK DIUBAH" : "******"
              }
              className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-100 rounded-[22px] text-sm font-black outline-none focus:bg-white focus:border-coffee-800 transition-all placeholder:text-[10px] placeholder:tracking-widest"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-2">
                Role Akses
              </label>
              <select
                {...register("role")}
                className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-100 rounded-[22px] text-xs font-black outline-none focus:bg-white focus:border-coffee-800 appearance-none transition-all"
              >
                <option value="Barista">BARISTA</option>
                <option value="Manager">MANAGER</option>
                <option value="Admin">ADMIN</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-2">
                ID Outlet
              </label>
              <input
                {...register("outlet_id")}
                placeholder="ID OUTLET"
                className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-100 rounded-[22px] text-sm font-black outline-none focus:bg-white focus:border-coffee-800 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-coffee-900 text-white rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-coffee-900/20 hover:bg-black transition-all active:scale-[0.98]"
          >
            {selectedStaff ? "Simpan Perubahan" : "Konfirmasi Registrasi"}
          </button>
        </form>
      </Modal>

      {/* Modal Delete Confirmation (Disamakan dengan Category) */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Konfirmasi Hapus"
      >
        <div className="py-6 space-y-6 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle size={40} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">
              Hapus Akun Staff?
            </h3>
            <p className="text-xs font-bold text-stone-500 leading-relaxed px-4">
              Akses login staff ini akan dicabut secara permanen. Tindakan ini
              tidak dapat dibatalkan.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-4 bg-stone-100 text-stone-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-stone-200 transition-all"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
