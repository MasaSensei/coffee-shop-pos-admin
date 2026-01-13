import { useState, useEffect } from "preact/hooks";
import Login from "./pages/Login"; // Pindahkan kode login kamu ke file ini
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Cek apakah ada token di localStorage saat app pertama kali dibuka
    const token = localStorage.getItem("token");
    if (token) {
      // Idealnya panggil API /me untuk validasi token
      setUser({ username: "Barista" });
    }
    setIsChecking(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (isChecking) return <div className="bg-[#FDF8F5] min-h-screen"></div>;

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={(userData) => setUser(userData)} />
  );
}
