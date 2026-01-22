
'use client';
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col justify-center overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-anime-purple/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-anime-pink/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">


                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-anime-pink/30 bg-anime-pink/10 text-anime-pink text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-anime-pink animate-pulse" />
                        A V2 Chegou
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-[1.1] mb-6 text-white">
                        Sua Vida Otaku <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-anime-pink via-purple-500 to-anime-cyan">
                            Gamificada.
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
                        Não apenas assista. Evolua. Suba de nível interagindo, desbloqueie
                        customizações de perfil, ganhe moedas e torne-se uma lenda na comunidade.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-4 bg-gradient-to-r from-anime-pink to-anime-purple rounded-lg text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(255,0,128,0.4)] transition-all transform hover:-translate-y-1">
                            Criar Conta Grátis
                        </button>
                        <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg text-white font-semibold hover:bg-white/10 transition-all">
                            Ver Benefícios
                        </button>
                    </div>
                    <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-black" />
                            ))}
                        </div>
                        <p>+2.000 Otakus já estão evoluindo</p>
                    </div>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >

                    <div className="relative z-10 bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500" />
                                <div>
                                    <h3 className="text-white font-bold text-lg">Sua Conta</h3>
                                    <p className="text-anime-cyan font-mono text-sm">Nível 5 • Influencer</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded font-bold">ONLINE</div>
                        </div>


                        <div className="mb-2 flex justify-between text-xs text-gray-400">
                            <span>XP Atual</span>
                            <span>325 / 500 XP</span>
                        </div>
                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-6">
                            <div className="h-full w-[65%] bg-gradient-to-r from-anime-pink to-anime-purple" />
                        </div>


                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500">Carteira</p>
                                <p className="text-white font-bold">2.400 Coins</p>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500">Spotify</p>
                                <p className="text-green-400 font-bold">Ativado</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-anime-cyan/20 blur-2xl rounded-full" />
                </motion.div>
            </div>
        </section>
    );
}