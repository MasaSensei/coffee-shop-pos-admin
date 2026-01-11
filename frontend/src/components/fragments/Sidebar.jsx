import { useLocation } from "preact-iso";
import {
  Coffee,
  LayoutDashboard,
  Store,
  Package,
  Users,
  LogOut,
  ChevronRight,
  Tag,
  Truck,
  FlaskConical,
  History,
  ShoppingBag,
} from "lucide-preact";

const managementMenu = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Store, label: "Gerai / Outlets", href: "/outlets" },
  { icon: Users, label: "Tim Barista", href: "/staff" },
];

const inventoryMenu = [
  { icon: Tag, label: "Kategori Menu", href: "/categories" },
  { icon: Package, label: "Daftar Menu", href: "/products" },
  { icon: FlaskConical, label: "Bahan Baku", href: "/ingredients" },
  { icon: Truck, label: "Supplier", href: "/suppliers" },
  { icon: ShoppingBag, label: "Purchasing", href: "/purchasing" }, // Tambahkan di sini
  { icon: History, label: "Riwayat Stok", href: "/stock-history" },
];

export function Sidebar() {
  const { path } = useLocation();

  const MenuItem = ({ item }) => {
    const isActive = path === item.href;
    return (
      <a
        key={item.href}
        href={item.href}
        className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
          isActive
            ? "bg-amber-100 text-coffee-900 shadow-lg shadow-amber-100/10"
            : "hover:bg-white/5 hover:text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon
            size={18}
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
          <ChevronRight size={14} className="animate-in slide-in-from-left-2" />
        )}
      </a>
    );
  };

  return (
    <aside className="w-72 bg-coffee-900 text-stone-200 flex flex-col h-screen sticky top-0 shadow-2xl overflow-y-auto custom-scrollbar">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-xl">
          <Coffee className="text-coffee-900" size={24} />
        </div>
        <span className="font-black text-white text-xl tracking-tighter uppercase">
          BrewFlow
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-6">
        {/* Section 1: Core Management */}
        <div>
          <p className="px-4 text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] mb-3">
            Management
          </p>
          <div className="space-y-1">
            {managementMenu.map((item) => (
              <MenuItem item={item} />
            ))}
          </div>
        </div>

        {/* Section 2: Inventory & Supply */}
        <div>
          <p className="px-4 text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] mb-3">
            Inventory & Product
          </p>
          <div className="space-y-1">
            {inventoryMenu.map((item) => (
              <MenuItem item={item} />
            ))}
          </div>
        </div>
      </nav>

      <div className="p-6 border-t border-white/5">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-stone-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-sm">
          <LogOut size={20} />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}
