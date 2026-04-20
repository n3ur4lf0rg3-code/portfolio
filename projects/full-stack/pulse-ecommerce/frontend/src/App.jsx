import Products from "./modules/products/Products";
import Cart from "./modules/cart/Cart";
import Checkout from "./modules/cart/Checkout";
import Login from "./modules/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Login />
      <Products />
      <Cart />

      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    </>
  );
}
