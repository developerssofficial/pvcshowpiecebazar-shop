"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import CartSidebar from "../../components/CartSidebar";

interface ProductDetailClientProps {
  initialProduct?: Record<string, unknown> | null;
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  const [product, setProduct] = useState<Record<string, unknown> | null>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState(false);
  const { addItem, totalItems, setIsOpen: setCartOpen } = useCart();

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setLoading(false);
      return;
    }

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
  }, [id, initialProduct]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#faf8f5" }}>
        <div className="wave-loader">
          <div className="wave-loader__ring wave-loader__ring--1" />
          <div className="wave-loader__ring wave-loader__ring--2" />
          <div className="wave-loader__ring wave-loader__ring--3" />
          <div className="wave-loader__core" />
        </div>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 24, fontWeight: 600 }}>প্রোডাক্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#faf8f5", padding: 20, fontFamily: "'Hind Siliguri', 'Outfit', sans-serif" }}>
        <img src="/logo.png" alt="PVC" style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover", border: "2px solid #d4af37", marginBottom: 20 }} />
        <h1 style={{ fontSize: 56, fontWeight: 900, color: "#12281d", marginBottom: 4 }}>404</h1>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#12281d", marginBottom: 10 }}>প্রোডাক্টটি পাওয়া যায়নি</h2>
        <p style={{ color: "#64748b", marginBottom: 26, fontSize: 15, textAlign: "center", maxWidth: 400 }}>এই প্রোডাক্টটি হয়তো বিক্রি হয়ে গেছে অথবা লিংকটি ভুল।</p>
        <a href="/" style={{ background: "linear-gradient(135deg, #12281d, #1a3c2b)", color: "#f5d77f", padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", border: "1px solid #d4af37" }}>🏠 হোমপেজে ফিরে যান</a>
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
  const category = (product.category as string) || "Showpiece";
  const image = (product.image as string) || "/logo.png";
  const originalPrice = price && offer > 0 ? Math.round(price / (1 - offer / 100)) : null;

  return (
    <>
      <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'Hind Siliguri', 'Outfit', sans-serif" }}>
        {/* Header */}
        <header style={{ background: "linear-gradient(135deg, #12281d 0%, #1a3c2b 100%)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(212,175,55,0.3)" }}>
          <a href="/" style={{ color: "white", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            ← ফিরে যান
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setCartOpen(true)} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(212,175,55,0.4)", color: "white", padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontSize: 16, position: "relative", display: "flex", alignItems: "center", gap: 6 }}>
              <span>🛒</span>
              {totalItems > 0 && <span style={{ background: "#d4af37", color: "#0e1f16", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{totalItems}</span>}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid #d4af37" }} />
              <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>PVC Showpiece Bazar</span>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div style={{ maxWidth: 1050, margin: "0 auto", padding: "18px 20px 0", fontSize: 13, color: "#64748b" }}>
          <a href="/" style={{ color: "#12281d", fontWeight: 600 }}>হোম</a>
          <span style={{ margin: "0 8px" }}>/</span>
          <a href="/#services" style={{ color: "#12281d", fontWeight: 600 }}>কালেকশন</a>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#aa8214", fontWeight: 600 }}>{name}</span>
        </div>

        {/* Product Details Grid */}
        <div style={{ maxWidth: 1050, margin: "0 auto", padding: "24px 20px 80px" }}>
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            {/* Image Box */}
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #ede5d8", padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <img src={image} alt={`${name} - PVC Showpiece Bazar`} style={{ width: "100%", height: "auto", minHeight: 320, maxHeight: 520, objectFit: "contain", display: "block" }} />
            </div>

            {/* Details Box */}
            <div>
              <span style={{ display: "inline-block", background: "#f5f0e6", color: "#12281d", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                {category}
              </span>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#12281d", marginBottom: 8, lineHeight: 1.3 }}>{name}</h1>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>ব্র্যান্ড: PVC Showpiece Bazar • প্রিমিয়াম কোয়ালিটি</p>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
                {[1,2,3,4,5].map((s) => <span key={s} style={{ color: "#f59e0b", fontSize: 16 }}>★</span>)}
                <span style={{ fontSize: 13, color: "#12281d", fontWeight: 700, marginLeft: 4 }}>4.9 (সন্তুষ্ট কাস্টমার রিভিউ)</span>
              </div>

              <div style={{ height: 1, background: "#e5e7eb", marginBottom: 18 }} />

              {/* Price */}
              {price != null && price > 0 ? (
                <div style={{ marginBottom: 20 }}>
                  {offer > 0 && <span style={{ background: "#ef4444", color: "white", padding: "3px 12px", borderRadius: 14, fontSize: 12, fontWeight: 700, marginRight: 10 }}>-{offer}% বিশেষ ছাড়</span>}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 6 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: "#b91c1c" }}>৳{price}</span>
                    {originalPrice && <span style={{ fontSize: 16, color: "#94a3b8", textDecoration: "line-through" }}>৳{originalPrice}</span>}
                  </div>
                  <p style={{ fontSize: 12, color: "#16a34a", marginTop: 6, fontWeight: 600 }}>✓ ১০০% ক্যাশ অন হোম ডেলিভারি সুবিধা</p>
                </div>
              ) : (
                <a href={`https://wa.me/8801336410584?text=Hi! I'm interested in your ${encodeURIComponent(name)}. Please share the price and details.`} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: "#25D366", color: "white", padding: "14px 20px", borderRadius: 12, fontSize: 15, fontWeight: 700, marginBottom: 18, textDecoration: "none" }}>💬 বিস্তারিত জানতে WhatsApp করুন</a>
              )}

              {/* Stock */}
              <div style={{ marginBottom: 14 }}>
                {inStock ? <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 14 }}>✓ স্টকে উপলব্ধ আছে</span> : <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 14 }}>✗ সাময়িকভাবে স্টক আউট</span>}
              </div>

              {/* Delivery Guarantee */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "12px 16px", marginBottom: 22, fontSize: 13, color: "#166534" }}>
                <strong>🚚 দ্রুত ডেলিভারি:</strong> অর্ডার কনফার্ম করার ২-৩ কর্মদিবসের মধ্যে আপনার ঠিকানায় পৌঁছে যাবে।
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {price != null && price > 0 && (
                  <button onClick={() => addItem({ _id: String(product._id), name, image, price, offer: product.offer as number | null, category })} style={{ width: "100%", background: "#d4af37", color: "#0e1f16", border: "none", padding: "15px 20px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(212,175,55,0.3)" }}>
                    🛒 কার্টে যোগ করুন
                  </button>
                )}
                <a href={`https://wa.me/8801336410584?text=Hi! I want to order ${encodeURIComponent(name)}. ${price ? `Price: ৳${price}.` : ""} Please share details.`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "white", padding: "14px 20px", borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
                  <span>💬</span> WhatsApp-এ সরাসরি অর্ডার
                </a>
                <a href="tel:+8801336410584" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#12281d", color: "white", padding: "14px 20px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", border: "1px solid #d4af37" }}>
                  <span>📞</span> ফোন করুন (+880 1336-410584)
                </a>
              </div>
            </div>
          </div>

          {/* Description */}
          {desc && (
            <div style={{ marginTop: 45, borderTop: "1px solid #e5e7eb", paddingTop: 30 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#12281d", marginBottom: 14 }}>এই প্রোডাক্টের বিস্তারিত বিবরণ</h2>
              <div style={{ background: "white", borderRadius: 16, padding: "24px 28px", fontSize: 15, color: "#334155", lineHeight: 1.8, border: "1px solid #ede5d8" }}>
                {desc}
              </div>
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
