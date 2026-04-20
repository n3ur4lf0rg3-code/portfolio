import { useStore } from "../../core/store";

export default function Cart() {
  const { cart } = useStore();

  return (
    <div>
      <h2>Cart</h2>
      {cart.map((item, i) => (
        <div key={i}>{item.name}</div>
      ))}
    </div>
  );
}
