"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build WhatsApp message
    const itemsList = items
      .map((i) => {
        const eff =
          i.offer != null && i.offer > 0
            ? Math.round(i.price * (1 - i.offer / 100))
            : i.price;
        return `• ${i.name} x${i.quantity} = ৳${eff * i.quantity}`;
      })
      .join("%0A");

    const msg = `🛒 *নতুন অর্ডার এসেছে!*%0A%0A📦 *প্রোডাক্টসমূহ:*%0A${itemsList}%0A%0A💰 *সর্বমোট মূল্য:* ৳${totalPrice}%0A%0A👤 *গ্রাহকের নাম:* ${form.name}%0A📞 *ফোন নম্বর:* ${form.phone}%0A📍 *ডেলিভারি ঠিকানা:* ${form.address}${
      form.note ? `%0A📝 *অতিরিক্ত নোট:* ${form.note}` : ""
    }%0A%0A💳 *পেমেন্ট পদ্ধতি:* Cash on Delivery (ক্যাশ অন ডেলিভারি)`;

    window.open(`https://wa.me/8801336410584?text=${msg}`, "_blank");
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at top center, #1b3d2b 0%, #0e1f16 100%)",
          padding: 20,
          fontFamily: "'Hind Siliguri', 'Outfit', sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "50px 32px",
            textAlign: "center",
            maxWidth: 480,
            width: "100%",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            border: "1px solid rgba(212,175,55,0.4)",
          }}
        >
          <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#12281d",
              marginBottom: 10,
            }}
          >
            অর্ডার সফলভাবে পাঠানো হয়েছে!
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 10, lineHeight: 1.6 }}>
            আপনার অর্ডারটি সরাসরি আমাদের WhatsApp এ পাঠানো হয়েছে।
          </p>
          <p style={{ fontSize: 13, color: "#16a34a", fontWeight: 700, marginBottom: 30 }}>
            আমাদের প্রতিনিধি খুব দ্রুত আপনার সাথে যোগাযোগ করে অর্ডার নিশ্চিত করবেন।
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #12281d 0%, #1a3c2b 100%)",
              color: "#f5d77f",
              padding: "14px 32px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid #d4af37",
            }}
          >
            🏠 হোমপেজে ফিরে যান
          </a>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf8f5",
          padding: 20,
          fontFamily: "'Hind Siliguri', 'Outfit', sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "50px 30px",
            textAlign: "center",
            maxWidth: 420,
            width: "100%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            border: "1px solid #ede5d8",
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 14 }}>🛒</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#12281d", marginBottom: 8 }}>
            আপনার কার্টটি বর্তমানে খালি
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 26 }}>
            অর্ডার করার পূর্বে অনুগ্রহ করে পছন্দের শোপিস কার্টে যুক্ত করুন।
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #d4af37 0%, #aa8214 100%)",
              color: "#0e1f16",
              padding: "14px 30px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(212,175,55,0.3)",
            }}
          >
            🛍️ কালেকশন দেখতে যান
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf8f5",
        fontFamily: "'Hind Siliguri', 'Outfit', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #12281d 0%, #1a3c2b 100%)",
          color: "white",
          padding: "14px 20px",
          borderBottom: "1px solid rgba(212,175,55,0.3)",
          position: "sticky",
          top: 0,
          zIndex: 90,
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a
            href="/"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ← ফিরে যান
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="Logo" style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid #d4af37" }} />
            <span style={{ fontSize: 16, fontWeight: 700 }}>চেকআউট ও ডেলিভারি</span>
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "35px 20px 80px",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 30,
        }}
        className="checkout-grid"
      >
        {/* Left: Form */}
        <div>
          <form id="checkout-form" onSubmit={handleSubmit}>
            <div
              style={{
                background: "white",
                borderRadius: 18,
                padding: "26px 24px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
                border: "1px solid #ede5d8",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#12281d",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>📍</span>
                ডেলিভারি তথ্য পূরণ করুন
              </h2>

              {/* Name */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  আপনার পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="যেমন: মোঃ সাকিব আহমেদ"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  সচল ফোন নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="যেমন: 01XXXXXXXXX"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>

              {/* Address */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  সম্পূর্ণ ডেলিভারি ঠিকানা *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="বাসা নম্বর, রোড নম্বর, এলাকা, থানা ও জেলা..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    fontSize: 15,
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Note */}
              <div style={{ marginBottom: 0 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  কাস্টমাইজেশন বা বিশেষ নোট (যদি থাকে)
                </label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="শোপিসে লেখার নাম, কাপল নাম বা ডেলিভারি নির্দেশিকা..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    fontSize: 15,
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div
              style={{
                background: "white",
                borderRadius: 18,
                padding: "22px 24px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
                border: "1px solid #ede5d8",
              }}
            >
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#12281d",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>💳</span>
                পেমেন্ট পদ্ধতি
              </h2>
              <div
                style={{
                  background: "#f0fdf4",
                  border: "2px solid #16a34a",
                  borderRadius: 12,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 26 }}>💵</span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#166534" }}>
                    ক্যাশ অন ডেলিভারি (Cash on Delivery)
                  </p>
                  <p style={{ fontSize: 13, color: "#4b5563" }}>
                    পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Submit Button */}
            <button
              type="submit"
              className="checkout-submit-btn"
              style={{
                display: "none",
                width: "100%",
                background: "linear-gradient(135deg, #d4af37 0%, #aa8214 100%)",
                color: "#0e1f16",
                padding: "16px 20px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                marginTop: 20,
                boxShadow: "0 6px 20px rgba(212,175,55,0.3)",
              }}
            >
              💬 WhatsApp-এ অর্ডার সম্পন্ন করুন (৳{totalPrice})
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: "24px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
              border: "1px solid #ede5d8",
              position: "sticky",
              top: 80,
            }}
          >
            <h2
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#12281d",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              অর্ডার বিবরণী ({totalItems} টি পণ্য)
            </h2>

            {/* Items */}
            <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: 16 }}>
              {items.map((item) => {
                const id = (item._id || item.id) as string | number;
                const eff =
                  item.offer != null && item.offer > 0
                    ? Math.round(item.price * (1 - item.offer / 100))
                    : item.price;
                return (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: "1px solid #f8fafc",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#faf8f5",
                        border: "1px solid #e8e2d5",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1e293b",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </p>
                      <p style={{ fontSize: 13, color: "#64748b" }}>
                        ৳{eff} × {item.quantity}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#b91c1c",
                        flexShrink: 0,
                      }}
                    >
                      ৳{eff * item.quantity}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div
              style={{
                borderTop: "1px solid #f1f5f9",
                paddingTop: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "#64748b",
                  marginBottom: 8,
                }}
              >
                <span>সাবটোটাল</span>
                <span style={{ fontWeight: 700, color: "#1e293b" }}>৳{totalPrice}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "#64748b",
                  marginBottom: 14,
                }}
              >
                <span>হোম ডেলিভারি</span>
                <span style={{ color: "#16a34a", fontWeight: 700 }}>ক্যাশ অন ডেলিভারি</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#12281d",
                  paddingTop: 12,
                  borderTop: "1px dashed #cbd5e1",
                }}
              >
                <span>সর্বমোট</span>
                <span style={{ color: "#b91c1c" }}>৳{totalPrice}</span>
              </div>
            </div>

            {/* Submit Button - Desktop */}
            <button
              type="submit"
              form="checkout-form"
              className="checkout-submit-desktop"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #d4af37 0%, #aa8214 100%)",
                color: "#0e1f16",
                padding: "14px 20px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                marginTop: 18,
                boxShadow: "0 6px 20px rgba(212,175,55,0.3)",
              }}
            >
              💬 WhatsApp-এ অর্ডার পাঠান
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#64748b",
                marginTop: 12,
              }}
            >
              🔒 শতভাগ নিরাপদ ডেলিভারি ও দ্রুত সেবা
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
          .checkout-submit-btn {
            display: block !important;
          }
          .checkout-submit-desktop {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
