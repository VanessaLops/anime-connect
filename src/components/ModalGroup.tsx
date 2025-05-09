'use client';

import { useState, useEffect } from 'react';
import { getDatabase, ref, get, push, set, remove, update } from 'firebase/database';

interface GroupCreateModalProps {
    currentUserId: string;
    setIsOpen: (open: boolean) => void;
}

export default function GroupCreateModal({ currentUserId, setIsOpen }: GroupCreateModalProps) {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [existingGroupName, setExistingGroupName] = useState('');
    const [existingGroupId, setExistingGroupId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGroupStatus = async () => {
            const db = getDatabase();
            const visitorRef = ref(db, `visitors/${currentUserId}`);
            const visitorSnap = await get(visitorRef);
            const visitorData = visitorSnap.val();

            console.log(visitorData,'visitorData')
            if (visitorData?.groupId) {
                const groupRef = ref(db, `grupos/${visitorData.groupId}`);
                console.log(groupRef,'groupRef')
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
    }, [currentUserId]);

    const handleCreateGroup = async () => {
        setError('');
        if (!groupName.trim()) {
            setError('O nome do grupo é obrigatório.');
            return;
        }

        try {
            const db = getDatabase();
            const groupsRef = ref(db, 'grupos');
            const newGroupRef = push(groupsRef);
            const newGroupId = newGroupRef.key;

            const newGroupData = {
                name: groupName,
                description,
                createdBy: currentUserId,
                createdAt: Date.now(),
            };

            await set(newGroupRef, newGroupData);
            await update(ref(db, `visitors/${currentUserId}`), {
                groupId: newGroupId,
            });

            alert('Grupo criado com sucesso!');
            setIsOpen(false);
        } catch (error) {
            console.error('Erro ao criar grupo:', error);
            setError('Erro ao criar o grupo. Tente novamente.');
        }
    };

    const handleDeleteGroup = async () => {
        const confirm = window.confirm(`Tem certeza que deseja excluir o grupo "${existingGroupName}"? Você perderá todos os benefícios como Nitro, cargos etc.`);

        if (!confirm) return;

        try {
            const db = getDatabase();
            await remove(ref(db, `grupos/${existingGroupId}`));
            await update(ref(db, `visitors/${currentUserId}`), {
                groupId: null,
            });

            setExistingGroupId('');
            setExistingGroupName('');
            alert('Grupo excluído com sucesso! Agora você pode criar um novo grupo.');
        } catch (error) {
            console.error('Erro ao excluir grupo:', error);
            alert('Erro ao excluir o grupo. Tente novamente.');
        }
    };

    if (isLoading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-8 w-96 relative text-black">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                {existingGroupName ? (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-center">Você já possui um grupo</h2>
                        <p className="text-center text-gray-700 mb-4">
                            Grupo atual: <strong>{existingGroupName}</strong>
                        </p>
                        <p className="text-sm text-red-600 mb-4">
                            Para criar um novo grupo, você precisa excluir o atual. Isso removerá todos os benefícios como Nitro, cargos etc.
                        </p>
                        <button
                            onClick={handleDeleteGroup}
                            className="w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            EXCLUIR GRUPO ATUAL
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-center">Criar Novo Grupo</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                                    Nome do Grupo
                                </label>
                                <input
                                    type="text"
                                    id="groupName"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nome do grupo"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Descrição (opcional)
                                </label>
                                <input
                                    id="description"
                                    value={description}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Fale um pouco sobre o grupo..."
                                  
                                />
                            </div>

                            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

                            <button
                                onClick={handleCreateGroup}
                                className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                            >
                                Criar Grupo
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
