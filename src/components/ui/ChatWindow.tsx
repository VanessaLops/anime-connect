'use client'
import { useEffect, useState } from "react";
import { GroupData } from "./SideBar";
import { User, UserType } from "@/utils/userStorage";
import { database } from "@/pages/api/lib/firebase";
import { onDisconnect, onValue, push, ref, set } from "firebase/database";
import PeaoAvatar from "./PeaoMembro";

import MessageInput from "./MessageInput";

import PeaoVisitante from "./PeaoVisitante";

import ModalProfile, { GroupDataType } from "./ModalProfile";

interface ChatWindowProps {
    groupData: GroupData;
    currentUser: {
        id: string;
        username: string;
        type: UserType;
        power: number;
        group: string[];
        relacionamento?: string;
        image: string;
        userNameAcess: string;
        password: string;
        status?: string;
    };
}


export default function ChatWindowSkeleton({ groupData, currentUser }: ChatWindowProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [grupos, setGrupos] = useState<GroupData | null>(null);
    const [onlineMembers, setOnlineMembers] = useState<any[]>([]);
    const [offlineMembers, setOfflineMembers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const messagesRef = ref(database, `grupos/${groupData.groupId}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsed = Object.values(data).sort(
                    (a: any, b: any) => a.timestamp - b.timestamp
                );
                setMessages(parsed);
            }
        });

        return () => unsubscribe();
    }, [groupData.groupId]);

    console.log(currentUser, 'ChatWindowProps currentUser')


    useEffect(() => {
        if (groupData.groupId) {
            const grupoRef = ref(database, 'grupos');

            const unsubscribe = onValue(grupoRef, snapshot => {
                if (snapshot.exists()) {
                    const grupos: Record<string, GroupData> = snapshot.val();
                    const grupoEncontrado = Object.entries(grupos).find(([id]) => id.startsWith(groupData.groupId!));

                    if (grupoEncontrado) {
                        const [, grupoData] = grupoEncontrado;
                        setGrupos(grupoData);
                    }
                }
            });

            return () => unsubscribe();
        }
    }, [groupData.groupId]);


    //Deixa online e offline apenas o usuário cadastrados
    useEffect(() => {
        const userExists = !!grupos?.members[currentUser.id];
        if (userExists) {
            const userStatusRef = ref(database, `grupos/${grupos?.groupId}/members/${currentUser.id}/status`);
            set(userStatusRef, 'Online');
            onDisconnect(userStatusRef).set('Offline');
        }
    }, [grupos]);


    // Monitorando alterações de status e movendo para a lista de Offline
    useEffect(() => {
        const gruposRef = ref(database, `grupos/${groupData.groupId}/members`);

        console.log(gruposRef, 'gruposRef')
        const unsubscribe = onValue(gruposRef, (snapshot) => {
            if (snapshot.exists()) {
                const members = snapshot.val();
                const updatedOnlineUsers = Object.values(members).filter(
                    (user: any) => typeof user === 'object' && user.status === 'Online'
                );
                const updatedOfflineUsers = Object.values(members).filter(
                    (user: any) => user.status !== 'Online' && user.type === 'Membro'
                );
                console.log(updatedOfflineUsers, 'updatedOfflineUsers')

                setOnlineMembers(updatedOnlineUsers);
                setOfflineMembers(updatedOfflineUsers);
            }
        });

        return () => unsubscribe();
    }, [groupData.groupId]);


    const handleUserClick = (user: User) => {
        if (user.type !== 'Visitante') {
            setSelectedUser(user);
            setIsModalOpen(true);
        }
    };



    return (
        <div className="flex h-screen bg-[#36393f] text-white">

            {/* Botão abrir sidebar mobile */}
            {!isSidebarOpen && (
                <button
                    className="md:hidden fixed top-4 left-4 z-50 bg-[#00ffff] text-black px-3 py-1 rounded shadow"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Abrir lista de membros"
                >
                    👥
                </button>
            )}

            {/* Sidebar - mobile e desktop */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-60 bg-[#36393f] border-r border-[#444] p-3
          overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:w-60
          z-40
        `}
            >
                {/* Botão fechar sidebar mobile */}
                <button
                    className="md:hidden mb-3 text-[#00ffff] font-bold"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Fechar lista de membros"
                >
                    ✕ Fechar
                </button>

                {/* Título sidebar */}
                <h2 className="text-lg font-bold mb-3 text-[#00ffff] text-center border-b border-[#444] pb-2 shadow-sm tracking-wide">
                    👥 Conectados
                </h2>

                {/* Lista usuários - só container */}
                <div className="flex flex-col text-sm font-medium text-white bg-[#36393f] p-2 rounded-md max-h-[calc(100vh-100px)] overflow-y-auto">
                    <div className="mb-3">
                        <h3 className="text-md font-semibold text-green-400 mb-1">🟢 Online</h3>
                        {onlineMembers?.map((user, index) => (
                            <div
                                key={`online-${index}`}
                                className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all"
                                onClick={() => handleUserClick(user)}
                            >

                                <PeaoAvatar
                                    username={user.username || "Visitante"}
                                    type={user.type}
                                    power={user.power}
                                    relacionamento={user.relacionamento}
                                    isTyping={false}
                                    group={user.group}
                                    id={user.id}
                                    image={user?.image}
                                    password={user.user}
                                    userNameAcess={user.userNameAcess}
                                    status={user.status?.toLowerCase()}
                                />

                            </div>
                        ))}
                    </div>

                    <div>
                        <h3 className="text-md font-semibold text-gray-400 mb-1">⚪ Membros Offline</h3>
                        {offlineMembers?.map((user, index) => (
                            <div
                                key={`online-${index}`}
                                className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all"

                            >
                                <PeaoAvatar
                                    username={user?.username || "Visitante"}
                                    type={user.type}
                                    power={user.power}
                                    relacionamento={user.relacionamento}
                                    isTyping={false}
                                    group={user.group}
                                    id={user.id}
                                    image={user?.image}
                                    password={user.user}
                                    userNameAcess={user.userNameAcess}
                                    status={user.status?.toLowerCase()}
                                />

                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Área principal do chat */}
            <main className="flex flex-col flex-1 ml-0 md:ml-60">

                {/* Header do grupo */}
                <header className="p-4 border-b border-gray-700 font-bold text-lg">
                    {groupData?.name}

                </header>

                {/* Área das mensagens */}
                <section className="flex-1 overflow-y-auto p-4">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-2">
                            <div className="flex items-start gap-2">
                                <img
                                    src={msg.image || "/default-avatar.png"}
                                    alt={msg.username}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-[#00ffff]">{msg.username}</p>
                                    <p className="text-sm text-white">{msg.text}</p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                </section>

                {/* Input de mensagem */}
                <footer className="p-4 border-t border-gray-700">
                    <MessageInput
                        groupName={groupData?.name}
                        groupId={groupData?.groupId}
                        currentUser={{
                            id: currentUser?.id,
                            username: currentUser?.username,
                            type: currentUser?.type,
                            power: currentUser?.power,
                            group: currentUser?.group,
                            relacionamento: currentUser?.relacionamento,
                            image: currentUser?.image,
                            userNameAcess: currentUser?.userNameAcess,
                            password: currentUser?.password,
                            status: currentUser?.status
                        }}
                    />
                </footer>

            </main>
            {selectedUser && (
                <ModalProfile
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={selectedUser}
                    groupId={groupData?.groupId || ''}
                    grupos={grupos as GroupDataType}
                />

            )}
        </div>
    );
}
