import { Bell, Search, UserCircle } from "lucide-preact";

export function Header({ title }) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-stone-100 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Judul: font-sans, font-black, NO italic */}
        <h2 className="text-xl font-black text-stone-900 font-sans tracking-tight uppercase">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar: Lebih clean */}
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari data..."
            className="pl-10 pr-4 py-2 bg-stone-100 border-none rounded-xl text-sm font-medium focus:ring-4 focus:ring-coffee-500/10 focus:bg-stone-50 w-64 transition-all outline-none"
          />
        </div>

        {/* Notifikasi */}
        <button className="relative p-2.5 text-stone-500 hover:bg-stone-100 rounded-xl transition-all active:scale-90">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-stone-200 mx-1"></div>

        {/* Profil User */}
        <div className="flex items-center gap-3 group cursor-pointer pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-stone-900 group-hover:text-coffee-700 transition-colors leading-none mb-1">
              Barista Admin
            </p>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">
              HQ Office
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-coffee-50 flex items-center justify-center text-coffee-800 shadow-sm border border-coffee-100 group-hover:bg-coffee-800 group-hover:text-white transition-all duration-300">
            <UserCircle size={26} />
          </div>
        </div>
      </div>
    </header>
  );
}
