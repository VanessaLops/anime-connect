'use client'
import { useEffect, useState } from 'react';
import { database } from '../../../firebase';
import { ref, get, onValue } from 'firebase/database';
import GroupCreateModal from './ModalGroup';

import { User, UserType } from '@/utils/userStorage';
import Image from 'next/image';
import { useRouter } from 'next/router';
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
  groupData: GroupData;
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
  groupId: string;
  category: string;
  members: Record<string, User>;
}

export default function Sidebar({ selectedItem, onSelect, currentUser, groupData }: SidebarProps) {
  const [grupos, setGrupos] = useState<GroupData | null>(null);
  const [user, setUser] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [grposUsuario, setGruposUsuario] = useState<any[]>([]);


  console.log(currentUser,'currentUser')
  useEffect(() => {
    if (groupData?.groupId) {
      const grupoRef = ref(database, 'grupos');

      const unsubscribe = onValue(grupoRef, snapshot => {
        if (snapshot.exists()) {
          const grupos: Record<string, GroupData> = snapshot.val();
          const grupoEncontrado = Object.entries(grupos).find(([id]) =>
            id.startsWith(groupData.groupId!)
          );



          if (grupoEncontrado) {
            const [, grupoData] = grupoEncontrado;
            const userLogadoString = localStorage.getItem('currentUser');
            let dadosUserLogadoAsync = JSON.parse(userLogadoString ?? '{}');
            const gruposMembro = Object.values(grupos).filter((grupo) =>
              grupo.members && Object.values(grupo.members).some(
                (membro) => membro.id === dadosUserLogadoAsync.id
              )
            );
            setGruposUsuario(gruposMembro)
            setUser(dadosUserLogadoAsync)
            const membrosGrupo = grupoData?.members
              ? Object.values(grupoData.members)
              : [];

            const localizaUser = membrosGrupo.find(
              (item) => item.id === dadosUserLogadoAsync?.id
            );

            const precisaAtualizarStatus =
              dadosUserLogadoAsync?.status === 'Offline' &&
              localizaUser?.status === 'Online';

            if (precisaAtualizarStatus) {
              dadosUserLogadoAsync = {
                ...dadosUserLogadoAsync,
                status: 'Online',
              };
              localStorage.setItem(
                'currentUser',
                JSON.stringify(dadosUserLogadoAsync)
              );
              document.cookie = `user=${JSON.stringify(dadosUserLogadoAsync)}; path=/;`;
              console.log('Status do usuário atualizado para Online!');
            }

            setGrupos(grupoData);
            //Primeiro Compara esse User Logado
            //Verifica o status dele na tabela do firebase se no firebase estiver Online  e no Async e Cokies Offiline
            //Altera o Status dele pra Online no async e no cookie
            //Depois Habilita o SIdeBar de Cadastro de Grupos e Lista todos os grupos que ele faz parte.
            //Verifica se ele já tem um grupo criado (Cada membro só pode criar 1 grupo)
            //Ao criar grupo ele recebe o status de owner na tabela de grupo.
          }
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

      <div className="w-20 bg-[#202225] flex flex-col items-center py-4 space-y-4 overflow-y-auto">

        <div className="flex-grow space-y-2 flex flex-col items-center">

          {
            currentUser?.type !== "Visitante" ? (
              <div className="mt-6 mb-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-12 h-12 bg-green-600 rounded-full hover:rounded-2xl transition-all duration-300"
                >
                  +
                </button>
              </div>
            ) : null
          }

          {currentUser?.type === 'Visitante' ? (
            groupData && (
              <Link
                key={groupData.createdAt}
                href={`/chat/${groupData?.groupId}`}
                className={`w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-300 ${selectedItem === groupData.name ? 'bg-[#5865F2]' : 'bg-gray-700'}`}
              >

                <Image
                  src={groupData?.image && groupData.image.trim() !== '' ? groupData.image : '/default-group.png'}

                  alt={groupData.name}
                  width={24}
                  height={24}
                />

              </Link>
            )
          ) : (
            grposUsuario?.map((grupo) => {
              return (
                <Link
                  href={`/chat/${grupo?.groupId}`}
                  key={grupo?.createdAt}
                  className={`w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-300 ${selectedItem === grupo.name ? 'bg-[#5865F2]' : 'bg-gray-700'}`}
                >

                  <Image

                    src={grupo?.image || '/default-group.png'}
                    alt={grupo.name}
                    width={24}
                    height={24}
                  />

                </Link>
              )
            })
          )}

        </div>

      </div>

      {isModalOpen && (
        <GroupCreateModal
          currentUserId={currentUser.id}
          setIsOpen={setIsModalOpen}
        />
      )}

    </>
  );
}
