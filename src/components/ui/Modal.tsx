'use client';

import { useEffect, useState } from 'react';
import { get, onDisconnect, ref, set, update } from 'firebase/database';
import Image from 'next/image';
import { User, UserType } from '@/utils/userStorage';
import { GroupData } from './SideBar';
import { database } from '../../../firebase';
import { Button } from './Button';
import bcrypt from 'bcryptjs';


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


        if (!userNameAcess.trim() || !password.trim()) {
            alert('Preencha o nome de usuário e a senha!');
            return;
        }

        try {

            const snapshotUsers = await get(ref(database, "users"));

            const usersData = snapshotUsers.val();

            const usersArray: User[] = Object.values(usersData as Record<string, User>);


            //Verifica se existe algum usuário com o username informado
            const usuarioPorNome = usersArray.find(function getName(dados: User) {
                return dados.userNameAcess === userNameAcess
            });



            if (!usuarioPorNome) {
                alert('Nome de usuário não encontrado!');
                return;
            }

            if (userNameAcess !== usuarioPorNome.userNameAcess) {
                alert('Nome de usuário Invalido!');
                return;
            }
            const isMatch = await bcrypt.compare(password, usuarioPorNome.password);


            if (!isMatch) {
                alert('Senha incorreta!');
                return false;
            }

            // Se passou das validações acima, é porque está tudo certo
            sessionStorage.setItem('currentUser', JSON.stringify(usuarioPorNome));

            const expires = new Date();
            expires.setDate(expires.getDate() + 7);

            document.cookie = `user=${JSON.stringify(usuarioPorNome)}; path=/; expires=${expires.toUTCString()};`;

            setTimeout(() => {
                setIsOpen(false);
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error("Erro ao realizar login:", error);
            alert("Erro ao realizar login. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };


    async function hashPassword(password: string) {
        try {

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        } catch (error) {
            console.error('Erro ao hash da senha:', error);
        }
    }


    const handleRegister = async () => {

        if (!userNameAcess.trim() || !password.trim()) {
            alert('Preencha o nome de usuário e a senha!');
            return;
        }

        const snapshotUsers = await get(ref(database, "users"));

        const usersData = snapshotUsers.val();


        const usersArray: User[] = Object.values(usersData as Record<string, User>);
        console.log(usersArray, 'usersArray')

        const usuarioPorNome = usersArray.find(user =>
            user.userNameAcess?.toLowerCase() === userNameAcess.toLowerCase()
        );

        // if (userNameAcess == usuarioPorNome?.userNameAcess) {
        //     alert('Escolha um nome de usuário mais forte! Use letras, números e talvez alguns símbolos.');
        //     return;
        // }


        const hashedPassword = await hashPassword(password);


        const user = {
            id: currentUser?.id,
            username: username,
            type: 'Membro',
            power: 0,
            group: [],
            image: image,
            userNameAcess: userNameAcess,
            password: hashedPassword,
            status: 'Online'
        };



        const expires = new Date();
        const groupRef = ref(database, `grupos/${groupId}/members/${currentUser.id}`);
        const userRef = ref(database, `users/${currentUser.id}`);
        update(userRef, user);
        update(groupRef, user);
        //Assim que criar eu devo atualizar esse usuario
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        document.cookie = `user=${JSON.stringify(userNameAcess)}; path=/; expires=${expires.toUTCString()};`;

        setTimeout(() => {
            setIsOpen(false);
            window.location.reload();
        }, 1000);

    };




    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
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
