import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pvcshowpiecebazar.shop";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PVC Showpiece Bazar | Custom PVC Home Decor & Showpieces in Bangladesh",
    template: "%s | PVC Showpiece Bazar",
  },
  description:
    "Shop premium handcrafted PVC showpieces, home decoration, wall decor, and custom showpieces in Bangladesh. Custom PVC Name Showpiece, Couple Showpiece, Family Showpiece & Calligraphy Art. Free delivery across Bangladesh.",
  keywords: [
    "PVC showpiece Bangladesh",
    "PVC home decor",
    "custom PVC showpiece",
    "wall decor Bangladesh",
    "home decoration Bangladesh",
    "PVC name showpiece",
    "PVC couple showpiece",
    "PVC family showpiece",
    "calligraphy PVC",
    "gift showpiece",
    "PVC art Barisal",
    "home decor Barisal",
    "custom showpiece online",
    "PVC wall decor",
  ],
  authors: [{ name: "PVC Showpiece Bazar" }],
  creator: "PVC Showpiece Bazar",
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: SITE_URL,
    siteName: "PVC Showpiece Bazar",
    title: "PVC Showpiece Bazar | Premium PVC Home Decor & Showpieces",
    description:
      "Shop premium handcrafted PVC showpieces, home decoration, wall decor & custom showpieces in Bangladesh. Free delivery across Bangladesh.",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "PVC Showpiece Bazar - Premium PVC Home Decor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PVC Showpiece Bazar | Premium PVC Home Decor & Showpieces",
    description:
      "Shop premium handcrafted PVC showpieces, home decoration, wall decor & custom showpieces in Bangladesh.",
    images: [`${SITE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PVC Showpiece Bazar",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: "Premium PVC showpieces, home decoration, wall decor & custom showpieces in Bangladesh",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Barisal",
      addressCountry: "BD",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+8801336410584",
      contactType: "customer service",
    },
    sameAs: ["https://www.facebook.com/PVCShowpieceBazar"],
  };

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PVC Showpieces & Home Decor",
    description: "Premium handcrafted PVC showpieces and home decoration items",
    url: SITE_URL,
    numberOfItems: 8,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Custom PVC Showpiece" },
      { "@type": "ListItem", position: 2, name: "PVC Name Showpiece" },
      { "@type": "ListItem", position: 3, name: "PVC Couple Showpiece" },
      { "@type": "ListItem", position: 4, name: "PVC Family Showpiece" },
      { "@type": "ListItem", position: 5, name: "Home Decoration" },
      { "@type": "ListItem", position: 6, name: "Wall Decor" },
      { "@type": "ListItem", position: 7, name: "Calligraphy PVC" },
      { "@type": "ListItem", position: 8, name: "Gift Showpiece" },
    ],
  };

  return (
    <html lang="bn">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="canonical" href={SITE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
        />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
