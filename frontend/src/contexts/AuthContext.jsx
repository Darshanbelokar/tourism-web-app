// src/contexts/AuthContext.js
import { createContext, useContext, useState } from "react";

const getApiBase = () => import.meta.env.VITE_BACKEND_URL || '';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // 🔹 Login
  const signIn = async (email, password) => {
    try {
  const res = await fetch(`${getApiBase()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { error: { message: errorText || "Login failed" } };
      }

      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);

      return { user: data.user, token: data.token };
    } catch (err) {
      return { error: { message: err.message } };
    }
  };

  // 🔹 Signup
  const signUp = async (fullName, email, password) => {
    try {
  const res = await fetch(`${getApiBase()}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { error: { message: errorText || "Signup failed" } };
      }

      const data = await res.json();
      return { message: data.message };
    } catch (err) {
      return { error: { message: err.message } };
    }
  };

  // 🔹 Logout
  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
