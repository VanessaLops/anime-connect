import Image from "next/image";
import React from "react";
import "../../styles/animations.css";

// Importações originais mantidas
import dono_geral from "../../utils/icons/dono_geral.png";
import dono_sala from "../../utils/icons/Dono_Sala/owner.png";
import membro_registro from "../../utils/icons/Membro/membro1.png";
import membro_cachorro from "../../utils/icons/Membro/membro_cachorro.png";
import membro_digitando from "../../utils/icons/Membro/menbro_digitando.gif";
import moderador_sala from "../../utils/icons/Moderador/mod.png";
import visitante from "../../utils/icons/Visitante/visitante.png";
import membro_griter1 from "../../utils/powers/gritter/power_griter_membro.gif";

import { User } from "@/utils/userStorage";
import AvatarSlideshow from "./AvatarSlideshow_Power";

interface AvatarProps extends User {
    isTyping: boolean;
    status?: string; // string pois o firebase retorna 'Online'/'Offline'
    vipEmoji?: number;
    showName?: boolean; // Novo: Controla se mostra o nome ou só a imagem
    className?: string; // Novo: Para estilização externa
}

const PeaoAvatar: React.FC<AvatarProps> = ({
    isTyping,
    username,
    type,
    power,
    relacionamento,
    status,
    showName = true,
    className = ""
}) => {
    let avatarSrc: string | any = visitante;

    const isOffline = status?.toLowerCase() === "offline";

    // Lógica de Seleção de Imagem (Mantida a sua original)
    if (power === 8) {
        // Lógica especial para power 8 (Slideshow)
        return (
            <div className={`flex items-center gap-2 ${className} ${isOffline ? 'opacity-50 grayscale' : ''}`}>
                <div className="relative w-10 h-10 shrink-0">
                    <AvatarSlideshow
                        images={[dono_geral.src, dono_sala.src, moderador_sala.src]}
                        size={40} // Aumentei para ficar visível no design novo
                        interval={1500}
                    />
                    {/* Bolinha de Status */}
                    <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-black rounded-full ${isOffline ? 'bg-gray-500' : 'bg-green-500'}`} />
                </div>

                {showName && (
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-sm text-white truncate">{username}</span>
                        {relacionamento && <span className="text-[10px] text-gray-400 truncate">{relacionamento}</span>}
                    </div>
                )}
            </div>
        );
    }

    // Switch Case Original (Ajustado para garantir src correto)
    switch (type) {
        case "Visitante":
            avatarSrc = visitante;
            break;
        case "Dono_Geral":
            avatarSrc = dono_geral;
            break;
        case "Staff":
            avatarSrc = moderador_sala;
            break;
        case "Dono_Sala":
        case "Sub_Dono":
            avatarSrc = dono_sala;
            break;
        case "Membro":
            if (isTyping) {
                avatarSrc = membro_digitando;
            } else {
                switch (power) {
                    case 1: avatarSrc = membro_griter1; break;
                    case 2: avatarSrc = membro_cachorro; break;
                    default: avatarSrc = membro_registro; break;
                }
            }
            break;
        default:
            avatarSrc = visitante;
            break;
    }

    return (
        <div className={`flex items-center gap-3 ${className} ${isOffline ? 'opacity-50 grayscale' : ''}`}>
            {/* Container da Imagem */}
            <div className="relative shrink-0">
                <Image
                    src={avatarSrc}
                    alt={username}
                    width={40} // Tamanho padrão maior para a V2
                    height={40}
                    className="object-contain w-10 h-10 drop-shadow-md"
                />
                {/* Indicador de Status Online/Offline */}
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-black rounded-full ${isOffline ? 'bg-gray-500' : 'bg-green-500'}`} />
            </div>

            {/* Container do Texto (Opcional) */}
            {showName && (
                <div className="flex flex-col min-w-0">
                    <span className={`font-bold text-sm truncate ${isOffline ? "text-gray-500" : "text-white"}`}>
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