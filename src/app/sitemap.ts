import type { MetadataRoute } from "next";
import { PRIVACY_PATH, TERMS_PATH } from "@/core/routes";
import { SITE_URL } from "@/core/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...[PRIVACY_PATH, TERMS_PATH].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
