import { AdminLayout } from "../../layouts/AdminLayout";

// Komponen ini menerima Component (halaman) dan title sebagai props
export function AdminRoute({ component: Component, title }) {
  const token = localStorage.getItem("token");

  // Jika tidak ada token, tendang ke login
  if (!token) {
    window.location.href = "/";
    return null;
  }

  return (
    <AdminLayout title={title}>
      <Component />
    </AdminLayout>
  );
}
