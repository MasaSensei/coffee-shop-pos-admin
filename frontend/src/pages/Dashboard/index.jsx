import {
  TrendingUp,
  Users,
  Store,
  Coffee,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-preact";
import { useDashboard } from "../../hooks/useDashboard";

export function Dashboard() {
  const { stats, loading } = useDashboard();

  if (loading)
    return (
      <div className="p-10 text-center font-black uppercase">
        Sedang Meracik Data... ☕
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 1. Header Welcome - Clean & Bold */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-stone-900 uppercase tracking-tight">
            Selamat Datang, Chief! ☕
          </h1>
          <p className="text-stone-500 mt-1 font-bold text-sm uppercase tracking-wider">
            Laporan operasional BrewFlow hari ini
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-black uppercase tracking-widest text-stone-600 hover:bg-stone-50 transition-all shadow-sm">
            Unduh Laporan
          </button>
          <button className="px-5 py-2.5 bg-coffee-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-coffee-950 shadow-lg shadow-coffee-900/20 transition-all active:scale-95">
            + Transaksi Baru
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((item, i) => (
          <div
            key={i}
            className="group relative bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm hover:shadow-2xl hover:shadow-coffee-900/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            <div
              className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${item.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`}
            />

            <div className="flex justify-between items-start mb-6">
              <div
                className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
              >
                <item.icon size={24} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-black uppercase ${
                  item.isUp ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {item.trend}
                {item.isUp ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
                {item.label}
              </h3>
              <p className="text-3xl font-black text-stone-900 tracking-tighter uppercase">
                {item.value}
              </p>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tight">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Section Tengah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight border-l-4 border-coffee-800 pl-4 leading-none">
              Performa Outlet
            </h3>
            <a
              href="/outlets"
              className="text-coffee-700 text-[10px] font-black uppercase tracking-widest hover:text-coffee-900 transition-colors"
            >
              Lihat Detail &rarr;
            </a>
          </div>

          <div className="space-y-6">
            {[
              {
                name: "BREWFLOW PUSAT - JAKARTA",
                sales: "Rp 5.2M",
                color: "bg-amber-500",
              },
              {
                name: "BREWFLOW BANDUNG",
                sales: "Rp 3.1M",
                color: "bg-coffee-600",
              },
              {
                name: "BREWFLOW JOGJA",
                sales: "Rp 2.8M",
                color: "bg-stone-400",
              },
            ].map((outlet, i) => (
              <div
                key={i}
                className="flex items-center justify-between group cursor-pointer p-2 hover:bg-stone-50 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${outlet.color} shadow-sm`}
                  />
                  <p className="font-black text-xs text-stone-600 uppercase tracking-tight group-hover:text-coffee-800">
                    {outlet.name}
                  </p>
                </div>
                <p className="font-black text-sm text-stone-900 uppercase">
                  {outlet.sales}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box: Analisis */}
        <div className="bg-coffee-950 p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center group">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-white/10 group-hover:rotate-12 transition-transform duration-500">
              <Coffee size={40} className="text-amber-100 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">
              Analisis Penjualan
            </h3>
            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.1em] max-w-[220px] leading-relaxed">
              Algoritma sedang meracik data transaksi kedai kamu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
