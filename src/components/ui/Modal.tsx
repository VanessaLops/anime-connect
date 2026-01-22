'use client';

import { User, UserType } from '@/utils/userStorage';
import bcrypt from 'bcryptjs';
import { get, ref, update } from 'firebase/database';
import { motion } from 'framer-motion';
import { Camera, Loader2, Lock, LogIn, User as UserIcon, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { database } from '../../pages/api/lib/firebase';

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
    // States de Dados
    const [userNameAcess, setUserNameAcess] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Nickname público
    const [image, setImage] = useState('');
    
    // States de Controle
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // --- FUNÇÕES AUXILIARES ---
    
    async function hashPassword(pass: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(pass, salt);
    }

    // --- LÓGICA DE LOGIN (HandleAccess) ---
    const handleAccess = async () => {
        setLoading(true);
        setError('');

        if (!userNameAcess.trim() || !password.trim()) {
            setError('Preencha usuário e senha!');
            setLoading(false);
            return;
        }

        try {
            // 1. Busca todos os usuários
            const snapshotUsers = await get(ref(database, "users"));
            if (!snapshotUsers.exists()) {
                setError('Banco de dados de usuários vazio.');
                setLoading(false);
                return;
            }

            const usersData = snapshotUsers.val();
            const usersArray: User[] = Object.values(usersData as Record<string, User>);

            // 2. Encontra usuário pelo Login (userNameAcess)
            const usuarioEncontrado = usersArray.find(user => 
                user.userNameAcess === userNameAcess
            );

            if (!usuarioEncontrado) {
                setError('Usuário não encontrado.');
                setLoading(false);
                return;
            }

            // 3. Valida Senha (Bcrypt)
            const isMatch = await bcrypt.compare(password, usuarioEncontrado.password);

            if (!isMatch) {
                setError('Senha incorreta!');
                setLoading(false);
                return;
            }

            // 4. Sucesso: Salva na Sessão e Recarrega
            // Mantém o tipo (Dono, Staff, Membro) que veio do banco
            sessionStorage.setItem('currentUser', JSON.stringify(usuarioEncontrado));
            
            // Feedback visual antes do reload
            setTimeout(() => {
                setIsOpen(false);
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error("Erro ao realizar login:", error);
            setError("Erro interno ao conectar.");
            setLoading(false);
        }
    };

    // --- LÓGICA DE CADASTRO (HandleRegister) ---
    const handleRegister = async () => {
        setLoading(true);
        setError('');

        // Validação Básica
        if (!userNameAcess.trim() || !password.trim()) {
            setError('Preencha usuário e senha!');
            setLoading(false);
            return;
        }

        try {
            // 1. Verifica Duplicidade (Lógica que faltava)
            const snapshotUsers = await get(ref(database, "users"));
            if (snapshotUsers.exists()) {
                const usersData = snapshotUsers.val();
                const usersArray: User[] = Object.values(usersData as Record<string, User>);
                
                const usuarioExistente = usersArray.find(user => 
                    user.userNameAcess?.toLowerCase() === userNameAcess.toLowerCase()
                );

                if (usuarioExistente) {
                    setError('Este nome de usuário já está em uso. Escolha outro.');
                    setLoading(false);
                    return;
                }
            }

            // 2. Criptografa Senha
            const hashedPassword = await hashPassword(password);

            // 3. Cria Objeto do Novo Membro
            // Importante: Usa o ID do Visitante atual para "promovê-lo"
            const newUser: User = {
                id: currentUser?.id, 
                username: username || currentUser.username || "Membro Novo",
                type: 'Membro', // Todo cadastro novo vira Membro (Dono é setado manualmente no banco depois se precisar)
                power: 0,
                group: [],
                image: image || currentUser.image || "",
                userNameAcess: userNameAcess,
                password: hashedPassword,
                status: 'Online'
            };

            // 4. Atualiza no Firebase (Users Global e Members do Grupo)
            const userRef = ref(database, `users/${newUser.id}`);
            const groupMemberRef = ref(database, `grupos/${groupId}/members/${newUser.id}`);

            await update(userRef, newUser);
            await update(groupMemberRef, newUser);

            // 5. Salva na Sessão Local
            sessionStorage.setItem('currentUser', JSON.stringify(newUser));

            // 6. Reload para efetivar
            setTimeout(() => {
                setIsOpen(false);
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error('Erro ao registrar:', error);
            setError('Falha ao criar conta.');
            setLoading(false);
        }
    };

    if (!mounted) return null;

    // --- RENDERIZAÇÃO (VISUAL V2 - PORTAL) ---
    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-[#0a0a0a] border border-anime-purple/30 rounded-2xl shadow-[0_0_50px_rgba(121,40,202,0.3)] overflow-hidden z-10"
            >
                {/* Glow Topo */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-anime-pink via-anime-purple to-anime-cyan" />

                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20">
                    <X size={24} />
                </button>

                <div className="p-8 relative z-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-anime-pink to-anime-purple flex items-center justify-center text-white shadow-lg">
                            {isLoginMode ? <LogIn size={32} /> : <UserPlus size={32} />}
                        </div>
                        <h2 className="text-2xl font-bold text-white font-display tracking-wide">
                            {isLoginMode ? 'Acessar Sistema' : 'Criar Identidade'}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {/* Avatar Upload (Só no cadastro) */}
                        {!isLoginMode && (
                            <div className="flex justify-center mb-6">
                                <div className="relative group cursor-pointer">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-anime-purple p-1">
                                        {image || currentUser.image ? (
                                            <Image 
                                                src={image || currentUser.image} 
                                                alt="Avatar" 
                                                width={96} height={96} 
                                                className="rounded-full w-full h-full object-cover" 
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-full text-gray-500">
                                                <UserIcon size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setImage(reader.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Inputs */}
                        {!isLoginMode && (
                            <div className="relative group">
                                <UserIcon className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-anime-pink transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Seu Nickname Público (Ex: Goku)"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-anime-pink focus:bg-white/10 transition-all placeholder:text-gray-600"
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <UserIcon className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-anime-cyan transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Usuário de Login (Sem espaços)"
                                value={userNameAcess}
                                onChange={(e) => setUserNameAcess(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-anime-cyan focus:bg-white/10 transition-all placeholder:text-gray-600"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-anime-purple transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="Sua Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-anime-purple focus:bg-white/10 transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={isLoginMode ? handleAccess : handleRegister}
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-anime-pink to-anime-purple hover:shadow-[0_0_20px_rgba(255,0,128,0.4)]'}`}
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : (isLoginMode ? 'Acessar' : 'Cadastrar')}
                        </button>

                        <div className="text-center mt-6">
                            <button
                                onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                {isLoginMode ? (
                                    <>Não tem conta? <span className="text-anime-cyan font-bold hover:underline">Registre-se</span></>
                                ) : (
                                    <>Já é membro? <span className="text-anime-pink font-bold hover:underline">Faça Login</span></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );

    return createPortal(modalContent, document.body);
}