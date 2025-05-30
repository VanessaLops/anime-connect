'use client'
import { useEffect, useState } from 'react';
import { database } from '../../pages/api/lib/firebase';
import { ref, onValue } from 'firebase/database';
import GroupCreateModal from './ModalGroup';

import { User, UserType } from '@/utils/userStorage';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarProps {
  selectedItem: string;
  onSelect: (item: string) => void;
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
  };
  groupData?: GroupData;
}

export interface GroupData {
  name: string;
  info: string;
  type: 'public' | 'private';
  code?: string;
  background: string;
  ownerId: string;
  createdAt: string;
  image: string;
  groupId?: string;
  category: string;
  members: Record<string, User>;
}

export default function Sidebar({ selectedItem, onSelect, currentUser, groupData }: SidebarProps) {
  const [gruposUsuario, setGruposUsuario] = useState<GroupData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (groupData?.groupId) {
      const grupoRef = ref(database, 'grupos');
      const unsubscribe = onValue(grupoRef, snapshot => {
        if (snapshot.exists()) {
          const grupos: Record<string, GroupData> = snapshot.val();

          const userLogadoString = sessionStorage.getItem('currentUser');
          let dadosUserLogadoAsync = JSON.parse(userLogadoString ?? '{}');

          const gruposMembro = Object.values(grupos).filter(grupo =>
            grupo.members && Object.values(grupo.members).some(
              membro => membro.id === dadosUserLogadoAsync.id
            )
          );

          setGruposUsuario(gruposMembro);
        }
      });

      return () => unsubscribe();
    }
  }, [groupData?.groupId]);

  return (
    <>
      {isModalOpen && (
        <GroupCreateModal
          currentUserId={currentUser.id}
          setIsOpen={setIsModalOpen}
        />
      )}

      <aside
        className="
          w-20 bg-[#1a122d] flex flex-col items-center py-4 space-y-6 overflow-y-auto
          shadow-lg shadow-[#d633ff]/40 border-r-2 border-[#d633ff]
        "
      >
        {/* Botão para criar grupo */}
        {currentUser?.type !== 'Visitante' && (
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Criar novo grupo"
            className="
              w-12 h-12 bg-[#d633ff] text-white font-bold text-2xl
              rounded-full hover:rounded-2xl transition-all duration-300
              shadow-md shadow-[#d633ff]/70 hover:shadow-[#ff3399]/80
              flex justify-center items-center
              ring-2 ring-[#ff3399] hover:ring-[#d633ff]
            "
          >
            +
          </button>
        )}

        {/* Lista dos grupos do usuário */}
        <nav className="flex flex-col items-center space-y-4 flex-grow">
          {(currentUser.type === 'Visitante' && groupData ? [groupData] : gruposUsuario).map((grupo) => (
            <Link
              key={grupo.groupId}
              href={`/chat/${grupo.groupId}`}
              onClick={() => onSelect(grupo.name)}
              aria-label={`Entrar no grupo ${grupo.name}`}
              className={`
                w-12 h-12 rounded-full flex justify-center items-center
                transition-all duration-300 hover:rounded-2xl
                ${
                  selectedItem === grupo.name
                    ? 'bg-[#d633ff] shadow-lg shadow-[#d633ff]/80'
                    : 'bg-gray-700 hover:bg-[#d633ff] hover:shadow-lg hover:shadow-[#d633ff]/50'
                }
              `}
            >
              <Image
                src={grupo.image && grupo.image.trim() !== '' ? grupo.image : '/default-group.png'}
                alt={grupo.name}
                width={32}
                height={32}
                className="rounded-full"
                priority
              />
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
