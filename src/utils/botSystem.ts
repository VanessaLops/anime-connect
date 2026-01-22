import { database } from '@/pages/api/lib/firebase';
import { get, push, ref, remove, set, update } from 'firebase/database';

interface BotConfig {
    groupId: string;
    botName: string;
    triggerMessage: string;
    senderUser: {
        id: string;
        username: string;
        type: string;
        power?: number;
    };
}

// Helper de Nível de Poder
const getPowerLevel = (type: string) => {
    switch (type) {
        case 'Dono_Geral': return 100;
        case 'Dono_Sala': return 90;
        case 'Admin_mod': return 50;
        case 'Staff': return 50;
        case 'Membro': return 10;
        default: return 0;
    }
};

export const BotSystem = {
    
    // --- NOVO: HELPER PARA ACHAR ID PELO NOME ---
    async findMemberIdByName(groupId: string, nameToFind: string) {
        const membersRef = ref(database, `grupos/${groupId}/members`);
        const snapshot = await get(membersRef);
        
        if (!snapshot.exists()) return null;

        const members = snapshot.val();
        
        // Procura no objeto de membros (Case Insensitive)
        // Ex: "goku" acha "Goku", "GOKU", etc.
        const foundEntry = Object.entries(members).find(([key, user]: [string, any]) => 
            user.username?.toLowerCase() === nameToFind.toLowerCase()
        );

        // Retorna o ID (chave) se achar, ou null
        return foundEntry ? foundEntry[0] : null;
    },

    // Função de Boas-vindas
    async announceJoin(groupId: string, botName: string, newUser: any) {
        const messagesRef = ref(database, `grupos/${groupId}/messages`);
        await push(messagesRef, {
            text: `🎉 Bem-vindo(a) à guilda, ${newUser.username}!`,
            timestamp: Date.now(),
            userId: 'BOT_SYSTEM',
            username: botName,
            image: `https://api.dicebear.com/7.x/bottts/png?seed=${botName}`,
            type: 'Bot',
            isSystemMessage: true,
            vipColor: '#00ff00'
        });
    },

    // Processador de Comandos
    async processMessage({ groupId, botName, triggerMessage, senderUser }: BotConfig) {

        if (!triggerMessage.startsWith('/')) return;

        // Separa o comando do argumento
        // Ex: "/promover Goku Super Saiyajin" -> command="/promover", targetName="Goku Super Saiyajin"
        const args = triggerMessage.split(' ');
        const command = args[0].toLowerCase();
        const targetName = args.slice(1).join(' '); // Pega tudo depois do comando como nome (incluindo espaços)

        const messagesRef = ref(database, `grupos/${groupId}/messages`);
        const senderPower = getPowerLevel(senderUser.type);

        const botSpeak = async (text: string) => {
            await push(messagesRef, {
                text: text,
                timestamp: Date.now(),
                userId: 'BOT_SYSTEM',
                username: botName,
                image: `https://api.dicebear.com/7.x/bottts/png?seed=${botName}`,
                type: 'Bot',
                status: 'Online',
                vipColor: '#00ff00'
            });
        };

        const adminCommands = ['/promover', '/rebaixar', '/kick', '/ban'];
        if (adminCommands.includes(command) && senderPower < 50) {
            return await botSpeak(`⛔ Sem permissão, ${senderUser.username}.`);
        }

        // --- COMANDOS ---

        if (command === '/ajuda') {
            await botSpeak(`🤖 Comandos:
            /diario - Recompensa diária
            /dado - Rolar D20
            ${senderPower >= 50 ? '\n👮 Admin (Use o Nome):\n/promover [Nome]\n/rebaixar [Nome]\n/kick [Nome]\n/ban [Nome]' : ''}`);
        }

        else if (command === '/dado') {
            const result = Math.floor(Math.random() * 20) + 1;
            await botSpeak(`🎲 ${senderUser.username} rolou: [ ${result} ]`);
        }

        else if (command === '/diario') {
            if (senderPower === 0) return await botSpeak("⛔ Visitantes não ganham XP.");
            const userRef = ref(database, `grupos/${groupId}/members/${senderUser.id}`);
            await update(userRef, { 
                relacionamento: '🌟 Membro Fiel',
                power: (senderUser.power || 0) + 1 
            });
            await botSpeak(`🎁 ${senderUser.username} ganhou XP diário!`);
        }

        // --- COMANDOS ADMINISTRATIVOS POR NOME ---

        else if (command === '/promover') {
            if (senderPower < 90) return await botSpeak("⛔ Só o Dono promove.");
            if (!targetName) return await botSpeak("⚠️ Digite o nome. Ex: /promover Goku");

            const targetId = await BotSystem.findMemberIdByName(groupId, targetName);
            
            if (targetId) {
                const targetRef = ref(database, `grupos/${groupId}/members/${targetId}`);
                await update(targetRef, { type: 'Staff', power: 5 });
                await botSpeak(`🛡️ ${targetName} foi promovido a STAFF!`);
            } else {
                await botSpeak(`❌ Usuário "${targetName}" não encontrado na sala.`);
            }
        }

        else if (command === '/rebaixar') {
            if (senderPower < 90) return await botSpeak("⛔ Só o Dono rebaixa.");
            if (!targetName) return await botSpeak("⚠️ Digite o nome.");

            const targetId = await BotSystem.findMemberIdByName(groupId, targetName);

            if (targetId) {
                const targetRef = ref(database, `grupos/${groupId}/members/${targetId}`);
                await update(targetRef, { type: 'Membro', power: 0 });
                await botSpeak(`⬇️ ${targetName} virou Membro comum.`);
            } else {
                await botSpeak(`❌ Usuário "${targetName}" não encontrado.`);
            }
        }

        else if (command === '/kick') {
            if (!targetName) return await botSpeak("⚠️ Digite o nome.");

            const targetId = await BotSystem.findMemberIdByName(groupId, targetName);

            if (targetId) {
                const targetRef = ref(database, `grupos/${groupId}/members/${targetId}`);
                const snapshot = await get(targetRef);
                const targetData = snapshot.val();

                if (getPowerLevel(targetData.type) >= senderPower) {
                    return await botSpeak("⛔ Você não pode chutar alguém de cargo superior/igual.");
                }

                await remove(targetRef);
                await botSpeak(`🥾 ${targetData.username} foi expulso.`);
            } else {
                await botSpeak(`❌ Usuário não encontrado.`);
            }
        }

        else if (command === '/ban') {
            if (!targetName) return await botSpeak("⚠️ Digite o nome.");

            const targetId = await BotSystem.findMemberIdByName(groupId, targetName);

            if (targetId) {
                const targetRef = ref(database, `grupos/${groupId}/members/${targetId}`);
                const snapshot = await get(targetRef);
                const targetData = snapshot.val();

                if (getPowerLevel(targetData.type) >= senderPower) {
                    return await botSpeak("⛔ Sem permissão para banir este cargo.");
                }

                // Lista Negra
                const banRef = ref(database, `grupos/${groupId}/banned/${targetId}`);
                await set(banRef, {
                    username: targetData.username,
                    bannedBy: senderUser.username,
                    date: Date.now()
                });

                await remove(targetRef);
                await botSpeak(`🚫 ${targetData.username} foi BANIDO.`);
            } else {
                await botSpeak(`❌ Usuário não encontrado.`);
            }
        }
    }
};