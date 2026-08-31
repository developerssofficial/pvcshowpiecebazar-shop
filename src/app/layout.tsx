import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PVC Showpiece Bazar - Premium PVC Showpieces & Decor",
  description:
    "Shop the finest collection of PVC showpieces, home decor items, and artistic creations at PVC Showpiece Bazar. Quality craftsmanship at affordable prices.",
  keywords: [
    "PVC showpiece",
    "home decor",
    "PVC art",
    "showpiece shop",
    "PVC bazar",
    "decorative items",
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
