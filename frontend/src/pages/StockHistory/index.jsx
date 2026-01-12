import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCcw,
  Trash2,
  Package,
  Calendar,
  Hash,
} from "lucide-preact";
import { DataTable } from "../../components/shared/DataTable";
import { PageHeader } from "../../components/shared/PageHeader";
import { useStockHistory } from "../../hooks/useStockHistory";

export function StockHistory() {
  const { logs, loading, pagination, setPagination, meta } = useStockHistory();

  // Mapping gaya Badge berdasarkan tipe mutasi
  const typeConfig = {
    PURCHASE: {
      label: "Masuk",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: ArrowUpRight,
    },
    SALE: {
      label: "Keluar",
      color: "bg-blue-50 text-blue-600 border-blue-100",
      icon: ArrowDownLeft,
    },
    WASTE: {
      label: "Dibuang",
      color: "bg-red-50 text-red-600 border-red-100",
      icon: Trash2,
    },
    ADJUST: {
      label: "Koreksi",
      color: "bg-amber-50 text-amber-600 border-amber-100",
      icon: RefreshCcw,
    },
  };

  const columns = [
    {
      header: "Waktu & Log",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-white transition-colors">
            <Calendar size={18} />
          </div>
          <div className="flex flex-col">
            <p className="font-black text-stone-900 uppercase tracking-tight leading-none">
              {new Date(row.created_at).toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <span className="text-[10px] font-bold text-stone-400 mt-1 uppercase italic">
              Pukul{" "}
              {new Date(row.created_at).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Bahan Baku",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Package size={14} />
          </div>
          <span className="font-black text-stone-800 uppercase italic tracking-tighter text-sm">
            {row.ingredient_name}
          </span>
        </div>
      ),
    },
    {
      header: "Aksi Mutasi",
      render: (row) => {
        const config = typeConfig[row.type] || typeConfig.ADJUST;
        return (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${config.color}`}
          >
            <config.icon size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      header: "Reference",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-stone-400">
          <Hash size={12} />
          <span className="text-[11px] font-black font-mono">
            {row.reference_id || "MANUAL"}
          </span>
        </div>
      ),
    },
    {
      header: "Perubahan",
      className: "text-right",
      render: (row) => (
        <div className="flex flex-col items-end px-4">
          <span
            className={`text-base font-black tabular-nums ${
              row.quantity > 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {row.quantity > 0 ? "+" : ""}
            {row.quantity.toLocaleString()}
          </span>
          <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest italic">
            Unit Qty
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <PageHeader
        title="Riwayat Stok"
        badge="Audit Log"
        icon={History}
        subtitle="Log mutasi otomatis dari penjualan, pembelian, dan koreksi manual."
      />

      <div className="relative">
        <DataTable columns={columns} data={logs} loading={loading} />

        {/* Pagination minimalis mengikuti gaya brand Anda */}
        <div className="mt-6 flex items-center justify-between px-2">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
            Total Record: {meta.total_data || 0}
          </p>

          <div className="flex gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="px-4 py-2 bg-white border-2 border-stone-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-coffee-800 disabled:opacity-30 transition-all"
            >
              Prev
            </button>
            <div className="px-4 py-2 bg-coffee-900 rounded-xl font-black text-[10px] text-white uppercase tracking-widest">
              Page {pagination.page}
            </div>
            <button
              disabled={logs.length < pagination.limit}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="px-4 py-2 bg-white border-2 border-stone-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-coffee-800 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
