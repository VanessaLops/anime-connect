'use client';
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 bg-gradient-to-tr from-anime-pink to-anime-purple rounded-lg flex items-center justify-center font-bold text-white">
                        AC
                        <div className="absolute inset-0 bg-white/20 blur-lg group-hover:blur-xl transition-all" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-wider text-white">
                        ANIME<span className="text-anime-pink">CONNECT</span>
                    </span>
                </Link>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <Link href="/comunidade" className="hover:text-white transition-colors">Comunidade</Link>
                    <Link href="#niveis" className="hover:text-white transition-colors">Sistema de Níveis</Link>
                    <Link href="#economia" className="hover:text-white transition-colors">Loja & Coins</Link>
                </nav>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                        Login
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-anime-cyan hover:text-black transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    >
                        <Sparkles size={16} />
                        Entrar Agora
                    </motion.button>
                </div>
            </div>
        </header>
    );
}