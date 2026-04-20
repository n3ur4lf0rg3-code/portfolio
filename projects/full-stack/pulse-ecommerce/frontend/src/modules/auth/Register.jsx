import { useState } from "react";
import { api } from "../../core/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api("/auth/register", "POST", { email, password });
      alert("User created");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
    </>
  );
}
