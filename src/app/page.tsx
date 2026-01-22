import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import Hero from "@/components/ui/Hero";
import LevelSystem from "@/components/ui/LevelSystem";

export default function Home() {
  return (
    <main className="bg-background min-h-screen selection:bg-anime-pink selection:text-white">
      <Header />
      <Hero />
      <LevelSystem />

      <section className="py-20 border-t border-white/5 bg-black">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-6">Missões Diárias & Recompensas</h2>
          <div className="p-8 bg-gradient-to-r from-[#1a1a1a] to-[#111] rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-anime-cyan/10 blur-[50px]" />
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h4 className="text-anime-cyan font-bold mb-2">Login Diário</h4>
                <p className="text-sm text-gray-400">Entre todo dia e acumule XP extra sem esforço.</p>
              </div>
              <div>
                <h4 className="text-anime-cyan font-bold mb-2">Convide Amigos</h4>
                <p className="text-sm text-gray-400">Ganhe status VIP por 3 dias a cada 2 amigos.</p>
              </div>
              <div>
                <h4 className="text-anime-cyan font-bold mb-2">Assista Lives</h4>
                <p className="text-sm text-gray-400">Drops de coins enquanto assiste seus streamers favoritos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}