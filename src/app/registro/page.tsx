'use client';

import { useEffect, useState } from 'react';
import { getDatabase, ref, get, update, set } from 'firebase/database';
import Image from 'next/image';
import { UserType } from '@/utils/userStorage';

interface ChatModalProps {
    visitorId: string;
    setIsOpen: (open: boolean) => void;
    groupName: string;
    currentUser: {
        id: string;
        type: "Dono_Geral" | "Admin_mod" | "Dono_Sala" | "Staff" | "Membro" | "Visitante";
        image: string;
        username: string;
    };
}

export interface VisitorData {
    id: string;
    username: string;
    type: UserType;
    power: number;
    group: string[];
    relacionamento?: string;
    image: string;
    userNameAcess: string;
    password: string;
}

export default function Registro({ visitorId, setIsOpen, groupName, currentUser }: ChatModalProps) {
    const [data, setData] = useState<ChatModalProps | null>(null);
    
    const [userNameAcess, setUserNameAcess] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [image, setImage] = useState('');
    const [userError, setUserError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    console.log(visitorId,'visitorId')
    useEffect(() => {
        const fetchVisitor = async () => {
            const db = getDatabase();
            const visitorRef = ref(db, `visitors/${visitorId}`);
            const snapshot = await get(visitorRef);
            if (snapshot.exists()) {
                const visitorData = snapshot.val();
                setData(visitorData);
                setUsername(visitorData.username || '');
                setImage(visitorData.image || '');
                const { userNameAcess, password, ...safeVisitorData } = visitorData;
                localStorage.setItem('visitorData', JSON.stringify(safeVisitorData));
            }
        };

        if (visitorId) fetchVisitor();
    }, [visitorId]);

    const handleAccess = async () => {
        setUserError('');
        setPasswordError('');

        if (!userNameAcess || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const db = getDatabase();
        const visitorRef = ref(db, `visitors/${visitorId}`);

        try {
            const snapshot = await get(visitorRef);

            if (!snapshot.exists()) {
                alert('Visitante não encontrado.');
                return;
            }
            const groupsRef = ref(db, 'grupos');
            const groupsSnap = await get(groupsRef);

            if (groupsSnap.exists()) {
                const userData = snapshot.val();
                const groupsData = groupsSnap.val();
                const groupEntry = Object.entries(groupsData).find((entry: any) =>
                    entry[1].name?.toLowerCase() === groupName.toLowerCase()
                );
                if (groupEntry) {
                    const [groupId] = groupEntry;
                    await update(visitorRef, {
                        userNameAcess,
                        password,
                        type: 'Membro',
                        group: [groupId]
                    });
                    const groupMemberRef = ref(db, `grupos/${groupId}/members/${visitorId}`);
                    await set(groupMemberRef, userData);
                    setIsOpen(false);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-8 w-96 relative text-black max-w-sm mx-auto">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                {currentUser ? (
                    <div className="flex items-center space-x-4 mb-6">
                        {currentUser.image && (
                            <Image
                                src={currentUser.image}
                                alt="Foto do visitante"
                                width={80}
                                height={80}
                                className="rounded-full"
                                unoptimized={true}
                            />
                        )}
                        <div className="flex flex-col text-left">
                            <span className="text-sm text-gray-500">ID: {currentUser.id?.split('-')[0]}</span>
                            <h3 className="text-xl font-semibold">{currentUser.username}</h3>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Carregando visitante...</p>
                )}

                <div className="mt-4 space-y-6">
                    <div>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nome Completo"
                        />
                    </div>

                    <div>
                        <label htmlFor="userNameAcess" className="block text-sm font-medium text-gray-700">
                            Nome de Usuário
                        </label>
                        <input
                            type="text"
                            id="userNameAcess"
                            value={userNameAcess}
                            onChange={(e) => setUserNameAcess(e.target.value)}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="aninha"
                        />
                        {userError && <p className="text-red-600 text-sm mt-1">{userError}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="********"
                        />
                        {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
                    </div>

                    <button
                        onClick={handleAccess}
                        className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                    >
                        Acessar
                    </button>

                    <p className="text-sm text-center text-gray-500 mt-4">
                        Já tem Conta?{' '}
                        <span
                            onClick={() => setIsOpen(false)}
                            className="text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
