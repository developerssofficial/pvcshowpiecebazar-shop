import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পেজটি পাওয়া যায়নি | PVC Showpiece Bazar",
  description: "আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই। PVC Showpiece Bazar-এর হোমপেজে ফিরে যান।",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0ebe0",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        padding: 20,
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="PVC Showpiece Bazar"
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #1c3528",
          marginBottom: 24,
          boxShadow: "0 4px 16px rgba(28,53,40,0.2)",
        }}
      />

      {/* 404 */}
      <h1
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: "#1c3528",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        404
      </h1>

      {/* Message */}
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#1c3528",
          marginBottom: 10,
        }}
      >
        পেজটি পাওয়া যায়নি
      </h2>
      <p
        style={{
          fontSize: 15,
          color: "#64748b",
          marginBottom: 30,
          maxWidth: 400,
          lineHeight: 1.6,
        }}
      >
        আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই বা সরিয়ে ফেলা হয়েছে।
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href="/"
          style={{
            background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
            color: "white",
            padding: "14px 30px",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          🏠 হোমপেজে ফিরে যান
        </a>
        <a
          href="https://wa.me/8801336410584"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#25D366",
            color: "white",
            padding: "14px 30px",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          📱 WhatsApp
        </a>
      </div>

      {/* Quick Links */}
      <div
        style={{
          marginTop: 40,
          background: "white",
          borderRadius: 12,
          padding: "20px 24px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          অথবা এগুলো দেখুন:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <a
            href="/#services"
            style={{
              fontSize: 14,
              color: "#1c3528",
              fontWeight: 600,
              textDecoration: "none",
              padding: "8px 12px",
              background: "#f0ebe0",
              borderRadius: 8,
              display: "block",
            }}
          >
            → আমাদের সেবাসমূহ
          </a>
          <a
            href="/#about"
            style={{
              fontSize: 14,
              color: "#1c3528",
              fontWeight: 600,
              textDecoration: "none",
              padding: "8px 12px",
              background: "#f0ebe0",
              borderRadius: 8,
              display: "block",
            }}
          >
            → আমাদের সম্পর্কে
          </a>
          <a
            href="/#contact"
            style={{
              fontSize: 14,
              color: "#1c3528",
              fontWeight: 600,
              textDecoration: "none",
              padding: "8px 12px",
              background: "#f0ebe0",
              borderRadius: 8,
              display: "block",
            }}
          >
            → যোগাযোগ করুন
          </a>
        </div>
      </div>
    </div>
  );
}
