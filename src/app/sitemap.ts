import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pvcshowpiecebazar.shop";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  try {
    const res = await fetch(`${SITE_URL}/api/services`, {
      cache: "no-store",
    });

    if (res.ok) {
      const services = await res.json();

      if (Array.isArray(services)) {
        const serviceEntries: MetadataRoute.Sitemap = services.map(
          (service: { _id: string; createdAt?: string }) => ({
            url: `${SITE_URL}/products/${service._id}`,
            lastModified: service.createdAt
              ? new Date(service.createdAt)
              : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          })
        );

        return [...baseEntries, ...serviceEntries];
      }
    }
  } catch {
    // API not available during build, return base only
  }

  return baseEntries;
}
