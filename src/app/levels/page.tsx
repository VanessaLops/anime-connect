'use client'
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Image from "next/image";

const levels = [
  { title: "Level 1", description: "Iniciante Otaku", image: "/levels/level1.png" },
  { title: "Level 2", description: "Otaku Curioso", image: "/levels/level2.png" },
  { title: "Level 3", description: "Otaku Fã", image: "/levels/level3.png" },
  { title: "Level 4", description: "Otaku Viciado", image: "/levels/level4.png" },
  { title: "Level 5", description: "Senpai", image: "/levels/level5.png" },
  { title: "Level 6", description: "Mestre dos Animes", image: "/levels/level6.png" },
  { title: "Level 7", description: "Colecionador de Mangás", image: "/levels/level7.png" },
  { title: "Level 8", description: "Otaku Pro", image: "/levels/level8.png" },
  { title: "Level 9", description: "Deus do Anime", image: "/levels/level9.png" },
  { title: "Level 10", description: "Lendário Otaku Supremo", image: "/levels/level10.png" },
];

export default function LevelsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <div className="h-10" />
      <main className="px-6 md:px-20 py-16 bg-gradient-to-b from-[#1a1a1a] to-black">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center">
          Níveis de Experiência
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {levels.map((level, idx) => (
            <div
              key={idx}
              className="bg-[#111] rounded-xl p-6 text-center shadow-md hover:shadow-pink-500/20 transition-shadow duration-300"
            >
              <div className="w-full h-[180px] mb-4 relative">
                <Image
                  src={level.image}
                  alt={level.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-pink-500">{level.title}</h2>
              <p className="text-gray-300">{level.description}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
