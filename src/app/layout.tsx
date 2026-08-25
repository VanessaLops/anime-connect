import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/orbitron";


export const metadata: Metadata = {
  title: "Anime Conect",
  description: "Seu Bate-Papo Sobre Animes",
  icons: {
    icon: "/logo.png",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
