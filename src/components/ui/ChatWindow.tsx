'use client';

import React, { useEffect, useState } from 'react';
import { GroupData } from './SideBar';
import { database } from '@/pages/api/lib/firebase';
import { onDisconnect, onValue, ref, set } from 'firebase/database';
import { User, UserType } from '@/utils/userStorage';
import PeaoAvatar from './PeaoMembro';
import MessageInput from './MessageInput';


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

interface NeonChatLayoutProps {
    colors: {
        background: string;
        sidebarBg: string;
        sidebarBorder: string;
        sidebarShadow: string;
        headerBg: string;
        headerBorder: string;
        headerShadow: string;
        mainBg: string;
        inputBg: string;
        inputBorder: string;
        buttonBg: string;
        buttonHoverBg: string;
        buttonShadow: string;
        usernameColor: string;
        textColor?: string;
    };
    groupData?: GroupData;
    currentUser?: ChatWindowProps["currentUser"];
    vipEmoji: number;
}

function NeonChatLayout({ colors, groupData, currentUser, vipEmoji }: NeonChatLayoutProps) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [grupos, setGrupos] = useState<GroupData | null>(null);
    const [onlineMembers, setOnlineMembers] = useState<any[]>([]);
    const [offlineMembers, setOfflineMembers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    console.log(groupData, 'gruposgrupos')
    useEffect(() => {
        const messagesRef = ref(database, `grupos/${groupData?.groupId}/messages`);
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
    }, [groupData?.groupId]);



    useEffect(() => {
        if (groupData?.groupId) {
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
    }, [groupData?.groupId]);


    //Deixa online e offline apenas o usuário cadastrados
    useEffect(() => {
        if (!grupos || !currentUser) return;

        const userExists = !!grupos.members?.[currentUser.id];
        if (userExists) {
            const userStatusRef = ref(
                database,
                `grupos/${grupos.groupId}/members/${currentUser.id}/status`
            );
            set(userStatusRef, 'Online');
            onDisconnect(userStatusRef).set('Offline');
        }
    }, [grupos, currentUser]);



    // Monitorando alterações de status e movendo para a lista de Offline
    useEffect(() => {
        const gruposRef = ref(database, `grupos/${groupData?.groupId}/members`);

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
    }, [groupData?.groupId]);


    const handleUserClick = (user: User) => {
        if (user.type !== 'Visitante') {
            setSelectedUser(user);
            setIsModalOpen(true);
        }
    };

    console.log(onlineMembers, 'onlineMembers')
    console.log(onlineMembers, 'onlineMembers')


    return (
        <div
            className={`flex flex-col md:flex-row h-screen font-sans`}
            style={{ backgroundColor: colors.background, color: colors.textColor || 'white' }}
        >
            {/* Sidebar Toggle Button for Mobile */}
            {/* <button
                className="md:hidden p-4 focus:outline-none"
                style={{ backgroundColor: colors.sidebarBg, color: colors.sidebarBorder }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? 'Fechar Membros' : 'Abrir Membros'}
            </button> */}

            {/* Sidebar */}
            <aside
                className={`w-full md:w-72 p-4 border-r-2 rounded-none md:rounded-tr-2xl md:rounded-br-2xl ${isSidebarOpen ? 'block' : 'hidden'
                    } md:block`} /* Conditional display based on isSidebarOpen */
                style={{
                    backgroundColor: colors.sidebarBg,
                    borderColor: colors.sidebarBorder,
                    boxShadow: `0 0 20px ${colors.sidebarShadow}`,
                }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 style={{ color: colors.sidebarBorder }} className="text-2xl font-bold">
                        🌐 Conectados
                    </h2>
                    <button
                        className="text-sm px-2 py-1 rounded-md transition shadow"
                        style={{
                            color: colors.sidebarBorder,
                            border: `1px solid ${colors.sidebarBorder}`,
                            backgroundColor: 'transparent',
                            boxShadow: `0 0 6px ${colors.sidebarShadow}`,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.sidebarBorder)}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        Sair
                    </button>
                </div>

                <div className="space-y-3">
                    <div
                        className="p-2 rounded-lg font-semibold border-l-4 shadow"
                        style={{
                            backgroundColor: colors.inputBg,
                            color: colors.usernameColor,
                            borderColor: colors.usernameColor,
                            boxShadow: `0 0 12px ${colors.usernameColor}`,
                        }}
                    >
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
                </div>

                <div className="mt-8 text-sm text-gray-400">
                    <p className="mb-2">⚪ Offline</p>
                    <ul className="space-y-1 text-gray-600">
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

                    </ul>
                </div>
            </aside>

           {/* Main Area */}
<div className="flex flex-col min-h-mobile-screen">

    {/* Group Title */}
    <div
        className="px-6 py-4 border-b-2 shadow shrink-0"
        style={{
            backgroundColor: colors.headerBg,
            borderColor: colors.headerBorder,
            boxShadow: `0 0 15px ${colors.headerShadow}`,
        }}
    >
        <h1 style={{ color: colors.sidebarBorder }} className="text-xl font-bold">
            Ajuda
        </h1>
    </div>

    {/* Conteúdo principal com scroll interno */}
    <main
        className="flex-1 overflow-y-auto p-4"
        style={{ backgroundColor: colors.mainBg }}
    >
        {messages.map((msg, index) => (
            <div key={index} className="mb-1">
                <div className="flex items-start gap-2">
                    <img
                        src={msg.image || "/default-avatar.png"}
                        alt={msg.username}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#00ffff]">{msg.username}</p>
                        <p className="text-sm text-white break-words">{msg.text}</p>
                        <span className="text-xs text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            </div>
        ))}
    </main>

    {/* Rodapé fixo no fim da tela */}
    <footer
        className="p-4 border-t-2 shadow shrink-0"
        style={{
            backgroundColor: colors.headerBg,
            borderColor: colors.headerBorder,
            boxShadow: `0 0 15px ${colors.headerShadow}`,
        }}
    >
        <MessageInput
            vipEmoji={vipEmoji}
            colors={colors}
            currentUser={currentUser}
            groupId={groupData?.groupId}
        />
        <div className="mt-2 text-1xl flex gap-2 flex-wrap px-2">Versão 1.0.0.0</div>
    </footer>
</div>

        </div>
    );
}

// === Definição dos temas de cores para cada VIP ===

const defaultColors = {
    background: '#0c0026',
    sidebarBg: '#14003c',
    sidebarBorder: '#ff00ff',
    sidebarShadow: '#ff00ff',
    headerBg: '#1a004a',
    headerBorder: '#ff00ff',
    headerShadow: '#ff00ff',
    mainBg: '#0f002e',
    inputBg: '#2c006e',
    inputBorder: '#ff00ff',
    buttonBg: '#ff00ff',
    buttonHoverBg: '#e600e6',
    buttonShadow: '#ff00ff',
    usernameColor: '#ffa500',
    textColor: 'white',
};

const vip1Colors = { // ROXO NEON 
    ...defaultColors,
};

const vip2Colors = { // AZUL NEON
    background: '#001f3f',
    sidebarBg: '#003366',
    sidebarBorder: '#00bfff',
    sidebarShadow: '#00bfff',
    headerBg: '#004c99',
    headerBorder: '#00bfff',
    headerShadow: '#00bfff',
    mainBg: '#00264d',
    inputBg: '#0059cc',
    inputBorder: '#00bfff',
    buttonBg: '#00bfff',
    buttonHoverBg: '#0099e6',
    buttonShadow: '#00bfff',
    usernameColor: '#66d9ff',
    textColor: 'white',
};

const vip3Colors = { // VERMELHO NEON
    background: '#330000',
    sidebarBg: '#660000',
    sidebarBorder: '#ff3300',
    sidebarShadow: '#ff3300',
    headerBg: '#990000',
    headerBorder: '#ff3300',
    headerShadow: '#ff3300',
    mainBg: '#4d0000',
    inputBg: '#b30000',
    inputBorder: '#ff3300',
    buttonBg: '#ff3300',
    buttonHoverBg: '#cc2900',
    buttonShadow: '#ff3300',
    usernameColor: '#ff6666',
    textColor: 'white',
};

const vip4Colors = { // BRANCO AMARELADO
    background: '#fffbea',
    sidebarBg: '#fff5d1',
    sidebarBorder: '#f3d27a',
    sidebarShadow: '#f3d27a',
    headerBg: '#f7e4a3',
    headerBorder: '#f3d27a',
    headerShadow: '#f3d27a',
    mainBg: '#fff8c1',
    inputBg: '#fff9d6',
    inputBorder: '#f3d27a',
    buttonBg: '#f3d27a',
    buttonHoverBg: '#d7b44a',
    buttonShadow: '#f3d27a',
    usernameColor: '#a67c00',
    textColor: '#5a4600',
};

const vip5Colors = { // OURO
    background: '#3e2f00',
    sidebarBg: '#5c4500',
    sidebarBorder: '#ffcc00',
    sidebarShadow: '#ffcc00',
    headerBg: '#7a6000',
    headerBorder: '#ffcc00',
    headerShadow: '#ffcc00',
    mainBg: '#4b3a00',
    inputBg: '#6b5400',
    inputBorder: '#ffcc00',
    buttonBg: '#ffcc00',
    buttonHoverBg: '#d4b300',
    buttonShadow: '#ffcc00',
    usernameColor: '#fff5b1',
    textColor: '#fffacd',
};

// === Função simulada que retorna o VIP do usuário 
function getUserVipLevel(): number {
    // Simulando retorno, troque para dinâmica real (0 a 5)
    return 0; // por exemplo, VIP3 (vermelho neon)
}

export default function ChatWindow({ groupData, currentUser }: ChatWindowProps) {
    const userVip = getUserVipLevel();

    const colorsMap: { [key: number]: typeof defaultColors } = {
        0: defaultColors,
        1: vip1Colors,
        2: vip2Colors,
        3: vip3Colors,
        4: vip4Colors,
        5: vip5Colors,
    };

    const userColors = colorsMap[userVip] || defaultColors;

    return <NeonChatLayout colors={userColors} groupData={groupData} currentUser={currentUser} vipEmoji={userVip} />

}