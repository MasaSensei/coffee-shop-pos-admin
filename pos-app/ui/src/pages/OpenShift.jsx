import { useState } from "preact/hooks";
import { shiftService } from "../services/shiftService";

export default function OpenShift({ user, onOpenSuccess }) {
  const [openingCash, setOpeningCash] = useState("");

  const handleOpenShift = async () => {
    if (!openingCash || openingCash < 0)
      return alert("Masukkan modal awal yang valid");

    try {
      const payload = {
        user_id: user.id,
        outlet_id: user.outlet_id || 1, // Gunakan dari user atau default 1
        start_cash: parseFloat(openingCash),
        start_time: new Date().toISOString(),
      };

      const res = await shiftService.open(payload);
      // Backend kamu mengembalikan { message, shift_id }
      onOpenSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal membuka shift. Pastikan server aktif.");
    }
  };

  return (
    <div className="h-screen bg-[#FDF8F5] flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md p-10 bg-white rounded-[3rem] shadow-2xl border border-stone-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A3728"
              stroke-width="2"
            >
              <rect width="20" height="12" x="2" y="6" rx="2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M6 12h.01M18 12h.01" />
            </svg>
          </div>
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-stone-900">
            Mulai Shift
          </h2>
          <p className="text-stone-400 mt-2 font-medium">
            Siapkan modal kasir Anda
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 focus-within:border-[#4A3728] transition-colors">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block mb-4">
              Kas Masuk (Modal Awal)
            </label>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-stone-300 mr-2 font-mono">
                Rp
              </span>
              <input
                type="number"
                value={openingCash}
                onInput={(e) => setOpeningCash(e.target.value)}
                className="w-full bg-transparent text-4xl font-black text-[#4A3728] outline-none placeholder:text-stone-200"
                placeholder="0"
                autoFocus
              />
            </div>
          </div>

          <button
            onClick={handleOpenShift}
            className="w-full bg-[#1F1916] hover:bg-[#4A3728] text-white py-6 rounded-[2rem] font-bold text-lg shadow-xl shadow-stone-200 active:scale-95 transition-all uppercase tracking-widest"
          >
            Buka Kasir
          </button>
        </div>
      </div>
    </div>
  );
}
