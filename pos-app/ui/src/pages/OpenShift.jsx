import { useState } from "preact/hooks";
import { shiftService } from "../services/shift.service";

export default function OpenShift({ user, onOpenSuccess }) {
  const [openingCash, setOpeningCash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenShift = async () => {
    if (!openingCash || parseFloat(openingCash) < 0) {
      return alert("Masukkan modal awal yang valid");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        outlet_id: user.outlet_id || 1,
        start_cash: parseFloat(openingCash), // Menggunakan start_cash sesuai BE
      };

      const res = await shiftService.open(payload);

      // Jika Backend mengembalikan 200/201 OK
      // Kirim data response ke App.jsx melalui callback
      onOpenSuccess(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Gagal membuka shift.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-[#FDF8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-10 bg-white rounded-[3rem] shadow-2xl border border-stone-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-stone-900">Mulai Shift</h2>
          <p className="text-stone-400 mt-2 font-medium">
            Input modal tunai di laci kasir
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 focus-within:border-[#4A3728]">
            <label className="text-[10px] font-black uppercase text-stone-400 block mb-4">
              Modal Awal
            </label>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-stone-300 mr-2">Rp</span>
              <input
                type="number"
                value={openingCash}
                onInput={(e) => setOpeningCash(e.target.value)}
                className="w-full bg-transparent text-4xl font-black text-[#4A3728] outline-none"
                placeholder="0"
                autoFocus
              />
            </div>
          </div>

          <button
            onClick={handleOpenShift}
            disabled={isSubmitting}
            className="w-full bg-[#1F1916] hover:bg-[#4A3728] text-white py-6 rounded-[2rem] font-bold text-lg transition-all active:scale-95 disabled:bg-stone-300"
          >
            {isSubmitting ? "MEMPROSES..." : "BUKA KASIR"}
          </button>
        </div>
      </div>
    </div>
  );
}
