import { useMemo } from "preact/hooks";
import { useIngredient } from "../../hooks/useIngredient";
import { DataTable } from "../../components/shared/DataTable";
import { Modal } from "../../components/shared/Modal";
import { DynamicForm } from "../../components/shared/DynamicForm";
import { PageHeader } from "../../components/shared/PageHeader";
import { OutletSwitcher } from "../../components/shared/OutletSwitcher";
import {
  FlaskConical,
  Search,
  X,
  Edit3,
  Trash2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-preact";

const FORM_FIELDS = [
  {
    name: "name",
    label: "Nama Bahan Baku",
    placeholder: "CONTOH: BIJI KOPI ARABIKA",
  },
  { name: "unit", label: "Satuan", placeholder: "GRAM / ML / PCS" },
  {
    name: "min_stock",
    label: "Stok Minimum",
    placeholder: "0",
    type: "number",
  },
];

export function Ingredients() {
  const {
    ingredients,
    loading,
    isModalOpen,
    setIsModalOpen,
    form,
    search,
    setSearch,
    meta,
    setPage,
    handleEdit,
    deleteId,
    setDeleteId,
    confirmDelete,
  } = useIngredient();

  const columns = useMemo(
    () => [
      {
        header: "Bahan Baku",
        render: (row) => (
          <div className="flex items-center gap-4 group">
            <div className="p-2.5 bg-stone-100 text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all rounded-xl shadow-sm">
              <FlaskConical size={18} />
            </div>
            <div>
              <p className="font-black text-stone-900 uppercase tracking-tight italic text-xs">
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
        header: "Stok",
        render: (row) => (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono font-bold text-sm ${
                  row.stock_qty <= row.min_stock
                    ? "text-red-500"
                    : "text-stone-900"
                }`}
              >
                {row.stock_qty.toLocaleString()}
              </span>
              <span className="text-[9px] font-black text-stone-400 uppercase italic">
                {row.unit}
              </span>
            </div>
            {row.stock_qty <= row.min_stock && (
              <span className="text-[8px] font-black text-red-400 uppercase tracking-tighter flex items-center gap-1 animate-pulse">
                <AlertCircle size={10} /> Low Stock
              </span>
            )}
          </div>
        ),
      },
      {
        header: "Avg Cost",
        render: (row) => (
          <div className="flex items-center gap-2 text-amber-600 font-mono font-bold text-[11px]">
            <TrendingUp size={14} className="text-amber-400" />
            Rp {row.avg_cost_price?.toLocaleString()}
          </div>
        ),
      },
      {
        header: "Aksi",
        className: "text-right",
        render: (row) => (
          <div className="flex justify-end items-center gap-1">
            <button
              onClick={() => handleEdit(row)}
              className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => setDeleteId(row.id)}
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 px-2 pb-20">
      {/* 1. TOP HEADER: Title & Primary Action Only */}
      <PageHeader
        title="Bahan Baku"
        badge="Inventory"
        subtitle="Master data stok dan harga rata-rata (MAC)"
        icon={FlaskConical}
        buttonLabel="Tambah Bahan"
        onButtonClick={() => setIsModalOpen(true)}
      />

      {/* 2. CONTROL BAR: Search & Outlet Switcher on the same row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors"
            size={18}
          />
          <input
            type="text"
            value={search}
            onInput={(e) => setSearch(e.target.value)}
            placeholder="CARI NAMA BAHAN..."
            className="w-full pl-14 pr-12 py-3.5 bg-white border-2 border-stone-100 rounded-2xl outline-none font-bold text-stone-700 focus:border-stone-900 transition-all shadow-sm uppercase text-[10px] tracking-widest"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Outlet Switcher: Di sebelah search */}
        <div className="lg:min-w-[280px]">
          <OutletSwitcher />
        </div>
      </div>

      {/* 3. DATA TABLE */}
      <div className="bg-white border-2 border-stone-100 rounded-[32px] overflow-hidden shadow-sm">
        <DataTable columns={columns} data={ingredients} loading={loading} />
      </div>

      {/* 4. PAGINATION */}
      {meta && meta.total_page > 1 && (
        <div className="flex justify-between items-center px-4">
          <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] italic">
            Page {meta.current_page} of {meta.total_page}
          </p>
          <div className="flex gap-2">
            <button
              disabled={meta.current_page === 1}
              onClick={() => setPage(meta.current_page - 1)}
              className="p-2 rounded-xl border-2 border-stone-100 text-stone-400 disabled:opacity-20 hover:border-stone-900 hover:text-stone-900 transition-all bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={meta.current_page === meta.total_page}
              onClick={() => setPage(meta.current_page + 1)}
              className="p-2 rounded-xl border-2 border-stone-100 text-stone-400 disabled:opacity-20 hover:border-stone-900 hover:text-stone-900 transition-all bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ingredient Configuration"
      >
        <DynamicForm
          fields={FORM_FIELDS}
          buttonLabel="Simpan Data Bahan"
          onSubmit={form.onSubmit}
          register={form.register}
          errors={form.errors}
          isLoading={form.isLoading}
        />
      </Modal>
    </div>
  );
}
