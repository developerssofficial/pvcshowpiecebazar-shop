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
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className="cart-sidebar"
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-400px",
          width: 380,
          maxWidth: "90vw",
          height: "100vh",
          background: "white",
          zIndex: 1000,
          boxShadow: isOpen ? "-4px 0 20px rgba(0,0,0,0.15)" : "none",
          transition: "right 0.3s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
            color: "white",
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>&#128722;</span>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>
              আপনার কার্ট
            </h2>
            {totalItems > 0 && (
              <span
                style={{
                  background: "#c9a96e",
                  color: "#1c3528",
                  borderRadius: "50%",
                  width: 26,
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              width: 34,
              height: 34,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 18,
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
            padding: items.length === 0 ? 0 : "10px 16px",
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#64748b",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>&#128722;</div>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                কার্ট খালি
              </p>
              <p style={{ fontSize: 13 }}>
                প্রোডাক্ট দেখে "Add to Cart" চাপুন
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
                    borderBottom: "1px solid #f0f0f0",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 10,
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

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1c3528",
                        marginBottom: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </h4>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#b91c1c" }}>
                      ৳{effectivePrice}
                    </p>

                    {/* Quantity Controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                        marginTop: 6,
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        width: "fit-content",
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(id, item.quantity - 1)}
                        style={{
                          width: 30,
                          height: 30,
                          border: "none",
                          background: "#f0ebe0",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1c3528",
                          borderRadius: "8px 0 0 8px",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          width: 36,
                          textAlign: "center",
                          fontSize: 14,
                          fontWeight: 600,
                          borderLeft: "1px solid #e5e7eb",
                          borderRight: "1px solid #e5e7eb",
                          lineHeight: "30px",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(id, item.quantity + 1)}
                        style={{
                          width: 30,
                          height: 30,
                          border: "none",
                          background: "#f0ebe0",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1c3528",
                          borderRadius: "0 8px 8px 0",
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
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: 18,
                        padding: 2,
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#1c3528",
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
              borderTop: "2px solid #e5e7eb",
              padding: "16px 20px",
              background: "#fafaf7",
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
                color: "#374151",
              }}
            >
              <span>সাবটোটাল ({totalItems} টি)</span>
              <span style={{ fontWeight: 700 }}>৳{totalPrice}</span>
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
              <span>ডেলিভারি</span>
              <span style={{ color: "#16a34a", fontWeight: 600 }}>পরবর্তীতে</span>
            </div>

            {/* Total */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
                padding: "10px 0",
                borderTop: "1px dashed #d1d5db",
                fontSize: 18,
                fontWeight: 800,
                color: "#1c3528",
              }}
            >
              <span>মোট</span>
              <span>৳{totalPrice}</span>
            </div>

            {/* Checkout Button */}
            <a
              href="/checkout"
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
                color: "white",
                padding: "14px 20px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                width: "100%",
                letterSpacing: 0.5,
              }}
            >
              অর্ডার করুন (Cash on Delivery)
            </a>

            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#64748b",
                marginTop: 10,
              }}
            >
              🔒 সিকিউর চেকআউট • ক্যাশ অন ডেলিভারি
            </p>
          </div>
        )}
      </div>
    </>
  );
}
