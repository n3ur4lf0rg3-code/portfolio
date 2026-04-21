import { useAuth } from "../core/auth.context";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <p>Access denied</p>;
  }

  return children;
}
