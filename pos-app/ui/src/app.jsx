import { useState, useEffect } from "preact/hooks";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OpenShift from "./pages/OpenShift";
import { shiftService } from "./services/shift.service";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeShift, setActiveShift] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkShift = async (userId) => {
    try {
      const res = await shiftService.checkActive(userId);
      // Jika Backend sukses mengembalikan data shift aktif
      if (res.data && res.data.data) {
        localStorage.setItem("active_shift_id", res.data.data.id);
        setActiveShift(res.data.data);
      } else {
        setActiveShift(null);
      }
    } catch (err) {
      // Jika Backend return 404 (No active shift), ini normal.
      console.log("No active shift detected.");
      localStorage.removeItem("active_shift_id");
      setActiveShift(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (token && storedUser) {
      setUser(storedUser);
      checkShift(storedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <div className="h-screen bg-[#FDF8F5] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-[#4A3728] rounded-full animate-spin"></div>
      </div>
    );

  // 1. Jika Belum Login
  if (!user)
    return (
      <Login
        onLoginSuccess={(u) => {
          setUser(u);
          localStorage.setItem("user", JSON.stringify(u));
          checkShift(u.id);
        }}
      />
    );

  // 2. Jika Belum Buka Shift (activeShift === null)
  if (!activeShift)
    return (
      <OpenShift
        user={user}
        onOpenSuccess={(res) => {
          // Backend kamu mengembalikan response sukses setelah POST /shifts
          // Kita langsung set activeShift agar layar berpindah ke Dashboard
          const shiftData = res.data || res;
          setActiveShift(shiftData);
          localStorage.setItem(
            "active_shift_id",
            shiftData.id || shiftData.shift_id,
          );

          // Opsional: panggil checkShift lagi untuk memastikan data sinkron
          checkShift(user.id);
        }}
      />
    );

  // 3. Masuk ke Dashboard
  return (
    <Dashboard
      user={user}
      onLogout={() => {
        setUser(null);
        setActiveShift(null);
        localStorage.clear();
      }}
    />
  );
}
