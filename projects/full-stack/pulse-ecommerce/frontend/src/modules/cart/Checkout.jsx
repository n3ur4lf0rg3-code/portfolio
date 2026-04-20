import { api } from "../../core/api";
import { useStore } from "../../core/store";
import { useAuth } from "../../core/auth.context";

export default function Checkout() {
  const { cart, total } = useStore();
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

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
