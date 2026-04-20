import { useState } from "react";
import { api } from "../../core/api";
import { useAuth } from "../../core/auth.context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await api("/auth/login", "POST", { email, password });
      login(res.token);
      alert("Login successful");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </>
  );
}
