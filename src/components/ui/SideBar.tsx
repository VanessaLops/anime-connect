import Image from 'next/image';

export const grupos = [
  {
    id: 'naruto',
    nome: 'Naruto',
    imagem: 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
    background_image: 'https://images3.alphacoders.com/132/thumb-1920-1328396.png'
  },
  {
    id: 'onepiece',
    nome: 'One Piece',
    imagem: 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
    background_image: 'https://giffiles.alphacoders.com/216/216975.gif'
  },
  {
    id: 'bleach',
    nome: 'Bleach',
    imagem: 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
    background_image: 'https://images7.alphacoders.com/135/thumb-1920-1359298.png'
  }
];

export const getGroupBackground = (groupName: string) => {
    const gruposInfo = grupos
    return gruposInfo.find(g => g.nome === groupName)?.background_image || '';
};



export default function Sidebar({ selectedItem, onSelect}: any) {
  return (
    <div className="w-20 bg-[#202225] flex flex-col items-center py-4 space-y-4 overflow-y-auto">

      <button
        onClick={() => onSelect('direct')}
        className={`w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-300 ${selectedItem === 'direct' ? 'bg-[#5865F2]' : 'bg-gray-700'
          }`}
      >
        <Image
          src="https://cdn-icons-png.flaticon.com/512/201/201623.png"
          alt="Chat Direto"
          width={24}
          height={24}
        />
      </button>


      <div className="flex-grow space-y-2 flex flex-col  items-center">
        {grupos.map((grupo) => (
          <button
            key={grupo.id}
            onClick={() => onSelect(grupo.nome)}
            className={`w-12 h-12 rounded-full hover:rounded-2xl transition-all duration-300 ${selectedItem === grupo.nome ? 'bg-[#5865F2]' : 'bg-gray-700'
              }`}
          >
            <Image
              src={grupo.imagem}
              alt={grupo.nome}
              width={24}
              height={24}
            />
          </button>
        ))}
      </div>

      <div className="mt-auto mb-4">
        <button
          onClick={() => alert('Abrir modal de criação de grupo')}
          className="w-12 h-12 bg-green-600 rounded-full hover:rounded-2xl transition-all duration-300"
        >
          +
        </button>
      </div>
    </div>
  );
}
