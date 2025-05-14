'use client'

import { useState } from 'react';
import Image from 'next/image';
import ChatModal from './Modal';
import { Button } from './Button';
import { UserType } from '@/utils/userStorage';

interface MessageInputProps {
    groupName: string;
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
    groupId: string;

}

export default function MessageInput({ groupId, currentUser }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const emojis = [
        { code: '(happy)', src: 'https://www.free-smileys.com/files/happy-smileys/572.gif' },
        { code: '(wink)', src: 'https://www.free-smileys.com/files/happy-smileys/573.gif' },
        { code: '(cool)', src: 'https://www.free-smileys.com/files/happy-smileys/576.gif' },
        { code: '(laugh)', src: 'https://www.free-smileys.com/files/happy-smileys/574.gif' },
        { code: '(sad)', src: 'https://www.free-smileys.com/files/happy-smileys/579.gif' },
        { code: '(surprised)', src: 'https://www.free-smileys.com/files/happy-smileys/581.gif' },
        { code: '(disappointed)', src: 'https://www.free-smileys.com/files/disappointed-smileys/898.gif' },
        { code: '(love1)', src: 'https://www.free-smileys.com/files/love-smileys/871.gif' },
        { code: '(love)', src: 'https://www.free-smileys.com/files/love-smileys/872.gif' },
        { code: '(love3)', src: 'https://www.free-smileys.com/files/love-smileys/870.gif' },
    ];

    const handleEmojiClick = (emoji: string) => {
        setMessage((prev) => prev + ` ${emoji}`);
    };

    function logout() {
        localStorage.removeItem('currentUser');
        document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.href = '/';
    }

    return (
        <div className="">
            <div className="emoji-picker flex gap-2 mb-2">
                {emojis.map((emoji) => (
                    <button key={emoji.code} onClick={() => handleEmojiClick(emoji.code)}>
                        <Image
                            src={emoji.src}
                            alt={emoji.code}
                            width={32}
                            height={32}
                            className="h-8 w-8"
                        />
                    </button>
                ))}
            </div>
            <div className="flex items-center justify-between space-x-4 mt-4">
                <div className="flex items-center w-full space-x-2">
                    <input

                        placeholder="Digite sua mensagem..."
                        className="flex-1 p-3 rounded-lg bg-[#2f3136] text-white placeholder-gray-400 focus:outline-none resize-none h-24 w-120 transition-all"
                    />
                    <button
                        onClick={() => console.log('Enviar mensagem')}
                        className="bg-[#34b7f1] text-white p-3 rounded-lg w-8 h-24 flex items-center justify-center hover:bg-[#29a3cc] transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col space-y-3 w-auto">
                    <Button
                        variant="primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Entrar
                    </Button>
                    <Button
                        onClick={() => logout()}
                        variant="outline"

                    >
                        Sair
                    </Button>
                </div>

            </div>

            {isModalOpen && (
                <ChatModal
                    currentUser={currentUser}
                    setIsOpen={setIsModalOpen}
                    groupId={groupId}
                />
            )}
        </div>
    );
}
