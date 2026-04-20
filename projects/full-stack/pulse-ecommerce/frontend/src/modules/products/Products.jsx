import { useEffect, useState } from "react";
import { getProducts } from "./product.service";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
