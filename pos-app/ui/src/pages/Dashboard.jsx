import { useEffect, useRef } from "preact/hooks";
import { useDashboard } from "../hooks/useDashboard";
import QRCode from "qrcode";

/**
 * Komponen Khusus QR Code untuk Preact
 * Menghindari error internal hooks library React murni
 */
function QRCodeDisplay({ text }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      QRCode.toCanvas(
        canvasRef.current,
        text,
        {
          width: 200,
          margin: 2,
          color: {
            dark: "#1F1916",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("QR Code Error:", error);
        },
      );
    }
  }, [text]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-inner border border-stone-100 flex justify-center">
      <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
    </div>
  );
}

export default function Dashboard({ user, onLogout }) {
  const { state, actions } = useDashboard(user);

  return (
    <div className="flex h-screen bg-[#F8F5F2] text-[#2C2420] font-['Plus_Jakarta_Sans'] overflow-hidden select-none">
      {/* COLUMN 1: SIDEBAR */}
      <div className="w-24 bg-[#1F1916] flex flex-col items-center py-6 border-r border-stone-800">
        <div className="w-12 h-12 bg-[#4A3728] rounded-2xl mb-8 flex items-center justify-center text-white font-black italic shadow-lg">
          BF
        </div>
        <div className="flex-1 space-y-4 w-full px-2 overflow-y-auto scrollbar-hide">
          <button
            onClick={() => actions.setActiveCat("ALL")}
            className={`w-full py-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${state.activeCat === "ALL" ? "bg-[#4A3728] text-white" : "text-stone-500 hover:bg-stone-800"}`}
          >
            <span className="text-[9px] font-bold uppercase">Semua</span>
          </button>
          {state.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => actions.setActiveCat(cat.id)}
              className={`w-full py-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${state.activeCat === cat.id ? "bg-[#4A3728] text-white shadow-lg" : "text-stone-500 hover:bg-stone-800"}`}
            >
              <span className="text-lg font-bold">{cat.name.charAt(0)}</span>
              <span className="text-[9px] font-bold uppercase text-center px-1">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={onLogout}
          className="mt-auto p-4 text-stone-500 hover:text-red-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9" />
          </svg>
        </button>
      </div>

      {/* COLUMN 2: PRODUCT GRID */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-8 flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl font-bold text-[#1F1916]">
              {state.outlet?.name.split(" ")[0] || "BrewFlow"}
            </h1>
            <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">
              Kasir: {user?.username} • Shift #{state.currentShiftId}
            </p>
          </div>
          <input
            type="text"
            value={state.searchQuery}
            onInput={(e) => actions.setSearchQuery(e.target.value)}
            placeholder="Cari menu..."
            className="bg-white border border-stone-200 rounded-2xl py-3 px-4 outline-none focus:border-[#4A3728] text-sm w-64"
          />
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {state.filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => actions.setSelectedProduct(p)}
                className="group bg-white rounded-[2rem] p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all cursor-pointer flex flex-col h-52 justify-between"
              >
                <div className="text-left">
                  <span className="px-2 py-0.5 bg-stone-100 rounded-md text-[9px] font-bold text-stone-400 uppercase">
                    {p.category_name}
                  </span>
                  <h3 className="text-lg font-bold text-stone-800 leading-tight mt-2">
                    {p.name}
                  </h3>
                </div>
                <p className="text-lg font-black text-[#4A3728] text-right">
                  Rp {p.variants[0]?.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COLUMN 3: CART & CHECKOUT */}
      <div className="w-[400px] bg-white border-l border-stone-100 flex flex-col shadow-xl">
        <div className="p-6 border-b border-stone-50 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Pesanan{" "}
            <span className="text-stone-300">
              #{String(state.orderNumber).padStart(3, "0")}
            </span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {state.cart.map((item) => (
            <div
              key={item.cartId}
              className="bg-stone-50 rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-[10px] text-[#4A3728] font-bold">
                  {item.variantName}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => actions.updateQty(item.cartId, -1)}
                  className="w-6 h-6 bg-white rounded-lg shadow-sm"
                >
                  -
                </button>
                <span className="text-sm font-bold">{item.qty}</span>
                <button
                  onClick={() => actions.updateQty(item.cartId, 1)}
                  className="w-6 h-6 bg-white rounded-lg shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-stone-50 border-t border-stone-200 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={state.orderType}
              onChange={(e) => actions.setOrderType(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs font-bold outline-none"
            >
              <option value="Dine-in">Dine-in</option>
              <option value="Takeaway">Takeaway</option>
            </select>
            <select
              value={state.paymentMethod}
              onChange={(e) => actions.setPaymentMethod(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs font-bold outline-none"
            >
              <option value="1">Cash (Tunai)</option>
              <option value="2">QRIS (Xendit)</option>
              <option value="3">Debit Card</option>
            </select>
          </div>

          {state.paymentMethod === "1" && (
            <input
              type="number"
              value={state.cashAmount}
              onInput={(e) => actions.setCashAmount(e.target.value)}
              placeholder="Uang Tunai..."
              className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-sm font-bold outline-none"
            />
          )}

          <div className="pt-2 space-y-1">
            <div className="flex justify-between text-xs text-stone-400 font-bold">
              <span>Pajak (10%)</span>
              <span>Rp {state.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-xs font-bold uppercase">Total</span>
              <span className="text-2xl font-black text-[#4A3728]">
                Rp {state.total.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={actions.handleCheckout}
            disabled={
              state.cart.length === 0 ||
              state.isProcessing ||
              (state.paymentMethod === "1" && state.paidNumber < state.total)
            }
            className={`w-full py-5 rounded-2xl font-bold text-white shadow-lg transition-all ${
              state.cart.length === 0 ||
              (state.paymentMethod === "1" && state.paidNumber < state.total)
                ? "bg-stone-300 cursor-not-allowed"
                : "bg-[#1F1916] hover:bg-[#4A3728]"
            }`}
          >
            {state.isProcessing ? "Memproses..." : "Konfirmasi & Bayar"}
          </button>
        </div>
      </div>

      {/* MODAL PILIH VARIAN */}
      {state.selectedProduct && (
        <div className="fixed inset-0 bg-[#1F1916]/80 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {state.selectedProduct.name}
              </h2>
              <button
                onClick={() => actions.setSelectedProduct(null)}
                className="text-stone-300"
              >
                ✕
              </button>
            </div>
            <div className="grid gap-3">
              {state.selectedProduct.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => actions.addToCart(state.selectedProduct, v)}
                  className="w-full flex justify-between p-5 rounded-2xl border-2 border-stone-100 hover:border-[#4A3728] font-bold"
                >
                  <span>{v.variant_name}</span>
                  <span>Rp {v.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUKSES & QRIS */}
      {state.showSuccessModal && state.lastTransaction && (
        <div className="fixed inset-0 bg-[#1F1916]/90 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full items-start justify-center">
            {/* AREA QRIS */}
            {state.lastTransaction.qrString && (
              <div className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center shadow-2xl border-4 border-[#4A3728]">
                <h3 className="font-black text-lg mb-4 text-[#1F1916]">
                  SCAN UNTUK BAYAR
                </h3>

                {/* PEMBAHARUAN: Memakai QRCodeDisplay yang baru */}
                <QRCodeDisplay text={state.lastTransaction.qrString} />

                <div className="mt-6 flex flex-col items-center">
                  <div className="flex gap-2 items-center mb-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-tighter">
                      Menunggu Pembayaran...
                    </p>
                  </div>
                  <p className="text-[10px] text-stone-400 font-medium">
                    Invoice: {state.lastTransaction.orderNo}
                  </p>
                </div>
              </div>
            )}

            {/* STRUK THERMAL */}
            <div className="bg-white text-black p-8 w-[350px] shadow-2xl font-mono text-[11px] border-t-[12px] border-[#4A3728]">
              <div className="text-center space-y-1 mb-6">
                <h2 className="text-base font-black uppercase">
                  {state.outlet?.name}
                </h2>
                <p className="text-[9px]">{state.outlet?.address}</p>
              </div>
              <div className="border-t border-dashed border-gray-300 my-4"></div>
              <div className="space-y-3 mb-6">
                {state.lastTransaction.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between font-bold">
                    <span>
                      {item.qty} {item.name}
                    </span>
                    <span>{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-300 pt-4 space-y-1 font-bold">
                <div className="flex justify-between">
                  <span>TOTAL</span>
                  <span>Rp {state.lastTransaction.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between italic">
                  <span>BAYAR</span>
                  <span>{state.lastTransaction.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-black mt-2">
                  <span>KEMBALI</span>
                  <span>{state.lastTransaction.change.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => actions.setShowSuccessModal(false)}
                className="w-full mt-8 bg-[#1F1916] text-white py-4 rounded-xl font-bold"
              >
                TRANSAKSI BARU
              </button>
            </div>
          </div>
        </div>
      )}

      {state.errorMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl">
          {state.errorMsg}
        </div>
      )}
    </div>
  );
}
