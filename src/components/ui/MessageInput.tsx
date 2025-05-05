import { useState } from 'react';
import Image from 'next/image';

interface MessageInputProps {
    setIsTyping: (typing: boolean) => void;
}

export default function MessageInput({ setIsTyping }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
    const emojis = [
        { code: '(hug)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(hug)_30' },
        { code: '(heart)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(heart)_30' },
        { code: '(smile)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(smile)_30' },
        { code: '(wink)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(wink)_30' },
        { code: '(cry)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(cry)_30' },
        { code: '(sad)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(sad)_30' },
        { code: '(kiss)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(kiss)_30' },
        { code: '(angry)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(angry)_30' },
        { code: '(love)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(love)_30' },
        { code: '(cool)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(cool)_30' },
        { code: '(tongue)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(tongue)_30' },
        { code: '(clap)', src: 'https://s0.xat.com/web_gear/chat/GetStrip8.php?c=a_(clap)_30' }
    ];

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            console.log('Mensagem enviada:', message);
            setMessage('');
        }
    };

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
        <div className="bg-[#40444b] p-4 rounded-lg shadow-lg relative w-full flex flex-col">

            <div className="emoji-picker flex gap-2 mb-2">
                {emojis.map((emoji) => (
                    <button key={emoji.code} onClick={() => handleEmojiClick(emoji.code)}>
                        <img
                            src={emoji.src}
                            alt={emoji.code}
                            className="h-8 w-8"
                        />
                    </button>
                ))}
            </div>

            <div className="flex items-center space-x-4 mt-4">

                <input
                
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                            onClick={() => console.log('Entrar no chat')}
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
        </div>
    );
}
