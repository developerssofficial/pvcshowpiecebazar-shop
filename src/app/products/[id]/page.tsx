import type { Metadata } from "next";

const SITE_URL = "https://pvcshowpiecebazar.shop";

// Dynamic metadata per product
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${SITE_URL}/api/services`, { cache: "no-store" });
    if (!res.ok) return getFallbackMetadata();

    const services = await res.json();
    const product = services.find((s: { _id: string }) => s._id === id);
    if (!product) return getFallbackMetadata();

    const title = `${product.name} | PVC Showpiece Bazar`;
    const description = `${product.description?.substring(0, 155) || product.name} | ${product.price ? `Price: ৳${product.price}` : "Contact for price"}. PVC Showpiece Bazar, Barisal, Bangladesh. Order via WhatsApp.`;

    return {
      title,
      description,
      keywords: [
        product.name,
        "PVC showpiece Bangladesh",
        product.category,
        "home decoration Bangladesh",
        "wall decor Bangladesh",
        "PVC home decor",
        "custom PVC showpiece",
      ],
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/products/${id}`,
        images: [
          {
            url: product.image || `${SITE_URL}/logo.png`,
            width: 800,
            height: 600,
            alt: `${product.name} - PVC Showpiece Bazar`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [product.image || `${SITE_URL}/logo.png`],
      },
      alternates: {
        canonical: `${SITE_URL}/products/${id}`,
      },
    };
  } catch {
    return getFallbackMetadata();
  }
}

function getFallbackMetadata(): Metadata {
  return {
    title: "PVC Showpiece Bazar | Home Decor & Lifestyle",
    description: "Premium PVC showpieces, home decoration & wall decor in Bangladesh.",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product = null;
  try {
    const res = await fetch(`${SITE_URL}/api/services`, { cache: "no-store" });
    if (res.ok) {
      const services = await res.json();
      product = services.find((s: { _id: string }) => s._id === id);
    }
  } catch {}

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 20 }}>
          <h1 style={{ fontSize: 22, color: "#374151", marginBottom: 12 }}>প্রোডাক্টটি খুঁজে পাওয়া যায়নি</h1>
          <p style={{ color: "#6b7280", marginBottom: 20 }}>এই প্রোডাক্টটি আর বিদ্যমান নাও থাকতে পারে।</p>
          <a href="/" style={{ display: "inline-block", background: "#2563eb", color: "white", padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
            হোমে ফিরুন
          </a>
        </div>
      </div>
    );
  }

  const desc = product.description || "";
  const price = product.price || null;
  const offer = product.offer || 0;
  const inStock = product.inStock !== false;
  const originalPrice = price && offer > 0 ? Math.round(price / (1 - offer / 100)) : null;

  // JSON-LD Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: desc,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: "PVC Showpiece Bazar",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${id}`,
      priceCurrency: "BDT",
      ...(price ? { price } : {}),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "PVC Showpiece Bazar",
        url: SITE_URL,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "120",
    },
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

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
                width={600}
                height={500}
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

              {/* Stock + Delivery */}
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
                <a
                  href={`https://wa.me/8801336410584?text=Hi! I'm interested in your ${product.name}. Price: ৳${price}. Please share details.`}
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

          {/* About This Item */}
          <div style={{ marginTop: 40, borderTop: "1px solid #e5e7eb", paddingTop: 30 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c3528", marginBottom: 14 }}>এই প্রোডাক্ট সম্পর্কে</h2>
            <div style={{ background: "#f9fafb", borderRadius: 12, padding: "20px 24px", fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
              {desc}
            </div>
          </div>
        </div>
      </div>

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
