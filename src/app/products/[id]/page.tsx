"use client";

import { useState, useEffect, use } from "react";
import ProductClient from "./ProductClient";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<{
    _id: string;
    name: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
    offer: number | null;
    inStock: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        const found = Array.isArray(data)
          ? data.find((s: { _id: string }) => s._id === id)
          : null;
        if (found) {
          setProduct({
            _id: found._id,
            name: found.name,
            description: found.description || "",
            image: found.image || "",
            category: found.category || "Showpiece",
            price: found.price ?? null,
            offer: found.offer ?? null,
            inStock: found.inStock !== false,
          });
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="wave-loader" style={{ width: 80, height: 80, position: "relative" }}>
          <div className="wave-loader__ring wave-loader__ring--1" />
          <div className="wave-loader__ring wave-loader__ring--2" />
          <div className="wave-loader__ring wave-loader__ring--3" />
          <div className="wave-loader__core" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 20 }}>
          <h1 style={{ fontSize: 22, color: "#374151", marginBottom: 12 }}>প্রোডাক্টটি খুঁজে পাওয়া যায়নি</h1>
          <p style={{ color: "#6b7280", marginBottom: 20 }}>এই প্রোডাক্টটি আর বিদ্যমান নাও থাকতে পারে।</p>
          <a href="/" style={{ display: "inline-block", background: "#2563eb", color: "white", padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
            হোমে ফিরুন
          </a>
        </div>
      </div>
    );
  }

  return <ProductClient product={product} />;
}
