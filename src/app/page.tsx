"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";

interface ServiceItem {
  _id?: string;
  id?: number | string;
  name: string;
  description?: string;
  desc?: string;
  image: string;
  category: string;
  price?: number | null;
  offer?: number | null;
  inStock?: boolean;
}

export default function Home() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("সবগুলো");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { addItem, totalItems, setIsOpen: setCartOpen } = useCart();

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          // Provide high quality curated samples if DB is empty so user always sees beautiful items
          setServices([
            {
              _id: "sample-1",
              name: "Custom Name & Couple Showpiece",
              category: "Couple Showpiece",
              image: "/logo.png",
              price: 1250,
              offer: 15,
              inStock: true,
              description: "আপনার পছন্দের নাম ও ছবি দিয়ে তৈরি প্রিমিয়াম এক্রিলিক ও পিভিসি শোপিস।",
            },
            {
              _id: "sample-2",
              name: "Islamic Calligraphy Wall Art",
              category: "Calligraphy",
              image: "/logo.png",
              price: 1850,
              offer: 10,
              inStock: true,
              description: "আকর্ষণীয় ইসলামিক ক্যালিগ্রাফি গোল্ডেন ফিনিশ দেয়াল সজ্জা।",
            },
            {
              _id: "sample-3",
              name: "Happy Family Memorial Frame",
              category: "Family Showpiece",
              image: "/logo.png",
              price: 1650,
              offer: 20,
              inStock: true,
              description: "পরিবারের স্মরণীয় মুহূর্তগুলো ফ্রেমবন্দি করুন লাক্সারি পিভিসি ডিজাইনে।",
            },
          ]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categoriesFromData = Array.from(new Set(services.map((s) => s.category).filter(Boolean)));
  const serviceCategories = ["সবগুলো", ...categoriesFromData];
  const filteredServices =
    selectedCategory === "সবগুলো" || selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#faf8f5" }}>
      {/* Top Banner Notice */}
      <div style={{ background: "#0e1f16", color: "#d4af37", fontSize: 13, padding: "8px 20px", textAlign: "center", fontWeight: 600, letterSpacing: 0.5, borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
        ✨ সারা বাংলাদেশে ক্যাশ অন হোম ডেলিভারি সুবিধা | অর্ডার করতে সরাসরি WhatsApp-এ যোগাযোগ করুন
      </div>

      {/* Header */}
      <header className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 100, transition: "all 0.3s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo & Brand */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{ position: "relative" }}>
              <img
                src="/logo.png"
                alt="PVC Showpiece Bazar"
                style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: "2px solid #d4af37", boxShadow: "0 0 12px rgba(212,175,55,0.3)" }}
              />
            </div>
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: 0.5, display: "block", fontFamily: "'Outfit', sans-serif" }}>
                PVC Showpiece <span style={{ color: "#d4af37" }}>Bazar</span>
              </span>
              <p style={{ fontSize: 10, color: "#a7f3d0", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>
                Home Decor &amp; Custom Art
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
            <a href="#home" style={{ fontSize: 15, fontWeight: 600, color: "#f3f4f6" }} className="nav-link">হোম</a>
            <a href="#features" style={{ fontSize: 15, fontWeight: 600, color: "#f3f4f6" }} className="nav-link">সুবিধাসমূহ</a>
            <a href="#services" style={{ fontSize: 15, fontWeight: 600, color: "#f3f4f6" }} className="nav-link">কালেকশন</a>
            <a href="#about" style={{ fontSize: 15, fontWeight: 600, color: "#f3f4f6" }} className="nav-link">আমাদের সম্পর্কে</a>
            <a href="#contact" style={{ fontSize: 15, fontWeight: 600, color: "#f3f4f6" }} className="nav-link">যোগাযোগ</a>
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setCartOpen(true)}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                color: "white",
                padding: "8px 14px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 16,
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 600,
              }}
            >
              <span>🛒</span>
              <span style={{ fontSize: 13 }}>কার্ট</span>
              {totalItems > 0 && (
                <span
                  style={{
                    background: "#d4af37",
                    color: "#0e1f16",
                    borderRadius: "50%",
                    minWidth: 20,
                    height: 20,
                    padding: "0 4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 20,
              }}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu animate-fade-in"
            style={{
              display: "none",
              flexDirection: "column",
              padding: "16px 24px 24px",
              gap: 16,
              background: "rgba(14, 31, 22, 0.98)",
              borderTop: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <a href="#home" onClick={() => setMobileMenuOpen(false)} style={{ color: "white", fontSize: 16, fontWeight: 600 }}>হোম</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: "white", fontSize: 16, fontWeight: 600 }}>সুবিধাসমূহ</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} style={{ color: "white", fontSize: 16, fontWeight: 600 }}>কালেকশন</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ color: "white", fontSize: 16, fontWeight: 600 }}>আমাদের সম্পর্কে</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ color: "white", fontSize: 16, fontWeight: 600 }}>যোগাযোগ</a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="home"
        style={{
          background: "radial-gradient(circle at top center, #1b3d2b 0%, #0e1f16 70%, #07100b 100%)",
          color: "white",
          padding: "70px 20px 85px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow ambient decorations */}
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 450, height: 450, background: "rgba(212, 175, 55, 0.12)", filter: "blur(90px)", borderRadius: "50%", pointerEvents: "none" }} />
        
        <div style={{ position: "relative", maxWidth: 840, margin: "0 auto" }} className="animate-fade-in-up">
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(212, 175, 55, 0.15)",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "#f3e5ab",
              padding: "6px 18px",
              borderRadius: 30,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            <span>💎 প্রিমিয়াম হ্যান্ডক্রাফটেড কালেকশন</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5.5vw, 54px)",
              fontWeight: 800,
              marginBottom: 16,
              lineHeight: 1.2,
              letterSpacing: -0.5,
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            আপনার ঘরের সৌন্দর্য বৃদ্ধি করুন <br />
            <span style={{ background: "linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #e6c86e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              কাস্টমাইজড পিভিসি শোপিসে
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2.2vw, 19px)",
              color: "#d1d5db",
              marginBottom: 35,
              lineHeight: 1.7,
              maxWidth: 680,
              margin: "0 auto 35px",
            }}
          >
            প্রিয়জনের জন্মদিনের উপহার, কাপল গিফট, ফ্যামিলি ফ্রেম কিংবা ইসলামিক ক্যালিগ্রাফি—আপনার মনের মতো যেকোনো ডিজাইন আমরা তৈরি করে পৌঁছে দিচ্ছি আপনার দরজায়।
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#services"
              style={{
                background: "linear-gradient(135deg, #d4af37 0%, #aa8214 100%)",
                color: "#0e1f16",
                padding: "14px 34px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 8px 24px rgba(212,175,55,0.35)",
              }}
              className="hover-lift"
            >
              <span>🛍️</span> আমাদের কালেকশন দেখুন
            </a>

            <a
              href="https://wa.me/8801336410584?text=Hello! I want to order a custom PVC Showpiece."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "2px solid #25D366",
                color: "#25D366",
                padding: "14px 30px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backdropFilter: "blur(6px)",
              }}
              className="hover-lift"
            >
              <span>💬</span> WhatsApp-এ অর্ডার দিন
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: "40px 20px", background: "#f5f0e6", borderBottom: "1px solid #e5dcce" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            {
              icon: "🎨",
              title: "১০০% কাস্টমাইজড",
              desc: "আপনার দেওয়া যেকোনো নাম, ছবি ও সাইজে নিখুঁত আর্টওয়ার্ক।",
            },
            {
              icon: "🚚",
              title: "সারা দেশে ডেলিভারি",
              desc: "ক্যাশ অন ডেলিভারিতে বাংলাদেশের যেকোনো প্রান্তে পৌঁছে দেওয়া হয়।",
            },
            {
              icon: "💎",
              title: "প্রিমিয়াম ম্যাটেরিয়াল",
              desc: "উচ্চমানের টেকসই পিভিসি ও গ্লসি এক্রিলিক বোর্ডের নিশ্চয়তা।",
            },
            {
              icon: "💰",
              title: "ন্যায্য প্রস্তুতকারক মূল্য",
              desc: "সরাসরি কারখানা থেকে কেনায় সর্বোচ্চ সাশ্রয়ী মূল্য।",
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 14,
                padding: "24px 20px",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                border: "1px solid #ede5d8",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              className="hover-card"
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{feature.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#12281d", marginBottom: 6 }}>{feature.title}</h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services & Products Section */}
      <section id="services" style={{ padding: "65px 20px 80px", flex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ color: "#aa8214", fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
              PREMIUM PRODUCTS
            </span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#12281d", marginTop: 4 }}>
              আমাদের জনপ্রিয় শোপিসসমূহ
            </h2>
            <p style={{ color: "#64748b", marginTop: 8, fontSize: 15 }}>আপনার ঘরের পছন্দের ক্যাটাগরি বেছে নিন</p>
          </div>

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "9px 22px",
                  borderRadius: 25,
                  border: selectedCategory === cat ? "1px solid #12281d" : "1px solid #dcd3c4",
                  background: selectedCategory === cat ? "#12281d" : "white",
                  color: selectedCategory === cat ? "#f5d77f" : "#475569",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: selectedCategory === cat ? "0 4px 12px rgba(18,40,29,0.2)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div className="wave-loader">
                <div className="wave-loader__ring wave-loader__ring--1" />
                <div className="wave-loader__ring wave-loader__ring--2" />
                <div className="wave-loader__ring wave-loader__ring--3" />
                <div className="wave-loader__core" />
              </div>
              <p style={{ color: "#64748b", fontSize: 14, marginTop: 24 }}>প্রোডাক্ট লোড হচ্ছে...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
              <p style={{ color: "#64748b", fontSize: 16 }}>এই ক্যাটাগরিতে বর্তমানে কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 26 }}>
              {filteredServices.map((service) => {
                const prodId = service._id || service.id;
                const price =
                  typeof service.price === "number"
                    ? service.price
                    : service.price
                    ? parseFloat(String(service.price).replace(/[^0-9.]/g, ""))
                    : null;
                const offer =
                  typeof service.offer === "number"
                    ? service.offer
                    : service.offer
                    ? parseFloat(String(service.offer).replace(/[^0-9.]/g, ""))
                    : 0;
                const originalPrice = price && offer > 0 ? Math.round(price / (1 - offer / 100)) : null;

                return (
                  <div
                    key={String(prodId || service.name)}
                    style={{
                      background: "white",
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                      border: "1px solid #eae3d5",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s",
                    }}
                    className="product-card"
                    onClick={() => prodId && router.push(`/products/${prodId}`)}
                  >
                    {/* Image Area */}
                    <div style={{ position: "relative", width: "100%", height: 240, background: "#f5f0e6", overflow: "hidden" }}>
                      <img
                        src={service.image}
                        alt={service.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12, transition: "transform 0.4s ease" }}
                        className="product-image"
                      />
                      {offer > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            background: "#ef4444",
                            color: "white",
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            boxShadow: "0 2px 8px rgba(239,68,68,0.4)",
                          }}
                        >
                          -{offer}% ছাড়
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <span style={{ alignSelf: "flex-start", background: "#f5f0e6", color: "#12281d", padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                        {service.category}
                      </span>

                      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#12281d", marginBottom: 8, lineHeight: 1.35 }}>
                        {service.name}
                      </h3>

                      {/* Price section */}
                      <div style={{ marginTop: "auto", marginBottom: 16 }}>
                        {price != null && price > 0 ? (
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontSize: 22, fontWeight: 800, color: "#b91c1c" }}>৳{price}</span>
                            {originalPrice && (
                              <span style={{ fontSize: 14, color: "#94a3b8", textDecoration: "line-through" }}>৳{originalPrice}</span>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: 14, color: "#059669", fontWeight: 700 }}>মূল্যের জন্য ইনবক্স করুন</span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {price != null && price > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addItem({
                                _id: String(service._id || service.id),
                                name: service.name,
                                image: service.image,
                                price: price,
                                offer: offer,
                                category: service.category,
                              });
                            }}
                            style={{
                              width: "100%",
                              background: "#d4af37",
                              color: "#0e1f16",
                              border: "none",
                              padding: "11px 0",
                              borderRadius: 10,
                              fontSize: 14,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            🛒 কার্টে যোগ করুন
                          </button>
                        )}

                        <a
                          href={`https://wa.me/8801336410584?text=Hello! I want to order ${encodeURIComponent(service.name)}${price ? ` (Price: ৳${price})` : ""}. Please share details.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            background: "#25D366",
                            color: "white",
                            padding: "10px 0",
                            borderRadius: 10,
                            fontSize: 13,
                            fontWeight: 700,
                            textDecoration: "none",
                          }}
                        >
                          <span>💬</span> WhatsApp অর্ডার
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* About & Trust Stats */}
      <section id="about" style={{ background: "linear-gradient(135deg, #12281d 0%, #1a3c2b 100%)", color: "white", padding: "75px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 50, alignItems: "center" }}>
          <div>
            <span style={{ color: "#d4af37", fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase" }}>ABOUT US</span>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, marginTop: 4, marginBottom: 18, lineHeight: 1.3 }}>
              PVC Showpiece Bazar কেন বেছে নেবেন?
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#e2e8f0", marginBottom: 20 }}>
              আমরা প্রতিটি শোপিস সর্বোচ্চ যত্ন ও নিখুঁত ফিনিশিং দিয়ে প্রস্তুত করি। আমাদের কাস্টমাইজড শোপিসগুলো আপনার ঘরের ড্রয়িং রুম, বেডরুম অথবা অফিস ডেস্কের আভিজাত্য বাড়িয়ে তোলে বহু গুণ।
            </p>

            {/* Stats Counter */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 30 }}>
              {[
                { num: "500+", label: "ইউনিক ডিজাইন" },
                { num: "2500+", label: "সন্তুষ্ট গ্রাহক" },
                { num: "100%", label: "কোয়ালিটি গ্যারান্টি" },
              ].map((stat, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 12px", textAlign: "center", border: "1px solid rgba(212,175,55,0.25)" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#d4af37", fontFamily: "'Outfit', sans-serif" }}>{stat.num}</div>
                  <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 20, overflow: "hidden", border: "2px solid rgba(212,175,55,0.4)", boxShadow: "0 15px 35px rgba(0,0,0,0.3)" }}>
            <img src="/logo.png" alt="PVC Showpiece Bazar" style={{ width: "100%", objectFit: "contain", display: "block", background: "#faf8f5", padding: 30 }} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: "70px 20px", background: "#faf8f5" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: "#aa8214", fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase" }}>GET IN TOUCH</span>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#12281d", marginTop: 4, marginBottom: 12 }}>
            সরাসরি আমাদের সাথে কথা বলুন
          </h2>
          <p style={{ color: "#64748b", marginBottom: 40, fontSize: 15 }}>যেকোনো কাস্টমাইজেশন বা অর্ডারের সহায়তায় আমরা প্রস্তুত</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 35 }}>
            <a
              href="tel:+8801336410584"
              style={{
                background: "white",
                borderRadius: 14,
                padding: "26px 20px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                border: "1px solid #ede5d8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
              className="hover-card"
            >
              <div style={{ fontSize: 32 }}>📞</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#12281d" }}>সরাসরি কল</h3>
              <p style={{ fontSize: 14, color: "#12281d", fontWeight: 600 }}>+880 1336-410584</p>
            </a>

            <a
              href="https://wa.me/8801336410584"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "white",
                borderRadius: 14,
                padding: "26px 20px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                border: "1px solid #ede5d8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
              className="hover-card"
            >
              <div style={{ fontSize: 32 }}>💬</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#12281d" }}>WhatsApp</h3>
              <p style={{ fontSize: 14, color: "#25D366", fontWeight: 700 }}>মেসেজ পাঠান</p>
            </a>

            <a
              href="https://www.facebook.com/PVCShowpieceBazar"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "white",
                borderRadius: 14,
                padding: "26px 20px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                border: "1px solid #ede5d8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
              className="hover-card"
            >
              <div style={{ fontSize: 32 }}>📘</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#12281d" }}>Facebook</h3>
              <p style={{ fontSize: 14, color: "#1877F2", fontWeight: 700 }}>অফিশিয়াল পেজ</p>
            </a>

            <a
              href="mailto:pvcshowpiecebazar.info@gmail.com"
              style={{
                background: "white",
                borderRadius: 14,
                padding: "26px 20px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                border: "1px solid #ede5d8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
              className="hover-card"
            >
              <div style={{ fontSize: 32 }}>✉️</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#12281d" }}>ইমেইল</h3>
              <p style={{ fontSize: 13, color: "#64748b", wordBreak: "break-all" }}>pvcshowpiecebazar.info@gmail.com</p>
            </a>
          </div>

          <div style={{ background: "white", borderRadius: 14, padding: "20px", border: "1px solid #ede5d8", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span>📍</span>
            <span style={{ fontSize: 14, color: "#475569", fontWeight: 600 }}>অবস্থান: বরিশাল, বাংলাদেশ (সারা দেশে ডেলিভারি)</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0c1811", color: "#94a3b8", padding: "50px 20px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 35, marginBottom: 35 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <img src="/logo.png" alt="PVC Showpiece Bazar" style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid #d4af37" }} />
              <span style={{ color: "white", fontSize: 18, fontWeight: 800 }}>PVC Showpiece Bazar</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#94a3b8" }}>
              প্রিমিয়াম কাস্টমাইজড পিভিসি শোপিস ও হোম ডেকরেশন সামগ্রী। আপনার বাড়ি সাজাতে অনন্য ডিজাইনের উপহার সামগ্রী।
            </p>
          </div>

          <div>
            <h4 style={{ color: "#f3e5ab", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>সেবাসমূহ</h4>
            <ul style={{ listStyle: "none", padding: 0, fontSize: 13, lineHeight: 2.2 }}>
              <li>কাস্টম কাপল শোপিস</li>
              <li>নেম ও ফ্যামিলি শোপিস</li>
              <li>ইসলামিক ক্যালিগ্রাফি ফ্রেম</li>
              <li>হোম ও ওয়াল ডেকর</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#f3e5ab", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>জরুরি লিঙ্ক</h4>
            <div style={{ fontSize: 13, lineHeight: 2.2 }}>
              <p>📍 বরিশাল, বাংলাদেশ</p>
              <p>📞 +880 1336-410584</p>
              <p>✉️ pvcshowpiecebazar.info@gmail.com</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, textAlign: "center", fontSize: 12, color: "#64748b" }}>
          <p>© {new Date().getFullYear()} PVC Showpiece Bazar. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Mobile Quick Action Bar */}
      <div
        className="mobile-quick-bar"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(14, 31, 22, 0.98)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(212,175,55,0.3)",
          padding: "10px 16px",
          display: "none",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 999,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.25)",
        }}
      >
        <a
          href="https://wa.me/8801336410584?text=Hello! I want to order a PVC Showpiece."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            background: "#25D366",
            color: "white",
            padding: "10px 8px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginRight: 8,
          }}
        >
          <span>💬</span> WhatsApp
        </a>

        <a
          href="tel:+8801336410584"
          style={{
            flex: 1,
            background: "#d4af37",
            color: "#0e1f16",
            padding: "10px 8px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span>📞</span> কল করুন
        </a>
      </div>

      {/* CSS Utilities */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-quick-bar { display: flex !important; }
          #about > div { grid-template-columns: 1fr !important; gap: 30px !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
          .mobile-quick-bar { display: none !important; }
        }
        .hover-lift:hover {
          transform: translateY(-3px);
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12) !important;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .nav-link:hover {
          color: #d4af37 !important;
        }
      `}</style>

      <CartSidebar />
    </div>
  );
}
