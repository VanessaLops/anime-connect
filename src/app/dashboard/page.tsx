'use client';

import PeaoAvatar from '@/components/ui/PeaoMembro';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Heart,
    Home,
    Image as ImageIcon,
    LogOut,
    MessageSquare,
    Play,
    Search,
    Send,
    Tv,
    X
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// --- MOCK DATA ---
const animes = [
    { id: 1, title: "Cyberpunk: Edgerunners", description: "Em uma distopia tecnológica, um garoto de rua tenta sobreviver.", ep: "Ep. 10", totalEps: 10, img: "https://wallpapers.com/images/hd/cyberpunk-edgerunners-lucy-looking-back-uh1w8k9r440j4q2r.jpg", category: "Ação", embedUrl: "https://www.youtube.com/embed/JtqIas3bYhg" },
    { id: 2, title: "Solo Leveling", description: "O mundo mudou após a abertura dos portais. Jinwoo caça para sobreviver.", ep: "Ep. 12", totalEps: 12, img: "https://images6.alphacoders.com/134/1347990.png", category: "Fantasia", embedUrl: "https://www.youtube.com/embed/FrO3c7y92cc" },
    { id: 3, title: "One Piece", description: "Luffy busca o maior tesouro do mundo para se tornar o Rei dos Piratas.", ep: "Ep. 1100", totalEps: 100, img: "https://images8.alphacoders.com/133/1338902.png", category: "Aventura", embedUrl: "https://www.youtube.com/embed/AQeJHj8D3CI" },
];

const mangas = [
    { id: 1, title: "Berserk", chapter: "Cap. 375", author: "Kentaro Miura", img: "https://images4.alphacoders.com/653/653770.jpg", pages: ["https://i.pinimg.com/736x/f5/66/29/f566297340632d0f94a87b8979c3224b.jpg"] },
    { id: 2, title: "Chainsaw Man", chapter: "Cap. 150", author: "Tatsuki Fujimoto", img: "https://images8.alphacoders.com/116/1169038.jpg", pages: ["https://i.pinimg.com/564x/4d/97/34/4d9734458f334a949f22770287342797.jpg"] },
    { id: 3, title: "Jujutsu Kaisen", chapter: "Cap. 240", author: "Gege Akutami", img: "https://images5.alphacoders.com/133/1330367.png", pages: ["https://i.pinimg.com/564x/13/20/39/132039206775553e433767576007204f.jpg"] },
];

const arts = [
    { id: 1, artist: "Kuvshinov", img: "https://images.alphacoders.com/133/1332782.png", likes: 230 },
    { id: 2, artist: "Wlop", img: "https://images3.alphacoders.com/132/1328471.jpeg", likes: 540 },
    { id: 3, artist: "Guweiz", img: "https://images4.alphacoders.com/131/1310708.jpeg", likes: 120 },
    { id: 4, artist: "RossDraws", img: "https://images7.alphacoders.com/133/1339379.png", likes: 890 },
    { id: 5, artist: "ArtGerm", img: "https://images5.alphacoders.com/133/1339850.png", likes: 410 },
    { id: 6, artist: "Sakimichan", img: "https://images3.alphacoders.com/134/1341065.jpeg", likes: 330 },
];

