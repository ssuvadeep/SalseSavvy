import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ss_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("ss_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ss_user");
    }
  }, [user]);

  const login = async (username, password) => {
    const res = await api.post("/api/auth/login", { username, password });
    const loggedInUser = { username: res.data.username, role: res.data.role };
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (username, email, password) => {
    await api.post("/api/users/register", { username, email, password });
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      // ignore — we still clear local state
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
