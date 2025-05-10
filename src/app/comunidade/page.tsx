'use client';


import { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../firebase";
import { GroupData } from "@/components/ui/SideBar";
import Link from "next/link";
export default function ComunidadePage() {

  const [selectedCategory, setSelectedCategory] = useState<string>("ComunidadE");
  const [groupChats, setGroupChats] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<Record<string, GroupData> | null>(null);
  const [loading, setLoading] = useState(false);

  const gruposArray = grupos ? Object.values(grupos) : [];


  const buscarGrupos = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(database, "grupos"));
      if (snapshot.exists()) {
        const gruposData = snapshot.val();
        const gruposComMembros: Record<string, GroupData> = Object.keys(gruposData).reduce(
          (acc, key) => {
            acc[key] = {
              ...gruposData[key],
              members: gruposData[key].members || [],
              groupId: key,
            };
            return acc;
          },
          {} as Record<string, GroupData>
        );
        setGrupos(gruposComMembros);
      } else {
        setGrupos(null);
      }
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarGrupos();
  }, []);


  useEffect(() => {
    if (grupos) {
      const filteredGroups = gruposArray.filter((group) => group.category === selectedCategory);
      setGroupChats(filteredGroups);
    }
  }, [selectedCategory, grupos]);

  const handleCategoryChange = (categoria: string) => {
    setSelectedCategory(categoria);
  };


console.log(grupos,'gruposgrupos')
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="h-10" />
      <main className="flex flex-col items-center justify-center px-6 py-20 text-center bg-gradient-to-b from-[#1a1a1a] to-black">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-pink-500">
          Junte-se à nossa Comunidade
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mb-16">
          Conecte-se com outros membros, compartilhe conhecimento e evolua junto com uma rede de pessoas engajadas no crescimento pessoal e profissional.
        </p>


        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={2}
          spaceBetween={16}
          className="mb-8 w-full max-w-3xl"
        >
          {gruposArray.map((group, index) => (
            <SwiperSlide key={index}>
              <div className="px-2">
                <button
                  onClick={() => handleCategoryChange(group.category)}
                  className={`w-full text-white py-3 px-6 rounded-md transition-colors duration-300 ${selectedCategory === group.category
                    ? "bg-pink-600"
                    : "bg-gray-600 hover:bg-pink-500"
                    }`}
                >
                  {group.category}
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>


        <div className="w-full max-w-6xl mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-left">
            {selectedCategory}
          </h2>
          <Swiper
            modules={[Autoplay, Navigation]}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation
            loop
            className="w-full"
          >
            {groupChats.map((chat, i) => (
              <SwiperSlide key={i}>
                <Link href={`/chat/${chat?.groupId}`}>
                  <div
                    className="cursor-pointer bg-[#1f1f1f] rounded-2xl p-4 m-2 shadow-lg hover:scale-105 transition-transform duration-300">
                    {chat?.background?.endsWith(".mp4") ? (
                      <video
                        src={chat?.background}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <img
                        src={chat?.background}
                        alt="background"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    )}

                    <h3 className="text-xl font-semibold mb-2">{chat.name}</h3>
                    <p className="text-pink-500">{chat.members ? Object.keys(chat.members).length : 0} membros ativos</p>
                  </div>
                </Link>

              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>
      <Footer />
    </div>
  );
}
