import Products from "./modules/products/Products";
import Cart from "./modules/cart/Cart";
import Checkout from "./modules/cart/Checkout";
import Login from "./modules/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./modules/admin/AdminPanel";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <>
      {/* resto */}

      <AdminRoute>
        <AdminPanel />
      </AdminRoute>
    </>
  );
}
