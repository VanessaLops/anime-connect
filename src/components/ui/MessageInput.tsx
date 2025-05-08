'use client'

import { useState } from 'react';
import Image from 'next/image';
import ChatModal from './Modal';


interface MessageInputProps {
    setIsTyping: (typing: boolean) => void;
    userId: string
    groupName: string;
}

export default function MessageInput({ setIsTyping, userId, groupName }: MessageInputProps) {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMessage(value);

        setIsTyping(true);

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(() => {
            setIsTyping(false);
        }, 1000);
        setTypingTimeout(timeout);
    };

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

            <div className="items-center space-x-1 mt-1">
                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    placeholder="Digite sua mensagem..."
                    className="w-162 p-4 rounded-lg bg-[#2f3136] text-white placeholder-gray-400 focus:outline-none h-25"
                />

                <div className="flex items-center space-x-4 mt-4">
                    <button
                        onClick={() => console.log('Entrar no chat')}
                        className="bg-[#34b7f1] text-white p-3 rounded-full hover:bg-[#29a3cc] transition-all duration-200"
                    >
                        Enviar
                    </button>

                    <div className="flex flex-col space-y-2 flex-1">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#34b7f1] text-white p-3 rounded-full hover:bg-[#29a3cc] transition-all duration-200"
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => console.log('Sair do chat')}
                            className="bg-[#f14c4c] text-white p-3 rounded-full hover:bg-[#e03c3c] transition-all duration-200"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ChatModal
                    visitorId={userId}
                    setIsOpen={setIsModalOpen}
                    groupName={groupName}
                />
            )}
        </div>
    );
}
