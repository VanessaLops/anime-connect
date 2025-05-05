import PeaoAvatar from "./PeaoStatus"

const users = [
  { username: "Ester", type: "Admin_mod", power: 7, relacionamento: "bff" },
  { username: "Super_Power", type: "Avatar_Power_Peao", power: 7, relacionamento: "casado" }
]

interface Props {
  isTyping: boolean
}

export default function DirectChat({ isTyping }: Props) {
  return (
    <div className="flex h-full flex-col bg-[#36393f] text-white">
      <div className="p-4 border-b border-gray-700 font-bold text-lg">Mensagens Diretas</div>
      
      <div className="p-4 space-y-4 overflow-y-auto">
        {users.map((user, index) => (
          <PeaoAvatar
            key={index}
            username={user.username}
            type={user.type}
            power={user.power}
            relacionamento={user.relacionamento}
            isTyping={isTyping}
          />
        ))}
      </div>
    </div>
  )
}