const initialPosts = [
    { id: 1, user: "Ratinha do Bequinho", avatar: "https://api.dicebear.com/7.x/adventurer/png?seed=Ratinha", time: "2 min atrás", text: "Gente, o que foi esse final?! 😱", image: "https://images5.alphacoders.com/133/1330367.png", likes: 42, comments: 5 },
    { id: 2, user: "Otaku Master", avatar: "https://api.dicebear.com/7.x/adventurer/png?seed=Otaku", time: "1 hora atrás", text: "Minha coleção cresceu!", image: null, likes: 120, comments: 12 },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('animes'); // Começa em Animes como pedido
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    // Estados de Controle
    const [watchingAnime, setWatchingAnime] = useState<any>(null);
    const [currentEp, setCurrentEp] = useState(1);
    const [readingManga, setReadingManga] = useState<any>(null);
    const [mangaPage, setMangaPage] = useState(0);
    const [selectedArt, setSelectedArt] = useState<any>(null);
    const [feedPosts, setFeedPosts] = useState(initialPosts);
    const [newPostText, setNewPostText] = useState("");

    useEffect(() => {
        const stored = sessionStorage.getItem('currentUser');
        if (!stored) { router.push('/'); return; }
        const parsedUser = JSON.parse(stored);
        if (parsedUser.type === 'Visitante') { alert("Acesso restrito."); router.push('/'); return; }
        setUser(parsedUser);
    }, [router]);

    const handleCreatePost = () => {
        if (!newPostText.trim()) return;
        const newPost = {
            id: Date.now(),
            user: user.username,
            avatar: user.image || "https://api.dicebear.com/7.x/adventurer/png?seed=User",
            time: "Agora mesmo",
            text: newPostText,
            image: null,
            likes: 0,
            comments: 0
        };
        setFeedPosts([newPost, ...feedPosts]);
        setNewPostText("");
    };

    const handleWatch = (anime: any) => { setWatchingAnime(anime); setCurrentEp(1); };
    const handleRead = (manga: any) => { setReadingManga(manga); setMangaPage(0); };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">

            {/* SIDEBAR */}
            <aside className="w-20 lg:w-64 bg-black/60 border-r border-white/10 flex flex-col justify-between py-6 z-20 backdrop-blur-xl shrink-0">
                <div>
                    <div className="px-6 mb-10 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-tr from-anime-pink to-anime-purple rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(255,0,128,0.5)]">AC</div>
                        <span className="hidden lg:block font-display font-bold text-xl tracking-wider">ANIME<span className="text-anime-pink">CONNECT</span></span>
                    </div>
                    <nav className="space-y-2 px-3">
                        <SidebarItem icon={<Home size={22} />} label="Feed Social" active={activeTab === 'feed'} onClick={() => { setActiveTab('feed'); setWatchingAnime(null); }} />
                        <SidebarItem icon={<Tv size={22} />} label="Animes Online" active={activeTab === 'animes'} onClick={() => { setActiveTab('animes'); setWatchingAnime(null); }} />
                        <SidebarItem icon={<BookOpen size={22} />} label="Mangás" active={activeTab === 'mangas'} onClick={() => { setActiveTab('mangas'); setWatchingAnime(null); }} />
                        <SidebarItem icon={<ImageIcon size={22} />} label="Galeria de Artes" active={activeTab === 'artes'} onClick={() => { setActiveTab('artes'); setWatchingAnime(null); }} />
                    </nav>
                </div>
                <div className="px-3 space-y-2">
                    <button onClick={() => { sessionStorage.removeItem('currentUser'); router.push('/'); }} className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut size={22} /><span className="hidden lg:block font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* ÁREA PRINCIPAL */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Header */}
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-10 shrink-0">
                    <h2 className="text-2xl font-display font-bold text-white capitalize flex items-center gap-2">
                        {watchingAnime ? <button onClick={() => setWatchingAnime(null)} className="flex gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft /> Voltar</button> :
                            readingManga ? <button onClick={() => setReadingManga(null)} className="flex gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft /> Sair do Leitor</button> :
                                activeTab === 'feed' ? 'Social Feed' : activeTab === 'animes' ? 'Animes & Streaming' : activeTab === 'mangas' ? 'Biblioteca de Mangás' : 'Galeria de Arte'}
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input type="text" placeholder="Pesquisar..." className="bg-[#1a1a1a] border border-white/10 rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:border-anime-purple focus:outline-none" />
                        </div>
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <PeaoAvatar {...user} isTyping={false} showName={false} className="scale-110" />
                        </div>
                    </div>
                </header>

                {/* Conteúdo Dinâmico */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a]">

                    {/* === ABA FEED === */}
                    {activeTab === 'feed' && (
                        <div className="max-w-2xl mx-auto p-8 space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-xl">
                                <div className="flex gap-4">
                                    <PeaoAvatar {...user} isTyping={false} showName={false} />
                                    <div className="flex-1">
                                        <textarea
                                            value={newPostText}
                                            onChange={(e) => setNewPostText(e.target.value)}
                                            placeholder="O que você está assistindo/lendo hoje?"
                                            className="w-full bg-transparent resize-none outline-none text-white text-base placeholder:text-gray-600 h-20 custom-scrollbar"
                                        />
                                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                            <div className="flex gap-4 text-anime-purple">
                                                <ImageIcon size={20} className="cursor-pointer hover:text-white transition-colors" />
                                                <Tv size={20} className="cursor-pointer hover:text-white transition-colors" />
                                            </div>
                                            <button onClick={handleCreatePost} className="flex items-center gap-2 bg-gradient-to-r from-anime-pink to-anime-purple px-6 py-2 rounded-full font-bold text-sm hover:shadow-[0_0_15px_rgba(255,0,128,0.4)] transition-all">
                                                <Send size={14} /> Publicar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {feedPosts.map((post) => (
                                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                                <Image src={post.avatar} alt="avatar" width={40} height={40} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white">{post.user}</p>
                                                <p className="text-xs text-gray-500">{post.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 pb-2 text-gray-200 text-sm leading-relaxed">{post.text}</div>
                                    {post.image && <div className="w-full h-64 bg-gray-800 relative mt-2"><Image src={post.image} alt="Post" fill className="object-cover" /></div>}
                                    <div className="p-4 flex items-center gap-6 text-gray-400 text-sm">
                                        <button className="flex items-center gap-2 hover:text-anime-pink"><Heart size={18} /> {post.likes}</button>
                                        <button className="flex items-center gap-2 hover:text-white"><MessageSquare size={18} /> {post.comments}</button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* === ABA ANIMES (VISUAL CLÁSSICO RESTAURADO) === */}
                    {activeTab === 'animes' && (
                        watchingAnime ? (
                            // Player Mode
                            <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6 animate-in fade-in">
                                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
                                    <iframe src={`${watchingAnime.embedUrl}?autoplay=1`} className="w-full h-full" allowFullScreen allow="autoplay" />
                                </div>
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    <h1 className="text-3xl font-bold text-white font-display">{watchingAnime.title} <span className="text-anime-cyan text-xl">Ep. {currentEp}</span></h1>
                                    <div className="flex gap-2">
                                        <button onClick={() => setCurrentEp(Math.max(1, currentEp - 1))} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"><ChevronLeft /></button>
                                        <button onClick={() => setCurrentEp(Math.min(watchingAnime.totalEps, currentEp + 1))} className="px-4 py-2 bg-anime-pink rounded-lg hover:bg-pink-600 text-white"><ChevronRight /></button>
                                    </div>
                                </div>
                                <div className="bg-[#121212] p-6 rounded-2xl border border-white/10">
                                    <h3 className="font-bold mb-4 flex gap-2"><Tv size={18} className="text-anime-purple" /> Episódios</h3>
                                    <div className="grid grid-cols-6 md:grid-cols-10 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                        {Array.from({ length: watchingAnime.totalEps }, (_, i) => i + 1).map(ep => (
                                            <button key={ep} onClick={() => setCurrentEp(ep)} className={`h-10 rounded font-bold text-sm ${currentEp === ep ? 'bg-anime-cyan text-black' : 'bg-white/5 hover:bg-white/10'}`}>{ep}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // CATALOG MODE (VISUAL RESTAURADO: Capa + Título Embaixo)
                            <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
                                {/* Hero Banner */}
                                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-10 group shadow-2xl border border-white/10">
                                    <Image src={animes[0].img} alt="Hero" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-8 md:p-12 z-10">
                                        <span className="px-3 py-1 bg-anime-pink text-white text-xs font-bold rounded-full mb-4 inline-block">Destaque</span>
                                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 text-white drop-shadow-lg">{animes[0].title}</h1>
                                        <p className="text-gray-200 max-w-xl mb-6 line-clamp-2 drop-shadow-md text-lg">{animes[0].description}</p>
                                        <button onClick={() => handleWatch(animes[0])} className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-anime-cyan transition-colors">
                                            <Play fill="black" size={18} /> Assistir Agora
                                        </button>
                                    </div>
                                </div>

                                {/* Grid de Animes (Restaurado para Title Below Card) */}
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white"><span className="w-1 h-6 bg-anime-purple rounded-full" /> Catálogo Completo</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {animes.map((anime) => (
                                        <div key={anime.id} onClick={() => handleWatch(anime)} className="group cursor-pointer">
                                            {/* Card Imagem */}
                                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-white/5 group-hover:border-anime-pink/50 transition-all shadow-lg">
                                                <Image src={anime.img} alt={anime.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold border border-white/10 z-10 text-white">
                                                    {anime.ep}
                                                </div>
                                                {/* Overlay Hover */}
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    <div className="w-12 h-12 bg-anime-pink rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,0,128,0.6)] transform scale-0 group-hover:scale-100 transition-transform">
                                                        <Play fill="white" size={20} className="ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Info Abaixo do Card (Restaurado) */}
                                            <h4 className="font-bold truncate text-white group-hover:text-anime-pink transition-colors">{anime.title}</h4>
                                            <p className="text-xs text-gray-500">{anime.category}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}

                    {/* === ABA MANGÁS === */}
                    {activeTab === 'mangas' && (
                        readingManga ? (
                            // Leitor
                            <div className="flex flex-col items-center p-6 space-y-6 animate-in zoom-in duration-300 min-h-full">
                                <div className="relative max-w-4xl w-full bg-white/5 rounded-xl overflow-hidden shadow-2xl border border-white/10 min-h-[800px]">
                                    <div className="relative w-full h-full min-h-[80vh]">
                                        <Image src={readingManga.pages[0]} alt="Manga Page" fill className="object-contain" unoptimized />
                                    </div>
                                    <div className="absolute inset-0 flex justify-between items-center px-4 opacity-0 hover:opacity-100 transition-opacity">
                                        <button className="p-4 bg-black/50 rounded-full hover:bg-anime-pink" onClick={() => setMangaPage(Math.max(0, mangaPage - 1))}><ChevronLeft /></button>
                                        <button className="p-4 bg-black/50 rounded-full hover:bg-anime-pink" onClick={() => setMangaPage(mangaPage + 1)}><ChevronRight /></button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Catálogo Mangá
                            <div className="p-8 animate-in fade-in">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white"><span className="w-1 h-6 bg-orange-500 rounded-full" /> Lendo Recentemente</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
                                    {mangas.map((manga) => (
                                        <div key={manga.id} onClick={() => handleRead(manga)} className="group cursor-pointer">
                                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-lg border border-white/5 hover:border-orange-500 transition-all">
                                                <Image src={manga.img} fill className="object-cover group-hover:scale-110 transition-transform duration-500" alt={manga.title} />
                                                <div className="absolute top-2 left-2 bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded shadow-lg">MANGA</div>
                                            </div>
                                            <h4 className="font-bold text-white truncate group-hover:text-orange-500">{manga.title}</h4>
                                            <p className="text-xs text-gray-500">{manga.author}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}

                    {/* === ABA ARTES === */}
                    {activeTab === 'artes' && (
                        <div className="p-8">
                            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                                {arts.map((art) => (
                                    <div key={art.id} onClick={() => setSelectedArt(art)} className="break-inside-avoid relative rounded-xl overflow-hidden group cursor-zoom-in border border-white/5 hover:border-white/20 transition-all">
                                        <Image src={art.img} alt={art.artist} width={500} height={700} className="w-full h-auto object-cover group-hover:brightness-110 transition-all" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <p className="font-bold text-white">{art.artist}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-300"><Heart size={12} className="text-anime-pink" fill="currentColor" /> {art.likes}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <AnimatePresence>
                                {selectedArt && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedArt(null)}>
                                        <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center">
                                            <button className="absolute top-4 right-4 bg-white/10 p-2 rounded-full hover:bg-white/20 z-50"><X size={24} /></button>
                                            <div className="relative w-full h-[80vh]"><Image src={selectedArt.img} fill className="object-contain" alt="Full Art" /></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-gradient-to-r from-anime-pink/20 to-transparent text-white border-l-4 border-anime-pink' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <div className={`${active ? 'text-anime-pink' : 'group-hover:text-white'} transition-colors`}>{icon}</div>
            <span className={`font-medium hidden lg:block ${active ? 'font-bold' : ''}`}>{label}</span>
        </button>
    );
}