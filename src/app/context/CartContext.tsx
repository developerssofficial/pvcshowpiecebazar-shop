"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  _id?: string;
  id?: number | string;
  name: string;
  image: string;
  price: number;
  offer?: number | null;
  category: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "pvc_cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveCart(items);
  }, [items, loaded]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    const itemId = (item._id || item.id) as string | number;
    setItems((prev) => {
      const existing = prev.find((i) => (i._id || i.id) === itemId);
      if (existing) {
        return prev.map((i) =>
          (i._id || i.id) === itemId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string | number) => {
    setItems((prev) => prev.filter((i) => (i._id || i.id) !== id));
  }, []);

  const updateQuantity = useCallback((id: string | number, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => (i._id || i.id) !== id));
      return;
    }
    setItems((prev) =>
      prev.map((i) => ((i._id || i.id) === id ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const effectivePrice =
      i.offer != null && i.offer > 0
        ? Math.round(i.price * (1 - i.offer / 100))
        : i.price;
    return sum + effectivePrice * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
