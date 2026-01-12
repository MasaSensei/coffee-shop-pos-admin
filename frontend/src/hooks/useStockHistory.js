import { useEffect, useState } from "preact/hooks";
import { ingredientService } from "../core/services/ingridient.service";

export function useStockHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [meta, setMeta] = useState({});

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await ingredientService.getAllHistory(
        pagination.page,
        pagination.limit
      );

      const result = response.data; // Ini adalah Object {data: Array, meta: Object}

      // SET DATA KE ARRAY (PENTING!)
      setLogs(result.data || []);

      // SET META DARI OBJECT META
      setMeta(result.meta || {});
    } catch (error) {
      console.error("Gagal memuat riwayat stok:", error);
      setLogs([]); // Fallback ke array kosong jika error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page]); // Hanya trigger saat halaman berubah

  return { logs, loading, meta, pagination, setPagination, refresh: fetchLogs };
}
