import { useState } from "preact/hooks";
import { authService } from "../services/authService";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Memanggil service axios yang sudah kita buat
      const response = await authService.login({ username, password });

      const { token, user_data } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        // Kirim data user ke App.jsx untuk mengubah state login
        onLoginSuccess(user_data || { username });
      }
    } catch (err) {
      const message = err.response?.data?.message || "Koneksi ke server gagal";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center font-sans text-stone-800">
      {/* Dekorasi Background */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-orange-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-stone-200/50 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm p-10 bg-white border border-stone-200 rounded-3xl shadow-xl z-10">
        {/* Brand Section */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-stone-100 rounded-2xl mb-4 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-stone-700"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5 2h14v2H5V2zm14 5H5v11c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V7zm-2 11H7V9h10v9zM9 11v5h2v-5H9zm4 0v5h2v-5h-2zM4 4h16v2H4V4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Bean & Brew
          </h1>
          <p className="text-sm text-stone-500 mt-2 font-medium">
            Cashier Access Point
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-[11px] rounded-r-lg">
            <span className="font-bold uppercase tracking-wider">Error:</span>{" "}
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">
              Staff Username
            </label>
            <input
              type="text"
              required
              value={username}
              onInput={(e) => setUsername(e.target.value)}
              className="w-full mt-2 bg-stone-50 border border-stone-200 p-4 rounded-2xl focus:border-stone-800 focus:ring-0 outline-none transition-all placeholder:text-stone-300 shadow-sm"
              placeholder="e.g. barista_john"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">
              Access Pin
            </label>
            <input
              type="password"
              required
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              className="w-full mt-2 bg-stone-50 border border-stone-200 p-4 rounded-2xl focus:border-stone-800 focus:ring-0 outline-none transition-all placeholder:text-stone-300 shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4A3728] hover:bg-[#3C2C20] text-[#FDF8F5] font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 text-sm tracking-wide"
          >
            {isLoading ? "Authenticating..." : "Sign In to Register"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[9px] text-stone-400 font-medium tracking-[0.2em] uppercase">
            Terminal Secured — v1.0.4
          </p>
        </div>
      </div>
    </div>
  );
}
