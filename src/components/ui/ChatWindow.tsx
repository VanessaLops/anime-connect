'use client'
import { useState, useEffect } from "react";
import '../../app/globals.css';
import PeaoAvatar from "./PeaoStatus";
import { get, ref } from "firebase/database";
import { database } from '../../../firebase';
import { User } from "@/utils/userStorage";
import { GroupData } from "./SideBar";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
    isTyping: boolean;
    groupName: string;
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: {
        id: string;
        type: "Dono_Geral" | "Admin_mod" | "Dono_Sala" | "Staff" | "Membro" | "Visitante";
        image: string;
        username: string;
    };
    isChatEnabled: boolean; 
}

export const getUsersFromFirebase = async (): Promise<User[]> => {
    try {
        const usersRef = ref(database, "visitors");
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            const users: User[] = Object.keys(usersData).map(key => ({
                id: key,
                ...usersData[key]
            }));
            console.log("Usuários recuperados do Firebase:", users);
            return users;
        } else {
            console.log("Nenhum usuário encontrado.");
            return [];
        }
    } catch (error) {
        console.error("Erro ao recuperar usuários do Firebase:", error);
        return [];
    }
};

export default function ChatWindow({  groupName, setIsTyping, currentUser }: ChatWindowProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [grupos, setGrupos] = useState<GroupData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUsers = async () => {
        const usersFromFirebase = await getUsersFromFirebase();
        setUsers(usersFromFirebase);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchGrupos = async () => {
        try {
            const snapshot = await get(ref(database, 'grupos'));
            if (snapshot.exists()) {
                setGrupos(Object.values(snapshot.val()));
            } else {
                console.log('Nenhum grupo encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar grupos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrupos();
    }, []);



    // const membrosPorGrupo = grupos.flatMap(grupo => {
    //     return grupo.groupId.filter(membro => membro.id === currentUser.id || membro.status !== 'Visitante');
    // });

    const group = grupos.find(group => group.name === groupName);

    console.log(group, 'offlineMembers')

    const groupUser = users.find(u => u.username === currentUser?.username);

    console.log(groupUser, 'groupUser')


    console.log(users, 'users', users)
    console.log(grupos, 'grupos')
    console.log(groupName, 'groupName')
    return (
        <div className="flex h-screen bg-[#36393f] text-white">
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-700 font-bold text-lg">
                    {groupName}
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <p>Carregando grupos...</p>
                    ) : (
                        <>
                            {/* {membrosPorGrupo.map((user, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all"
                                >
                                    <PeaoAvatar
                                        group={user.group}
                                        username={user.username}
                                        type={user.type}
                                        power={user.power}
                                        relacionamento={user.relacionamento}
                                        isTyping={isTyping}
                                        id={user.id}
                                        image={user.image}
                                        password=""
                                        userNameAcess=""
                                    />
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
                                    <span className="text-sm text-gray-400 ml-2">Alguém está digitando...</span>
                                </div>
                            )} */}
                        </>
                    )}
                </div>
                <div className="p-4 border-t border-gray-700">
                    <MessageInput setIsTyping={setIsTyping} userId={currentUser?.id || ''} groupName={groupName} currentUser={currentUser} />
                </div>
            </div>

            <div className="w-50 bg-[#36393f] border-l border-[#444] p-3 overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent">
                <h2 className="text-lg font-bold mb-3 text-[#00ffff] text-center border-b border-[#444] pb-2 shadow-sm tracking-wide">
                    👥 Conectados
                </h2>

                {loading ? (
                    <p>Carregando usuários...</p>
                ) : (
                    <div className="flex flex-col text-sm font-medium text-white bg-[#36393f] p-2 rounded-md max-h-screen overflow-y-auto">
                        {/* Online */}
                        <div className="mb-3">
                            <h3 className="text-md font-semibold text-green-400 mb-1">🟢Online</h3>
                            {users
                                .filter(u => u.status === "online")
                                .map((user, index) => (
                                    <div
                                        key={`online-${index}`}
                                        className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all"
                                    >
                                        <PeaoAvatar
                                            username={user.username}
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

                        {/* Membros Offline */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-400 mb-1">⚪ Membros Offline</h3>
                            {/* {membrosPorGrupo
                                .filter(u => u.status !== "online")
                                .map((user, index) => (
                                    <div
                                        key={`offline-${index}`}
                                        className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all opacity-50"
                                    >
                                        <PeaoAvatar
                                            username={user.username}
                                            type={user.type}
                                            power={user.power}
                                            relacionamento={user.relacionamento}
                                            isTyping={false}
                                            group={user.group}
                                            id={user.id}
                                            image={user.image}
                                            password=""
                                            userNameAcess=""
                                        />
                                    </div>
                                ))} */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
