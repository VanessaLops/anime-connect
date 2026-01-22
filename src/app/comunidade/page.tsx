'use client';

import Footer from "@/components/ui/Footer"; // Certifique-se que o Footer V2 está aqui
import Header from "@/components/ui/Header";
import { off, onValue, ref } from "firebase/database";
import { motion } from "framer-motion";
import { Hash, Search, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { database } from "../../pages/api/lib/firebase"; // Ajuste o caminho se necessário

// Tipagem (Mantida a sua ou ajustada se necessário)
export interface GroupData {
  groupId: string;
  name: string;
  category: string;
  background: string;
  members?: Record<string, any> | string[];
  description?: string;
}

export default function ComunidadePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [grupos, setGrupos] = useState<Record<string, GroupData> | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Converter Objeto em Array
  const gruposArray = useMemo(() => {
    return grupos ? Object.values(grupos) : [];
  }, [grupos]);

  // 2. Extrair Categorias Únicas para o Menu
  const categories = useMemo(() => {
    const cats = new Set(gruposArray.map(g => g.category || "Geral"));
    return ["Todos", ...Array.from(cats)];
  }, [gruposArray]);

  // 3. Filtrar Grupos baseados na Categoria Selecionada
  const filteredGroups = useMemo(() => {
    if (selectedCategory === "Todos") return gruposArray;
    return gruposArray.filter((g) => g.category === selectedCategory);
  }, [selectedCategory, gruposArray]);

  // --- Efeito: Buscar Firebase ---
  useEffect(() => {
    const gruposRef = ref(database, "grupos");
    setLoading(true);

    const unsubscribe = onValue(gruposRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Tratamento de dados para garantir o formato correto
        const formattedData: Record<string, GroupData> = Object.keys(data).reduce((acc, key) => {
          acc[key] = {
            ...data[key],
            groupId: key, // Garante que o ID está no objeto
            members: data[key].members || []
          };
          return acc;
        }, {} as Record<string, GroupData>);
        
        setGrupos(formattedData);
      } else {
        setGrupos(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro Firebase:", error);
      setLoading(false);
    });

    return () => off(gruposRef);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-anime-pink selection:text-white overflow-x-hidden">
      <Header />
      
      {/* Background Ambience (Igual a Home V2) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-anime-purple/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-anime-pink/15 rounded-full blur-[120px]" />
      </div>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        
        {/* --- Hero Section da Comunidade --- */}
        <div className="text-center mb-16 relative">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-anime-cyan/30 bg-anime-cyan/10 text-anime-cyan text-xs font-bold uppercase tracking-wider mb-4">
                    <Users size={12} /> Guildas & Clãs
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-6">
                    Explore Comunidades <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-anime-pink via-purple-500 to-anime-cyan">
                        Épicas
                    </span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Encontre seu esquadrão. Discuta teorias, compartilhe fanarts e suba de nível juntos em grupos dedicados aos seus animes e jogos favoritos.
                </p>
            </motion.div>
        </div>

        {/* --- Filtro de Categorias (Estilo Tags) --- */}
        <div className="mb-12">
            <Swiper
                modules={[FreeMode]}
                slidesPerView="auto"
                spaceBetween={12}
                freeMode={true}
                className="w-full max-w-4xl !px-1" // !px-1 evita corte de shadow
            >
                {categories.map((cat, index) => (
                    <SwiperSlide key={index} className="!w-auto">
                        <button
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border
                                ${selectedCategory === cat 
                                    ? "bg-gradient-to-r from-anime-pink to-anime-purple border-transparent text-white shadow-[0_0_15px_rgba(255,0,128,0.4)] scale-105" 
                                    : "bg-[#121212] border-white/10 text-gray-400 hover:border-anime-pink/50 hover:text-white"
                                }
                            `}
                        >
                            {cat === "Todos" ? <Sparkles size={14}/> : <Hash size={14}/>}
                            {cat}
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

        {/* --- Grid de Grupos --- */}
        <div className="min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-display font-bold text-white">
                    {selectedCategory === "Todos" ? "Grupos em Destaque" : `Explorando: ${selectedCategory}`}
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            {loading ? (
                // Skeleton Loading
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="h-[280px] bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredGroups.length === 0 ? (
                // Estado Vazio
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                    <Search size={48} className="mb-4 opacity-50"/>
                    <p>Nenhum grupo encontrado nesta categoria.</p>
                </div>
            ) : (
                // Lista de Grupos
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGroups.map((group) => (
                        <Link href={`/chat/${group.groupId}`} key={group.groupId}>
                            <motion.div 
                                whileHover={{ y: -8 }}
                                className="group relative h-[320px] bg-[#121212] rounded-2xl overflow-hidden border border-white/10 hover:border-anime-pink/50 transition-colors shadow-lg"
                            >
                                {/* Imagem/Vídeo de Fundo */}
                                <div className="absolute inset-0 z-0">
                                    {group.background?.endsWith(".mp4") ? (
                                        <video
                                            src={group.background}
                                            autoPlay loop muted
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105 transform"
                                        />
                                    ) : (
                                        <img
                                            src={group.background || "/placeholder.jpg"}
                                            alt={group.name}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105 transform"
                                        />
                                    )}
                                    {/* Overlay Gradiente para leitura do texto */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                </div>

                                {/* Conteúdo do Card */}
                                <div className="absolute bottom-0 left-0 w-full p-5 z-10">
                                    {/* Tag da Categoria */}
                                    <span className="inline-block px-2 py-0.5 mb-2 rounded bg-white/10 backdrop-blur-md border border-white/10 text-[10px] uppercase font-bold text-anime-cyan">
                                        {group.category}
                                    </span>

                                    <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-anime-pink transition-colors">
                                        {group.name}
                                    </h3>
                                    
                                    <div className="flex items-center justify-between mt-3 text-sm text-gray-300">
                                        <div className="flex items-center gap-1.5">
                                            <Users size={14} className="text-anime-purple" />
                                            <span>
                                                {group.members ? (Array.isArray(group.members) ? group.members.length : Object.keys(group.members).length) : 0}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 font-mono group-hover:text-white transition-colors">
                                            Entrar →
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-anime-pink/30 rounded-2xl pointer-events-none transition-colors" />
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}