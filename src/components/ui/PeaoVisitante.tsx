'use client'

import Image from "next/image";
import React from "react";
import "../../styles/animations.css";

// --- IMPORTAÇÃO DOS ÍCONES ---
import visitante from "../../utils/icons/Visitante/visitante.png";
import visitante_lapis from "../../utils/icons/Visitante/visitante_1.gif";

import membro_registro from "../../utils/icons/Membro/membro1.png";
import membro_digitando from "../../utils/icons/Membro/menbro_digitando.gif";

import membro_cachorro from "../../utils/icons/Membro/membro_cachorro.png";
import membro_griter1 from "../../utils/powers/gritter/power_griter_membro.gif";

import dono_geral from "../../utils/icons/dono_geral.png";
import dono_sala from "../../utils/icons/Dono_Sala/owner.png";
import moderador_sala from "../../utils/icons/Moderador/mod.png";

import { User } from "@/utils/userStorage";
import AvatarSlideshow from "./AvatarSlideshow_Power";

// Interface atualizada para suportar estilização externa e controle de exibição
interface AvatarProps extends User {
    isTyping: boolean;
    status?: string;
    vipEmoji?: number;
    showName?: boolean; // Novo: Controla se mostra o nome
    className?: string; // Novo: Para classes CSS extras
}

const PeaoAvatar: React.FC<AvatarProps> = ({
    isTyping,
    username,
    type,
    power,
    relacionamento,
    status,
    showName = true, // Padrão é mostrar o nome
    className = ""
}) => {

    let avatarSrc: any = visitante; // Define visitante como fallback padrão

    // Normaliza o status para checagem
    const isOffline = status?.toLowerCase() === "offline";

    // --- LÓGICA DE POWER ESPECIAL (SLIDESHOW) ---
    if (power === 8) {
        return (
            <div className={`flex items-center gap-2 ${className} ${isOffline ? 'opacity-50 grayscale' : ''}`}>
                <div className="relative w-10 h-10 shrink-0">
                    <AvatarSlideshow
                        images={[dono_geral.src, dono_sala.src, moderador_sala.src]}
                        size={40}
                        interval={1500}
                    />
                    {/* Bolinha de Status */}
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-black rounded-full ${isOffline ? 'bg-gray-500' : 'bg-green-500'}`} />
                </div>

                {showName && (
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-white truncate">{username}</span>
                        {relacionamento && (
                            <span className="text-[10px] text-gray-400 truncate">{relacionamento}</span>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // --- LÓGICA DE SELEÇÃO DE IMAGEM ---
    switch (type) {
        case "Visitante":
            // CORREÇÃO: Agora usa o GIF de lápis se estiver digitando
            avatarSrc = isTyping ? visitante_lapis : visitante;
            break;

        case "Dono_Geral":
            avatarSrc = dono_geral;
            break;

        case "Staff":
            avatarSrc = moderador_sala;
            break;

        case "Dono_Sala":
        case "Sub_Dono": // Adicionado caso precise
            avatarSrc = dono_sala;
            break;

        case "Membro":
            if (isTyping) {
                avatarSrc = membro_digitando;
            } else {
                switch (power) {
                    case 1:
                        avatarSrc = membro_griter1;
                        break;
                    case 2:
                        avatarSrc = membro_cachorro;
                        break;
                    default:
                        avatarSrc = membro_registro;
                        break;
                }
            }
            break;

        default:
            avatarSrc = visitante;
            break;
    }

    return (
        <div className={`flex items-center gap-3 ${className} ${isOffline ? 'opacity-50 grayscale' : ''}`}>

            {/* Imagem do Avatar */}
            <div className="relative shrink-0">
                <Image
                    src={avatarSrc}
                    alt={username}
                    width={40}  // Aumentado para 40px (padrão V2)
                    height={40}
                    className="object-contain w-10 h-10 drop-shadow-md"
                />

                {/* Indicador de Status (Bolinha verde/cinza) */}
                <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-black rounded-full shadow-sm 
                    ${isOffline ? 'bg-gray-500' : 'bg-green-500'}`}
                />
            </div>

            {/* Nome e Relacionamento (Só renderiza se showName for true) */}
            {showName && (
                <div className="flex flex-col min-w-0">
                    <span className={`font-bold text-sm truncate leading-tight ${isOffline ? "text-gray-500" : "text-white"}`}>
                        {username}
                    </span>
                    {relacionamento && (
                        <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                            {relacionamento}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default PeaoAvatar;