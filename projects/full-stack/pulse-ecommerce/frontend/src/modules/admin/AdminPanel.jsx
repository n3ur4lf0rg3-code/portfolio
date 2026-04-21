import { useState } from "react";
import { createProduct } from "../products/product.service";

export default function AdminPanel() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleCreate = async () => {
    try {
      await createProduct({ name, price, image });
      alert("Product created");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Image URL" onChange={(e) => setImage(e.target.value)} />

      <button onClick={handleCreate}>Create Product</button>
    </div>
  );
}
