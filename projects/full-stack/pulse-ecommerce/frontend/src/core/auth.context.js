import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const data = parseJwt(token);
    setUser({ token, role: data.role });
  }
}, []);

const login = (token) => {
  const data = parseJwt(token);
  localStorage.setItem("token", token);
  setUser({ token, role: data.role });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
