import { Key, useEffect, useState } from 'react';
import Image from 'next/image';
import { database } from '../../../firebase';
import { ref, set, get, child } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

interface SidebarProps {
  selectedItem: string;
  onSelect: (item: string) => void;
}

interface GroupData {
  name: string;
  info: string;
  type: 'public' | 'private';
  code?: string;
  background: string;
  ownerId: string;
  createdAt: string;
  image: string;
}

export default function Sidebar({ selectedItem, onSelect }: SidebarProps) {

  const [grupos, setGrupos] = useState<GroupData[] | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const gruposArray = Object.values(grupos || []);

  console.log(grupos, 'grupos')
  const buscarGrupos = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(database, 'grupos'));

      if (snapshot.exists()) {
        const data = snapshot.val();
        setGrupos(data)
        console.log(data, 'dados dos grupos');
      } else {
        console.log('Nenhum grupo encontrado.');
        setGrupos(null);
      }
    } catch (error: any) {
      console.error('Erro ao buscar grupos:', error);
      setError('Erro ao carregar grupos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarGrupos();
  }, []);

  console.log(buscarGrupos, 'snapshot')

  const [userStatus, setUserStatus] = useState('Visitante');

  const handleEnterGroup = (groupName: string) => {
    setUserStatus('Membro');
    onSelect(groupName);
  };



  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [type, setType] = useState<'public' | 'private'>('public');
  const [code, setCode] = useState('');
  const [background, setBackground] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');


  const [canCreate, setCanCreate] = useState(true);


  const handleCreateGroup = async () => {
    const groupId = uuidv4();
    const idUser = uuidv4();
    const grupoPath = `grupos/${groupId}`;
    const userPath = `usuarios/${groupId}/grupos`;

    try {
      const snapshot = await get(child(ref(database), userPath));
      const userGroups = snapshot.val() || {};

      const alreadyHasPublic = Object.values(userGroups).some((g: any) => g.type === 'public');
      const alreadyHasPrivate = Object.values(userGroups).some((g: any) => g.type === 'private');

      if ((type === 'public' && alreadyHasPublic) || (type === 'private' && alreadyHasPrivate)) {
        alert('Você só pode criar 1 grupo público e 1 privado.');
        return;
      }

      const groupData: GroupData = {
        name,
        info,
        type,
        background,
        ownerId: idUser,
        image,
        createdAt: new Date().toISOString(),
        ...(type === 'private' && { code })
      };

      await set(ref(database, grupoPath), groupData);
      await set(ref(database, `${userPath}/${groupId}`), {
        name,
        type,
      });

      alert('Grupo criado com sucesso!');
      //onClose();
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      alert('Erro ao criar grupo');
    }
  };


  return (
    <div className="w-20 bg-[#202225] flex flex-col items-center py-4 space-y-4 overflow-y-auto">
      {/* <button onClick={() => onSelect('direct')} className={`w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-300 ${selectedItem === 'direct' ? 'bg-[#5865F2]' : 'bg-gray-700'}`}>
        <Image src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="Chat Direto" width={24} height={24} />
      </button> */}

      <div className="flex-grow space-y-2 flex flex-col items-center">
        {Array.isArray(gruposArray) && gruposArray.map((grupo) => (
          <button
            key={grupo.createdAt}
            onClick={() => handleEnterGroup(grupo.name)}
            className={`w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-300 ${selectedItem === grupo.name ? 'bg-[#5865F2]' : 'bg-gray-700'}`}
          >
            <Image src={grupo.image} alt={grupo.name} width={24} height={24} />
          </button>
        ))}


      </div>

      <div className="mt-auto mb-4">
        <button onClick={() => handleCreateGroup()} className="w-12 h-12 bg-green-600 rounded-full hover:rounded-2xl transition-all duration-300">+</button>
      </div>
    </div>
  );
}
