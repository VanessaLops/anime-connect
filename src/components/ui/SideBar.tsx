'use client'


import { useEffect, useState } from 'react';
import Image from 'next/image';
import { database } from '../../../firebase';
import { ref, get } from 'firebase/database';
import GroupCreateModal from '../ModalGroup';
import membro_digitando from "../../utils/icons/Membro/menbro_digitando.gif";

interface SidebarProps {
  selectedItem: string;
  onSelect: (item: string) => void;
  currentUser: {
    id: string;
    type: "Dono_Geral" | "Admin_mod" | "Dono_Sala" | "Staff" | "Membro" | "Visitante";
  };
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
  members: { id: string; username: string }[];  
}

export default function Sidebar({ selectedItem, onSelect, currentUser }: SidebarProps) {
  const [grupos, setGrupos] = useState<Record<string, GroupData> | null>(null)

  console.log(grupos,'gruposaqui')
  const [loading, setLoading] = useState(false);
  const [canCreateGroup, setCanCreateGroup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const gruposArray = grupos ? Object.values(grupos) : [];

  const buscarGrupos = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(database, 'grupos'));
      if (snapshot.exists()) {
        const gruposData = snapshot.val();
        
      
        const gruposComMembros: Record<string, GroupData> = Object.keys(gruposData).reduce((acc, key) => {
          acc[key] = {
            ...gruposData[key],
            members: gruposData[key].members || [],  
            groupId: key, 
          };
          return acc;
        }, {} as Record<string, GroupData>);
  
        setGrupos(gruposComMembros);
      } else {
        setGrupos(null);
      }
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    buscarGrupos();
  }, []);

  useEffect(() => {
    if (!grupos || !currentUser || currentUser.type === 'Visitante') {
      setCanCreateGroup(false);
      return;
    }

    const usuarioJaTemGrupo = Object.values(grupos).some(
      (grupo) => grupo.ownerId === currentUser.id && grupo.type === 'public'
    );

    setCanCreateGroup(!usuarioJaTemGrupo && currentUser.type === 'Membro');
  }, [grupos, currentUser]);

  const handleEnterGroup = (groupName: string) => {
    onSelect(groupName);
  };

  const handleCreateGroupClick = () => {
    const grupoExistente = Object.values(grupos || {}).find(
      (grupo) => grupo.ownerId === currentUser.id && grupo.type === 'public'
    );

    if (grupoExistente) {
      const confirmacao = window.confirm(
        `Você já criou o grupo "${grupoExistente.name}".\n\n⚠️ Só é permitido criar 1 grupo por membro.\n\nDeseja excluir o grupo atual?\n\n⚠️ Atenção: Ao excluir, você perderá tudo o que adicionou ao grupo (membros, moedas AnimeMoney, upgrades de Nitro no futuro etc.)`
      );

      if (confirmacao) {
        console.log('Excluir grupo:', grupoExistente.groupId);
      }
      return;
    }

    setIsModalOpen(true);
  };

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
          {loading ? (
            <h1 className="text-white">Carregando...</h1>
          ) : (
            gruposArray.map((grupo) => (
              <button
                key={grupo.createdAt}
                onClick={() => handleEnterGroup(grupo.name)}
                className={`w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-300 ${selectedItem === grupo.name ? 'bg-[#5865F2]' : 'bg-gray-700'}`}
              >

                <Image
                  src={grupo?.image || membro_digitando}
                  alt={grupo.name}
                  width={24}
                  height={24}
                />

              </button>
            ))
          )}
        </div>

        {canCreateGroup && (
          <div className="mt-auto mb-4">
            <button
              onClick={handleCreateGroupClick}
              className="w-12 h-12 bg-green-600 rounded-full hover:rounded-2xl transition-all duration-300"
            >
              +
            </button>
          </div>
        )}
      </div>
    </>
  );
}
