"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import CartSidebar from "../../components/CartSidebar";

export default function ProductPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addItem, totalItems, setIsOpen: setCartOpen } = useCart();

  useEffect(() => {
    const currentId = id || (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : "");
    if (!currentId) {
      setError(true);
      setLoading(false);
      return;
    }

    // Try single item endpoint first, fallback to all services list
    fetch(`/api/services?id=${encodeURIComponent(currentId)}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Single fetch failed");
      })
      .then((data) => {
        if (data && (data._id || data.name)) {
          setProduct(data);
          setLoading(false);
        } else {
          throw new Error("Invalid single product");
        }
      })
      .catch(() => {
        // Fallback to fetching all services
        fetch("/api/services")
          .then((res) => res.json())
          .then((data) => {
            const list = Array.isArray(data) ? data : [];
            const found = list.find((s: Record<string, unknown>) => String(s._id) === currentId || String(s.id) === currentId);
            if (found) {
              setProduct(found);
            } else {
              setError(true);
            }
          })
          .catch(() => setError(true))
          .finally(() => setLoading(false));
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f0ebe0" }}>
        <div className="wave-loader" style={{ width: 80, height: 80, position: "relative" }}>
          <div className="wave-loader__ring wave-loader__ring--1" />
          <div className="wave-loader__ring wave-loader__ring--2" />
          <div className="wave-loader__ring wave-loader__ring--3" />
          <div className="wave-loader__core" />
        </div>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 20 }}>লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f0ebe0", padding: 20 }}>
        <img src="/logo.png" alt="PVC" style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover", border: "3px solid #1c3528", marginBottom: 20 }} />
        <h1 style={{ fontSize: 64, fontWeight: 900, color: "#1c3528", marginBottom: 4 }}>404</h1>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c3528", marginBottom: 10 }}>প্রোডাক্টটি পাওয়া যায়নি</h2>
        <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14, textAlign: "center", maxWidth: 380 }}>এই প্রোডাক্টটি আর বিদ্যমান নেই।</p>
        <a href="/" style={{ background: "linear-gradient(135deg, #1c3528, #2d5a3d)", color: "white", padding: "14px 30px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>🏠 হোমপেজে ফিরে যান</a>
      </div>
    );
  }

  const price = typeof product.price === "number" ? product.price : (product.price ? parseFloat(String(product.price).replace(/[^0-9.]/g, "")) : null);
  
  let offer = 0;
  if (typeof product.offer === "number") {
    offer = product.offer;
  } else if (typeof product.offer === "string") {
    offer = parseFloat(product.offer.replace(/[^0-9.]/g, "")) || 0;
  }

  const inStock = product.inStock !== false;
  const desc = (product.description as string) || (product.desc as string) || "";
  const name = (product.name as string) || "";
  const category = (product.category as string) || "";
  const image = (product.image as string) || "";
  const originalPrice = price && offer > 0 ? Math.round(price / (1 - offer / 100)) : null;

  return (
    <>
      <div style={{ minHeight: "100vh", background: "white", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
        {/* Header */}
        <header style={{ background: "linear-gradient(135deg, #1c3528, #2d5a3d)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <a href="/" style={{ color: "white", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>← ফিরে যান</a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setCartOpen(true)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 18, position: "relative" }}>
              &#128722;
              {totalItems > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#c9a96e", color: "#1c3528", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{totalItems}</span>}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <img src="/logo.png" alt="Logo" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "2px solid #c9a96e" }} />
              <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>PVC Showpiece Bazar</span>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px 20px 0", fontSize: 13, color: "#64748b" }}>
          <a href="/" style={{ color: "#1c3528" }}>হোম</a>
          <span style={{ margin: "0 6px" }}>/</span>
          <a href="/#services" style={{ color: "#1c3528" }}>সেবাসমূহ</a>
          <span style={{ margin: "0 6px" }}>/</span>
          <span>{name}</span>
        </div>

        {/* Product */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 60px" }}>
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            {/* Image */}
            <div style={{ background: "#f0ebe0", borderRadius: 14, overflow: "hidden", border: "1px solid #e8e0d0" }}>
              <img src={image} alt={`${name} - PVC Showpiece Bazar - হাতে তৈরি ${category}`} style={{ width: "100%", height: "auto", minHeight: 300, maxHeight: 500, objectFit: "contain", display: "block" }} />
            </div>

            {/* Details */}
            <div>
              <span style={{ display: "inline-block", background: "#f0ebe0", color: "#1c3528", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{category}</span>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1c3528", marginBottom: 8, lineHeight: 1.3 }}>{name}</h1>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>PVC Showpiece Bazar</p>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
                {[1,2,3,4,5].map((s) => <span key={s} style={{ color: "#f59e0b", fontSize: 16 }}>★</span>)}
                <span style={{ fontSize: 13, color: "#64748b", marginLeft: 4 }}>4.8</span>
              </div>

              <div style={{ height: 1, background: "#e5e7eb", marginBottom: 16 }} />

              {/* Price */}
              {price != null && price > 0 ? (
                <div style={{ marginBottom: 18 }}>
                  {offer > 0 && <span style={{ background: "#ef4444", color: "white", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700, marginRight: 10 }}>-{offer}% ছাড়</span>}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
                    <span style={{ fontSize: 30, fontWeight: 800, color: "#b91c1c" }}>৳{price}</span>
                    {originalPrice && <span style={{ fontSize: 15, color: "#9ca3af", textDecoration: "line-through" }}>৳{originalPrice}</span>}
                  </div>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>সব ট্যাক্স অন্তর্ভুক্ত</p>
                </div>
              ) : (
                <a href={`https://wa.me/8801336410584?text=Hi! I'm interested in your ${name}. Please share the price and details.`} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: "#25D366", color: "white", padding: "14px 20px", borderRadius: 10, fontSize: 15, fontWeight: 700, marginBottom: 18, textDecoration: "none" }}>বিস্তারিত জানতে WhatsApp করুন</a>
              )}

              <div style={{ height: 1, background: "#e5e7eb", marginBottom: 16 }} />

              {/* Stock */}
              <div style={{ marginBottom: 10 }}>
                {inStock ? <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 14 }}>✓ স্টকে আছে</span> : <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 14 }}>✗ স্টকে নেই</span>}
              </div>

              {/* Delivery */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#166534" }}>
                <strong>🚚 ডেলিভারি:</strong> অর্ডার করলে ২-৩ কর্মদিবসের মধ্যে হোম ডেলিভারি
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {price != null && price > 0 && (
                  <button onClick={() => addItem({ _id: String(product._id), name, image, price, offer: product.offer as number | null, category })} style={{ width: "100%", background: "#c9a96e", color: "#1c3528", border: "none", padding: "14px 20px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>🛒 কার্টে যোগ করুন</button>
                )}
                <a href={`https://wa.me/8801336410584?text=Hi! I'm interested in your ${name}. ${price ? `Price: ৳${price}.` : ""} Please share details.`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "white", padding: "14px 20px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>📱 WhatsApp-এ অর্ডার করুন</a>
                <a href="tel:+8801336410584" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#1c3528", color: "white", padding: "14px 20px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>📞 ফোনে কল করুন</a>
              </div>

              {/* Seller */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", marginTop: 16, fontSize: 13, color: "#374151" }}>
                <p style={{ marginBottom: 4 }}><strong>বিক্রেতা:</strong> PVC Showpiece Bazar</p>
                <p style={{ marginBottom: 4 }}><strong>📍 অবস্থান:</strong> Barisal, Bangladesh</p>
                <p><strong>📞 ফোন:</strong> +880 1336-410584</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {desc && (
            <div style={{ marginTop: 40, borderTop: "1px solid #e5e7eb", paddingTop: 30 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c3528", marginBottom: 14 }}>এই প্রোডাক্ট সম্পর্কে</h2>
              <div style={{ background: "#f0ebe0", borderRadius: 12, padding: "20px 24px", fontSize: 15, color: "#374151", lineHeight: 1.8 }}>{desc}</div>
            </div>
          )}
        </div>
      </div>

      <CartSidebar />

      <style>{`
        @media (max-width: 768px) { .product-grid { grid-template-columns: 1fr !important; gap: 24px !important; } }
      `}</style>
    </>
  );
}
