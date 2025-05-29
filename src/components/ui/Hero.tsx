'use client';
import Image from "next/image";
import { Button } from "./Button";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="px-6 md:px-20 pt-16 pb-20 bg-gradient-to-b from-[#1a1a1a] to-black">
            <motion.div
                className="mt-[80px] flex flex-col lg:flex-row items-center justify-between gap-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.div
                    className="max-w-xl"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <h1 className="text-white text-4xl md:text-5xl font-semibold leading-tight mb-3">
                        TESTE DEVELOPMENT
                    </h1>
                    <h2 className="text-pink-500 text-[52px] md:text-[70px] leading-tight font-extrabold font-orbitron mb-6">
                        Anime <br /> Connect
                    </h2>
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                        O app definitivo para fãs de anime e mangá! Compartilhe, converse, descubra novos títulos e ganhe XP.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="primary" href="/comunidade">Entrar nas Comunidade</Button>
                        <Button variant="outline" href="/funcionalidades">Ver Funcionalidades</Button>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
