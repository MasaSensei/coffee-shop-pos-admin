import {
  Search,
  Coffee,
  Edit3,
  Trash2,
  Tag,
  Banknote,
  Trash,
  ChevronDown,
} from "lucide-preact";
import { DataTable } from "../../components/shared/DataTable";
import { Modal } from "../../components/shared/Modal";
import { PageHeader } from "../../components/shared/PageHeader";
import { useProduct } from "../../hooks/useProduct";

export function Products() {
  const {
    products,
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
    handleDelete,
    handleClose,
    variantFields,
    addVariant,
    removeVariant,
    isActive,
    selectedProduct,
    setValue,
    categories,
    deleteId,
    confirmDelete,
    setDeleteId,
  } = useProduct();

  const columns = [
    {
      header: "Menu & Kategori",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-coffee-800 shadow-inner group-hover:bg-coffee-50 transition-colors">
            <Coffee size={20} />
          </div>
          <div className="flex flex-col">
            <p className="font-black text-stone-900 uppercase tracking-tight leading-none">
              {row.name}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <Tag size={10} className="text-amber-500" />
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-md">
                {row.category_name || "Tanpa Kategori"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Estimasi Harga",
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-bold text-stone-400">Rp</span>
            <span className="font-black text-stone-900 text-base tabular-nums">
              {row.min_price?.toLocaleString()}
            </span>
          </div>
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">
            Mulai Dari
          </span>
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
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                : "bg-stone-300"
            }`}
          />
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${
              row.is_active ? "text-emerald-600" : "text-stone-400"
            }`}
          >
            {row.is_active ? "Active" : "Archived"}
          </span>
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
            onClick={() => handleDelete(row.id)}
            className="p-3 bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-2xl transition-all active:scale-90"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        title="Menu"
        badge="Gallery"
        icon={Coffee}
        buttonLabel="Tambah Menu"
        onButtonClick={() => setIsModalOpen(true)}
      />

      {/* Search Bar */}
      <div className="relative max-w-md group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300"
          size={20}
        />
        <input
          value={search}
          onInput={(e) => setSearch(e.target.value)}
          placeholder="CARI MENU..."
          className="w-full pl-14 pr-12 py-4 bg-white border-2 border-stone-100 rounded-2xl outline-none font-bold placeholder:text-stone-200"
        />
      </div>

      <DataTable columns={columns} data={products} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={selectedProduct ? "Edit Menu" : "Menu Baru"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Row 1: Nama Produk */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
              Nama Produk
            </label>
            <input
              {...register("name")}
              placeholder="CONTOH: AREN LATTE"
              className={`w-full px-6 py-4 bg-stone-50 border-2 rounded-2xl font-bold uppercase outline-none transition-all ${
                errors.name
                  ? "border-red-200"
                  : "border-stone-100 focus:border-coffee-800"
              }`}
            />
            {errors.name && (
              <p className="text-[9px] font-bold text-red-500 uppercase ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Kategori */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                Kategori
              </label>
              <div className="relative">
                <select
                  {...register("category_id")}
                  className="w-full py-4 pl-5 pr-12 bg-stone-50 border-2 border-stone-100 rounded-2xl font-black uppercase text-[11px] appearance-none outline-none focus:border-coffee-800"
                >
                  <option value="">PILIH...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Status Toggle */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                Status Menu
              </label>
              <div className="flex p-1.5 bg-stone-100 rounded-2xl gap-1 h-[54px] items-center">
                <button
                  type="button"
                  onClick={() => setValue("is_active", true)}
                  className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase transition-all ${
                    isActive
                      ? "bg-white shadow-sm text-coffee-900"
                      : "text-stone-400"
                  }`}
                >
                  Aktif
                </button>
                <button
                  type="button"
                  onClick={() => setValue("is_active", false)}
                  className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase transition-all ${
                    !isActive
                      ? "bg-white shadow-md text-red-600"
                      : "text-stone-400"
                  }`}
                >
                  Off
                </button>
              </div>
            </div>
          </div>

          {/* Varian Section */}
          <div className="space-y-4 pt-6 border-t-2 border-dashed border-stone-100">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                Varian & Harga
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="text-[10px] font-black text-coffee-700 bg-coffee-50 px-3 py-1 rounded-lg hover:bg-coffee-900 hover:text-white transition-all"
              >
                + TAMBAH
              </button>
            </div>

            <div className="space-y-3">
              {variantFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-2 group animate-in slide-in-from-top-1"
                >
                  <input
                    {...register(`variants.${index}.name`)}
                    placeholder="UKURAN/SUHU"
                    className="flex-[1.5] px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl text-xs font-bold uppercase outline-none focus:border-coffee-800 focus:bg-white transition-all"
                  />
                  <div className="relative flex-1">
                    <Banknote
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"
                      size={14}
                    />
                    <input
                      type="number"
                      {...register(`variants.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      placeholder="HARGA"
                      className="w-full pl-9 pr-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl text-xs font-bold outline-none focus:border-coffee-800 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-3 text-stone-300 hover:text-red-500 transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-coffee-900 text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-coffee-900/20 disabled:opacity-50"
          >
            {loading
              ? "MENYEDUH..."
              : selectedProduct
              ? "UPDATE MENU"
              : "PUBLISH KE KASIR"}
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Konfirmasi Hapus"
      >
        <div className="flex flex-col items-center text-center py-6 space-y-6">
          {/* Icon Peringatan */}
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 animate-bounce">
            <Trash2 size={40} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black uppercase text-stone-900">
              Hapus Menu Ini?
            </h3>
            <p className="text-sm font-medium text-stone-400 max-w-[240px]">
              Tindakan ini tidak dapat dibatalkan. Menu akan hilang dari list
              kasir.
            </p>
          </div>

          <div className="flex w-full gap-3 pt-4">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-4 bg-stone-100 text-stone-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-stone-200 transition-all"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
