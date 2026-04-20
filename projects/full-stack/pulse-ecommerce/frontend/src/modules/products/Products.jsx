import { useEffect, useState } from "react";
import { api } from "../../core/api";
import { useStore } from "../../core/store";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useStore();

  useEffect(() => {
    api("/products").then(setProducts);
  }, []);

  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>
          <img src={p.image} width="100" />
          <h3>{p.name}</h3>
          <p>{p.price}</p>
          <button onClick={() => addToCart(p)}>Add</button>
        </div>
      ))}
    </div>
  );
}
