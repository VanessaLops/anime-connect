'use client'
import { useState, useEffect } from "react";
import '../../app/globals.css';
import PeaoAvatar from "./PeaoStatus";
import { get, ref } from "firebase/database";
import { database } from '../../../firebase';
import { User } from "@/utils/userStorage";
import { GroupData } from "./SideBar";

interface ChatWindowProps {
    isTyping: boolean;
    groupName: string;
}


interface Users {
    users: User[];
}

export const getUsersFromFirebase = async (): Promise<User[]> => {
    try {
        // Referência ao nó "users" do Firebase
        const usersRef = ref(database, "visitors");

        // Recuperando os dados dos usuários
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const usersData = snapshot.val();

            // Transformando os dados em um array de usuários
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
export default function ChatWindow({ isTyping, groupName }: ChatWindowProps) {
    console.log(groupName, 'groupName')
    const [users, setUsers] = useState<User[]>([]);
    const [grupos, setGrupos] = useState<GroupData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUsers = async () => {
        const usersFromFirebase = await getUsersFromFirebase();
        console.log(usersFromFirebase,'usersFromFirebase')
        setUsers(usersFromFirebase);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const [usersData] = useState<Users>({ users });
    console.log(users, 'visitors')

    console.log(groupName, 'groupName')
    console.log("Dados de usersData:", usersData?.users);

    console.log(grupos, 'grupos');


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




    function filtrarGrupos(grupos: GroupData[], usuario: User): GroupData[] {
        const grupoAjudaId = "d03330f1-834a-4535-af18-6a805642c962";
        // Se for visitante, incluir o grupo de ajuda mesmo que não esteja em usuario.group
        const gruposPermitidos = usuario.type === "Visitante"
            ? [...usuario.group, grupoAjudaId]
            : usuario.group;

        return grupos.filter(grupo => gruposPermitidos.includes(grupo.groupId));
    }

    const usuarios = Array.isArray(users)
        ? users
        : [users];

    console.log(usuarios, 'usuarios')
    const gruposPorUsuario = usuarios.map(user => ({
        userData: user,
        grupos: filtrarGrupos(grupos, user)
    }));



    return (
        <div className="flex h-screen bg-[#36393f] text-white">
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-700 font-bold text-lg">
                    {groupName}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#2f3136] rounded-md">
                    {loading ? (
                        <p>Carregando grupos...</p>
                    ) : (
                        gruposPorUsuario?.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all"
                            >
                                <PeaoAvatar
                                    key={index}
                                    group={user.userData.group}
                                    username={user.userData.username}
                                    type={user.userData.type}
                                    power={user.userData.power}
                                    relacionamento={user.userData.relacionamento}
                                    isTyping={isTyping}
                                    id={user.userData.id}
                                    image={user.userData.image}
                                />
                            </div>
                        ))
                    )}

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

            <div className="w-50 bg-[#36393f] border-l border-[#444] p-3 overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent">
                <h2 className="text-lg font-bold mb-3 text-[#00ffff] text-center border-b border-[#444] pb-2 shadow-sm tracking-wide">
                    👥 Conectados
                </h2>
                <div className="flex flex-col text-sm font-medium text-white bg-[#36393f] p-2 rounded-md max-h-screen overflow-y-auto">
                    {loading ? (
                        <p>Carregando usuários...</p>
                    ) : (
                        gruposPorUsuario.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-1 py-1 hover:bg-[#2e2e3a] rounded-sm transition-all"
                            >
                                <PeaoAvatar
                                    username={user.userData.username}
                                    type={user.userData.type}
                                    power={user.userData.power}
                                    relacionamento={user.userData.relacionamento}
                                    isTyping={isTyping}
                                    group={user.userData.group}
                                    id={user.userData.id}
                                    image={user.userData.image}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
