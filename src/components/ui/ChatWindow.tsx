'use client'
import { useState, useEffect } from "react";
import '../../app/globals.css';
import PeaoAvatar from "./PeaoStatus";
import { database } from '../../../firebase';
import { GroupData } from "./SideBar";
import MessageInput from "./MessageInput";
import ChatModal from './Modal';
import { onDisconnect, ref, set } from "firebase/database";

interface ChatWindowProps {
    groupData: GroupData;
    currentUser: {
        id: string;
        type: "Dono_Geral" | "Admin_mod" | "Dono_Sala" | "Staff" | "Membro" | "Visitante";
        status: string;
    };
}

export default function ChatWindow({ groupData, currentUser }: ChatWindowProps) {


    const [onlineMembers, setOnlineMembers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log(groupData.groupId, 'onlineMembers')


    useEffect(() => {
        const firebaseOnlineMembers = groupData?.members
            ? Object.values(groupData.members).filter((user: any) => user.status === "Online")
            : [];

        const currentUserOnline = currentUser && currentUser.status === "Online"
            ? [currentUser]
            : [];

        // Evita duplicação: garante que currentUser não está já em firebaseOnlineMembers
        const allOnlineMembers = [
            ...firebaseOnlineMembers.filter(u => u.id !== currentUser.id),
            ...currentUserOnline
        ];

        setOnlineMembers(allOnlineMembers);
    }, [groupData, currentUser]);


    function registerVisitor(groupId: string, user: any) {
        const userRef = ref(database, `grupos/${groupId}/members/${user.id}`);
        set(userRef, currentUser);
        onDisconnect(userRef).remove();
        console.log("Visitante registrado no Firebase:", currentUser);
    }



    useEffect(() => {
        if (currentUser?.type === "Visitante" && groupData?.groupId) {
            registerVisitor(groupData.groupId, currentUser);
        }
    }, [currentUser, groupData]);



    return (
        <div className="flex h-screen bg-[#36393f] text-white">
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-700 font-bold text-lg">
                    {groupData?.name}
                </div>
                <div className="flex-1 overflow-y-auto">
                    <p>Carregando grupos...</p>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <MessageInput
                        userId={currentUser?.id ?? ''}
                        groupName={groupData?.name ?? ''}
                        currentUser={{
                            id: currentUser?.id ?? '',
                            type: currentUser?.type ?? 'Visitante',
                            image: currentUser?.id ?? 'default.jpg',
                            username: currentUser?.id ?? 'Visitante'
                        }}
                    />

                </div>
            </div>

            <div className="w-50 bg-[#36393f] border-l border-[#444] p-3 overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent">
                <h2 className="text-lg font-bold mb-3 text-[#00ffff] text-center border-b border-[#444] pb-2 shadow-sm tracking-wide">
                    👥 Conectados
                </h2>

                <div className="flex flex-col text-sm font-medium text-white bg-[#36393f] p-2 rounded-md max-h-screen overflow-y-auto">
                    {/* Online */}
                    <div className="mb-3">
                        <h3 className="text-md font-semibold text-green-400 mb-1">🟢 Online</h3>
                        {onlineMembers.map((user, index) => (
                            <div
                                key={`online-${index}`}
                                className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all"
                            >
                                <PeaoAvatar
                                    username={user.username || "Visitante"}
                                    type={user.type}
                                    power={user.power}
                                    relacionamento={user.relacionamento}
                                    isTyping={false}
                                    group={user.group}
                                    id={user.id}
                                    image={user.image}
                                    password=""
                                    userNameAcess=""
                                    status="online"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Offline */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-400 mb-1">⚪ Membros Offline</h3>

                    </div>
                </div>
            </div>
        </div>
    );
}
