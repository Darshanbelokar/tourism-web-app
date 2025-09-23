import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const decreaseQuantity = (id) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity || 1) > 0);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };
  const [cart, setCart] = useState(() => {
    // Persist cart in localStorage
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      let updated;
      if (existingIndex !== -1) {
        // Item exists, increase quantity
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1,
        };
      } else {
        // New item, set quantity to 1
        updated = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
