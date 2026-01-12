import { useState } from "preact/hooks";
import {
  ShoppingBag,
  Plus,
  Trash2,
  Package,
  Calculator,
  ChevronDown,
  Calendar,
  Truck,
  Hash,
  ArrowRight,
  CheckCircle2,
} from "lucide-preact";
import { DataTable } from "../../components/shared/DataTable";
import { Modal } from "../../components/shared/Modal";
import { PageHeader } from "../../components/shared/PageHeader";
import { usePurchase } from "../../hooks/usePurchase";

export function Purchases() {
  const {
    orders,
    loading,
    suppliers,
    ingredients,
    isModalOpen,
    setIsModalOpen,
    totalCost,
    form,
  } = usePurchase();

  // 1. RENDERER UNTUK DETAIL EXPAND (TAMPILAN SAAT KLIK CHEVRON)
  // 1. RENDERER UNTUK DETAIL EXPAND (DESAIN STRUK DIGITAL)
  const renderPurchaseDetails = (order) => (
    <div className="px-6 py-8 bg-stone-100/50 animate-in fade-in zoom-in-95 duration-300">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-0 bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200 relative">
        {/* Dekorasi Guntingan Struk di Atas (Garis Putus-putus) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[radial-gradient(circle,_#e5e7eb_1px,_transparent_1px)] bg-[length:8px_8px] opacity-50" />

        {/* SISI KIRI: DAFTAR BAHAN (Items List) */}
        <div className="flex-[2] p-8 border-b md:border-b-0 md:border-r border-dashed border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-amber-600" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400">
                Itemized Receipt
              </h4>
            </div>
            <span className="text-[10px] font-bold text-stone-400 font-mono">
              Items: {order.items?.length || 0}
            </span>
          </div>

          <div className="space-y-4">
            {order.items?.length > 0 ? (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-stone-800 uppercase leading-tight group-hover:text-amber-600 transition-colors">
                      {item.ingredient_name}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400 mt-0.5">
                      {item.qty_received} qty × Rp{" "}
                      {item.cost_per_unit?.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-stone-900 tabular-nums">
                      Rp {item.subtotal?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center border-2 border-dashed border-stone-100 rounded-2xl">
                <p className="text-[10px] font-bold text-stone-300 uppercase italic">
                  Data item tidak ditemukan
                </p>
              </div>
            )}
          </div>

          {/* Footer Struk di Kiri */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center">
              <Hash size={14} className="text-stone-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">
                Internal Ref
              </span>
              <span className="text-[10px] font-bold text-stone-600 uppercase">
                {order.po_number}
              </span>
            </div>
          </div>
        </div>

        {/* SISI KANAN: RINGKASAN TOTAL (Summary) */}
        <div className="flex-1 bg-stone-50/50 p-8 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                Status Pembelian
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[9px] font-black italic uppercase tracking-tighter">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                {order.status}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase">
                <span>Subtotal</span>
                <span>Rp {order.total_cost?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase">
                <span>Tax (0%)</span>
                <span>Rp 0</span>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex flex-col items-end">
              <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">
                Grand Total
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-stone-400">Rp</span>
                <span className="text-3xl font-black text-stone-900 tracking-tighter tabular-nums leading-none">
                  {order.total_cost?.toLocaleString()}
                </span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg active:scale-95">
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Efek Gerigi Struk di Bawah */}
      <div className="max-w-4xl mx-auto h-2 bg-[conic-gradient(from_135deg_at_50%_0%,_#fff_0,_#fff_25%,_transparent_25%)] bg-[length:12px_12px]" />
    </div>
  );

  const columns = [
    {
      header: "PO & Vendor",
      render: (row) => (
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-amber-600 shadow-inner group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
            <Hash size={20} />
          </div>
          <div className="flex flex-col">
            <p className="font-black text-stone-900 uppercase tracking-tight leading-none italic group-hover:text-amber-600 transition-colors">
              {row.po_number}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <Truck size={10} className="text-stone-400" />
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">
                {row.supplier_name || "Vendor Unknown"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Waktu Transaksi",
      render: (row) => (
        <div className="flex items-center gap-2 text-stone-400">
          <Calendar size={14} />
          <span className="text-xs font-bold uppercase tracking-tighter">
            {new Date(row.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest border ${
            row.status === "RECEIVED"
              ? "bg-green-50 text-green-700 border-green-100"
              : "bg-amber-50 text-amber-700 border-amber-100"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Total Tagihan",
      className: "text-right",
      render: (row) => (
        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-bold text-stone-400">Rp</span>
            <span className="font-black text-amber-600 text-base tabular-nums">
              {row.total_cost?.toLocaleString()}
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-20 px-2 animate-in fade-in duration-500">
      <PageHeader
        title="Purchasing"
        badge="Inventory"
        subtitle="Manage Stock Inflow & Moving Average Cost"
        icon={ShoppingBag}
        buttonLabel="Buat PO Baru"
        onButtonClick={() => setIsModalOpen(true)}
      />

      {/* 2. KIRIM renderRowDetails KE DATATABLE */}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        renderRowDetails={renderPurchaseDetails}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Purchase Order"
        maxWidth="max-w-2xl"
      >
        {/* Berikan h-[75vh] atau h-[600px] agar modal stabil sejak awal */}
        <form
          onSubmit={form.onSubmit}
          className="flex flex-col h-[75vh] max-h-[700px] overflow-hidden"
        >
          {/* 1. HEADER / VENDOR (Tetap di atas) */}
          <div className="shrink-0 p-1">
            <div className="bg-stone-50 p-5 rounded-[24px] border border-stone-100">
              <label className="block text-[10px] font-black text-stone-400 uppercase mb-2 ml-1 tracking-widest">
                Pilih Vendor / Supplier
              </label>
              <div className="relative">
                <select
                  {...form.register("supplier_id")}
                  className="w-full p-3.5 bg-white border-2 border-stone-100 rounded-2xl font-bold outline-none focus:border-amber-600 appearance-none transition-all text-sm uppercase pr-12"
                >
                  <option value="">-- PILIH SUPPLIER --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
          </div>

          {/* 2. AREA SCROLLABLE (Hanya bagian ini yang bergerak) */}
          <div className="flex-1 overflow-y-auto my-4 pr-2 custom-scrollbar">
            <div className="flex justify-between items-center px-2 mb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-1">
              <h3 className="text-[10px] font-black uppercase text-stone-400 tracking-widest flex items-center gap-2 italic">
                <Package size={14} className="text-amber-600" /> Detail Item
                Pesanan
              </h3>
              <button
                type="button"
                onClick={() =>
                  form.append({
                    ingredient_id: "",
                    qty_received: 1,
                    cost_per_unit: 0,
                  })
                }
                className="text-[10px] font-black text-amber-700 bg-amber-50 px-4 py-2 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm flex items-center gap-1 active:scale-95"
              >
                <Plus size={14} /> TAMBAH ITEM
              </button>
            </div>

            <div className="space-y-3 px-1">
              {form.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="group relative flex flex-col gap-3 bg-white p-4 rounded-2xl border-2 border-stone-100 hover:border-amber-200 transition-all shadow-sm"
                >
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <select
                        {...form.register(`items.${index}.ingredient_id`)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold outline-none focus:bg-white uppercase"
                      >
                        <option value="">Pilih Bahan...</option>
                        {ingredients.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name} ({ing.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => form.remove(index)}
                      className="p-2 text-stone-300 hover:text-red-500 transition-colors bg-stone-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-stone-400 uppercase ml-1">
                        Kuantitas
                      </span>
                      <input
                        type="number"
                        step="any"
                        {...form.register(`items.${index}.qty_received`, {
                          valueAsNumber: true,
                        })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold outline-none focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-stone-400 uppercase ml-1">
                        Harga Satuan
                      </span>
                      <input
                        type="number"
                        {...form.register(`items.${index}.cost_per_unit`, {
                          valueAsNumber: true,
                        })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-100 rounded-xl text-[11px] font-bold text-right outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. FOOTER (Tetap di bawah) */}
          <div className="shrink-0 pt-2 border-t border-stone-100">
            <div className="bg-stone-900 rounded-[24px] p-5 flex justify-between items-center shadow-xl shadow-stone-200">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2.5 bg-stone-800 rounded-xl text-amber-500">
                  <Calculator size={20} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest leading-none mb-1">
                    Estimasi Total
                  </p>
                  <p className="text-lg font-black italic tabular-nums">
                    Rp {totalCost.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                disabled={form.isLoading || form.fields.length === 0}
                className="px-6 py-3.5 bg-amber-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all disabled:opacity-50 disabled:bg-stone-700 shadow-lg shadow-amber-900/20 flex items-center gap-2"
              >
                {form.isLoading ? (
                  "MEMPROSES..."
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    KONFIRMASI
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
