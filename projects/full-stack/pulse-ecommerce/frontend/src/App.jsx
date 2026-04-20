import Products from "./modules/products/Products";
import Cart from "./modules/cart/Cart";
import Checkout from "./modules/cart/Checkout";

export default function App() {
  return (
    <>
      <Products />
      <Cart />
      <Checkout />
    </>
  );
}
