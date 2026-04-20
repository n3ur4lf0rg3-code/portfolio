import { api } from "../../core/api";
import { useStore } from "../../core/store";

export default function Checkout() {
  const { cart, total } = useStore();

  const handleCheckout = async () => {
    try {
      await api("/orders", "POST", {
        items: cart,
        total,
      });

      alert("Order created");
    } catch (err) {
      alert(err.message);
    }
  };

  return <button onClick={handleCheckout}>Checkout</button>;
}
