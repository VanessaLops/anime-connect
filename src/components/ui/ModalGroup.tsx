'use client';

import { get, getDatabase, ref, remove, set, update } from 'firebase/database';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Bot, Hash, Image as ImageIcon, Link as LinkIcon, Loader2, Trash2, Users, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // Importante para o modal não ficar preso
import { v4 as uuidv4 } from 'uuid';

interface GroupCreateModalProps {
    currentUserId: string;
    setIsOpen: (open: boolean) => void;
}

export default function GroupCreateModal({ currentUserId, setIsOpen }: GroupCreateModalProps) {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [backgroundUrl, setBackgroundUrl] = useState('');
    const [category, setCategory] = useState('');

    const [error, setError] = useState('');
    const [existingGroupName, setExistingGroupName] = useState('');
    const [existingGroupId, setExistingGroupId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // Novo loading para ação
    const [createBot, setCreateBot] = useState(false);
    const [botName, setBotName] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchGroupStatus = async () => {
            const db = getDatabase();
            const visitorRef = ref(db, `users/${currentUserId}`);
            const visitorSnap = await get(visitorRef);
            const visitorData = visitorSnap.val();

            if (visitorData?.groupId) {
                const groupRef = ref(db, `grupos/${visitorData.groupId}`);
                const groupSnap = await get(groupRef);
                const groupData = groupSnap.val();

                if (groupData?.name) {
                    setExistingGroupName(groupData.name);
                    setExistingGroupId(visitorData.groupId);
                }
            }
            setIsLoading(false);
        };
        fetchGroupStatus();
        return () => setMounted(false);
    }, [currentUserId]);

    const handleCreateGroup = async () => {
        setError('');
        if (!groupName.trim()) {
            setError('O nome do grupo é obrigatório.');
            return;
        }
        if (existingGroupId) {
            setError('Você já pertence a um grupo e não pode criar outro.');
            return;
        }

        setIsSubmitting(true);

        try {
            const db = getDatabase();
            const newGroupId = uuidv4();
            const newGroupRef = ref(db, `grupos/${newGroupId}`);
            const userRef = ref(db, `users/${currentUserId}`);

            const userSnapshot = await get(userRef);

            if (!userSnapshot.exists()) {
                throw new Error("Usuário não encontrado");
            }

            const userData = userSnapshot.val();

            const newGroupData = {
                name: groupName,
                info: description,
                code: currentUserId,
                type: 'public',
                background: backgroundUrl,
                createdAt: Date.now(),
                image: image,
                groupId: newGroupId,
                category: category || 'Geral',
                ownerId: currentUserId,
                members: {
                    [currentUserId]: {
                        ...userData,
                        type: 'Dono_Sala'
                    }
                },
                // Adicionando Bot se selecionado (Lógica sugerida)
                ...(createBot && botName ? { botName: botName, hasBot: true } : {})
            };

            await Promise.all([
                set(newGroupRef, newGroupData),
                update(userRef, {
                    groupId: newGroupId,
                    type: 'Dono_Sala'
                })
            ]);

            sessionStorage.clear(); // Cuidado com isso, pode deslogar o user sem querer
            alert('Grupo criado com sucesso! Faça login novamente para atualizar seus privilégios.');
            window.location.reload();
            setIsOpen(false);

        } catch (error) {
            console.error('Erro ao criar grupo:', error);
            setError('Erro ao criar o grupo. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteGroup = async () => {
        const confirm = window.confirm(`Tem certeza que deseja excluir o grupo "${existingGroupName}"? Você perderá todos os benefícios.`);
        if (!confirm) return;

        setIsSubmitting(true);
        try {
            const db = getDatabase();
            await remove(ref(db, `grupos/${existingGroupId}`));
            await update(ref(db, `users/${currentUserId}`), {
                groupId: null,
                type: 'Membro' // Resetando para membro comum
            });

            setExistingGroupId('');
            setExistingGroupName('');
            alert('Grupo excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir grupo:', error);
            alert('Erro ao excluir o grupo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-[#0a0a0a] border border-anime-purple/30 rounded-2xl shadow-[0_0_50px_rgba(121,40,202,0.3)] overflow-hidden z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                {/* Glow Topo */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-anime-pink via-anime-purple to-anime-cyan" />

                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20 bg-black/50 rounded-full p-1"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    
                    {/* --- TELA DE CARREGAMENTO INICIAL --- */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Loader2 className="animate-spin text-anime-purple mb-4" size={40} />
                            <p className="text-gray-400">Verificando permissões...</p>
                        </div>
                    ) : existingGroupName ? (
                        
                        // --- TELA: JÁ POSSUI GRUPO ---
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-lg">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white font-display mb-2">Grupo Existente</h2>
                            <p className="text-gray-400 mb-6">
                                Você já é dono do grupo <strong className="text-white">{existingGroupName}</strong>.
                            </p>
                            
                            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6 text-left">
                                <p className="text-sm text-red-400 flex items-start gap-2">
                                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                    Para criar um novo, você deve excluir o atual. Isso removerá todos os membros, histórico e benefícios vinculados.
                                </p>
                            </div>

                            <button
                                onClick={handleDeleteGroup}
                                disabled={isSubmitting}
                                className="w-full py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Trash2 size={18} /> Excluir Grupo Atual</>}
                            </button>
                        </div>

                    ) : (
                        
                        // --- TELA: CRIAR NOVO GRUPO ---
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-anime-pink to-anime-purple flex items-center justify-center text-white shadow-lg">
                                    <Zap size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white font-display">Criar Guilda</h2>
                                <p className="text-sm text-gray-400">Crie seu espaço e convide seus amigos.</p>
                            </div>

                            <div className="space-y-4">
                                {/* Nome do Grupo */}
                                <div className="relative group">
                                    <Users className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-anime-pink transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Nome do Grupo (Ex: Os Vingadores)"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-anime-pink focus:bg-white/10 transition-all placeholder:text-gray-600"
                                    />
                                </div>

                                {/* Ícone do Grupo */}
                                <div className="relative group">
                                    <ImageIcon className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-anime-cyan transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="URL da Imagem do Ícone"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-anime-cyan focus:bg-white/10 transition-all placeholder:text-gray-600"
                                    />
                                </div>

                                {/* Background */}
                                <div className="relative group">
                                    <LinkIcon className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-anime-purple transition-colors" size={18} />
                                    <input
                                        type="url"
                                        placeholder="URL do Wallpaper/Fundo (Obrigatório)"
                                        value={backgroundUrl}
                                        onChange={(e) => setBackgroundUrl(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-anime-purple focus:bg-white/10 transition-all placeholder:text-gray-600"
                                    />
                                </div>

                                {/* Categoria e Descrição (Grid) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <Hash className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Categoria (Ex: RPG)"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Descrição Curta"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600"
                                    />
                                </div>

                                {/* Opção de Bot */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <input
                                            type="checkbox"
                                            id="createBot"
                                            checked={createBot}
                                            onChange={() => setCreateBot(!createBot)}
                                            className="w-5 h-5 rounded border-gray-600 text-anime-purple focus:ring-anime-purple bg-black/50"
                                        />
                                        <label htmlFor="createBot" className="text-sm font-medium text-gray-200 cursor-pointer select-none flex items-center gap-2">
                                            <Bot size={16} /> Adicionar Bot Assistente
                                        </label>
                                    </div>
                                    
                                    <AnimatePresence>
                                        {createBot && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Nome do Bot (Ex: Jarvis)"
                                                    value={botName}
                                                    onChange={(e) => setBotName(e.target.value)}
                                                    className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-anime-purple transition-all placeholder:text-gray-600"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Erro */}
                                {error && (
                                    <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                        {error}
                                    </p>
                                )}

                                {/* Botão de Criar */}
                                <button
                                    onClick={handleCreateGroup}
                                    disabled={isSubmitting}
                                    className={`
                                        w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98]
                                        ${isSubmitting 
                                            ? 'bg-gray-700 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-anime-pink to-anime-purple hover:shadow-[0_0_20px_rgba(255,0,128,0.4)]'
                                        }
                                    `}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Fundar Guilda'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );

    return createPortal(modalContent, document.body);
}