import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../core/schemas/auth.schema";
import { authService } from "../core/services/auth.service";
import { useState } from "preact/hooks";
import { toast } from "sonner"; // Pastikan sudah install sonner

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validasi langsung saat user mengetik
  });

  const onFormSubmit = async (data) => {
    // 1. IF RETURN: Proteksi Double Click/Loading
    if (isLoading) return;

    // 2. IF RETURN: Pengecekan Logika Bisnis (Contoh: Blacklist kata tertentu)
    if (data.username.toLowerCase() === "kasar") {
      toast.error("Nama tidak sopan!", {
        description: "Gunakan nama barista yang ramah ya.",
      });
      return;
    }

    setIsLoading(true);

    // Toast Loading: Memberi kesan proses sedang berjalan
    const toastId = toast.loading("Sedang menyeduh data...");

    try {
      const res = await authService.login(data);

      // 3. IF RETURN: Cek apakah token ada di response
      if (!res.data?.token) {
        toast.error("Error Sistem", {
          description: "Data akses tidak ditemukan, hubungi owner.",
        });
        return;
      }

      localStorage.setItem("token", res.data.token);

      toast.success("Login Berhasil!", {
        id: toastId, // Mengganti toast loading tadi
        description: "Selamat bertugas di bar, Barista!",
      });

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      // 4. IF RETURN: Cek status code spesifik
      const status = err.response?.status;

      if (status === 401) {
        toast.error("Biji Kopi Salah", {
          id: toastId,
          description: "Username atau password tidak cocok.",
        });
        return;
      }

      if (status === 500) {
        toast.error("Mesin Overheat", {
          id: toastId,
          description: "Server kami sedang bermasalah, coba lagi nanti.",
        });
        return;
      }

      // Default Error
      toast.error("Koneksi Terputus", {
        id: toastId,
        description: "Pastikan internetmu stabil seperti aliran espresso.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginFields = [
    { name: "username", label: "Username", placeholder: "admin" },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    loginFields,
    isLoading,
  };
}
