'use client';

import { useEffect, useState } from 'react';
import { get, onDisconnect, ref, set, update } from 'firebase/database';
import Image from 'next/image';
import { UserType } from '@/utils/userStorage';
import { GroupData } from './SideBar';
import { database } from '../../../firebase';
import { Button } from './Button';

interface ChatModalProps {
    setIsOpen: (open: boolean) => void;
    currentUser: {
        id: string;
        username: string;
        type: UserType;
        power: number;
        group: string[];
        image: string;
        userNameAcess: string;
        password: string;
        status?: string;
    };
    groupId: string;
}

export default function ChatModal({ groupId, currentUser, setIsOpen }: ChatModalProps) {
    const [userNameAcess, setUserNameAcess] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [image, setImage] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleAccess = async () => {
        setLoading(true);

        try {
            const snapshotUsers = await get(ref(database, "users"));
            if (snapshotUsers.exists()) {
                const usersData = snapshotUsers.val();
                const matchingUser = Object.values(usersData).find((user: any) =>
                    user.userNameAcess === userNameAcess && user.password === password
                );
                if (matchingUser) {
                    localStorage.setItem('currentUser', JSON.stringify(matchingUser));
                    const expires = new Date();
                    expires.setDate(expires.getDate() + 7);
                    document.cookie = `user=${JSON.stringify(matchingUser)}; path=/; expires=${expires.toUTCString()};`;

                    setTimeout(() => {
                        setIsOpen(false);
                        window.location.reload();
                    }, 1000);

                } else {
                    alert("Usuário ou senha inválidos.");
                }
            }
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            alert("Erro ao realizar login. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {

        const user = {
            id: currentUser?.id,
            username: username,
            type: 'Membro',
            power: 0,
            group: [],
            image: image,
            userNameAcess: userNameAcess,
            password: password,
            status: 'Online'
        };

        // const expires = new Date();
        // localStorage.setItem('currentUser', JSON.stringify(user));
        // document.cookie = `user=${JSON.stringify(userNameAcess)}; path=/; expires=${expires.toUTCString()};`;

        const groupRef = ref(database, `grupos/${groupId}/members/${currentUser.id}`);
        const userRef = ref(database, `users/${currentUser.id}`);
        update(userRef, user);
        update(groupRef, user);
        setTimeout(() => {
            setIsOpen(false);
            window.location.reload();
        }, 1000);

    };




    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-8 w-96 relative text-black">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                <h2 className="text-xl font-semibold text-center mb-4">
                    {isLoginMode ? 'Login' : 'Cadastro'}
                </h2>

                <div className="space-y-4">
                    {currentUser.type === 'Visitante' && !isLoginMode && (
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                {image || currentUser.image ? (
                                    <Image
                                        src={image || currentUser.image}
                                        alt="Avatar"
                                        width={64}
                                        height={64}
                                        className="rounded-full"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                if (reader.result) {
                                                    setImage(reader.result as string);
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    title="Clique para trocar a imagem"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold">{username || currentUser.username}</h3>
                                <p className="text-sm text-gray-500">ID: {currentUser.id.split('-')[0]}</p>
                            </div>
                        </div>
                    )}

                    {!isLoginMode && (
                        <>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome Nick</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    placeholder={currentUser?.username}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label htmlFor="userNameAcess" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
                        <input
                            type="text"
                            id="userNameAcess"
                            value={userNameAcess}
                            onChange={(e) => setUserNameAcess(e.target.value)}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="aninha"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="1234"
                        />
                    </div>

                    {loading ? (
                        <div className="text-center text-gray-500 mt-4">Carregando...</div>
                    ) : (
                        <Button
                            onClick={isLoginMode ? handleAccess : handleRegister}
                            className={`w-full py-2 ${isLoginMode ? 'bg-green-600' : 'bg-blue-600'} text-white rounded-md hover:opacity-90`}
                        >
                            {isLoginMode ? 'Acessar' : 'Cadastrar'}
                        </Button>
                    )}

                    <div className="text-center mt-4 text-sm text-gray-600">
                        {isLoginMode ? (
                            <>
                                Não tem uma conta?{' '}
                                <span
                                    onClick={() => setIsLoginMode(false)}
                                    className="text-blue-600 hover:underline cursor-pointer"
                                >
                                    Cadastre-se
                                </span>
                            </>
                        ) : (
                            <>
                                Já tem uma conta?{' '}
                                <span
                                    onClick={() => setIsLoginMode(true)}
                                    className="text-green-600 hover:underline cursor-pointer"
                                >
                                    Faça login
                                </span>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
