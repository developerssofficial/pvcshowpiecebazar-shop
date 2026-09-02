"use client";

import AddToCartButton from "../../components/AddToCartButton";
import CartSidebar from "../../components/CartSidebar";

interface Props {
  product: {
    _id: string;
    name: string;
    description?: string;
    image: string;
    category: string;
    price: number | null;
    offer?: number | null;
    inStock?: boolean;
  };
}

export default function ProductClient({ product }: Props) {
  const price = product.price;
  const offer = product.offer || 0;
  const inStock = product.inStock !== false;
  const desc = product.description || "";
  const originalPrice = price && offer > 0 ? Math.round(price / (1 - offer / 100)) : null;

  return (
    <>
      <div style={{ minHeight: "100vh", background: "white", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
        {/* Header */}
        <header style={{ background: "linear-gradient(135deg, #1c3528, #2d5a3d)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <a href="/" style={{ color: "white", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>← ফিরে যান</a>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/logo.png" alt="PVC Showpiece Bazar Logo" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid #c9a96e" }} />
            <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>PVC Showpiece Bazar</span>
          </div>
        </header>

        {/* Breadcrumb */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px 20px 0", fontSize: 13, color: "#6b7280" }}>
          <a href="/" style={{ color: "#2563eb" }}>হোম</a>
          <span style={{ margin: "0 6px" }}>/</span>
          <a href="/#services" style={{ color: "#2563eb" }}>সেবাসমূহ</a>
          <span style={{ margin: "0 6px" }}>/</span>
          <span>{product.name}</span>
        </div>

        {/* Product Content */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 60px" }}>
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            {/* Image */}
            <div>
              <img
                src={product.image}
                alt={`${product.name} - PVC Showpiece Bazar - হাতে তৈরি ${product.category}`}
                style={{ width: "100%", height: "auto", borderRadius: 12, background: "#f3f4f6" }}
              />
            </div>

            {/* Details */}
            <div>
              <span style={{ display: "inline-block", background: "#eff6ff", color: "#2563eb", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{product.category}</span>

              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", marginBottom: 8, lineHeight: 1.3 }}>{product.name}</h1>

              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 10 }}>PVC Showpiece Bazar</p>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map((s) => (<span key={s} style={{ color: "#f59e0b", fontSize: 16 }}>★</span>))}
                <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 4 }}>4.8 আউট অফ 5</span>
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
                  target="_blank"
                  rel="noopener noreferrer"
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

              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#166534" }}>
                <strong>🚚 ডেলিভারি:</strong> অর্ডার করলে ২-৩ কর্মদিবসের মধ্যে হোম ডেলিভারি
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {price != null && price > 0 && (
                  <AddToCartButton
                    item={{
                      _id: product._id,
                      name: product.name,
                      image: product.image,
                      price: price,
                      offer: product.offer || null,
                      category: product.category,
                    }}
                  />
                )}
                <a
                  href={`https://wa.me/8801336410584?text=Hi! I'm interested in your ${product.name}. ${price ? `Price: ৳${price}.` : ""} Please share details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "white", padding: "14px 20px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none", textAlign: "center" }}
                >
                  📱 WhatsApp-এ অর্ডার করুন
                </a>
                <a href="tel:+8801336410584" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#1c3528", color: "white", padding: "14px 20px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
                  📞 ফোনে কল করুন
                </a>
              </div>

              {/* Seller Info */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", marginTop: 16, fontSize: 13, color: "#374151" }}>
                <p style={{ marginBottom: 4 }}><strong>বিক্রেতা:</strong> PVC Showpiece Bazar</p>
                <p style={{ marginBottom: 4 }}><strong>📍 অবস্থান:</strong> Barisal, Bangladesh</p>
                <p><strong>📞 ফোন:</strong> +880 1336-410584</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div style={{ marginTop: 40, borderTop: "1px solid #e5e7eb", paddingTop: 30 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c3528", marginBottom: 14 }}>এই প্রোডাক্ট সম্পর্কে</h2>
            <div style={{ background: "#f9fafb", borderRadius: 12, padding: "20px 24px", fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
              {desc}
            </div>
          </div>
        </div>
      </div>

      <CartSidebar />

      <style>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-templateColumns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </>
  );
}
