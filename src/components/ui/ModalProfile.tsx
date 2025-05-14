'use client';
import React from 'react';
import { Dialog } from '@headlessui/react';
import { UserType } from '@/utils/userStorage';
import { getDatabase, ref, update } from 'firebase/database';
import { database } from '../../../firebase';


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
    currentUserType: UserType;
    groupId: string;
}

const ModalProfile: React.FC<ModalProfileProps> = ({
    isOpen,
    onClose,
    user,
    currentUserType,
    groupId
}) => {
    if (!user) return null;

    const handlePromotion = () => {
        if (currentUserType === 'Dono_Sala') {
            if (user.type === 'Membro') {

                updateUserStatus('Staff');
            } else if (user.type === 'Staff') {

                updateUserStatus('Sub_Dono');
            } else if (user.type === 'Sub_Dono') {

                updateUserStatus('Staff');
            }
        } else if (currentUserType === 'Staff') {
            if (user.type === 'Membro') {

                updateUserStatus('Staff');
            }
        } else if (currentUserType === 'Sub_Dono') {
            if (user.type === 'Membro') {

                updateUserStatus('Staff');
            } else if (user.type === 'Staff') {

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
                document.cookie = `user=${JSON.stringify(updatedUser)}; path=/;`;
            })
            .catch((error) => {
                console.error('Erro ao atualizar o tipo do usuário:', error);
            });
    };


    const getPromotionLabel = () => {
        if (currentUserType === 'Dono_Sala') {
            if (user.type === 'Membro') return 'Promover a Moderador';
            if (user.type === 'Staff') return 'Promover a SubDono';
            if (user.type === 'Sub_Dono') return 'Promover a Dono';
        } else if (currentUserType === 'Staff' && user.type === 'Membro') {
            return 'Promover a Moderador';
        } else if (currentUserType === 'Sub_Dono') {
            if (user.type === 'Membro') return 'Promover a Moderador';
            if (user.type === 'Staff') return 'Promover a Dono';
        }
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
