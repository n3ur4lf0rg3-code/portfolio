import { useAuth } from "../core/auth.context";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <p>Unauthorized</p>;
  }

  return children;
}
