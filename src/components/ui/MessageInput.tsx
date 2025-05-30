'use client'

import { useState } from 'react';
import Image from 'next/image';
import ChatModal from './Modal';
import { ref, push } from 'firebase/database';
import { database } from '@/pages/api/lib/firebase';
import { UserType } from '@/utils/userStorage';
import { getEmojisByVip } from '@/utils/emojis';

interface MessageInputProps {
    groupId?: string;
    currentUser?: {
        id: string;
        username: string;
        type: UserType;
        power: number; // vamos usar para controle de permissão
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
    const [localUser, setLocalUser] = useState(currentUser);

    const emojis = getEmojisByVip(vipEmoji);

    const handleEmojiClick = (emoji: string) => {
        setMessage((prev) => prev + ` ${emoji}`);
    };

    console.log(currentUser, 'currentUser')

const canSendMessage = Boolean(currentUser);


    const sendMessage = async () => {
        if (!message.trim()) return;
        if (!canSendMessage) return alert('Você não tem permissão para enviar mensagens.');

        const messageRef = ref(database, `grupos/${groupId}/messages`);
        const newMessage = {
            text: message,
            timestamp: Date.now(),
            userId: currentUser?.id,
            username: currentUser?.username,
            image: currentUser?.image,
            status: currentUser?.status || 'Online',
        };

        await push(messageRef, newMessage);
        setMessage('');
    };

    function logout() {
        sessionStorage.removeItem('currentUser');
        setLocalUser(undefined);
        window.location.href = '/';
    }

    return (
        <div>
            <div>
                {emojis.map((emoji) =>
                    emoji.src ? (
                        <button
                            key={emoji.code}
                            onClick={() => canSendMessage && handleEmojiClick(emoji.code)}
                            disabled={!canSendMessage}
                            style={{ cursor: canSendMessage ? 'pointer' : 'not-allowed' }}
                        >
                            <Image src={emoji.src} alt={emoji.code} width={32} height={32} className="h-8 w-8" />
                        </button>
                    ) : (
                        <button
                            key={emoji.code}
                            onClick={() => canSendMessage && handleEmojiClick(emoji.code)}
                            disabled={!canSendMessage}
                            style={{ fontSize: 24, cursor: canSendMessage ? 'pointer' : 'not-allowed' }}
                        >
                            {emoji.code}
                        </button>
                    )
                )}
            </div>
            <div className="w-full">
                <div className="flex items-center gap-2 w-full">
                    <textarea
                        placeholder="Digite sua mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={2}
                        className="w-full resize-none rounded-xl px-4 py-2 shadow border focus:outline-none"
                        style={{
                            backgroundColor: colors.inputBg,
                            color: colors.textColor || 'white',
                            borderColor: colors.inputBorder,
                            boxShadow: `0 0 8px ${colors.sidebarShadow}`,
                            cursor: canSendMessage ? 'auto' : 'not-allowed',
                        }}
                        disabled={!canSendMessage}
                    />
                    <div className="flex flex-col gap-2">

                        {

                            currentUser?.type === "Visitante" ? 
                            <button className="px-4 py-2 rounded-full text-white shadow hover:transition" onClick={() => setIsModalOpen(true)}>Entrar</button> : <button className="px-4 py-2 rounded-full text-white shadow hover:transition" onClick={logout}>Sair</button>
                        }


                        <button
                            className="px-4 py-2 rounded-full text-white shadow hover:transition"
                            style={{
                                backgroundColor: canSendMessage ? colors.buttonBg : '#555',
                                boxShadow: canSendMessage ? `0 0 10px ${colors.buttonShadow}` : 'none',
                                cursor: canSendMessage ? 'pointer' : 'not-allowed',
                            }}
                            onClick={sendMessage}
                            disabled={!canSendMessage}
                            onMouseEnter={e => canSendMessage && (e.currentTarget.style.backgroundColor = colors.buttonHoverBg)}
                            onMouseLeave={e => canSendMessage && (e.currentTarget.style.backgroundColor = colors.buttonBg)}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>

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
