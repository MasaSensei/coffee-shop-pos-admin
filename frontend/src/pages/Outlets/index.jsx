import { useMemo } from "preact/hooks";
import { useOutlet } from "../../hooks/useOutlet";
import { DataTable } from "../../components/shared/DataTable";
import { Modal } from "../../components/shared/Modal";
import { DynamicForm } from "../../components/shared/DynamicForm";
import {
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
  Activity, // Tambahkan ini
} from "lucide-preact";
import { PageHeader } from "../../components/shared/PageHeader";

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

  const columns = useMemo(
    () => [
      {
        header: "Outlet",
        render: (row) => (
          <div
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => (window.location.href = `/outlets/${row.id}`)}
          >
            <div className="p-2.5 bg-stone-100 text-coffee-800 rounded-xl group-hover:bg-coffee-800 group-hover:text-white transition-all shadow-sm">
              <Store size={18} />
            </div>
            <div>
              <p className="font-black text-stone-900 uppercase tracking-tight group-hover:text-coffee-700 transition-colors">
                {row.name}
              </p>
              <p className="text-[8px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                ID: #{row.id}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Lokasi",
        render: (row) => (
          <div className="flex items-center gap-2 text-stone-500 font-bold text-[11px] uppercase italic">
            <MapPin size={14} className="min-w-[14px] text-stone-300" />
            <span className="truncate max-w-[180px]">{row.address}</span>
          </div>
        ),
      },
      {
        header: "Kontak",
        render: (row) => (
          <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px]">
            <Phone size={14} />
            {/* Handle SQL NullString dari Go */}
            {row.phone?.Valid ? row.phone.String : "---"}
          </div>
        ),
      },
      {
        header: "Status",
        render: (row) => (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                row.is_active
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "bg-red-400"
              }`}
            />
            <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
              {row.is_active ? "Aktif" : "Non-Aktif"}
            </span>
          </div>
        ),
      },
      {
        header: "Aksi",
        className: "text-right",
        render: (row) => (
          <div className="flex justify-end items-center gap-3">
            {/* Tombol Audit/Detail Utama */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/outlets/${row.id}`;
              }}
              className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-900 rounded-xl hover:bg-coffee-900 hover:text-white transition-all group/mon border border-amber-100/50"
            >
              <Activity size={14} className="group-hover/mon:animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Audit
              </span>
            </button>

            {/* Tombol Mini Aksi */}
            <div className="flex gap-1 border-l border-stone-100 pl-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(row);
                }}
                className="p-2 text-stone-400 hover:text-coffee-700 hover:bg-stone-100 rounded-lg transition-all"
                title="Edit Cabang"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(row.id);
                }}
                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Hapus Cabang"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ),
      },
    ],
    [handleEdit, setDeleteId]
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 px-2">
      <PageHeader
        title="Outlet"
        badge="Center"
        subtitle="Operations & Branch Management"
        icon={Store}
        buttonLabel="Tambah Cabang"
        onButtonClick={() => setIsAdding(true)}
      />

      <div className="relative max-w-md group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-coffee-800 transition-colors"
          size={20}
        />
        <input
          type="text"
          value={search}
          onInput={(e) => setSearch(e.target.value)}
          placeholder="CARI NAMA ATAU ALAMAT..."
          className="w-full pl-14 pr-12 py-4 bg-white border-2 border-stone-100 rounded-2xl outline-none font-bold text-stone-700 focus:border-coffee-800 transition-all shadow-sm uppercase text-xs tracking-wider"
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

      <div className="bg-white border-2 border-stone-100 rounded-[32px] overflow-hidden shadow-sm">
        <DataTable columns={columns} data={outlets} loading={loading} />
      </div>

      {meta && meta.total_page > 1 && (
        <div className="flex justify-between items-center px-4 py-2">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
            Halaman {meta.current_page} / {meta.total_page}
          </p>
          <div className="flex gap-2">
            <button
              disabled={meta.current_page === 1}
              onClick={() => setPage(meta.current_page - 1)}
              className="p-2.5 rounded-xl border-2 border-stone-100 text-stone-400 disabled:opacity-20 hover:border-coffee-800 hover:text-coffee-800 transition-all bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={meta.current_page === meta.total_page}
              onClick={() => setPage(meta.current_page + 1)}
              className="p-2.5 rounded-xl border-2 border-stone-100 text-stone-400 disabled:opacity-20 hover:border-coffee-800 hover:text-coffee-800 transition-all bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isAdding}
        onClose={handleCloseModal}
        title={deleteId ? "Edit Konfigurasi Cabang" : "Registrasi Cabang Baru"}
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

      <Modal
        isOpen={deleteId !== null}
        onClose={() => !submitting && setDeleteId(null)}
        title="Konfirmasi Hapus"
      >
        <div className="text-center p-4">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertTriangle size={40} />
          </div>
          <h3 className="font-black text-stone-900 uppercase mb-2">
            Hapus Data Outlet?
          </h3>
          <p className="text-[11px] font-bold text-stone-500 uppercase mb-8 leading-relaxed tracking-wide px-4">
            Akses ke outlet ini akan ditutup dan riwayat transaksi mungkin
            terpengaruh.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-200"
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
