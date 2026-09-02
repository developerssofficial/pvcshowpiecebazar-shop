import type { Metadata } from "next";
import ProductClient from "./ProductClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pvcshowpiecebazar.shop";

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

  return <ProductClient product={product} />;
}
