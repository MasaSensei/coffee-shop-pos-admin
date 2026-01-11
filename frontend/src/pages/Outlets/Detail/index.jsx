import { useState, useMemo } from "preact/hooks";
import { useLocation } from "preact-iso";
import {
  Store,
  MapPin,
  Phone,
  ChevronLeft,
  Users,
  Activity,
  Calendar,
  Store as StoreIcon,
  Coffee,
} from "lucide-preact";
import { DataTable } from "../../../components/shared/DataTable";
import { useOutletDetail } from "../../../hooks/useOutlet";

export function OutletDetail({ id }) {
  const { route } = useLocation();
  const [activeTab, setActiveTab] = useState("shifts");

  // Menggunakan Hook Dinamis
  const { data, metaShifts, loading, shiftPage, setShiftPage } =
    useOutletDetail(id);

  console.log("Outlet Detail Data:", data);

  // Definisi kolom yang mengambil data dari Row (Database)
  const shiftColumns = useMemo(
    () => [
      {
        header: "JURNAL SESI",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-100 text-stone-600 rounded-lg">
              <Calendar size={14} />
            </div>
            <div>
              {/* Format tanggal dari Go CreatedAt */}
              <p className="font-black text-stone-900 uppercase text-[11px]">
                {new Date(row.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-[9px] font-bold text-stone-400 uppercase">
                {row.session || "REGULAR SESSION"}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "BARISTA",
        render: (row) => (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-coffee-800 text-white rounded-full flex items-center justify-center text-[10px] font-black uppercase">
              {row.barista?.substring(0, 2) || "???"}
            </div>
            <span className="text-[11px] font-black text-stone-700 uppercase">
              {row.barista}
            </span>
          </div>
        ),
      },
      {
        header: "STATUS AUDIT",
        render: (row) => (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                row.status === "Verified"
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "bg-amber-500"
              }`}
            />
            <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
              {row.status}
            </span>
          </div>
        ),
      },
    ],
    []
  );

  // Guard Clause saat loading pertama kali
  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Coffee className="animate-bounce text-stone-300" size={40} />
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
          Brewing Data...
        </p>
      </div>
    );
  }

  // Ambil data outlet dari response wrapper "data" (Go: detail)
  const outlet = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 px-2 pb-10">
      {/* HEADER NAVIGATION */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => route("/outlets")}
          className="group flex items-center gap-2 px-4 py-2 bg-white border-2 border-stone-100 rounded-xl hover:border-coffee-800 transition-all shadow-sm"
        >
          <ChevronLeft
            size={16}
            className="text-stone-400 group-hover:text-coffee-800"
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">
            Kembali
          </span>
        </button>

        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border-2 border-emerald-100 rounded-xl">
          <Activity size={14} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
            Live Monitor
          </span>
        </div>
      </div>

      {/* INFO CARD */}
      <div className="bg-white border-2 border-stone-100 rounded-[32px] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-stone-100 text-coffee-800 rounded-2xl shadow-sm border-2 border-stone-50">
              <StoreIcon size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-stone-900 uppercase tracking-tight italic">
                  {outlet.name}
                </h1>
                <div
                  className={`w-3 h-3 rounded-full ${
                    outlet.is_active ? "bg-emerald-500" : "bg-red-400"
                  }`}
                />
              </div>
              <div className="flex flex-wrap gap-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-stone-300" />{" "}
                  {outlet.address}
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone size={14} className="text-stone-300" />
                  {outlet.phone?.Valid ? outlet.phone.String : "No Phone"}
                </div>
              </div>
            </div>
          </div>

          {/* MANAGER SECTION */}
          <div className="flex gap-2">
            <div className="px-6 py-3 bg-stone-50 rounded-2xl border-2 border-stone-100 text-center min-w-[140px]">
              <p className="text-[9px] font-black text-stone-400 uppercase mb-1">
                Ground Manager
              </p>
              <p className="text-xs font-black text-stone-700 uppercase">
                {outlet.manager?.name || "No Manager Assigned"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS & DATA TABLE */}
      <div className="space-y-4">
        <div className="flex gap-2 p-1 bg-stone-100 w-fit rounded-2xl border-2 border-stone-100">
          <TabButton
            active={activeTab === "shifts"}
            onClick={() => setActiveTab("shifts")}
            label="Riwayat Audit"
          />
          <TabButton
            active={activeTab === "staffs"}
            onClick={() => setActiveTab("staffs")}
            label="Tim Barista"
          />
        </div>

        <div className="bg-white border-2 border-stone-100 rounded-[32px] overflow-hidden shadow-sm">
          {activeTab === "shifts" ? (
            <div className="space-y-4">
              <DataTable
                columns={shiftColumns}
                data={outlet.shifts || []}
                loading={loading}
              />
              {/* PAGINATION KHUSUS SHIFT */}
              {metaShifts && metaShifts.total_page > 1 && (
                <div className="p-4 border-t border-stone-50 flex justify-between items-center">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                    Halaman {shiftPage} dari {metaShifts.total_page}
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled={shiftPage === 1}
                      onClick={() => setShiftPage((p) => p - 1)}
                      className="p-2 border rounded-lg disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      disabled={shiftPage === metaShifts.total_page}
                      onClick={() => setShiftPage((p) => p + 1)}
                      className="p-2 border rounded-lg disabled:opacity-30"
                    >
                      <Activity size={16} className="rotate-90" />{" "}
                      {/* Simbol Next */}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB TIM BARISTA */
            <div className="p-8">
              {outlet.staffs?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {outlet.staffs.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex items-center gap-4 p-4 border-2 border-stone-50 rounded-2xl"
                    >
                      <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center font-black text-stone-600">
                        {staff.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-black text-stone-800 uppercase">
                          {staff.name}
                        </p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase">
                          {staff.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4">
                  <Users size={40} className="mx-auto text-stone-200" />
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    Belum Ada Staff Terdaftar
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        active
          ? "bg-white text-coffee-800 shadow-sm"
          : "text-stone-400 hover:text-stone-600"
      }`}
    >
      {label}
    </button>
  );
}
