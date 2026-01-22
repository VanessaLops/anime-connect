'use client';

import { database } from '@/pages/api/lib/firebase';
import { get, ref, remove, update } from 'firebase/database';
import { motion } from 'framer-motion';
import { Ban, Bot, Crown, Save, Search, Settings, Shield, Trash2, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PeaoAvatar from './PeaoMembro'; // Reutilizando seu componente

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    currentUser: any; // Tipar corretamente com sua interface User
}

export default function AdminPanel({ isOpen, onClose, groupId, currentUser }: AdminPanelProps) {
    const [activeTab, setActiveTab] = useState('membros');
    const [members, setMembers] = useState<any[]>([]);
    const [bannedUsers, setBannedUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [groupSettings, setGroupSettings] = useState({ name: '', background: '', info: '', botName: '', hasBot: false });
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const isOwner = currentUser.type === 'Dono_Sala' || currentUser.type === 'Dono_Geral';

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            fetchData();
        }
        return () => setMounted(false);
    }, [isOpen, groupId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Buscar Membros
            const membersSnap = await get(ref(database, `grupos/${groupId}/members`));
            if (membersSnap.exists()) {
                const mData = membersSnap.val();
                setMembers(Object.values(mData));
            }

            // 2. Buscar Banidos (Se tiver permissão)
            const bannedSnap = await get(ref(database, `grupos/${groupId}/banned`));
            if (bannedSnap.exists()) {
                const bData = bannedSnap.val();
                // Transforma objeto {ID: {dados}} em array com ID
                const bArray = Object.entries(bData).map(([key, val]: any) => ({ ...val, id: key }));
                setBannedUsers(bArray);
            }

            // 3. Buscar Configs (Só Dono)
            if (isOwner) {
                const groupSnap = await get(ref(database, `grupos/${groupId}`));
                if (groupSnap.exists()) {
                    const gData = groupSnap.val();
                    setGroupSettings({
                        name: gData.name || '',
                        background: gData.background || '',
                        info: gData.info || '',
                        botName: gData.botName || '',
                        hasBot: gData.hasBot || false
                    });
                }
            }
        } catch (error) {
            console.error("Erro ao carregar painel:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- AÇÕES ---

    const handlePromote = async (userId: string, newRole: string, newPower: number) => {
        try {
            await update(ref(database, `grupos/${groupId}/members/${userId}`), {
                type: newRole,
                power: newPower
            });
            fetchData(); // Recarrega lista
        } catch (e) { alert('Erro ao promover'); }
    };

    const handleKick = async (userId: string) => {
        if (!confirm('Tem certeza que deseja expulsar este usuário?')) return;
        try {
            await remove(ref(database, `grupos/${groupId}/members/${userId}`));
            setMembers(members.filter(m => m.id !== userId));
        } catch (e) { alert('Erro ao expulsar'); }
    };

    const handleSaveSettings = async () => {
        try {
            await update(ref(database, `grupos/${groupId}`), groupSettings);
            alert('Configurações salvas com sucesso!');
        } catch (e) { alert('Erro ao salvar'); }
    };

    const handleUnban = async (userId: string) => {
        try {
            await remove(ref(database, `grupos/${groupId}/banned/${userId}`));
            setBannedUsers(bannedUsers.filter(b => b.id !== userId));
        } catch (e) { alert('Erro ao desbanir'); }
    };

    if (!mounted || !isOpen) return null;

    // Filtra membros pela busca
    const filteredMembers = members.filter(m => 
        m.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ModalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-4xl h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden"
            >
                {/* --- SIDEBAR DO MENU --- */}
                <div className="w-64 bg-black/50 border-r border-white/10 flex flex-col">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Shield className="text-anime-pink" />
                            Painel {isOwner ? 'Master' : 'Staff'}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Gerencie sua comunidade</p>
                    </div>
                    
                    <nav className="flex-1 p-4 space-y-2">
                        <button 
                            onClick={() => setActiveTab('membros')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'membros' ? 'bg-anime-purple/20 text-anime-purple border border-anime-purple/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Users size={18} /> Membros
                        </button>
                        
                        <button 
                            onClick={() => setActiveTab('bans')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'bans' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Ban size={18} /> Banidos
                        </button>

                        {isOwner && (
                            <button 
                                onClick={() => setActiveTab('config')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'config' ? 'bg-anime-cyan/20 text-anime-cyan border border-anime-cyan/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Settings size={18} /> Configurações
                            </button>
                        )}
                    </nav>
                </div>

                {/* --- CONTEÚDO PRINCIPAL --- */}
                <div className="flex-1 flex flex-col bg-[#0f0f0f]">
                    {/* Header da Aba */}
                    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/20">
                        <h3 className="text-lg font-bold text-white capitalize">{activeTab}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        
                        {/* === ABA MEMBROS === */}
                        {activeTab === 'membros' && (
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar membro..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pl-10 text-white focus:border-anime-purple focus:outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    {filteredMembers.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <PeaoAvatar {...member} isTyping={false} showName={false} />
                                                <div>
                                                    <p className="font-bold text-white text-sm">{member.username}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        {member.type} 
                                                        {member.type === 'Dono_Sala' && <Crown size={10} className="text-yellow-500"/>}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Ações (Só aparecem se você tiver cargo maior) */}
                                            {/* Lógica simplificada: Dono mexe em tudo, Staff mexe em Membro */}
                                            {(isOwner || (currentUser.type === 'Staff' && member.type === 'Membro')) && currentUser.id !== member.id && (
                                                <div className="flex items-center gap-2">
                                                    {isOwner && member.type !== 'Staff' && (
                                                        <button 
                                                            onClick={() => handlePromote(member.id, 'Staff', 50)}
                                                            className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30 hover:bg-blue-500/30"
                                                        >
                                                            Promover Staff
                                                        </button>
                                                    )}
                                                    {isOwner && member.type === 'Staff' && (
                                                        <button 
                                                            onClick={() => handlePromote(member.id, 'Membro', 0)}
                                                            className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30 hover:bg-yellow-500/30"
                                                        >
                                                            Rebaixar
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleKick(member.id)}
                                                        className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                                                        title="Expulsar"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* === ABA CONFIGURAÇÕES (DONO) === */}
                        {activeTab === 'config' && isOwner && (
                            <div className="space-y-6 max-w-xl">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Nome do Grupo</label>
                                        <input 
                                            value={groupSettings.name}
                                            onChange={(e) => setGroupSettings({...groupSettings, name: e.target.value})}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-anime-cyan outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">URL Background</label>
                                        <input 
                                            value={groupSettings.background}
                                            onChange={(e) => setGroupSettings({...groupSettings, background: e.target.value})}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-anime-cyan outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Descrição</label>
                                        <textarea 
                                            value={groupSettings.info}
                                            onChange={(e) => setGroupSettings({...groupSettings, info: e.target.value})}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-anime-cyan outline-none resize-none h-24"
                                        />
                                    </div>
                                </div>

                                {/* Config do Bot */}
                                <div className="p-4 rounded-xl bg-purple-900/10 border border-purple-500/20">
                                    <h4 className="font-bold text-white flex items-center gap-2 mb-4">
                                        <Bot size={18} className="text-anime-purple"/> Configuração do Bot
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                                            <input 
                                                type="checkbox" 
                                                checked={groupSettings.hasBot}
                                                onChange={(e) => setGroupSettings({...groupSettings, hasBot: e.target.checked})}
                                                className="w-4 h-4 accent-anime-purple"
                                            />
                                            Ativar Bot
                                        </label>
                                        {groupSettings.hasBot && (
                                            <input 
                                                value={groupSettings.botName}
                                                onChange={(e) => setGroupSettings({...groupSettings, botName: e.target.value})}
                                                placeholder="Nome do Bot (Ex: Jarvis)"
                                                className="flex-1 bg-black/30 border border-white/10 rounded p-2 text-white text-sm"
                                            />
                                        )}
                                    </div>
                                </div>

                                <button 
                                    onClick={handleSaveSettings}
                                    className="px-6 py-3 bg-gradient-to-r from-anime-cyan to-blue-600 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 hover:brightness-110 transition-all"
                                >
                                    <Save size={18} /> Salvar Alterações
                                </button>
                            </div>
                        )}

                        {/* === ABA BANIDOS === */}
                        {activeTab === 'bans' && (
                            <div>
                                {bannedUsers.length === 0 ? (
                                    <p className="text-gray-500 text-center mt-10">Nenhum usuário banido.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {bannedUsers.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between p-3 bg-red-900/10 border border-red-500/20 rounded-xl">
                                                <div>
                                                    <p className="font-bold text-white">{user.username}</p>
                                                    <p className="text-xs text-gray-500">Banido por: {user.bannedBy}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleUnban(user.id)}
                                                    className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded text-xs hover:bg-green-600/30"
                                                >
                                                    Desbanir
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </motion.div>
        </div>
    );

    return createPortal(ModalContent, document.body);
}