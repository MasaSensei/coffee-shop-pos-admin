import { useState } from "preact/hooks";
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
  AlertCircle,
} from "lucide-preact";
import { Modal } from "../../components/shared/Modal";

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
  { icon: ShoppingBag, label: "Purchasing", href: "/purchasing" },
  { icon: History, label: "Riwayat Stok", href: "/stock-history" },
];

export function Sidebar() {
  const location = useLocation();
  const path = location.path;
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear(); // Bersihkan semua sesi
    location.route("/");
  };

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
    <>
      <aside className="w-72 bg-coffee-900 text-stone-200 flex flex-col h-screen sticky top-0 shadow-2xl overflow-y-auto custom-scrollbar border-r border-white/5">
        {/* Branding */}
        <div className="p-8 flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-xl shadow-inner">
            <Coffee className="text-coffee-900" size={24} />
          </div>
          <span className="font-black text-white text-xl tracking-tighter uppercase italic">
            BrewFlow
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-6">
          <div>
            <p className="px-4 text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] mb-3 opacity-50">
              Management
            </p>
            <div className="space-y-1">
              {managementMenu.map((item) => (
                <MenuItem key={item.href} item={item} />
              ))}
            </div>
          </div>

          <div>
            <p className="px-4 text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] mb-3 opacity-50">
              Inventory & Product
            </p>
            <div className="space-y-1">
              {inventoryMenu.map((item) => (
                <MenuItem key={item.href} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Logout Button Trigger */}
        <div className="p-6 border-t border-white/5 bg-black/10">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-4 text-stone-500 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-widest group"
          >
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <LogOut size={16} />
            </div>
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* MODAL LOGOUT CUSTOM */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Keluar"
      >
        <div className="flex flex-col items-center text-center py-6 space-y-6">
          {/* Ikon Peringatan dengan Gaya BrewFlow */}
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 relative">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
            <LogOut size={44} className="relative z-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase text-stone-900 tracking-tight">
              Sesi Hampir Selesai?
            </h3>
            <p className="text-sm font-medium text-stone-400 max-w-[280px]">
              Pastikan semua pesanan sudah tersimpan. Sampai jumpa di shift
              berikutnya!
            </p>
          </div>

          <div className="flex w-full gap-3 pt-4">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1 py-4 bg-stone-100 text-stone-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-stone-200 transition-all active:scale-95"
            >
              Lanjut Kerja
            </button>
            <button
              onClick={handleConfirmLogout}
              className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
