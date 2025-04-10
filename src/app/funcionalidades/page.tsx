'use client'

import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import Image from "next/image"

const funcionalidades = [
  {
    titulo: "Dashboard Interativa",
    descricao: "Visualize dados em tempo real com gráficos dinâmicos.",
    imagem: "/funcionalidades/dashboard.png",
  },
  {
    titulo: "Níveis de Usuário",
    descricao: "Sistema de progressão com 10 níveis exclusivos.",
    imagem: "/funcionalidades/levels.png",
  },
  {
    titulo: "Notificações em Tempo Real",
    descricao: "Receba alertas instantâneos de mudanças importantes.",
    imagem: "/funcionalidades/notificacoes.png",
  },
  {
    titulo: "Personalização de Perfil",
    descricao: "Customize seu avatar, banner e bio como quiser.",
    imagem: "/funcionalidades/perfil.png",
  },
  {
    titulo: "Sistema de Recompensas",
    descricao: "Ganhe pontos e conquistas com base nas suas ações.",
    imagem: "/funcionalidades/recompensas.png",
  },
  {
    titulo: "Suporte Integrado",
    descricao: "Ajuda ao vivo para dúvidas e resolução de problemas.",
    imagem: "/funcionalidades/suporte.png",
  },
]

export default function FuncionalidadesPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />

      {/* Espaçamento entre header e conteúdo */}
      <div className="h-10" />

      <main className="px-6 md:px-20 py-16 bg-gradient-to-b from-[#1a1a1a] to-black">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center">
          Funcionalidades da Plataforma
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {funcionalidades.map((item, index) => (
            <div
              key={index}
              className="bg-[#111] rounded-xl p-6 text-center shadow-md hover:shadow-pink-500/20 transition-shadow duration-300"
            >
              <div className="w-full h-[180px] mb-4 relative">
                <Image
                  src={item.imagem}
                  alt={item.titulo}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-pink-500">{item.titulo}</h2>
              <p className="text-gray-300">{item.descricao}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
