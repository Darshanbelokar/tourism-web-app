import React from "react";
import { useCart } from "@/contexts/CartContext";
import { X, Trash2 } from "lucide-react";
import { Button } from "./UI/button";

const CartDrawer = ({ open, onClose }) => {
  const { cart, addToCart, removeFromCart, clearCart, decreaseQuantity } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      style={{ minWidth: 320 }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Your Cart</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto bg-white">
        {cart.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">Your cart is empty.</div>
        ) : (
          <ul className="space-y-4 bg-white rounded-lg p-2">
              {cart.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3 border-b pb-2 bg-white rounded shadow-sm px-2">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-medium text-sm line-clamp-1">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.price}</div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => decreaseQuantity(item.id)} aria-label="Decrease quantity">
                          -
                        </Button>
                        <span className="text-xs text-muted-foreground">Qty: {item.quantity || 1}</span>
                        <Button variant="ghost" size="icon" onClick={() => addToCart(item)} aria-label="Increase quantity">
                          +
                        </Button>
                      </div>
                    <div className="text-xs font-semibold text-primary">Subtotal: ₹{((item.quantity || 1) * Number(String(item.price).replace(/[^\d.]/g, ""))).toLocaleString()}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
          </ul>
        )}
      </div>
      {cart.length > 0 && (
          <div className="p-4 border-t flex flex-col gap-2 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-base">Total:</span>
              <span className="font-bold text-lg text-primary">
                ₹{cart.reduce((sum, item) => {
                  const priceNum = Number(String(item.price).replace(/[^\d.]/g, ""));
                  return sum + (isNaN(priceNum) ? 0 : priceNum) * (item.quantity || 1);
                }, 0).toLocaleString()}
              </span>
            </div>
            <Button variant="destructive" onClick={clearCart} size="sm">Clear Cart</Button>
            <Button
              variant="hero"
              size="sm"
              className="w-full"
              onClick={() => {
                // Here you can add further checkout logic
              }}
            >
              Checkout
            </Button>
          </div>
      )}
    </div>
  );
};

export default CartDrawer;
