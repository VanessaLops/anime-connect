'use client'
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from '../../pages/api/lib/firebase';
import GroupCreateModal from './ModalGroup';

import { User, UserType } from '@/utils/userStorage';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarProps {
  selectedItem: string;
  onSelect: (item: string) => void;
  currentUser: {
    id: string;
    username: string;
    type?: UserType;
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
        <GroupCreateModal currentUserId={currentUser.id} setIsOpen={setIsModalOpen} />
      )}

      <aside className="w-[72px] h-full bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 gap-4 z-50 overflow-y-auto custom-scrollbar">

        {/* Botão Home/Logo */}
        <Link href="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-anime-pink to-anime-purple flex items-center justify-center text-white font-bold mb-2 shadow-[0_0_15px_rgba(255,0,128,0.5)]">
          AC
        </Link>

        <div className="w-8 h-[1px] bg-white/10 rounded-full" />

        {/* Lista de Grupos */}
        <nav className="flex flex-col gap-3 w-full items-center">
          {(currentUser?.type === 'Visitante' && groupData ? [groupData] : gruposUsuario).map((grupo) => (
            <Link
              key={grupo.groupId}
              href={`/chat/${grupo.groupId}`}
              onClick={() => onSelect(grupo.name)}
              className="group relative flex items-center justify-center"
            >
              {/* Indicador de Seleção (Barra lateral branca) */}
              <div className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 ${selectedItem === grupo.name ? 'h-8' : 'h-0 group-hover:h-4'}`} />

              <div className={`
                relative w-12 h-12 rounded-[18px] overflow-hidden transition-all duration-300
                ${selectedItem === grupo.name ? 'rounded-[12px] ring-2 ring-anime-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)]' : 'hover:rounded-[12px] group-hover:bg-gray-800'}
              `}>
                <Image
                  src={grupo.image && grupo.image.trim() !== '' ? grupo.image : '/default-group.png'}
                  alt={grupo.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Tooltip */}
              <div className="absolute left-16 z-50 bg-black border border-white/20 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {grupo.name}
              </div>
            </Link>
          ))}

          {/* Botão Criar Grupo */}
          {currentUser?.type !== 'Visitante' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-12 h-12 rounded-[18px] bg-white/5 border border-white/10 flex items-center justify-center text-green-400 hover:text-white hover:bg-green-500 hover:border-green-500 transition-all duration-300 group mt-2"
            >
              <Plus size={24} />
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}
