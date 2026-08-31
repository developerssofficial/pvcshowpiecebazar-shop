"use client";

import { useState } from "react";

const products = [
  {
    id: 1,
    name: "PVC Swan Showpiece",
    price: 450,
    category: "Animals",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Beautiful%20white%20PVC%20plastic%20swan%20showpiece%20sculpture%20on%20white%20background%20product%20photography&image_size=square",
  },
  {
    id: 2,
    name: "PVC Flower Vase",
    price: 380,
    category: "Decor",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Elegant%20PVC%20plastic%20flower%20vase%20showpiece%20decorative%20on%20white%20background%20product%20photography&image_size=square",
  },
  {
    id: 3,
    name: "PVC Peacock Art",
    price: 650,
    category: "Art",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Colorful%20PVC%20plastic%20peacock%20showpiece%20art%20sculpture%20on%20white%20background%20product%20photography&image_size=square",
  },
  {
    id: 4,
    name: "PVC Tulip Bunch",
    price: 320,
    category: "Flowers",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Beautiful%20PVC%20plastic%20tulip%20flower%20bunch%20showpiece%20on%20white%20background%20product%20photography&image_size=square",
  },
  {
    id: 5,
    name: "PVC Rose Bouquet",
    price: 520,
    category: "Flowers",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Red%20PVC%20plastic%20rose%20bouquet%20showpiece%20on%20white%20background%20product%20photography&image_size=square",
  },
  {
    id: 6,
    name: "PVC Buddha Statue",
    price: 780,
    category: "Spiritual",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Peaceful%20PVC%20plastic%20buddha%20statue%20showpiece%20on%20white%20background%20product%20photography&image_size=square",
  },
  {
    id: 7,
    name: "PVC Elephant Pair",
    price: 590,
    category: "Animals",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20plastic%20elephant%20pair%20showpiece%20sculpture%20on%20white%20background%20product%20photography&image_size=square",
  },
  {
    id: 8,
    name: "PVC Table Lamp",
    price: 420,
    category: "Lighting",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern%20PVC%20plastic%20decorative%20table%20lamp%20showpiece%20on%20white%20background%20product%20photography&image_size=square",
  },
];

