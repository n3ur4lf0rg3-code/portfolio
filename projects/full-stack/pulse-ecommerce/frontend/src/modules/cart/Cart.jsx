import { useStore } from "../../core/store";

export default function Cart() {
  const { cart, total } = useStore();

  return (
    <div>
      <h2>Cart</h2>

      {cart.map((item) => (
        <div key={item.id}>
          {item.name} x {item.quantity}
        </div>
      ))}

      <h3>Total: ${total}</h3>
    </div>
  );
}
