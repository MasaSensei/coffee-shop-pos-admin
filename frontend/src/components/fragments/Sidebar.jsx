import { useLocation } from "preact-iso";
import {
  Coffee,
  LayoutDashboard,
  Store,
  Package,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-preact";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Store, label: "Gerai / Outlets", href: "/outlets" },
  { icon: Package, label: "Menu Kopi", href: "/products" },
  { icon: Users, label: "Tim Barista", href: "/staff" },
];

export function Sidebar() {
  const { path } = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <aside className="w-72 bg-coffee-900 text-stone-200 flex flex-col h-screen sticky top-0 shadow-2xl">
      {/* Logo Section - Clean & Bold */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-xl shadow-inner">
          <Coffee className="text-coffee-900" size={24} />
        </div>
        <span className="font-black text-white text-xl tracking-tighter font-sans uppercase">
          BrewFlow
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] mb-4">
          Management
        </p>

        {menuItems.map((item) => {
          const isActive = path === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-amber-100 text-coffee-900 shadow-lg shadow-amber-100/10"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-coffee-900"
                      : "text-stone-500 group-hover:text-amber-100"
                  }
                />
                <span
                  className={`text-sm tracking-tight ${
                    isActive
                      ? "font-black"
                      : "font-bold text-stone-400 group-hover:text-stone-200"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {isActive && (
                <ChevronRight
                  size={16}
                  className="animate-in slide-in-from-left-2 duration-300"
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Bottom Action */}
      <div className="p-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-stone-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}
