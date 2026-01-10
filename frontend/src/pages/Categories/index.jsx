import { Tag, AlertCircle, Edit3, Trash2 } from "lucide-preact";
import { DataTable } from "../../components/shared/DataTable";
import { Modal } from "../../components/shared/Modal";
import { useCategory } from "../../hooks/useCategory";
import { PageHeader } from "../../components/shared/PageHeader";

export function Categories() {
  const {
    categories,
    loading,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    selectedCategory,
    handleEdit,
    handleDelete,
    handleSubmit,
    deleteId,
    setDeleteId,
    confirmDelete,
  } = useCategory();

  const columns = [
    {
      header: "Nama Kategori",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-coffee-800 shadow-inner">
            <Tag size={20} />
          </div>
          <div>
            <p className="font-black text-stone-900 uppercase tracking-tight">
              {row.name}
            </p>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              ID: #{row.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Kapasitas Menu",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 bg-amber-50 text-amber-700 text-[10px] font-black rounded-xl border border-amber-100">
            {row.total_menus || 0} ITEMS
          </span>
          {row.total_menus > 0 ? (
            <div className="flex -space-x-2">
              {[...Array(Math.min(row.total_menus, 3))].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white bg-stone-200"
                />
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-stone-400 font-bold uppercase italic">
              Kosong
            </p>
          )}
        </div>
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
            onClick={() => setDeleteId(row.id)} // Ganti handleDelete menjadi setDeleteId
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
      {/* Header Section */}
      <PageHeader
        title="Grouping"
        badge="Master"
        subtitle="Kelola departemen produk BrewFlow"
        icon={Tag}
        buttonLabel="Kategori Baru"
        onButtonClick={() => setIsModalOpen(true)}
      />

      {/* Table Section */}
      <DataTable columns={columns} data={categories} loading={loading} />

      {/* Modal Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? "Ubah Nama Group" : "Buat Group Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-8 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-2">
                Nama Kategori
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onInput={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-8 py-5 bg-stone-50 border-2 border-stone-100 rounded-[28px] text-sm font-black outline-none focus:bg-white focus:border-coffee-800 transition-all placeholder:text-stone-300"
                placeholder="CONTOH: SIGNATURE COFFEE"
              />
            </div>

            <div className="p-6 bg-amber-50 rounded-[28px] border border-amber-100">
              <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                <span className="block mb-1">💡 TIPS KANTOR:</span>
                Gunakan nama kategori yang singkat dan jelas agar mudah dibaca
                oleh Barista pada layar POS kasir.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-5 bg-stone-100 text-stone-500 rounded-[28px] font-black uppercase tracking-widest text-[10px] hover:bg-stone-200 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] py-5 bg-coffee-900 text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-coffee-900/20 hover:bg-black transition-all"
            >
              {selectedCategory ? "Simpan Perubahan" : "Konfirmasi Kategori"}
            </button>
          </div>
        </form>
      </Modal>
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
              Hapus Kategori?
            </h3>
            <p className="text-xs font-bold text-stone-500 leading-relaxed px-4">
              Menu di dalam kategori ini mungkin akan kehilangan relasi.
              Tindakan ini tidak dapat dibatalkan.
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
