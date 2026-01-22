'use client';

import { database } from '@/pages/api/lib/firebase';
import { BotSystem } from '@/utils/botSystem'; // <--- O CÉREBRO DO BOT IMPORTADO AQUI
import { getEmojisByVip } from '@/utils/emojis';
import { UserType } from '@/utils/userStorage';
import { get, push, ref } from 'firebase/database'; // Adicionado 'get' para verificar configurações do bot
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, LogIn, LogOut, Send, Smile } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ChatModal from './Modal';

interface MessageInputProps {
    groupId?: string;
    currentUser?: {
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
    vipEmoji: number;
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
}

export default function MessageInput({ groupId, vipEmoji, currentUser, colors }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const emojis = getEmojisByVip(vipEmoji);
    const canSendMessage = Boolean(currentUser);

    // Fechar emoji picker ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEmojiClick = (emoji: string) => {
        setMessage((prev) => prev + ` ${emoji}`);
    };

    // --- FUNÇÃO DE ENVIO COM A LÓGICA DO BOT ---
    const sendMessage = async () => {
        if (!message.trim()) return;
        if (!canSendMessage) return alert('Você não tem permissão para enviar mensagens.');

        setIsSending(true);

        try {
            // 1. Prepara a mensagem do Usuário
            const messageRef = ref(database, `grupos/${groupId}/messages`);
            const messageText = message; // Guarda o texto antes de limpar o state
            
            const newMessage = {
                text: messageText,
                timestamp: Date.now(),
                userId: currentUser?.id,
                username: currentUser?.username,
                image: currentUser?.image,
                status: currentUser?.status || 'Online',
                type: currentUser?.type, // Importante para o bot saber a permissão (Dono/Membro)
                vipColor: colors.usernameColor
            };

            // 2. Envia para o Firebase
            await push(messageRef, newMessage);
            
            // 3. Limpa a UI imediatamente (Melhor UX)
            setMessage('');
            setShowEmojiPicker(false);

            // 4. LÓGICA DO BOT (Executa em segundo plano)
            if (groupId) {
                // Busca dados do grupo para saber se tem bot ativado
                const groupRef = ref(database, `grupos/${groupId}`);
                const snapshot = await get(groupRef);
                
                if (snapshot.exists()) {
                    const groupData = snapshot.val();

                    // Se o grupo tem a flag 'hasBot' e um nome de bot definido
                    if (groupData.hasBot && groupData.botName) {
                        // Chama o cérebro do bot sem 'await' para não travar a interface do usuário
                        BotSystem.processMessage({
                            groupId: groupId,
                            botName: groupData.botName,
                            triggerMessage: messageText,
                            senderUser: currentUser
                        });
                    }
                }
            }

        } catch (error) {
            console.error("Erro ao enviar:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    function logout() {
        sessionStorage.removeItem('currentUser');
        window.location.href = '/';
    }

    return (
        <div className="relative w-full max-w-5xl mx-auto">
            
            {/* === EMOJI PICKER POP-UP === */}
            <AnimatePresence>
                {showEmojiPicker && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        ref={emojiPickerRef}
                        className="absolute bottom-full left-0 mb-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-full sm:w-[320px] max-h-[200px] overflow-y-auto custom-scrollbar z-50"
                        style={{ borderColor: colors.sidebarBorder }}
                    >
                        <div className="grid grid-cols-6 gap-2">
                            {emojis.map((emoji, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleEmojiClick(emoji.code)}
                                    className="hover:bg-white/10 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                                >
                                    {emoji.src ? (
                                        <Image src={emoji.src} alt={emoji.code} width={24} height={24} className="w-6 h-6 object-contain" />
                                    ) : (
                                        <span className="text-xl">{emoji.code}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === INPUT BAR === */}
            <div className="flex items-end gap-2">
                
                {/* 1. Botão de Emoji */}
                <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    disabled={!canSendMessage}
                >
                    <Smile size={24} />
                </button>

                {/* 2. Área de Texto Glassmorphism */}
                <div 
                    className="flex-1 relative rounded-2xl border transition-all duration-300"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        borderColor: colors.inputBorder,
                        boxShadow: `0 0 10px ${colors.sidebarShadow}20`
                    }}
                >
                    <textarea
                        placeholder={canSendMessage ? "Digite sua mensagem... (/ajuda para o bot)" : "Faça login para conversar"}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        className="w-full bg-transparent text-white px-4 py-3 pr-12 rounded-2xl focus:outline-none resize-none min-h-[48px] max-h-[120px] custom-scrollbar placeholder:text-gray-500"
                        style={{ color: colors.textColor || 'white' }}
                        disabled={!canSendMessage}
                    />
                    
                    {/* Botão Enviar (Dentro do Input) */}
                    <button
                        onClick={sendMessage}
                        disabled={!message.trim() || isSending || !canSendMessage}
                        className="absolute right-2 bottom-2 p-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
                        style={{
                            backgroundColor: message.trim() ? colors.buttonBg : 'transparent',
                            color: message.trim() ? '#fff' : 'gray',
                            boxShadow: message.trim() ? `0 0 15px ${colors.buttonShadow}` : 'none'
                        }}
                    >
                        {isSending ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
                    </button>
                </div>

                {/* 3. Botão Login/Logout */}
                {currentUser?.type === "Visitante" ? (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="p-3 rounded-full bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-600/40 hover:text-white transition-all shadow-[0_0_10px_rgba(0,255,0,0.2)]"
                        title="Fazer Login"
                    >
                        <LogIn size={24} />
                    </button>
                ) : (
                    <button 
                        onClick={logout}
                        className="p-3 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:text-white transition-all"
                        title="Sair"
                    >
                        <LogOut size={24} />
                    </button>
                )}

            </div>

            {/* Modal de Login (Usando Portal internamente no componente Modal) */}
            {isModalOpen && currentUser && groupId && (
                <ChatModal
                    currentUser={currentUser}
                    setIsOpen={setIsModalOpen}
                    groupId={groupId}
                />
            )}
        </div>
    );
}