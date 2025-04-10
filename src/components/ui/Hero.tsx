'use client';
import Image from "next/image";
import { Button } from "./Button";

export default function Hero() {
    return (
        <section className="px-6 md:px-20 pt-16 pb-20 bg-gradient-to-b from-[#1a1a1a] to-black">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                {/* Texto */}
                <div className="max-w-xl">
                    <h1 className="text-white text-4xl md:text-5xl font-semibold leading-tight mb-3">
                        Bem-vindo ao
                    </h1>
                    <h2 className="text-pink-500 text-[52px] md:text-[70px] leading-tight font-extrabold font-orbitron mb-6">
                        Anime <br /> Connect
                    </h2>
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                        O app definitivo para fãs de anime e mangá! Compartilhe, converse, descubra novos títulos e ganhe XP.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="primary">Entrar na Comunidade</Button>
                        <Button variant="outline">Ver Funcionalidades</Button>
                    </div>
                </div>

                {/* Avatar */}
                <div className="w-full lg:w-[400px] drop-shadow-[0_0_80px_rgba(236,72,153,0.8)]">
                    <Image
                        src="/avatar.png"
                        alt="Avatar"
                        width={500}
                        height={500}
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </section>
    );
}
