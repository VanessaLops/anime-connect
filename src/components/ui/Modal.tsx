'use client';

import { useEffect, useState } from 'react';
import { getDatabase, ref, get, update, set } from 'firebase/database';
import Image from 'next/image';
import { UserType } from '@/utils/userStorage';

interface ChatModalProps {
    setIsOpen: (open: boolean) => void;
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
    }
}



export default function ChatModal({ currentUser, setIsOpen }: ChatModalProps) {
    // const [data, setData] = useState<VisitorData | null>(null);
    // const [userNameAcess, setUserNameAcess] = useState('');
    // const [password, setPassword] = useState('');

    // const [username, setUsername] = useState('');
    // const [image, setImage] = useState('');
    // console.log(image)
    // useEffect(() => {
    //     const fetchVisitor = async () => {
    //         const db = getDatabase();
    //         const visitorRef = ref(db, `visitors/${visitorId}`);
    //         const snapshot = await get(visitorRef);
    //         if (snapshot.exists()) {
    //             const visitorData = snapshot.val();
    //             setData(visitorData);
    //             setUsername(visitorData.username || '');
    //             setImage(visitorData.image || '');
    //         }
    //     };
    //     fetchVisitor();
    // }, [visitorId]);


    // const handleAccess = async () => {
    //     if (!userNameAcess || !password) {
    //         alert('Por favor, preencha todos os campos.');
    //         return;
    //     }

    //     const db = getDatabase();
    //     const visitorRef = ref(db, `visitors/${visitorId}`);

    //     try {
    //         await update(visitorRef, {
    //             userNameAcess,
    //             password,
    //             type: 'Membro',
    //         });


    //         const groupsRef = ref(db, 'grupos');
    //         const snapshot = await get(groupsRef);

    //         if (snapshot.exists()) {
    //             const groupsData = snapshot.val();

    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             const groupEntry = Object.entries(groupsData).find((entry: any) => {
    //                 const group = entry[1];
    //                 return group.name?.toLowerCase() === groupName.toLowerCase();
    //             });


    //             if (groupEntry) {
    //                 const [groupId] = groupEntry;
    //                 const groupMemberRef = ref(db, `grupos/${groupId}/members/${visitorId}`);
    //                 await set(groupMemberRef, {
    //                     name: username,
    //                     type: 'Membro',
    //                 });

    //             } else {
    //                 console.warn('Nenhum grupo público encontrado.');
    //             }
    //         }
    //         setIsOpen(false);
    //     } catch (error) {
    //         console.error('Erro ao conceder acesso:', error);
    //         alert('Erro ao conceder acesso.');
    //     }
    // };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-8 w-96 relative text-black">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                {/* {data ? (
                    <div className="flex items-center space-x-4 mb-4">
                        {data.image && (
                            <Image
                                src={data.image}
                                alt="Foto do visitante"
                                width={100}
                                height={100}
                                className="rounded-full"
                                unoptimized={true}
                            />
                        )}
                        <div className="flex flex-col text-left">
                            <span className="text-sm text-gray-500">ID: {data.id?.split('-')[0]}</span>
                            <h3 className="text-xl font-semibold">{data.username}</h3>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Carregando visitante...</p>
                )}

                <div className="mt-6 space-y-4">

                    <div>

                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Seu nome"
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
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="aninha"
                        />
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
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1234"
                        />
                    </div>
                    <button
                        onClick={handleAccess}
                        className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                    >
                        Acessar
                    </button>

                </div> */}
            </div>
        </div>
    );
}