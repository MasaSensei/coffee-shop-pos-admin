import { useState, useEffect } from "preact/hooks";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OpenShift from "./pages/OpenShift";
import { shiftService } from "./services/shiftService";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeShift, setActiveShift] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkShift = async (userId) => {
    try {
      const res = await shiftService.checkActive(userId);
      // Jika res sukses, berarti ada shift aktif
      setActiveShift(res.data);
    } catch (err) {
      // Jika 404 (Error), berarti belum open shift
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

  // 1. Login Logic
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

  // 2. Shift Logic
  if (!activeShift)
    return (
      <OpenShift
        user={user}
        onOpenSuccess={(shiftData) => {
          // shiftData adalah { message, shift_id } dari backend
          setActiveShift(shiftData);
        }}
      />
    );

  // 3. Main Dashboard
  return (
    <Dashboard
      user={user}
      activeShift={activeShift}
      onLogout={() => {
        setUser(null);
        setActiveShift(null);
        localStorage.clear();
      }}
    />
  );
}
