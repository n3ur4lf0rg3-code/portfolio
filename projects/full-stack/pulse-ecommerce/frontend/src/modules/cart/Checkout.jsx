import { api } from "../../core/api";
import { useStore } from "../../core/store";

export default function Checkout() {
  const { cart } = useStore();

  const handleCheckout = async () => {
    await api("/orders", "POST", {
      items: cart,
      total: cart.reduce((a, b) => a + b.price, 0),
    });
  };

  return <button onClick={handleCheckout}>Pay</button>;
}
