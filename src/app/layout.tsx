import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/core/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AnimeConnect",
    "rede social de anime",
    "comunidade de anime",
    "chat de anime",
    "app de anime",
    "fãs de anime",
    "assistir anime online",
  ],
  authors: [{ name: SITE_NAME }],
  applicationName: SITE_NAME,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/logo.png", width: 1200, height: 1200, alt: `${SITE_NAME} — Beta Galaxy` }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
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

export const viewport: Viewport = {
  themeColor: "#010A13",
  colorScheme: "dark",
};

// Cinzel (serifada de inscrição) nos títulos, Inter no texto — o par
// display/body do tema hextech. Expostas como variáveis pro Tailwind.
const displayFont = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
  display: "swap",
});
const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`scroll-smooth ${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-sans antialiased selection:bg-hex-gold selection:text-hex-navy">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
      </body>
    </html>
  );
}
