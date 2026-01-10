import { useState, useEffect } from "preact/hooks";
import { dashboardService } from "../core/services/dashboard.service";
import { toast } from "sonner";
import { TrendingUp, Coffee, Users } from "lucide-preact";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      setData(res.data.data); // data dari format { status: "success", data: {...} }
    } catch (err) {
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Kita transform data API menjadi array 'stats' yang dibutuhkan UI
  const stats = [
    {
      label: "Total Pendapatan",
      value: data ? `Rp ${data.total_revenue.toLocaleString()}` : "Rp 0",
      trend: "+14.5%",
      isUp: true,
      icon: TrendingUp,
      desc: "vs bulan lalu",
      color: "from-amber-500 to-coffee-600",
    },
    {
      label: "Pesanan Selesai",
      value: data ? data.completed_orders.toString() : "0",
      trend: "+8.2%",
      isUp: true,
      icon: Coffee,
      desc: "cup terjual hari ini",
      color: "from-coffee-700 to-coffee-900",
    },
    {
      label: "Bahan Baku Kritis",
      value: data ? data.low_stock_count.toString() : "0",
      trend: "Check",
      isUp: false,
      icon: Users, // Bisa diganti icon Alert
      desc: "perlu restock segera",
      color: "from-stone-700 to-stone-900",
    },
  ];

  return {
    stats,
    loading,
    refresh: fetchDashboardData,
  };
}
