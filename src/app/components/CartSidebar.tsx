"use client";

import { useCart } from "../context/CartContext";

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(14, 31, 22, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            animation: "fadeIn 0.25s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className="cart-sidebar"
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-420px",
          width: 390,
          maxWidth: "92vw",
          height: "100vh",
          background: "#ffffff",
          zIndex: 1000,
          boxShadow: isOpen ? "-8px 0 30px rgba(0,0,0,0.25)" : "none",
          transition: "right 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Hind Siliguri', 'Outfit', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #12281d 0%, #1a3c2b 100%)",
            color: "white",
            padding: "18px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            borderBottom: "1px solid rgba(212,175,55,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🛒</span>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
              আপনার কার্ট
            </h2>
            {totalItems > 0 && (
              <span
                style={{
                  background: "#d4af37",
                  color: "#0e1f16",
                  borderRadius: "50%",
                  minWidth: 24,
                  height: 24,
                  padding: "0 6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              width: 34,
              height: 34,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: items.length === 0 ? 0 : "14px 20px",
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "#64748b",
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 14 }}>🛍️</div>
              <p style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                কার্ট খালি রয়েছে
              </p>
              <p style={{ fontSize: 13, color: "#64748b" }}>
                পছন্দের প্রোডাক্টের নিচে "কার্টে যোগ করুন" চাপুন
              </p>
            </div>
          ) : (
            items.map((item) => {
              const id = (item._id || item.id) as string | number;
              const effectivePrice =
                item.offer != null && item.offer > 0
                  ? Math.round(item.price * (1 - item.offer / 100))
                  : item.price;

              return (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "14px 0",
                    borderBottom: "1px solid #f1f5f9",
                    alignItems: "center",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 12,
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

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#12281d",
                        marginBottom: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </h4>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#b91c1c" }}>
                      ৳{effectivePrice}
                    </p>

                    {/* Quantity Controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                        marginTop: 6,
                        border: "1px solid #cbd5e1",
                        borderRadius: 8,
                        width: "fit-content",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(id, item.quantity - 1)}
                        style={{
                          width: 28,
                          height: 28,
                          border: "none",
                          background: "#f8fafc",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          width: 32,
                          textAlign: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          borderLeft: "1px solid #cbd5e1",
                          borderRight: "1px solid #cbd5e1",
                          lineHeight: "28px",
                          background: "white",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(id, item.quantity + 1)}
                        style={{
                          width: 28,
                          height: 28,
                          border: "none",
                          background: "#f8fafc",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove + Subtotal */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <button
                      onClick={() => removeItem(id)}
                      style={{
                        background: "#fee2e2",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: 12,
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontWeight: 700,
                      }}
                    >
                      মুছুন
                    </button>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#12281d",
                        marginTop: 8,
                      }}
                    >
                      ৳{effectivePrice * item.quantity}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: "18px 22px",
              background: "#faf8f5",
              flexShrink: 0,
            }}
          >
            {/* Subtotal */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
                fontSize: 14,
                color: "#64748b",
              }}
            >
              <span>সাবটোটাল ({totalItems} টি)</span>
              <span style={{ fontWeight: 700, color: "#1e293b" }}>৳{totalPrice}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 14,
                fontSize: 13,
                color: "#64748b",
              }}
            >
              <span>হোম ডেলিভারি</span>
              <span style={{ color: "#16a34a", fontWeight: 700 }}>ক্যাশ অন ডেলিভারি</span>
            </div>

            {/* Total */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
                padding: "12px 0 0",
                borderTop: "1px dashed #d1d5db",
                fontSize: 20,
                fontWeight: 800,
                color: "#12281d",
              }}
            >
              <span>সর্বমোট</span>
              <span style={{ color: "#b91c1c" }}>৳{totalPrice}</span>
            </div>

            {/* Checkout Button */}
            <a
              href="/checkout"
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                background: "linear-gradient(135deg, #d4af37 0%, #aa8214 100%)",
                color: "#0e1f16",
                padding: "14px 20px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                width: "100%",
                boxShadow: "0 6px 20px rgba(212,175,55,0.3)",
              }}
            >
              চেকআউট করুন (Cash on Delivery) →
            </a>
          </div>
        )}
      </div>
    </>
  );
}
