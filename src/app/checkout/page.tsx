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

    const msg = `🛒 নতুন অর্ডার!%0A%0A📦 প্রোডাক্ট:%0A${itemsList}%0A%0A💰 মোট: ৳${totalPrice}%0A%0A👤 নাম: ${form.name}%0A📞 ফোন: ${form.phone}%0A📍 ঠিকানা: ${form.address}${
      form.note ? `%0A📝 নোট: ${form.note}` : ""
    }%0A%0A💳 পেমেন্ট: Cash on Delivery`;

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
          background: "#f0ebe0",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "50px 30px",
            textAlign: "center",
            maxWidth: 450,
            width: "100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 16 }}>&#10004;&#65039;</div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#1c3528",
              marginBottom: 12,
            }}
          >
            অর্ডার সম্পন্ন!
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 8, lineHeight: 1.6 }}>
            আপনার অর্ডার WhatsApp-এ পাঠানো হয়েছে।
          </p>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 30 }}>
            আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
              color: "white",
              padding: "14px 30px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            হোমে ফিরে যান
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
          background: "#f0ebe0",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "50px 30px",
            textAlign: "center",
            maxWidth: 400,
            width: "100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>&#128722;</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c3528", marginBottom: 10 }}>
            কার্ট খালি
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
            প্রথমে কিছু প্রোডাক্ট কার্টে যোগ করুন
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
              color: "white",
              padding: "14px 30px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            শপিং শুরু করুন
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0ebe0",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
          color: "white",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <a
          href="/"
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ← ফিরে যান
        </a>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>চেকআউট</h1>
      </div>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "30px 20px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 30,
        }}
        className="checkout-grid"
      >
        {/* Left: Form */}
        <div>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: "white",
                borderRadius: 14,
                padding: "24px 20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1c3528",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 22 }}>&#128100;</span>
                ডেলিভারি তথ্য
              </h2>

              {/* Name */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 6,
                  }}
                >
                  আপনার নাম *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="যেমন: মোঃ রহিম উদ্দিন"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                    fontSize: 15,
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#1c3528")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#d1d5db")
                  }
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 6,
                  }}
                >
                  ফোন নম্বর *
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
                    border: "1px solid #d1d5db",
                    fontSize: 15,
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#1c3528")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#d1d5db")
                  }
                />
              </div>

              {/* Address */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 6,
                  }}
                >
                  ডেলিভারি ঠিকানা *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="বাসা নম্বর, রোড, এলাকা, জেলা..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                    fontSize: 15,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#1c3528")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#d1d5db")
                  }
                />
              </div>

              {/* Note */}
              <div style={{ marginBottom: 0 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 6,
                  }}
                >
                  অতিরিক্ত নোট (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="বিশেষ কোনো অনুরোধ থাকলে লিখুন..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                    fontSize: 15,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#1c3528")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#d1d5db")
                  }
                />
              </div>
            </div>

            {/* Payment Method */}
            <div
              style={{
                background: "white",
                borderRadius: 14,
                padding: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1c3528",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 22 }}>&#128179;</span>
                পেমেন্ট মেথড
              </h2>
              <div
                style={{
                  background: "#f0fdf4",
                  border: "2px solid #16a34a",
                  borderRadius: 10,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 24 }}>&#128176;</span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1c3528" }}>
                    Cash on Delivery (COD)
                  </p>
                  <p style={{ fontSize: 13, color: "#64748b" }}>
                    ডেলিভারি পেতে টাকা দিন
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button - Mobile */}
            <button
              type="submit"
              className="checkout-submit-btn"
              style={{
                display: "none",
                width: "100%",
                background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
                color: "white",
                padding: "16px 20px",
                borderRadius: 12,
                fontSize: 17,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                marginTop: 20,
                letterSpacing: 0.5,
              }}
            >
              WhatsApp-এ অর্ডার পাঠান - ৳{totalPrice}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              position: "sticky",
              top: 20,
            }}
          >
            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1c3528",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              অর্ডার সামারি ({totalItems} টি)
            </h2>

            {/* Items */}
            <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 16 }}>
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
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: "1px solid #f5f5f5",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 8,
                        overflow: "hidden",
                        background: "#f0ebe0",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1c3528",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </p>
                      <p style={{ fontSize: 12, color: "#64748b" }}>
                        ৳{eff} × {item.quantity}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#1c3528",
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
                borderTop: "1px solid #e5e7eb",
                paddingTop: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 6,
                }}
              >
                <span>সাবটোটাল</span>
                <span>৳{totalPrice}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 12,
                }}
              >
                <span>ডেলিভারি</span>
                <span style={{ color: "#16a34a", fontWeight: 600 }}>পরবর্তীতে</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#1c3528",
                  paddingTop: 10,
                  borderTop: "1px dashed #d1d5db",
                }}
              >
                <span>মোট</span>
                <span>৳{totalPrice}</span>
              </div>
            </div>

            {/* Submit Button - Desktop */}
            <button
              type="submit"
              form="checkout-form"
              className="checkout-submit-desktop"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("form")?.requestSubmit();
              }}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
                color: "white",
                padding: "14px 20px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                marginTop: 16,
              }}
            >
              WhatsApp-এ অর্ডার পাঠান
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "#64748b",
                marginTop: 10,
              }}
            >
              🔒 আপনার তথ্য নিরাপদ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
