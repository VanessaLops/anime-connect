'use client'



import { useState, useEffect } from "react";
import '../../app/globals.css';
import PeaoAvatar from "./PeaoStatus";
import { get, ref } from "firebase/database";
import { database } from '../../../firebase';
import { UserType } from "@/utils/userStorage";

interface ChatWindowProps {
    isTyping: boolean;
    groupName: string;
}

const users = [
    { username: "Visitante", type: "Visitante", power: 1, group: [0] },
    { username: "Membro 1", type: "Membro", power: 1, group: [2] },
    { username: "Membro 2", type: "Membro", power: 3, group: [3] },
    {
        username: "Dono Geral",
        type: "Dono_Geral",
        power: 4,
        group: [1, 2, 3],
    },
    {
        username: "Dono Sala",
        type: "Dono_Sala",
        power: 5,
        relacionamento: "casado",
        group: [2],
    },
    { username: "Staff", type: "Staff", power: 6, group: [1] },
    {
        username: "POWER AVATAR",
        type: "Membro",
        power: 8,
        relacionamento: "casado",
        group: [2],
    },
    {
        username: "ESTER",
        type: "Admin_mod",
        power: 1,
        relacionamento: "casado",
        group: [2],
    },
];

const order: Record<UserType, number> = {
    "Dono_Geral": 1,
    "Dono_Sala": 2,
    "Admin_mod": 2,
    "Staff": 3,
    "Membro": 4,
    "Visitante": 5
};

export default function ChatWindow({ isTyping, groupName }: ChatWindowProps) {
    const [grupos, setGrupos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchGrupos = async () => {
        try {
            const snapshot = await get(ref(database, 'grupos'));
            if (snapshot.exists()) {
                setGrupos(Object.values(snapshot.val()));
            } else {
                console.log('Nenhum grupo encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar grupos:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchGrupos();
    }, []);


    const getGroupIdByName = (nome: string) => {
        return grupos.find(g => g.nome === nome)?.id;
    };


    const groupId = getGroupIdByName(groupName);

    const sortedUsers = users.sort((a, b) => {
        if (a.type === "Dono_Geral" && !b.group.includes(3)) return -1;
        if (b.type === "Dono_Geral" && !a.group.includes(3)) return 1;
        return order[a.type as UserType] - order[b.type as UserType];
    });


    const visibleUsers = groupId !== undefined
        ? sortedUsers.filter(user => user.group.includes(groupId))
        : [];

    return (
        <div className="flex h-screen bg-[#36393f] text-white">
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-700 font-bold text-lg">
                    {groupName}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#2f3136] rounded-md">
                    {loading ? (
                        <p>Carregando grupos...</p>
                    ) : (
                        visibleUsers?.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all"
                            >
                                <PeaoAvatar
                                    key={index}
                                    group={user.group}
                                    username={user.username}
                                    type={user.type}
                                    power={user.power}
                                    relacionamento={user.relacionamento}
                                    isTyping={isTyping}
                                />
                            </div>
                        ))
                    )}

                    {isTyping && (
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
                            <span className="text-sm text-gray-400 ml-2">Alguém está digitando...</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-50 bg-[#36393f] border-l border-[#444] p-3 overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent">
                <h2 className="text-lg font-bold mb-3 text-[#00ffff] text-center border-b border-[#444] pb-2 shadow-sm tracking-wide">
                    👥 Conectados
                </h2>
                <div className="flex flex-col text-sm font-medium text-white bg-[#36393f] p-2 rounded-md max-h-screen overflow-y-auto">
                    {loading ? (
                        <p>Carregando usuários...</p>
                    ) : (
                        visibleUsers.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all"
                            >
                                <PeaoAvatar
                                    username={user.username}
                                    type={user.type}
                                    power={user.power}
                                    relacionamento={user.relacionamento}
                                    isTyping={isTyping}
                                    group={user.group}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
