import { LocationProvider, Router, Route } from "preact-iso";
import { Toaster } from "sonner";
import { AdminRoute } from "./components/shared/AdminRoute";

// Import Pages
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Outlets } from "./pages/Outlets"; // Halaman baru nanti
import { Products } from "./pages/Products";
import { Categories } from "./pages/Categories";
import { Staff } from "./pages/Staff";

export function App() {
  return (
    <LocationProvider>
      <Toaster position="top-center" richColors closeButton />
      <Router>
        {/* Public Route */}
        <Route path="/" component={Login} />

        <AdminRoute
          path="/dashboard"
          component={Dashboard}
          title="Ringkasan Kedai"
        />
        <AdminRoute
          path="/outlets"
          component={Outlets}
          title="Manajemen Outlet"
        />
        <AdminRoute
          path="/products"
          component={Products}
          title="Manajemen Menu Kopi"
        />
        <AdminRoute
          path="/categories"
          component={Categories}
          title="Manajemen Kategori Menu"
        />
        <AdminRoute path="/staff" component={Staff} title="Manajemen Staff" />
      </Router>
    </LocationProvider>
  );
}
