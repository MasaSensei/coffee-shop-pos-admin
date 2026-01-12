import { LocationProvider, Router, Route } from "preact-iso";
import { Toaster } from "sonner";
import { AdminRoute } from "./components/shared/AdminRoute";

// Import Pages
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Outlets } from "./pages/Outlets";
import { OutletDetail } from "./pages/Outlets/Detail";
import { Products } from "./pages/Products";
import { Categories } from "./pages/Categories";
import { Staff } from "./pages/Staff";
import { Ingredients } from "./pages/Ingridients";
import { Suppliers } from "./pages/Suppliers";
import { Purchases } from "./pages/Purchases";
import { AppProvider } from "./core/context/AppContext";
import { StockHistory } from "./pages/StockHistory";
import { ProductRecipe } from "./pages/Products/Detail";

const ADMIN_ROUTES = [
  { path: "/dashboard", component: Dashboard, title: "Ringkasan Kedai" },
  { path: "/outlets", component: Outlets, title: "Manajemen Outlet" },
  // Tambahkan rute detail di sini
  { path: "/outlets/:id", component: OutletDetail, title: "Audit Operasional" },
  { path: "/products", component: Products, title: "Manajemen Menu Kopi" },
  {
    path: "/products/:id/recipe",
    component: ProductRecipe,
    title: "Atur Resep Kopi",
  },
  {
    path: "/categories",
    component: Categories,
    title: "Manajemen Kategori Menu",
  },
  {
    path: "/ingredients",
    component: Ingredients,
    title: "Manajemen Bahan Baku",
  },
  { path: "/staff", component: Staff, title: "Manajemen Staff" },
  { path: "/suppliers", component: Suppliers, title: "Manajemen Supplier" },
  { path: "/purchasing", component: Purchases, title: "Purchasing" },
  { path: "/stock-history", component: StockHistory, title: "Riwayat Stok" },
];

export function App() {
  return (
    <LocationProvider>
      <AppProvider>
        <Toaster position="top-center" richColors closeButton />
        <Router>
          {/* Public Route */}
          <Route path="/" component={Login} />

          {/* Admin Routes */}
          {ADMIN_ROUTES.map((route) => (
            <AdminRoute
              key={route.path}
              path={route.path}
              component={route.component}
              title={route.title}
            />
          ))}
        </Router>
      </AppProvider>
    </LocationProvider>
  );
}
