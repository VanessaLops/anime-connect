import { useState } from "react";
import '../../app/globals.css';
import PeaoAvatar from "./PeaoStatus";
import { getGroupBackground } from "./SideBar";

const users = [
    { username: "Visitante", status: "DonoGeral", power: 1, type: "Visitante" },
    { username: "Mmebro", status: "Dono", power: 2, type: "Membro" },
    { username: "Mmebro", status: "Visitante", power: 3, type: "Membro" },
    { username: "Dono Geral", status: "Visitante", power: 4, type: "Dono_Geral" },
    { username: "Dono_Sala", status: "Visitante", power: 5, type: "Dono_Sala", relacionamento: "casado" },
    { username: "Staff", status: "Staff", power: 6, type: "Staff" },
    { username: "Ester", status: "ESTER", power: 7, type: "Admin_mod", relacionamento: "bff" },
    { username: "Sup", status: "Avatar_Power_Peao", power: 7, type: "Avatar_Power_Peao", relacionamento: "casado" },

    // { username: "User4", status: "Visitante", power: 9 },
    // { username: "User5", status: "Visitante", power: 10 },
    // { username: "User6", status: "Visitante", power: 11 },
    // { username: "User7", status: "Visitante", power: 12 },
    // { username: "User8", status: "Visitante", power: 13 },
    // { username: "User9", status: "Visitante", power: 14 },
    // { username: "User10", status: "Visitante", power: 15 },
    // { username: "User11", status: "Visitante", power: 16 },
    // { username: "User12", status: "Visitante", power: 17 }
];

interface ChatWindowProps {
    isTyping: boolean;
    groupName: string;
}






export default function ChatWindow({ isTyping, groupName }: ChatWindowProps) {
    const [visibleUsers, setVisibleUsers] = useState(users.length);

    const [isLoading, setIsLoading] = useState(false);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1; // margem de erro

        if (isAtBottom && visibleUsers < users.length && !isLoading) {
            setIsLoading(true);
            setVisibleUsers(prev => prev + 5);

            setTimeout(() => setIsLoading(false), 500);
        }
    };

    const bgImage = getGroupBackground(groupName);

    return (
        <div className="flex h-screen bg-[#36393f] text-white">
            <div className="flex-1 flex flex-col">

                <div className="p-4 border-b border-gray-700 font-bold text-lg">
                    {groupName}
                </div>


                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#2f3136] rounded-md"
                    style={{
                        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}>

                    <div className="flex items-start space-x-3">
                        <div className="bg-[#40444b] p-3 rounded-lg max-w-md">
                            <span className="block font-semibold text-white">User123</span>
                            <p className="text-gray-300">Bem-vindo ao grupo!</p>
                        </div>
                    </div>


                    <div className="flex items-start space-x-3">
                        <div className="bg-[#40444b] p-3 rounded-lg max-w-md">
                            <span className="block font-semibold text-white">Staff</span>
                            <p className="text-gray-300">Se precisar de ajuda, só chamar um moderador.</p>
                        </div>
                    </div>

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


            <div
                className="h-100 overflow-y-auto"
                onScroll={handleScroll}
            >
                <div className="text-lg font-semibold mb-2">Conectados</div>
                {users.slice(0, visibleUsers).map((user, index) => (
                    <PeaoAvatar
                        key={index}
                        username={user.username}
                        type={user.type}
                        power={user.power}
                        relacionamento={user.relacionamento}
                        isTyping={isTyping}
                    />
                ))}
            </div>

        </div>
    );
}
