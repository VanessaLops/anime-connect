'use client'



import { User } from "@/utils/userStorage";
import PeaoAvatar from "./PeaoStatus";



export interface PeaoAvatarProps extends User {
  isTyping: boolean;
  usersData: User[];
}

export default function DirectChat({ isTyping, usersData }: PeaoAvatarProps) {
 
 console.log(usersData,'usersData')
  return (
    <div className="flex h-full flex-col bg-[#36393f] text-white">
      <div className="p-4 border-b border-gray-700 font-bold text-lg">Mensagens Diretas</div>

      {/* <div className="p-4 space-y-4 overflow-y-auto">
        {usersData.map((user, index) => (
          <PeaoAvatar
            key={index}
            group={user.group}
            username={user.username}
            type={user.type}
            power={user.power}
            relacionamento={user.relacionamento}
            isTyping={isTyping}
          />
        ))}
      </div> */}
    </div>
  )
}
