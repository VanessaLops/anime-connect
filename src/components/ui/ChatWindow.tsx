'use client';

import { database } from '@/pages/api/lib/firebase';
import { UserType } from '@/utils/userStorage';
import { onValue, ref } from 'firebase/database';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, Hash, LogOut, Shield, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AdminPanel from './AdminPanel';
import MessageInput from './MessageInput';
import PeaoAvatar from './PeaoMembro';
import { GroupData } from './SideBar';

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
    colors: any; // Simplificado para focar na lógica visual
    groupData?: GroupData;
    currentUser?: ChatWindowProps["currentUser"];
    vipEmoji: number;
}

// === COMPONENTE DE LAYOUT VISUAL ===
function NeonChatLayout({ colors, groupData, currentUser, vipEmoji }: NeonChatLayoutProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [onlineMembers, setOnlineMembers] = useState<any[]>([]);
    const [offlineMembers, setOfflineMembers] = useState<any[]>([]);
    const [showMembers, setShowMembers] = useState(true); // Toggle da Sidebar Direita
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    // --- 1. BUSCAR MENSAGENS ---
    useEffect(() => {
        if (!groupData?.groupId) return;
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

    // --- 2. AUTO SCROLL ---
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // --- 3. GERENCIAR STATUS & LISTA DE MEMBROS ---
    useEffect(() => {
        if (!groupData?.groupId || !currentUser) return;

        // ... (código de setar status online do usuário mantém igual) ...

        const membersRef = ref(database, `grupos/${groupData.groupId}/members`);
        const unsubscribe = onValue(membersRef, (snapshot) => {
            if (snapshot.exists()) {
                const members = snapshot.val();

                const online: any[] = [];
                const offline: any[] = [];

                // --- INJEÇÃO DO BOT NA LISTA (VISUAL) ---
                // Se o grupo tem bot configurado, adicionamos ele manualmente na lista online
                if (groupData.hasBot && groupData.botName) {
                    online.push({
                        id: 'BOT_SYSTEM', // ID fixo para ordenação
                        userId: 'BOT_SYSTEM',
                        username: groupData.botName,
                        type: 'Bot', // Type Bot para pegar prioridade 0
                        power: 999,
                        image: `https://api.dicebear.com/7.x/bottts/png?seed=${groupData.botName}`,
                        status: 'Online',
                        relacionamento: '🤖 Sistema'
                    });
                }
                // ----------------------------------------

                Object.values(members).forEach((user: any) => {
                    if (user.status === 'Online') {
                        online.push(user);
                    } else if (user.type !== 'Visitante') {
                        offline.push(user);
                    }
                });

                setOnlineMembers(online);
                setOfflineMembers(offline);
            }
        });
        return () => unsubscribe();
    }, [groupData?.groupId, currentUser, groupData?.hasBot, groupData?.botName]);

    // --- FUNÇÃO PARA ORDENAR POR CARGO (Hierarquia xat) ---
    const rolePriority: Record<string, number> = {
        'Bot': 0,          // Bot no TOPO (0)
        'Dono_Geral': 1,
        'Dono_Sala': 2,
        'Sub_Dono': 3,
        'Admin_mod': 4,
        'Staff': 5,
        'Membro': 6,
        'Visitante': 7     // Visitante no fim (7)
    };

    const getSortedMembers = (members: any[]) => {
        return members.sort((a, b) => {
            const roleA = rolePriority[a.type] ?? 99;
            const roleB = rolePriority[b.type] ?? 99;
            return roleA - roleB;
        });
    };

    // Combinamos Online + Offline para processar, mas aqui focamos na lista online
    const sortedOnline = [...onlineMembers].sort((a, b) => {
        // Se for o BOT SYSTEM, força ele pro topo sempre (caso o type não esteja exato)
        if (a.userId === 'BOT_SYSTEM') return -1;
        if (b.userId === 'BOT_SYSTEM') return 1;

        const roleA = rolePriority[a.type] ?? 99; // 99 para desconhecidos
        const roleB = rolePriority[b.type] ?? 99;

        // Se cargos forem iguais, ordena por nome
        if (roleA === roleB) {
            return a.username.localeCompare(b.username);
        }

        return roleA - roleB; // Menor número = Mais alto na lista
    });
    return (
        <div className="relative flex w-full h-screen overflow-hidden bg-black text-white">

            {/* === CAMADA 1: BACKGROUND IMERSIVO === */}
            <div className="absolute inset-0 z-0">
                {groupData?.background?.endsWith('.mp4') ? (
                    <video
                        src={groupData.background}
                        autoPlay loop muted
                        className="w-full h-full object-cover opacity-30"
                    />
                ) : (
                    <img
                        src={groupData?.background || '/default-bg.jpg'}
                        alt="bg"
                        className="w-full h-full object-cover opacity-30"
                    />
                )}
                {/* Overlay Gradiente para leitura */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
            </div>

            {/* === CAMADA 2: ÁREA DO CHAT (CENTRO) === */}
            <div className="relative z-10 flex-1 flex flex-col min-w-0 transition-all duration-300">

                {/* Header do Chat */}
                <header className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <Hash size={20} className="text-anime-pink" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-white leading-tight drop-shadow-md">
                                {groupData?.name || "Sala de Chat"}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                {onlineMembers.length} Online
                            </div>
                        </div>
                    </div>

                    {/* Botão Mobile/Desktop para Toggle da Lista */}
                    <button
                        onClick={() => setShowMembers(!showMembers)}
                        className={`p-2 rounded-lg transition-colors border ${showMembers ? 'bg-anime-purple/20 border-anime-purple text-white' : 'border-white/10 text-gray-400 hover:text-white'}`}
                    >
                        <Users size={20} />
                    </button>
                </header>

                {/* Lista de Mensagens */}
                <div
                    className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                    ref={scrollRef}
                >
                    {messages.map((msg, index) => {
                        const isMe = msg.username === currentUser?.username;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: isMe ? 20 : -20 }} // Animação lateral
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex items-end gap-3 mb-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* AVATAR PEÃO NA MENSAGEM */}
                                <div className="flex-shrink-0 -mb-1">
                                    {/* Usando o PeaoAvatar com showName={false} para mostrar só o boneco */}
                                    <PeaoAvatar
                                        {...msg} // Passa todas as props do user
                                        type={msg.type || 'Visitante'}
                                        power={msg.power || 0}
                                        username={msg.username}
                                        isTyping={false}
                                        showName={false} // IMPORTANTE: Esconde o nome (já mostramos na bolha)
                                        className="scale-90" // Um pouco menor que na lista
                                    />
                                </div>

                                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                    {/* Nome do Usuário */}
                                    <span
                                        className="text-[10px] font-bold mb-1 ml-1 opacity-80"
                                        style={{ color: isMe ? colors.usernameColor : '#ccc' }}
                                    >
                                        {msg.username}
                                    </span>

                                    {/* Bolha de Vidro (Glassmorphism mais forte) */}
                                    <div
                                        className={`px-4 py-2 rounded-2xl text-sm leading-relaxed backdrop-blur-md shadow-lg border border-white/5
                        ${isMe
                                                ? 'bg-anime-purple/60 text-white rounded-br-none' // Roxo translúcido para mim
                                                : 'bg-black/60 text-gray-100 rounded-bl-none' // Preto translúcido para outros
                                            }
                    `}
                                    >
                                        {msg.text}
                                    </div>

                                    {/* Hora pequena */}
                                    <span className="text-[9px] text-gray-500 mt-1 opacity-50">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-black/60 backdrop-blur-xl border-t border-white/10">
                    <MessageInput
                        vipEmoji={vipEmoji}
                        colors={colors}
                        currentUser={currentUser}
                        groupId={groupData?.groupId}
                    />
                    <div className="flex justify-between items-center mt-2 px-1">
                        <span className="text-[10px] text-gray-500 font-mono">V2.0.0 Stable</span>
                        <span className="text-[10px] text-anime-pink font-bold">Anime Connect</span>
                    </div>
                </div>
            </div>

            {/* === CAMADA 3: LISTA DE MEMBROS (DIREITA) === */}
            <AnimatePresence>
                {showMembers && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 300, opacity: 1 }} // Largura fixa 300px
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative z-20 h-full border-l border-white/10 bg-black/70 backdrop-blur-xl flex flex-col shadow-2xl"
                    >
                        {/* Header Membros */}
                        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <h2
                                className="font-display font-bold text-sm tracking-wider uppercase flex items-center gap-2 text-gray-200"
                            >
                                <Users size={16} className="text-anime-cyan" />
                                Membros
                            </h2>
                            <div className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/30">
                                {sortedOnline.length} ON
                            </div>
                        </div>

                        {/* Lista Scrollável */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">

                            {/* Membros Online */}
                            <div className="px-2 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Online</div>
                            {sortedOnline.map((user) => (
                                <div
                                    key={user.id}
                                    className={`
                                        group relative p-2 rounded-xl border border-transparent transition-all cursor-pointer
                                        hover:bg-white/10 hover:border-white/10 hover:shadow-lg
                                        ${currentUser?.id === user.id ? 'bg-white/5 border-white/5' : ''}
                                    `}
                                // onClick={() => handleUserClick(user)} // Adicione sua lógica de modal aqui
                                >
                                    <div className="flex items-center justify-between">
                                        <PeaoAvatar
                                            {...user}
                                            isTyping={false}
                                            showName={true}
                                            status="Online"
                                        />

                                        {/* Ícone de Cargo (Opcional) */}
                                        <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                            {user.type === 'Dono_Sala' && <Crown size={14} className="text-yellow-400" />}
                                            {user.type === 'Staff' && <Shield size={14} className="text-blue-400" />}
                                            {user.type === 'Visitante' && <LogOut size={12} className="text-gray-600" />}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Membros Offline (Opcional - Se quiser mostrar) */}
                            {offlineMembers.length > 0 && (
                                <>
                                    <div className="mt-6 px-2 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-t border-white/5">Offline</div>
                                    {offlineMembers.map((user) => (
                                        <div key={user.id} className="p-2 opacity-50 hover:opacity-100 transition-opacity grayscale">
                                            <PeaoAvatar
                                                {...user}
                                                isTyping={false}
                                                showName={true}
                                                status="offline"
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Área de Controle (Admin & Staff) */}
                        {(currentUser?.type === "Dono_Sala" || currentUser?.type === "Staff" || currentUser?.type === "Admin_mod") && (
                            <div className={`p-3 border-t border-white/10 backdrop-blur-sm ${currentUser.type === "Dono_Sala" ? 'bg-red-900/10' : 'bg-blue-900/10'}`}>
                                <button
                                    onClick={() => setIsAdminPanelOpen(true)} // <--- Abre o Modal
                                    className={`
                w-full flex items-center justify-center gap-2 py-2 text-xs font-bold border rounded-lg transition-all shadow-lg
                ${currentUser.type === "Dono_Sala"
                                            ? 'text-red-400 border-red-500/30 hover:bg-red-500/20'
                                            : 'text-blue-400 border-blue-500/30 hover:bg-blue-500/20'}
            `}
                                >
                                    <Shield size={14} />
                                    {currentUser.type === "Dono_Sala" ? "Painel Master" : "Painel Staff"}
                                </button>
                            </div>
                        )}

                        {/* ... depois do fechamento da <motion.aside> ... */}

                        {/* RENDERIZAÇÃO DO MODAL DE ADMINISTRAÇÃO */}
                        {isAdminPanelOpen && groupData && (
                            <AdminPanel
                                isOpen={isAdminPanelOpen}
                                onClose={() => setIsAdminPanelOpen(false)}
                                groupId={groupData.groupId}
                                currentUser={currentUser}
                            />
                        )}

                    </motion.aside>
                )}
            </AnimatePresence>

        </div>
    );
}

// === COMPONENTE WRAPPER (Mantido para compatibilidade com seu código) ===
// Defina suas cores padrão aqui se quiser sobrescrever
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

// Mock function
function getUserVipLevel(): number {
    return 0;
}

export default function ChatWindow({ groupData, currentUser }: ChatWindowProps) {
    const userVip = getUserVipLevel();
    // Você pode restaurar o colorsMap aqui se precisar das cores VIPs diferentes
    return <NeonChatLayout colors={defaultColors} groupData={groupData} currentUser={currentUser} vipEmoji={userVip} />
}