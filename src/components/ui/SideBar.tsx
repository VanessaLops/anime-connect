import { useEffect, useState } from 'react';
import Image from 'next/image';
import { database } from '../../../firebase';
import { ref, set, get, getDatabase } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/utils/userStorage';
import { VisitorData } from './Modal';
import { getUsersFromFirebase } from './ChatWindow';

interface SidebarProps {
  selectedItem: string;
  onSelect: (item: string) => void;
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
}

export default function Sidebar({ selectedItem, onSelect }: SidebarProps) {
  const [grupos, setGrupos] = useState<Record<string, GroupData> | null>(null); // Updated type here
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [type, setType] = useState<'public' | 'private'>('public');
  const [code, setCode] = useState('');
  const [background, setBackground] = useState('');
  const [image, setImage] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const gruposArray = grupos ? Object.values(grupos) as GroupData[] : [];

  const buscarGrupos = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(database, 'grupos'));
      console.log('Grupos recebidos do Firebase:', snapshot.val());

      if (snapshot.exists()) {
        const data = snapshot.val();
        setGrupos(data);
        console.log(data, 'dados dos grupos');
      } else {
        console.log('Nenhum grupo encontrado.');
        setGrupos(null);
      }
    } catch (error: unknown) {
      console.error('Erro ao buscar grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarGrupos();
  }, []);


  const handleEnterGroup = (groupName: string) => {
    onSelect(groupName);
  };



  let fetchUsers = async () => {
    const usersFromFirebase = await getUsersFromFirebase();
    setUsers(usersFromFirebase);
  };
console.log(fetchUsers,'fetchUsers')
  // useEffect(() => {
  //   const fetchVisitor = async () => {
  //     const db = getDatabase();
  //     const visitorRef = ref(db, `visitors/${visitorId}`);
  //     const snapshot = await get(visitorRef);
  //     if (snapshot.exists()) {
  //       const visitorData = snapshot.val();
  //       setData(visitorData);
  //     }
  //   };
  //   fetchVisitor();
  // }, [visitorId]);


  const handleCreateGroup = async () => {
    try {

      const groupId = uuidv4();
      const grupoPath = `grupos/${groupId}`;
      const userPath = `usuarios/${1}/grupos`;

      const groupData: GroupData = {
        name,
        info,
        type,
        background,
        ownerId: '', 
        image,
        groupId,
        createdAt: new Date().toISOString(),
        ...(type === 'private' && { code })
      };

      await set(ref(database, grupoPath), groupData);
      await set(ref(database, `${userPath}/${groupId}`), {
        name,
        type,
      });

      alert('Grupo criado com sucesso!');
      // setHasGroup(true);
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      alert('Erro ao criar grupo');
    }
  };



  return (
    <div className="w-20 bg-[#202225] flex flex-col items-center py-4 space-y-4 overflow-y-auto">
      <button onClick={() => onSelect('direct')} className={`w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-300 ${selectedItem === 'direct' ? 'bg-[#5865F2]' : 'bg-gray-700'}`}>
        <Image src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="Chat Direto" width={24} height={24} />
      </button>

      <div className="flex-grow space-y-2 flex flex-col items-center">
        {
          loading ? (
            <>
              <h1>LENDO</h1>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do Grupo"
              />
              <input
                type="text"
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                placeholder="Informações sobre o Grupo"
              />
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Informações sobre o Grupo"
              />
              <select value={type} onChange={(e) => setType(e.target.value as 'public' | 'private')}>
                <option value="public">Público</option>
                <option value="private">Privado</option>
              </select>
              {type === 'private' && (
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Código do Grupo"
                />
              )}
              <input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Cor de Fundo"
              />
              {/* <button onClick={() => handleCreateGroup('visitorId1')}>Criar Grupo</button> */}

            </>
          ) : <>
            {gruposArray.map((grupo) => (
              <button
                key={grupo.createdAt}
                onClick={() => handleEnterGroup(grupo.name)}
                className={`w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-300 ${selectedItem === grupo.name ? 'bg-[#5865F2]' : 'bg-gray-700'}`}
              >
                <Image src={grupo.image} alt={grupo.name} width={24} height={24} />
              </button>
            ))}
          </>
        }
      </div>
{/* 
      <div className="mt-auto mb-4">
        <button onClick={() => handleCreateGroup()} className="w-12 h-12 bg-green-600 rounded-full hover:rounded-2xl transition-all duration-300">+</button>
      </div> */}
    </div>
  );
}
