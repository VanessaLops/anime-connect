'use client'


import Header from "@/components/ui/Header";
import Hero from "@/components/ui/Hero";
import Features from "@/components/ui/Features";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <Hero />
      {/* <Features /> */}
      <Footer />
    </div>
  );
}
