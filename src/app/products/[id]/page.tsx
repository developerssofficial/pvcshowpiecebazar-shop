"use client";

import { useState, useEffect } from "react";
import AddToCartButton from "../../components/AddToCartButton";
import CartSidebar from "../../components/CartSidebar";

export default function ProductPage() {
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
    // Extract ID from URL path
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const found = list.find((s: Record<string, unknown>) => String(s._id) === id);
        if (found) {
          setProduct({
            _id: String(found._id),
            name: String(found.name || ""),
            description: String(found.description || ""),
            image: String(found.image || ""),
            category: String(found.category || "Showpiece"),
            price: typeof found.price === "number" ? found.price : null,
            offer: typeof found.offer === "number" ? found.offer : null,
            inStock: found.inStock !== false,
          });
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Loading
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

  // Error / Not Found
  if (error || !product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f0ebe0", padding: 20 }}>
        <img src="/logo.png" alt="PVC Showpiece Bazar" style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover", border: "3px solid #1c3528", marginBottom: 20 }} />
        <h1 style={{ fontSize: 64, fontWeight: 900, color: "#1c3528", marginBottom: 4 }}>404</h1>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c3528", marginBottom: 10 }}>প্রোডাক্টটি পাওয়া যায়নি</h2>
        <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14, textAlign: "center", maxWidth: 380 }}>
          আপনি যে প্রোডাক্টটি খুঁজছেন সেটি বিদ্যমান নেই বা সরিয়ে ফেলা হয়েছে।
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="/" style={{ background: "linear-gradient(135deg, #1c3528, #2d5a3d)", color: "white", padding: "14px 30px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            🏠 হোমপেজে ফিরে যান
          </a>
          <a href="https://wa.me/8801336410584" target="_blank" rel="noopener noreferrer" style={{ background: "#25D366", color: "white", padding: "14px 30px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            📱 WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // Product Detail
  const price = product.price;
  const offer = product.offer || 0;
  const inStock = product.inStock;
  const desc = product.description;
  const originalPrice = price && offer > 0 ? Math.round(price / (1 - offer / 100)) : null;

  return (
    <>
      <div style={{ minHeight: "100vh", background: "white", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
        {/* Header */}
        <header style={{ background: "linear-gradient(135deg, #1c3528, #2d5a3d)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <a href="/" style={{ color: "white", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>← ফিরে যান</a>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid #c9a96e" }} />
            <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>PVC Showpiece Bazar</span>
          </div>
        </header>

        {/* Breadcrumb */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px 20px 0", fontSize: 13, color: "#6b7280" }}>
          <a href="/" style={{ color: "#1c3528" }}>হোম</a>
          <span style={{ margin: "0 6px" }}>/</span>
          <a href="/#services" style={{ color: "#1c3528" }}>সেবাসমূহ</a>
          <span style={{ margin: "0 6px" }}>/</span>
          <span>{product.name}</span>
        </div>

        {/* Product */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 60px" }}>
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            {/* Image */}
            <div style={{ background: "#f3f4f6", borderRadius: 14, overflow: "hidden" }}>
              <img
                src={product.image}
                alt={`${product.name} - PVC Showpiece Bazar - হাতে তৈরি ${product.category}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* Details */}
            <div>
              <span style={{ display: "inline-block", background: "#f0ebe0", color: "#1c3528", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{product.category}</span>

              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1c3528", marginBottom: 8, lineHeight: 1.3 }}>{product.name}</h1>

              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>PVC Showpiece Bazar</p>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map((s) => (<span key={s} style={{ color: "#f59e0b", fontSize: 16 }}>★</span>))}
                <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 4 }}>4.8</span>
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
                <a
                  href={`https://wa.me/8801336410584?text=Hi! I'm interested in your ${product.name}. Please share the price and details.`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", textAlign: "center", background: "#25D366", color: "white", padding: "14px 20px", borderRadius: 10, fontSize: 15, fontWeight: 700, marginBottom: 18, textDecoration: "none" }}
                >
                  বিস্তারিত জানতে WhatsApp করুন
                </a>
              )}

              <div style={{ height: 1, background: "#e5e7eb", marginBottom: 16 }} />

              {/* Stock */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                {inStock ? (
                  <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 14 }}>✓ স্টকে আছে</span>
                ) : (
                  <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 14 }}>✗ স্টকে নেই</span>
                )}
              </div>

              {/* Delivery */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#166534" }}>
                <strong>🚚 ডেলিভারি:</strong> অর্ডার করলে ২-৩ কর্মদিবসের মধ্যে হোম ডেলিভারি
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {price != null && price > 0 && (
                  <AddToCartButton
                    item={{
                      _id: product._id,
                      name: product.name,
                      image: product.image,
                      price: price,
                      offer: product.offer,
                      category: product.category,
                    }}
                  />
                )}
                <a
                  href={`https://wa.me/8801336410584?text=Hi! I'm interested in your ${product.name}. ${price ? `Price: ৳${price}.` : ""} Please share details.`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "white", padding: "14px 20px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none", textAlign: "center" }}
                >
                  📱 WhatsApp-এ অর্ডার করুন
                </a>
                <a href="tel:+8801336410584" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#1c3528", color: "white", padding: "14px 20px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
                  📞 ফোনে কল করুন
                </a>
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
              <div style={{ background: "#f9fafb", borderRadius: 12, padding: "20px 24px", fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
                {desc}
              </div>
            </div>
          )}
        </div>
      </div>

      <CartSidebar />

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </>
  );
}
