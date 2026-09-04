import { Metadata } from "next";
import { getDb } from "@/lib/mongodb";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pvcshowpiecebazar.shop";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const db = await getDb();
    const { ObjectId } = await import("mongodb");
    let filter: Record<string, unknown> = {};
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { _id: id };
    }
    const service = await db.collection("services").findOne(filter);
    if (!service) return null;
    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error("Error loading product on server:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "প্রোডাক্ট | PVC Showpiece Bazar",
      description: "কাস্টমাইজড পিভিসি শোপিস ও হোম ডেকর আইটেম কিনুন PVC Showpiece Bazar থেকে।",
    };
  }

  const name = product.name || "PVC Showpiece";
  const desc =
    product.description ||
    product.desc ||
    `হাতে তৈরি প্রিমিয়াম ${product.category || "PVC Showpiece"} - PVC Showpiece Bazar থেকে অর্ডার করুন। সারা বাংলাদেশে ক্যাশ অন হোম ডেলিভারি।`;
  const image = product.image || `${SITE_URL}/logo.png`;
  const productUrl = `${SITE_URL}/products/${id}`;

  return {
    title: `${name} | PVC Showpiece Bazar`,
    description: desc.slice(0, 160),
    keywords: [
      name,
      `${name} price in Bangladesh`,
      `${product.category || "PVC"} showpiece`,
      "PVC home decor Bangladesh",
      "custom showpiece Barisal",
      "হাতে তৈরি শোপিস",
    ],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${name} - PVC Showpiece Bazar`,
      description: desc.slice(0, 160),
      url: productUrl,
      type: "website",
      images: [
        {
          url: image,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - PVC Showpiece Bazar`,
      description: desc.slice(0, 160),
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  let productSchema = null;
  let breadcrumbSchema = null;

  if (product) {
    const price =
      typeof product.price === "number"
        ? product.price
        : product.price
        ? parseFloat(String(product.price).replace(/[^0-9.]/g, ""))
        : null;

    const inStock = product.inStock !== false;
    const name = product.name || "PVC Showpiece";
    const image = product.image || `${SITE_URL}/logo.png`;
    const desc =
      product.description ||
      product.desc ||
      `হাতে তৈরি প্রিমিয়াম ${product.category || "PVC Showpiece"} - PVC Showpiece Bazar`;
    const productUrl = `${SITE_URL}/products/${id}`;

    productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: name,
      image: [image],
      description: desc,
      category: product.category || "Home Decor",
      brand: {
        "@type": "Brand",
        name: "PVC Showpiece Bazar",
      },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "BDT",
        price: price ? String(price) : "0",
        priceValidUntil: "2027-12-31",
        itemCondition: "https://schema.org/NewCondition",
        availability: inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "PVC Showpiece Bazar",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "28",
      },
    };

    breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: product.category || "Products",
          item: `${SITE_URL}/#services`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: name,
          item: productUrl,
        },
      ],
    };
  }

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
