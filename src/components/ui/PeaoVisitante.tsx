'use client'



import React from "react";
import Image from "next/image";
import "../../styles/animations.css";

import visitante_lapis from "../../utils/icons/Visitante/visitante_1.gif";
import visitante from "../../utils/icons/Visitante/visitante.png";

import membro_registro from "../../utils/icons/Membro/membro1.png";
import membro_digitando from "../../utils/icons/Membro/menbro_digitando.gif";

import membro_cachorro from "../../utils/icons/Membro/membro_cachorro.png";

import membro_griter1 from "../../utils/powers/gritter/power_griter_membro.gif";

import dono_geral from "../../utils/icons/dono_geral.png";
import dono_sala from "../../utils/icons/Dono_Sala/owner.png";
import moderador_sala from "../../utils/icons/Moderador/mod.png";

import AvatarSlideshow from "./AvatarSlideshow_Power";
import { User } from "@/utils/userStorage";

interface AvatarProps extends User {
    isTyping: boolean;
    status?: "online" | "offline";
}


const PeaoVisitante: React.FC<AvatarProps> = ({
    isTyping,
    username,
    type,
    power,
    relacionamento,
    status
}) => {

    let avatarSrc: string = "";

    const isOffline = status === "offline";
    console.log(isOffline,'isOfflineisOffline')
    const avatarStyle = {
        objectFit: "contain" as const,
        opacity: isOffline ? 0.4 : 1,
        filter: isOffline ? "grayscale(100%)" : "none",
    };

    const usernameStyle = {
        fontWeight: "bold",
        fontSize: "16px",
        color: isOffline ? "#777" : "#fff",
    };

    const relacionamentoStyle = {
        fontSize: "12px",
        color: isOffline ? "#666" : "gray",
    };


    //POWER AVATAR COLORIDO
    if (power === 8) {
        return (
            <div style={{ display: "flex", alignItems: "center", padding: "4px" }}>
                <AvatarSlideshow
                    images={[dono_geral.src, dono_sala.src, moderador_sala.src]}
                    size={10}
                    interval={1500}
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginLeft: 6,
                    }}
                >
                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {username}
                    </span>
                    {relacionamento && (
                        <span style={{ fontSize: "12px", color: "gray" }}>
                            {relacionamento}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    switch (type) {
        case "Visitante":
            avatarSrc = isTyping ? visitante.src : visitante.src;
            break;
        case "Dono_Geral":
            avatarSrc = dono_geral.src;
            break;
        // case "Admin_mod":
        //     avatarSrc = ester.src;
        //     break;
        case "Staff":
            avatarSrc = moderador_sala.src;
            break;
        case "Dono_Sala":
            avatarSrc = dono_sala.src;
            break;
        case "Membro":
            if (isTyping) {
                avatarSrc = membro_digitando.src;
            } else {
                switch (power) {
                    case 1:
                        avatarSrc = membro_griter1.src;
                        break;
                    case 2:
                        avatarSrc = membro_cachorro.src;
                        break;
                    default:
                        avatarSrc = membro_registro.src;
                        break;
                }
            }
            break;
        default:
            avatarSrc = visitante.src;
            break;
    }

    return (
        <div style={{ display: "flex", alignItems: "center", padding: "4px" }}>
            <Image
                src={avatarSrc || ""}
                alt="Avatar"
                width={10}
                height={10}
                style={avatarStyle}
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginLeft: 6,
                }}
            >
                <span style={usernameStyle}>{username}</span>
                {relacionamento && (
                    <span style={relacionamentoStyle}>{relacionamento}</span>
                )}
            </div>
        </div>
    );
};

export default PeaoVisitante;
