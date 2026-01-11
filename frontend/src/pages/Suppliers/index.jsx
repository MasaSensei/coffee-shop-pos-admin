import { useMemo } from "preact/hooks";
import { useSupplier } from "../../hooks/useSupplier";
import { DataTable } from "../../components/shared/DataTable";
import { Modal } from "../../components/shared/Modal";
import { DynamicForm } from "../../components/shared/DynamicForm";
import {
  Truck,
  Trash2,
  Edit3,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  MapPin,
  Phone,
  User,
} from "lucide-preact";
import { PageHeader } from "../../components/shared/PageHeader";

const FORM_FIELDS = [
  {
    name: "name",
    label: "Nama Perusahaan",
    placeholder: "CONTOH: PT. BIJI KOPI MAKMUR",
  },
  {
    name: "contact_person",
    label: "Nama Kontak Person",
    placeholder: "NAMA PENANGGUNG JAWAB...",
  },
  {
    name: "phone",
    label: "Nomor Telepon / WA",
    placeholder: "0812XXXXXX",
  },
  {
    name: "address",
    label: "Alamat Kantor",
    placeholder: "JL. INDUSTRI NO. 45...",
  },
];

export function Suppliers() {
  const {
    suppliers,
    loading,
    search,
    setSearch,
    isModalOpen,
    setIsModalOpen,
    openAddModal, // Fungsi khusus untuk reset & buka modal add
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    onEdit,
    onDelete,
    handleDelete,
    selectedSupplier,
    formProps,
    meta,
    setPage,
  } = useSupplier();

  const columns = useMemo(
    () => [
      {
        header: "Supplier",
        render: (row) => (
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm border border-amber-100/50">
              <Truck size={18} />
            </div>
            <div>
              <p className="font-black text-stone-900 uppercase tracking-tight group-hover:text-amber-700 transition-colors italic">
                {row.name}
              </p>
              <p className="text-[8px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                REF: SUP-{row.id?.toString().padStart(4, "0")}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Kontak Person",
        render: (row) => (
          <div className="flex items-center gap-2 text-stone-600 font-bold text-[11px] uppercase italic">
            <User size={14} className="min-w-[14px] text-stone-300" />
            <span>{row.contact_person}</span>
          </div>
        ),
      },
      {
        header: "Info Kontak",
        render: (row) => (
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px]">
              <Phone size={12} />
              {row.phone}
            </div>
            <div className="flex items-center gap-2 text-stone-300 text-[9px] uppercase font-bold tracking-tight">
              <MapPin size={10} />
              <span className="truncate max-w-[150px]">{row.address}</span>
            </div>
          </div>
        ),
      },
      {
        header: "Aksi",
        className: "text-right",
        render: (row) => (
          <div className="flex justify-end items-center gap-1">
            <button
              onClick={() => onEdit(row)}
              className="p-2 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
              title="Edit Supplier"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onDelete(row)}
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Hapus Supplier"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 px-2">
      <PageHeader
        title="Supplier"
        badge="Vendor"
        subtitle="Supply Chain & Partner Management"
        icon={Truck}
        buttonLabel="Tambah Supplier"
        onButtonClick={openAddModal} // MEMANGGIL FUNGSI RESET
      />

      {/* Search Bar */}
      <div className="relative max-w-md group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-amber-600 transition-colors"
          size={20}
        />
        <input
          type="text"
          value={search}
          onInput={(e) => setSearch(e.target.value)}
          placeholder="CARI SUPPLIER ATAU KONTAK..."
          className="w-full pl-14 pr-12 py-4 bg-white border-2 border-stone-100 rounded-2xl outline-none font-bold text-stone-700 focus:border-amber-600 transition-all shadow-sm uppercase text-xs tracking-wider"
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

      {/* Data Table */}
      <div className="bg-white border-2 border-stone-100 rounded-[32px] overflow-hidden shadow-sm">
        <DataTable columns={columns} data={suppliers} loading={loading} />
      </div>

      {/* Pagination */}
      {meta && meta.total_page > 1 && (
        <div className="flex justify-between items-center px-4 py-2">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
            Halaman {meta.current_page} / {meta.total_page}
          </p>
          <div className="flex gap-2">
            <button
              disabled={meta.current_page === 1}
              onClick={() => setPage(meta.current_page - 1)}
              className="p-2.5 rounded-xl border-2 border-stone-100 text-stone-400 disabled:opacity-20 hover:border-amber-600 hover:text-amber-600 transition-all bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={meta.current_page === meta.total_page}
              onClick={() => setPage(meta.current_page + 1)}
              className="p-2.5 rounded-xl border-2 border-stone-100 text-stone-400 disabled:opacity-20 hover:border-amber-600 hover:text-amber-600 transition-all bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL FORM (ADD/EDIT) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedSupplier ? "Perbarui Data Vendor" : "Registrasi Partner Baru"
        }
      >
        <DynamicForm
          {...formProps}
          fields={FORM_FIELDS}
          buttonLabel={
            selectedSupplier ? "Update Supplier" : "Simpan Data Vendor"
          }
        />
      </Modal>

      {/* MODAL DELETE CONFIRMATION */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !formProps.isLoading && setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <div className="text-center p-4">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertTriangle size={40} />
          </div>
          <h3 className="font-black text-stone-900 uppercase mb-2 italic">
            Hapus Partner Supplier?
          </h3>
          <p className="text-[11px] font-bold text-stone-500 uppercase mb-8 leading-relaxed tracking-wide px-4">
            Data{" "}
            <span className="text-stone-900 underline">
              {selectedSupplier?.name}
            </span>{" "}
            akan dihapus permanen.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDelete}
              disabled={formProps.isLoading}
              className="py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 shadow-lg"
            >
              {formProps.isLoading ? "MENGHAPUS..." : "Ya, Hapus"}
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="py-4 bg-stone-100 text-stone-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-200 transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
