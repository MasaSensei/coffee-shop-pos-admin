import { AdminLayout } from "../../layouts/AdminLayout";

export function AdminRoute({ component: Component, title, ...rest }) {
  // logic cek auth (misal: ambil token)
  const token = localStorage.getItem("token");

  if (!token) {
    // redirect ke login jika perlu
    return (window.location.href = "/"), null;
  }

  return (
    <AdminLayout title={title}>
      {/* POIN KRUSIAL: 
        Gunakan {...rest} agar 'id' dari router diteruskan ke Component (OutletDetail)
      */}
      <Component {...rest} />
    </AdminLayout>
  );
}
