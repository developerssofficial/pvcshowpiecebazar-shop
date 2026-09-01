import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PVC Showpiece Bazar | Home Decor & Lifestyle",
  description:
    "PVC Showpiece Bazar - আমরা আপনার পছন্দমতো কাস্টমাইজড PVC শোপিস তৈরি করি। Custom PVC Showpiece, Name Showpiece, Couple Showpiece, Family Showpiece, Home Decoration, Wall Decor, Calligraphy PVC, Gift Showpiece।",
  keywords: [
    "PVC showpiece",
    "home decor",
    "PVC art",
    "showpiece shop",
    "PVC bazar",
    "custom showpiece",
    "name showpiece",
    "couple showpiece",
    "family showpiece",
    "wall decor",
    "calligraphy PVC",
    "gift showpiece",
    "home decoration",
    "Barisal",
    "Bangladesh",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
