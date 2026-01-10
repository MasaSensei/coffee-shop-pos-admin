import { LocationProvider, Router, Route } from "preact-iso";
import { Toaster } from "sonner";
import { AdminRoute } from "./components/shared/AdminRoute";

// Import Pages
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Outlets } from "./pages/Outlets"; // Halaman baru nanti

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
      </Router>
    </LocationProvider>
  );
}
