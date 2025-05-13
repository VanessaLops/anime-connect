'use client'
import { useState, useEffect } from "react";
import '../../app/globals.css';
import PeaoAvatar from "./PeaoMembro";
import { database } from '../../../firebase';
import { GroupData } from "./SideBar";
import MessageInput from "./MessageInput";
import { onValue, ref, onDisconnect, set } from "firebase/database";
import PeaoVisitante from "./PeaoVisitante";
import { UserType } from "@/utils/userStorage";
import ModalProfile from "./ModalProfile";

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



export default function ChatWindow({ groupData, currentUser }: ChatWindowProps) {
    const [grupos, setGrupos] = useState<GroupData | null>(null);
    const [onlineMembers, setOnlineMembers] = useState<any[]>([]);
    const [offlineMembers, setOfflineMembers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log(onlineMembers, 'offlineMembers')


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
                    (user: any) => user.status === 'Online'
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


    const handleUserClick = (user: any) => {
        if (user.type !== 'Visitante') {
            setSelectedUser(user);
            setIsModalOpen(true);
        }
    };
    return (
        <div className="flex h-screen bg-[#36393f] text-white">
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-700 font-bold text-lg">
                    {groupData?.name}
                </div>
                <div className="flex-1 overflow-y-auto">
                    <p>Carregando grupos...</p>
                </div>
                <div className="p-4 border-t border-gray-700">
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
                </div>
            </div>

            <div className="w-50 bg-[#36393f] border-l border-[#444] p-3 overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent">
                <h2 className="text-lg font-bold mb-3 text-[#00ffff] text-center border-b border-[#444] pb-2 shadow-sm tracking-wide">
                    👥 Conectados
                </h2>

                <div className="flex flex-col text-sm font-medium text-white bg-[#36393f] p-2 rounded-md max-h-screen overflow-y-auto">
                    {/* Online */}
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

                    {/* Offline */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-400 mb-1">⚪ Membros Offline</h3>
                        {offlineMembers?.map((user, index) => (
                            <div
                                key={`online-${index}`}
                                className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all"

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
            </div>

            {selectedUser && (
                <ModalProfile
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={selectedUser}
                    currentUserType={currentUser.type}
                    groupId={groupData.groupId}
                />
            )}

        </div>
    );
}
