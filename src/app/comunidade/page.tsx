'use client'

import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import Link from "next/link"

export default function ComunidadePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="h-10" />
      <main className="flex flex-col items-center justify-center px-6 py-20 text-center bg-gradient-to-b from-[#1a1a1a] to-black">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-pink-500">
          Junte-se à nossa Comunidade
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mb-10">
          Conecte-se com outros membros, compartilhe conhecimento e evolua junto com uma rede de pessoas engajadas no crescimento pessoal e profissional.
        </p>

        <Link
          href="/chat"
          className="bg-pink-600 hover:bg-pink-700 transition duration-300 text-white font-semibold py-3 px-8 rounded-full shadow-lg"
        >
          Entrar Agora
        </Link>
      </main>
      <Footer />
    </div>
  )
}
