"use client";

import { useState, useEffect } from "react";

interface ServiceItem {
  _id?: string;
  id?: number;
  name: string;
  description?: string;
  desc?: string;
  image: string;
  category: string;
  price?: number;
  offer?: number | null;
}

const fallbackServices: ServiceItem[] = [
  { id: 1, name: "Custom PVC Showpiece", desc: "আপনার পছন্দমতো কাস্টমাইজড PVC শোপিস তৈরি করি।", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Custom%20handcrafted%20PVC%20showpiece%20beautiful%20sculpture%20on%20white%20background%20product%20photography&image_size=square", category: "Showpiece", price: 1500, offer: null },
  { id: 2, name: "Name Showpiece", desc: "আপনার নাম দিয়ে তৈরি বিশেষ PVC শোপিস।", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20name%20showpiece%20decorative%20nameplate%20elegant%20on%20white%20background%20product%20photography&image_size=square", category: "Showpiece", price: 800, offer: 10 },
  { id: 3, name: "Couple Showpiece", desc: "প্রিয়জনের জন্য সুন্দর কাপল শোপিস।", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Beautiful%20PVC%20couple%20showpiece%20romantic%20sculpture%20on%20white%20background%20product%20photography&image_size=square", category: "Showpiece", price: 1200, offer: 15 },
  { id: 4, name: "Family Showpiece", desc: "পরিবারের ছবি থেকে তৈরি PVC শোপিস।", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20family%20showpiece%20loving%20family%20sculpture%20on%20white%20background%20product%20photography&image_size=square", category: "Showpiece", price: 1500, offer: null },
  { id: 5, name: "Home Decoration", desc: "আপনার ঘর সাজানোর জন্য সেরা PVC ডেকোর।", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20home%20decoration%20items%20flower%20vase%20showpiece%20on%20white%20background%20product%20photography&image_size=square", category: "Decor", price: 600, offer: 5 },
  { id: 6, name: "Wall Decor", desc: "দেয়ালের জন্য আকর্ষণীয় PVC ওয়াল ডেকোর।", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20wall%20decor%20art%20beautiful%20hanging%20on%20white%20background%20product%20photography&image_size=square", category: "Decor", price: 900, offer: null },
  { id: 7, name: "Calligraphy PVC", desc: "ইসলামিক ক্যালিগ্রাফি PVC শোপিস।", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20Islamic%20calligraphy%20art%20bismillah%20elegant%20sculpture%20on%20white%20background%20product%20photography&image_size=square", category: "Art", price: 1000, offer: 20 },
  { id: 8, name: "Gift Showpiece", desc: "প্রিয়জনকে দেওয়ার জন্য নান্দনিক PVC গিফট।", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Beautiful%20PVC%20gift%20showpiece%20wrapped%20elegant%20present%20on%20white%20background%20product%20photography&image_size=square", category: "Gift", price: 700, offer: 10 },
];

const allCategories = ["All", "Showpiece", "Decor", "Art", "Gift"];

export default function Home() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const serviceCategories = [
    "All",
    ...Array.from(new Set(services.map((s) => s.category))),
  ];

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
          color: "white",
          padding: "0",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/logo.png"
              alt="PVC Showpiece Bazar Logo"
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #c9a96e",
              }}
            />
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0.5 }}>
                PVC Showpiece Bazar
              </h1>
              <p style={{ fontSize: 10, opacity: 0.85, letterSpacing: 2, textTransform: "uppercase" }}>
                Home Decor &amp; Lifestyle
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav
            style={{ display: "flex", gap: 28, alignItems: "center" }}
            className="desktop-nav"
          >
            <a href="#home" style={{ fontSize: 14, fontWeight: 500 }}>Home</a>
            <a href="#services" style={{ fontSize: 14, fontWeight: 500 }}>Services</a>
            <a href="#about" style={{ fontSize: 14, fontWeight: 500 }}>About</a>
            <a href="#contact" style={{ fontSize: 14, fontWeight: 500 }}>Contact</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            &#9776;
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu"
            style={{
              display: "none",
              flexDirection: "column",
              padding: "10px 20px 20px",
              gap: 15,
              background: "rgba(0,0,0,0.15)",
            }}
          >
            <a href="#home" style={{ fontSize: 16 }}>Home</a>
            <a href="#services" style={{ fontSize: 16 }}>Services</a>
            <a href="#about" style={{ fontSize: 16 }}>About</a>
            <a href="#contact" style={{ fontSize: 16 }}>Contact</a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="home"
        style={{
          background: "linear-gradient(135deg, #1c3528 0%, #2d5a3d 50%, #3a7a52 100%)",
          color: "white",
          padding: "80px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <img
            src="/logo.png"
            alt="PVC Showpiece Bazar"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #c9a96e",
              marginBottom: 25,
              boxShadow: "0 0 30px rgba(201,169,110,0.3)",
            }}
          />
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              marginBottom: 10,
              lineHeight: 1.2,
              letterSpacing: 1,
            }}
          >
            PVC Showpiece Bazar
          </h2>
          <p
            style={{
              fontSize: "clamp(14px, 2vw, 18px)",
              color: "#c9a96e",
              marginBottom: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Home Decor &amp; Lifestyle
          </p>
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              opacity: 0.9,
              marginBottom: 35,
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "0 auto 35px",
            }}
          >
            আমরা আপনার পছন্দমতো কাস্টমাইজড PVC শোপিস তৈরি করি। প্রিয়জনকে দিতে চান একটি অনন্য উপহার?
            অথবা আপনার ঘর সাজাতে চান সুন্দর শোপিস দিয়ে? আমরা সব সময় আপনার পাশে।
          </p>
          <div style={{ display: "flex", gap: 15, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#services"
              style={{
                background: "#c9a96e",
                color: "#1c3528",
                padding: "14px 35px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                display: "inline-block",
                letterSpacing: 0.5,
              }}
            >
              আমাদের সেবাসমূহ দেখুন
            </a>
            <a
              href="https://wa.me/8801336410584"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "2px solid #c9a96e",
                color: "#c9a96e",
                padding: "14px 35px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              WhatsApp-এ যোগাযোগ করুন
            </a>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section
        style={{
          background: "#f8f6f1",
          padding: "30px 20px",
          borderBottom: "1px solid #e8e0d0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 25,
          }}
        >
          {[
            { icon: "🎨", title: "কাস্টমাইজড", desc: "আপনার পছন্দমতো ডিজাইন তৈরি করি" },
            { icon: "🚚", title: "হোম ডেলিভারি", desc: "সারা বাংলাদেশে হোম ডেলিভারি" },
            { icon: "✅", title: "মানসম্মত", desc: "প্রিমিয়াম PVC ম্যাটেরিয়াল ব্যবহার করি" },
            { icon: "💰", title: "সাশ্রয়ী মূল্য", desc: "সরাসরি আমাদের কাছ থেকে কিনুন" },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "15px 10px",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{feature.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "#1c3528" }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        style={{
          padding: "60px 20px",
          flex: 1,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#1c3528" }}>
              আমাদের সেবাসমূহ
            </h2>
            <p style={{ color: "#64748b", marginTop: 10, fontSize: 16 }}>
              আমরা যেসব সেবা প্রদান করি
            </p>
          </div>

          {/* Category Filter */}
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 40,
            }}
          >
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 22px",
                  borderRadius: 25,
                  border: selectedCategory === cat ? "none" : "2px solid #d4c9b0",
                  background: selectedCategory === cat ? "#1c3528" : "white",
                  color: selectedCategory === cat ? "white" : "#374151",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div className="wave-loader">
                <div className="wave-loader__ring wave-loader__ring--1" />
                <div className="wave-loader__ring wave-loader__ring--2" />
                <div className="wave-loader__ring wave-loader__ring--3" />
                <div className="wave-loader__core" />
              </div>
              <p style={{ color: "#64748b", fontSize: 14, marginTop: 24 }}>লোড হচ্ছে...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ color: "#64748b", fontSize: 16 }}>কোনো সেবা পাওয়া যায়নি।</p>
            </div>
          ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 25,
            }}
          >
            {filteredServices.map((service) => (
              <div
                key={service._id || service.id}
                style={{
                  background: "white",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                }}
                onClick={() => setSelectedService(service)}
              >
                <div
                  style={{
                    width: "100%",
                    height: 220,
                    background: "#f8f6f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: 18 }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#f0ebe0",
                      color: "#1c3528",
                      padding: "3px 10px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    {service.category}
                  </span>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: "#1c3528" }}>
                    {service.name}
                  </h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.4, marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                    {service.description || service.desc}
                  </p>
                  <p style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, marginBottom: 12, cursor: "pointer" }}>
                    বিস্তারিত দেখুন →
                  </p>
                  {service.price !== undefined && service.price !== null && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>
                        ৳{service.price}
                      </span>
                      {service.offer != null && service.offer > 0 && (
                        <span style={{
                          background: "#ef4444",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: 10,
                          fontSize: 11,
                          fontWeight: 700,
                        }}>
                          -{service.offer}%
                        </span>
                      )}
                    </div>
                  )}
                  <a
                    href={`https://wa.me/8801336410584?text=Hi! I'm interested in your ${service.name}. Price: ৳${service.price}. Please share details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "#25D366",
                      color: "white",
                      padding: "8px 18px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    WhatsApp-এ অর্ডার করুন
                  </a>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        style={{
          background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
          color: "white",
          padding: "70px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 50,
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, marginBottom: 20 }}>
              PVC Showpiece Bazar সম্পর্কে
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.9, marginBottom: 15 }}>
              PVC Showpiece Bazar-এ আপনাকে স্বাগতম। আমরা আপনার পছন্দমতো কাস্টমাইজড PVC শোপিস তৈরি করি।
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.9, marginBottom: 15 }}>
              আমাদের সেবাসমূহ:
            </p>
            <ul style={{ fontSize: 15, lineHeight: 2, opacity: 0.9, paddingLeft: 20, marginBottom: 25 }}>
              <li>Custom PVC Showpiece</li>
              <li>Name Showpiece</li>
              <li>Couple Showpiece</li>
              <li>Family Showpiece</li>
              <li>Home Decoration</li>
              <li>Wall Decor</li>
              <li>Calligraphy PVC</li>
              <li>Gift Showpiece</li>
            </ul>
            <div style={{ display: "flex", gap: 25, flexWrap: "wrap" }}>
              {[
                { num: "500+", label: "Products" },
                { num: "2000+", label: "Happy Customers" },
                { num: "50+", label: "Designs" },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#c9a96e" }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <img
              src="/logo.png"
              alt="PVC Showpiece Bazar"
              style={{ width: "100%", objectFit: "contain", display: "block", background: "#f8f6f1", padding: 20 }}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        style={{
          padding: "60px 20px",
          background: "#f8f6f1",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, color: "#1c3528", marginBottom: 15 }}>
            যোগাযোগ করুন
          </h2>
          <p style={{ color: "#64748b", marginBottom: 40, fontSize: 16 }}>
            অর্ডার করতে বা জিজ্ঞাসা করতে নিচের যেকোনো মাধ্যমে যোগাযোগ করুন!
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 25,
              marginBottom: 40,
            }}
          >
            {/* Phone */}
            <a
              href="tel:+8801336410584"
              style={{
                background: "white",
                borderRadius: 14,
                padding: "30px 20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 36 }}>&#128222;</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1c3528" }}>ফোন করুন</h3>
              <p style={{ fontSize: 15, color: "#2563eb", fontWeight: 600 }}>+880 1336-410584</p>
            </a>

            {/* Email */}
            <a
              href="mailto:pvcshowpiecebazar.info@gmail.com"
              style={{
                background: "white",
                borderRadius: 14,
                padding: "30px 20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 36 }}>&#128231;</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1c3528" }}>ইমেইল করুন</h3>
              <p style={{ fontSize: 14, color: "#2563eb", fontWeight: 600, wordBreak: "break-all" }}>pvcshowpiecebazar.info@gmail.com</p>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/8801336410584"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "white",
                borderRadius: 14,
                padding: "30px 20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 36 }}>&#128172;</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1c3528" }}>WhatsApp</h3>
              <p style={{ fontSize: 14, color: "#25D366", fontWeight: 600 }}>WhatsApp-এ মেসেজ করুন</p>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/PVCShowpieceBazar"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "white",
                borderRadius: 14,
                padding: "30px 20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 36 }}>&#128240;</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1c3528" }}>Facebook</h3>
              <p style={{ fontSize: 14, color: "#1877F2", fontWeight: 600 }}>আমাদের Facebook পেজ</p>
            </a>
          </div>

          {/* Location */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: "25px 20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 28 }}>&#128205;</span>
            <div style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1c3528", marginBottom: 2 }}>আমাদের অবস্থান</h3>
              <p style={{ fontSize: 14, color: "#64748b" }}>Barisal, Bangladesh</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#1c3528",
          color: "#9ca3af",
          padding: "40px 20px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 30,
            marginBottom: 30,
          }}
        >
          <div>
            <img
              src="/logo.png"
              alt="PVC Showpiece Bazar"
              style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", marginBottom: 12, border: "2px solid #c9a96e" }}
            />
            <h3 style={{ color: "white", fontSize: 17, fontWeight: 700, marginBottom: 10 }}>
              PVC Showpiece Bazar
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              Home Decor &amp; Lifestyle - আমরা আপনার পছন্দমতো কাস্টমাইজড PVC শোপিস তৈরি করি।
            </p>
          </div>
          <div>
            <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
              সেবাসমূহ
            </h3>
            <ul style={{ listStyle: "none", padding: 0, fontSize: 13, lineHeight: 2 }}>
              <li>Custom PVC Showpiece</li>
              <li>Name Showpiece</li>
              <li>Couple Showpiece</li>
              <li>Family Showpiece</li>
              <li>Wall Decor</li>
              <li>Calligraphy PVC</li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
              যোগাযোগ
            </h3>
            <div style={{ fontSize: 13, lineHeight: 2.2 }}>
              <p>&#128205; Barisal, Bangladesh</p>
              <p>&#128222; +880 1336-410584</p>
              <p style={{ wordBreak: "break-all" }}>&#128231; pvcshowpiecebazar.info@gmail.com</p>
            </div>
          </div>
          <div>
            <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
              আমাদের অনুসরণ করুন
            </h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="https://www.facebook.com/PVCShowpieceBazar"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#1877F2",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  display: "inline-block",
                }}
              >
                Facebook
              </a>
              <a
                href="https://wa.me/8801336410584"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#25D366",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  display: "inline-block",
                }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #374151",
            paddingTop: 18,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          <p>&copy; {new Date().getFullYear()} PVC Showpiece Bazar. All rights reserved.</p>
        </div>
      </footer>

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setSelectedService(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              maxWidth: 500,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedService(null)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "#f3f4f6",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                color: "#374151",
              }}
            >
              ✕
            </button>

            {/* Image */}
            <div style={{ width: "100%", height: 250, background: "#f8f6f1", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
              <img
                src={selectedService.image}
                alt={selectedService.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Content */}
            <div style={{ padding: "20px 24px 24px" }}>
              {/* Category badge */}
              <span style={{
                display: "inline-block",
                background: "#f0ebe0",
                color: "#1c3528",
                padding: "4px 12px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 10,
              }}>
                {selectedService.category}
              </span>

              {/* Name */}
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1c3528", marginBottom: 12, lineHeight: 1.3 }}>
                {selectedService.name}
              </h2>

              {/* Full Description */}
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, marginBottom: 20 }}>
                {selectedService.description || selectedService.desc}
              </p>

              {/* Price & Offer */}
              {selectedService.price !== undefined && selectedService.price !== null && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#2563eb" }}>
                    ৳{selectedService.price}
                  </span>
                  {selectedService.offer != null && selectedService.offer > 0 && (
                    <span style={{
                      background: "#ef4444",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                      -{selectedService.offer}%
                    </span>
                  )}
                </div>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: "#e5e7eb", marginBottom: 20 }} />

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* WhatsApp Order */}
                <a
                  href={`https://wa.me/8801336410584?text=Hi! I'm interested in your ${selectedService.name}. Price: ৳${selectedService.price}. Please share details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "#25D366",
                    color: "white",
                    padding: "14px 20px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  📱 WhatsApp-এ অর্ডার করুন
                </a>

                {/* Phone Call */}
                <a
                  href="tel:+8801336410584"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "#1c3528",
                    color: "white",
                    padding: "14px 20px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  📞 ফোনে কল করুন
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive CSS */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          #about > div {
            grid-template-columns: 1fr !important;
          }
        }
        /* wave loader animation is in globals.css */
      `}</style>
    </div>
  );
}
