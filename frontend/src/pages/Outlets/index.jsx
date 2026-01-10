import { useMemo } from "preact/hooks"; // Tambahkan useMemo
import { useOutlet } from "../../hooks/useOutlet";
import { DataTable } from "../../components/shared/DataTable";
import { Modal } from "../../components/shared/Modal";
import { DynamicForm } from "../../components/shared/DynamicForm";
import {
  Plus,
  Store,
  Trash2,
  Edit3,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  MapPin,
  Phone,
} from "lucide-preact";
import { PageHeader } from "../../components/shared/PageHeader";

// 1. Pindahkan definisi statis ke luar komponen agar tidak dibuat ulang tiap render
const FORM_FIELDS = [
  {
    name: "name",
    label: "Nama Outlet",
    placeholder: "CONTOH: BREWFLOW JAKARTA",
  },
  {
    name: "address",
    label: "Alamat Lengkap",
    placeholder: "JL. KOPI NO. 123...",
  },
  { name: "phone", label: "Nomor Telepon", placeholder: "0812XXXXXX" },
];

export function Outlets() {
  const {
    outlets,
    loading,
    search,
    setSearch,
    isAdding,
    setIsAdding,
    handleCloseModal,
    handleEdit,
    register,
    handleSubmit,
    onSubmit,
    errors,
    submitting,
    deleteId,
    setDeleteId,
    confirmDelete,
    meta,
    setPage,
  } = useOutlet();

  // 2. Gunakan useMemo untuk Columns agar DataTable tidak lag saat mengetik search
  const columns = useMemo(
    () => [
      {
        header: "Outlet",
        render: (row) => (
          <div
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => console.log("Navigasi ke detail:", row.id)}
          >
            <div className="p-2.5 bg-stone-100 text-coffee-800 rounded-xl group-hover:bg-coffee-800 group-hover:text-white transition-all">
              <Store size={18} />
            </div>
            <span className="font-black text-stone-900 uppercase tracking-tight">
              {row.name}
            </span>
          </div>
        ),
      },
      {
        header: "Lokasi",
        render: (row) => (
          <div className="flex items-center gap-2 text-stone-500 font-bold text-[11px] uppercase italic">
            <MapPin size={14} className="min-w-[14px]" />
            <span className="truncate max-w-[200px]">{row.address}</span>
          </div>
        ),
      },
      {
        header: "Kontak",
        render: (row) => (
          <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px]">
            <Phone size={14} /> {row.phone}
          </div>
        ),
      },
      {
        header: "Aksi",
        className: "text-right",
        render: (row) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
              className="p-2 text-stone-400 hover:text-coffee-700 hover:bg-stone-100 rounded-lg transition-all"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(row.id);
              }}
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, setDeleteId]
  ); // Hanya dibuat ulang jika fungsi aksi berubah

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <PageHeader
        title="Outlet"
        badge="Center"
        subtitle="Operations & Branch Management"
        icon={Store}
        buttonLabel="Tambah Cabang"
        onButtonClick={() => setIsAdding(true)}
      />

      {/* SEARCH BAR */}
      <div className="relative max-w-md group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-coffee-800 transition-colors"
          size={20}
        />
        <input
          type="text"
          value={search}
          onInput={(e) => setSearch(e.target.value)}
          placeholder="CARI CABANG..."
          className="w-full pl-14 pr-12 py-4 bg-white border-2 border-stone-100 rounded-2xl outline-none font-bold text-stone-700 focus:border-coffee-800 transition-all shadow-sm uppercase text-xs"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* TABLE */}
      <DataTable columns={columns} data={outlets} loading={loading} />

      {/* PAGINATION */}
      {meta && meta.total_page > 1 && (
        <div className="flex justify-between items-center px-4">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
            Halaman {meta.current_page} dari {meta.total_page}
          </p>
          <div className="flex gap-2">
            <button
              disabled={meta.current_page === 1}
              onClick={() => setPage(meta.current_page - 1)}
              className="p-2.5 rounded-xl border-2 border-stone-100 text-stone-400 disabled:opacity-30 hover:border-coffee-800 hover:text-coffee-800 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={meta.current_page === meta.total_page}
              onClick={() => setPage(meta.current_page + 1)}
              className="p-2.5 rounded-xl border-2 border-stone-100 text-stone-400 disabled:opacity-30 hover:border-coffee-800 hover:text-coffee-800 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL FORM */}
      <Modal
        isOpen={isAdding}
        onClose={handleCloseModal}
        title={deleteId ? "Edit Cabang" : "Registrasi Cabang"}
      >
        <DynamicForm
          fields={FORM_FIELDS}
          buttonLabel="Simpan Data"
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
          isLoading={submitting}
        />
      </Modal>

      {/* MODAL DELETE */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => !submitting && setDeleteId(null)}
        title="Validasi Hapus"
      >
        <div className="text-center p-4">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} />
          </div>
          <p className="text-sm font-bold text-stone-500 uppercase mb-8 leading-relaxed">
            Hapus cabang ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Ya, Hapus"}
            </button>
            <button
              onClick={() => setDeleteId(null)}
              className="py-4 bg-stone-100 text-stone-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-200"
            >
              Batal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
