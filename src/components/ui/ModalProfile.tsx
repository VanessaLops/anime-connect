'use client';
import React from 'react';
import { Dialog } from '@headlessui/react';
import { UserType } from '@/utils/userStorage';
import { getDatabase, ref, update } from 'firebase/database';
import { database } from '../../pages/api/lib/firebase';
import { group } from 'console';


export interface GroupDataType {
    name: string;
    info: string;
    type: 'public' | 'private';
    code?: string;
    background: string;
    ownerId: string;
    createdAt: string;
    image: string;
    groupId: string;
    category: string;
    members: {
        [userId: string]: {
            type: UserType;
            power: number;
            status?: string;
        };
    };
}

interface ModalProfileProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
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

    groupId: string;
    grupos: GroupDataType | null;

}

const ModalProfile: React.FC<ModalProfileProps> = ({
    isOpen,
    onClose,
    user,
    groupId,
    grupos
}) => {

    console.log(user, 'user')

    console.log(groupId, 'groupId')
    if (!user) return null;
    const handlePromotion = () => {
        if (!grupos || !grupos.members[user.id]) return;

        const userGroupType = grupos.members[user.id].type;
        const getSessionString = sessionStorage.getItem('currentUser')

        const getSession = getSessionString ? JSON.parse(getSessionString) : null;

        if (getSession?.type === 'Dono_Sala') {
            if (userGroupType === 'Membro') {
                updateUserStatus('Staff');
            }
            else if (userGroupType === 'Staff') {
                updateUserStatus('Sub_Dono');
            }
            else if (userGroupType === 'Sub_Dono') {
                updateUserStatus('Staff');
            }
        } else if (getSession.type === 'Staff') {
            if (userGroupType === 'Membro') {
                updateUserStatus('Staff');
            }
        } else if (getSession.type === 'Sub_Dono') {
            if (userGroupType === 'Membro') {
                updateUserStatus('Staff');
            } else if (userGroupType === 'Staff') {
                updateUserStatus('Staff');
            }
        }

        onClose();
    };


    const updateUserStatus = (newStatus: UserType) => {
        const db = getDatabase();
        const userRef = ref(database, `grupos/${groupId}/members/${user.id}`);


        update(userRef, {
            type: newStatus
        })
            .then(() => {
                const updatedUser = { ...user, type: newStatus };
                sessionStorage.setItem('userStatus', newStatus);
            })
            .catch((error) => {
                console.error('Erro ao atualizar o tipo do usuário:', error);
            });
    };



    const getPromotionLabel = () => {

        const getSessionString = sessionStorage.getItem('currentUser')

        const getSession = getSessionString ? JSON.parse(getSessionString) : null;

        const userGroupType = grupos?.members?.[getSession.id]?.type;

        const ownerId = grupos?.ownerId;

        console.log(userGroupType, 'userGroupType')

        if (!userGroupType) return null;
        console.log(userGroupType === 'Membro', 'a')
        console.log(userGroupType == 'Dono_Sala', 'b')


        console.log(user.type, 'user.type')

        console.log(ownerId, 'ownerId')
        console.log(grupos, 'getSession')

        if (getSession?.type === 'Dono_Sala' && getSession.id === ownerId) {
            if (user.type === 'Visitante') return 'Promover a Membro';
            if (user.type === 'Membro') return 'Promover a Staff';
            if (user.type === 'Staff') return 'Promover a Dono Ajudante';
        }

        // if (user.type === 'Dono_Sala' && userGroupType === 'Membro') {

        //     // 
        //     // if (userGroupType === 'Sub_Dono') return 'Promover a Dono';
        // } else if (user.type === 'Staff' && userGroupType === 'Membro') {
        //     return 'Promover a Moderador';
        // } else if (user.type === 'Sub_Dono') {
        //     if (userGroupType === 'Membro') return 'Promover a Moderador';
        //     if (userGroupType === 'Staff') return 'Promover a Dono';
        // }

        return null;
    };


    const promotionLabel = getPromotionLabel();

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl bg-[#1d1f21] text-white border border-[#666] p-0 shadow-xl">
                    <div className="flex">

                        <div className="w-1/3 bg-[#2b2d30] p-4 flex flex-col items-center">
                            <img
                                src={
                                    user?.image?.trim()
                                        ? user.image
                                        : 'https://placehold.co/100x100?text=Avatar'
                                }
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border border-gray-600"
                            />
                            <p className="text-center text-sm mt-3 text-gray-400">Avatar</p>
                        </div>


                        <div className="w-2/3 p-6">
                            <h2 className="text-xl font-bold text-cyan-300 mb-4">{user.username}</h2>

                            <div className="space-y-2 text-sm">
                                <p><span className="text-cyan-400">Status:</span> {user.status || '---'}</p>
                                <p><span className="text-cyan-400">Tipo:</span> {user.type}</p>
                                <p><span className="text-cyan-400">Poder:</span> {user.power}</p>
                                {user.relacionamento && (
                                    <p><span className="text-cyan-400">Relacionamento:</span> {user.relacionamento}</p>
                                )}
                            </div>

                            <div className="mt-6 flex flex-col gap-2">
                                {promotionLabel && (
                                    <button
                                        onClick={handlePromotion}
                                        className="bg-[#456] hover:bg-[#678] text-white py-2 px-4 border border-[#888] transition"
                                    >
                                        {promotionLabel}
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="bg-[#844] hover:bg-[#a55] text-white py-2 px-4 border border-[#a77] transition"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ModalProfile;