const categories = ["All", "Animals", "Decor", "Art", "Flowers", "Spiritual", "Lighting"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
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
            padding: "15px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 45,
                height: 45,
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: "bold",
              }}
            >
              PVC
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
                PVC Showpiece Bazar
              </h1>
              <p style={{ fontSize: 11, opacity: 0.85, letterSpacing: 1 }}>
                Premium PVC Art &amp; Decor
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav
            style={{ display: "flex", gap: 30, alignItems: "center" }}
            className="desktop-nav"
          >
            <a href="#home" style={{ fontSize: 15, fontWeight: 500 }}>
              Home
            </a>
            <a href="#products" style={{ fontSize: 15, fontWeight: 500 }}>
              Products
            </a>
            <a href="#about" style={{ fontSize: 15, fontWeight: 500 }}>
              About
            </a>
            <a href="#contact" style={{ fontSize: 15, fontWeight: 500 }}>
              Contact
            </a>
            <div style={{ position: "relative" }}>
              <button
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Cart ({cartCount})
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "rgba(255,255,255,0.2)",
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
              background: "rgba(0,0,0,0.1)",
            }}
          >
            <a href="#home" style={{ fontSize: 16 }}>Home</a>
            <a href="#products" style={{ fontSize: 16 }}>Products</a>
            <a href="#about" style={{ fontSize: 16 }}>About</a>
            <a href="#contact" style={{ fontSize: 16 }}>Contact</a>
            <button
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "white",
                padding: "10px 20px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 16,
                textAlign: "left",
              }}
            >
              Cart ({cartCount})
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="home"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)",
          color: "white",
          padding: "80px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              'url("https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Abstract%20geometric%20PVC%20patterns%20blue%20gradient%20background%20texture&image_size=landscape_16_9") center/cover',
            opacity: 0.15,
          }}
        />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            Beautiful PVC Showpieces
            <br />
            <span style={{ color: "#fbbf24" }}>For Your Home</span>
          </h2>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              opacity: 0.9,
              marginBottom: 35,
              lineHeight: 1.6,
            }}
          >
            Discover our handcrafted collection of premium PVC showpieces. From
            elegant flower vases to stunning animal sculptures — add art to every
            corner of your home.
          </p>
          <div style={{ display: "flex", gap: 15, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#products"
              style={{
                background: "#fbbf24",
                color: "#1e3a5f",
                padding: "14px 35px",
                borderRadius: 10,
                fontSize: 17,
                fontWeight: 700,
                transition: "transform 0.2s",
                display: "inline-block",
              }}
            >
              Shop Now
            </a>
            <a
              href="#about"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.5)",
                color: "white",
                padding: "14px 35px",
                borderRadius: 10,
                fontSize: 17,
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section
        style={{
          background: "#f8fafc",
          padding: "30px 20px",
          borderBottom: "1px solid #e2e8f0",
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
            { icon: "🎨", title: "Handcrafted", desc: "Each piece is uniquely crafted by skilled artisans" },
            { icon: "🚚", title: "Free Delivery", desc: "Free shipping on orders above ৳1000" },
            { icon: "✅", title: "Quality Assured", desc: "Premium PVC material, durable & eco-friendly" },
            { icon: "💰", title: "Best Prices", desc: "Wholesale & retail prices directly from us" },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "15px 10px",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{feature.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: "#1e3a5f" }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        style={{
          padding: "60px 20px",
          flex: 1,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#1e3a5f" }}>
              Our Products
            </h2>
            <p style={{ color: "#64748b", marginTop: 10, fontSize: 16 }}>
              Browse our handpicked collection of PVC showpieces
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
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 22px",
                  borderRadius: 25,
                  border: selectedCategory === cat ? "none" : "2px solid #e2e8f0",
                  background: selectedCategory === cat ? "#2563eb" : "white",
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

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 25,
            }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "white",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 2px 12px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 220,
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ padding: 18 }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#eff6ff",
                      color: "#2563eb",
                      padding: "3px 10px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    {product.category}
                  </span>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#1f2937" }}>
                    {product.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#2563eb" }}>
                      ৳{product.price}
                    </span>
                    <button
                      onClick={() => setCartCount(cartCount + 1)}
                      style={{
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
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
            <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, marginBottom: 20 }}>
              About PVC Showpiece Bazar
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, marginBottom: 15 }}>
              We are a passionate team of artisans and creators who specialize in
              crafting beautiful showpieces from PVC material. Our journey started
              with a simple idea — to bring art into every home at an affordable
              price.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, marginBottom: 25 }}>
              Each piece in our collection is meticulously handcrafted with
              attention to detail, ensuring you receive nothing but the best. Our
              PVC showpieces are durable, lightweight, and eco-friendly.
            </p>
            <div style={{ display: "flex", gap: 30 }}>
              {[
                { num: "500+", label: "Products" },
                { num: "2000+", label: "Happy Customers" },
                { num: "50+", label: "Designs" },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#fbbf24" }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>{stat.label}</div>
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
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Artisan%20crafting%20PVC%20showpiece%20in%20workshop%20colorful%20plastic%20art%20studio&image_size=portrait_4_3"
              alt="About PVC Showpiece Bazar"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        style={{
          padding: "60px 20px",
          background: "#f8fafc",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, color: "#1e3a5f", marginBottom: 15 }}>
            Get In Touch
          </h2>
          <p style={{ color: "#64748b", marginBottom: 35, fontSize: 16 }}>
            Have questions? Want to place a bulk order? We&apos;d love to hear from you!
          </p>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 40,
              boxShadow: "0 2px 15px rgba(0,0,0,0.06)",
              textAlign: "left",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "2px solid #e5e7eb",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "2px solid #e5e7eb",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "2px solid #e5e7eb",
                  fontSize: 15,
                  outline: "none",
                }}
              />
            </div>
            <div style={{ marginBottom: 25 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Write your message here..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "2px solid #e5e7eb",
                  fontSize: 15,
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>
            <button
              style={{
                width: "100%",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#111827",
          color: "#9ca3af",
          padding: "50px 20px 25px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 35,
            marginBottom: 35,
          }}
        >
          <div>
            <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 15 }}>
              PVC Showpiece Bazar
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>
              Your trusted destination for premium PVC showpieces and home decor items. Quality craftsmanship since 2020.
            </p>
          </div>
          <div>
            <h3 style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 15 }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: "none", padding: 0, fontSize: 14, lineHeight: 2 }}>
              <li><a href="#home" style={{ color: "#9ca3af" }}>Home</a></li>
              <li><a href="#products" style={{ color: "#9ca3af" }}>Products</a></li>
              <li><a href="#about" style={{ color: "#9ca3af" }}>About Us</a></li>
              <li><a href="#contact" style={{ color: "#9ca3af" }}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 15 }}>
              Categories
            </h3>
            <ul style={{ listStyle: "none", padding: 0, fontSize: 14, lineHeight: 2 }}>
              <li>Animal Showpieces</li>
              <li>Flower Showpieces</li>
              <li>Home Decor</li>
              <li>Spiritual Items</li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 15 }}>
              Contact Info
            </h3>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <p>&#128205; Dhaka, Bangladesh</p>
              <p>&#128222; +880 1XXX-XXXXXX</p>
              <p>&#128231; info@pvcshowpiecebazar.shop</p>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #374151",
            paddingTop: 20,
            textAlign: "center",
            fontSize: 13,
          }}
        >
          <p>&copy; {new Date().getFullYear()} PVC Showpiece Bazar. All rights reserved.</p>
        </div>
      </footer>

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
      `}</style>
    </div>
  );
}
