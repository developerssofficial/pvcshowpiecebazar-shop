import type { MetadataRoute } from "next";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pvcshowpiecebazar.shop";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/checkout`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const db = await getDb();
    const services = await db
      .collection("services")
      .find({}, { projection: { _id: 1, updatedAt: 1, createdAt: 1 } })
      .toArray();

    const productRoutes: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${SITE_URL}/products/${service._id.toString()}`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : (service.createdAt ? new Date(service.createdAt) : new Date()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return routes;
  }
}
