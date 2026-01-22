import { Crown, Heart, Lock, Unlock, Zap } from "lucide-react";

// (Mantenha seu array de levels aqui igual ao anterior...)
const levels = [
    {
        lvl: 1,
        title: "Iniciante",
        xp: "0 - 100 XP",
        features: ["Acesso aos posts", "Dar Likes", "Comentar"],
        status: "unlocked",
        icon: <Zap size={20} />
    },
    {
        lvl: 2,
        title: "Explorador",
        xp: "150 XP",
        features: ["Spotify no Perfil", "Background Custom", "Status Personalizado"],
        status: "locked",
        icon: <Heart size={20} />
    },
    {
        lvl: 3,
        title: "Membro VIP",
        xp: "200 XP",
        features: ["Assistir Animes", "Ler Mangás", "Embeds exclusivos"],
        status: "locked",
        icon: <Crown size={20} />
    },
    // ... adicione os outros níveis
];

export default function LevelSystem() {
    return (

        <section id="niveis" className="relative z-20 px-6 -mt-32 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levels.map((level, index) => (
                        <div
                            key={level.lvl}
                            className={`relative bg-[#121212]/90 backdrop-blur-xl p-6 rounded-2xl border ${level.status === 'unlocked' ? 'border-anime-pink shadow-[0_0_20px_rgba(255,0,128,0.15)]' : 'border-white/10'} hover:-translate-y-2 transition-transform duration-300 group`}
                        >

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-anime-cyan transition-colors flex items-center gap-2">
                                        {level.icon && <span className={level.status === 'unlocked' ? "text-anime-pink" : "text-gray-500"}>{level.icon}</span>}
                                        {level.title}
                                    </h3>
                                    <p className="text-xs font-mono text-gray-500 uppercase mt-1">Nível {level.lvl} • {level.xp}</p>
                                </div>
                                {level.status === 'locked' ? <Lock size={16} className="text-gray-600" /> : <Unlock size={16} className="text-anime-pink" />}
                            </div>


                            <ul className="space-y-2 mb-4 min-h-[80px]">
                                {level.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-anime-purple" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${level.status === 'unlocked' ? 'bg-anime-pink w-full' : 'bg-gray-700 w-0'}`} />
                            </div>
                        </div>
                    ))}
                    <div className="bg-gradient-to-br from-anime-purple to-[#4c1d95] p-6 rounded-2xl flex flex-col justify-center items-center text-center text-white shadow-lg transform hover:scale-[1.02] transition-transform">
                        <h3 className="text-2xl font-bold mb-2">Evolua Rápido!</h3>
                        <p className="text-sm opacity-90 mb-6">
                            Complete missões diárias para ganhar XP extra e desbloquear o Nível 2 hoje mesmo.
                        </p>
                        <button className="bg-white text-anime-purple px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                            Ver Missões
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}