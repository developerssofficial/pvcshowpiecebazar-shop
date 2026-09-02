"use client";

import { useCart } from "../context/CartContext";

interface Props {
  _id?: string;
  id?: number | string;
  name: string;
  image: string;
  price: number;
  offer?: number | null;
  category: string;
}

export default function AddToCartButton({ item }: { item: Props }) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(item)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: "#c9a96e",
        color: "#1c3528",
        padding: "15px 20px",
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      🛒 কার্টে যোগ করুন
    </button>
  );
}
