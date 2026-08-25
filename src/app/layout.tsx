import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/orbitron";


export const metadata: Metadata = {
  title: "AnimeConnect — Beta Galaxy",
  description: "Uma galáxia conectada por animes. AnimeConnect está em beta, rumo à sua v1.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="font-sans antialiased selection:bg-anime-pink selection:text-white">
        {children}
      </body>
    </html>
  );
}
