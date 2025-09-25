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

      const data = await res.json();

      if (!res.ok) {
        return { 
          error: { 
            message: data.message || "Login failed",
            requiresVerification: data.requiresVerification || false,
            email: data.email
          } 
        };
      }

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

      const data = await res.json();

      if (!res.ok) {
        return { error: { message: data.message || "Signup failed" } };
      }

      return { 
        data: {
          message: data.message,
          requiresVerification: data.requiresVerification || false,
          verificationSent: data.verificationSent || false,
          email: data.email,
          userId: data.userId
        }
      };
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
