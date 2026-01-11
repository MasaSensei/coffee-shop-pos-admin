import { useEffect, useState } from "preact/hooks";
import { Store, ChevronDown } from "lucide-preact";
import { useApp } from "../../core/context/AppContext";
import { api } from "../../core/api";

export function OutletSwitcher() {
  const { activeOutletId, changeOutlet } = useApp();
  const [outlets, setOutlets] = useState([]);

  useEffect(() => {
    // Ambil daftar outlet untuk dropdown
    const fetchOutlets = async () => {
      try {
        const res = await api.get("/outlets"); // Pastikan endpoint ini ada di Go kamu
        setOutlets(res.data.data || []);
      } catch (err) {
        console.error("Gagal ambil daftar outlet", err);
      }
    };
    fetchOutlets();
  }, []);

  return (
    <div className="flex items-center gap-3 bg-white border-2 border-stone-100 p-2 pl-4 rounded-2xl shadow-sm hover:border-amber-200 transition-all">
      <div className="flex items-center gap-2 border-r border-stone-100 pr-3">
        <Store size={16} className="text-amber-600" />
        <span className="text-[10px] font-black uppercase text-stone-400 tracking-tighter">
          Gerai
        </span>
      </div>

      <div className="relative flex items-center">
        <select
          value={activeOutletId}
          onChange={(e) => changeOutlet(e.target.value)}
          className="appearance-none bg-transparent font-black text-xs uppercase text-stone-900 outline-none pr-8 cursor-pointer z-10"
        >
          {outlets.length === 0 && <option>Memuat...</option>}
          {outlets.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-0 text-stone-400 pointer-events-none"
        />
      </div>
    </div>
  );
}
