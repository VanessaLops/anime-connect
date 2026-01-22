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

// --- CÉREBRO AUTÔNOMO (FRASES E REAÇÕES) ---
const randomPhrases = [
    "Alguém aí assistiu o episódio novo de One Piece? Tá insano! 🔥",
    "Estou entediado... quem quer jogar um /dado valendo XP?",
    "Lembrem-se de beber água, pessoal! 💧",
    "Detectei um nível de otaku muito alto nesta sala... 🧐",
    "Se eu fosse humano, passaria o dia vendo animes.",
    "Alguém viu meu criador por aí? Preciso de um upgrade.",
    "A paz deste grupo é suspeita...",
    "Curiosidade: O primeiro anime da história foi lançado em 1917! 📜",
    "Vocês preferem Dublado ou Legendado? (Cuidado com a resposta...)",
    "Bip bop... processando... alguém disse 'pizza'?"
];

export const BotSystem = {
    
    // --- HELPER PARA ACHAR ID PELO NOME ---
    async findMemberIdByName(groupId: string, nameToFind: string) {
        const membersRef = ref(database, `grupos/${groupId}/members`);
        const snapshot = await get(membersRef);
        
        if (!snapshot.exists()) return null;

        const members = snapshot.val();
        const foundEntry = Object.entries(members).find(([key, user]: [string, any]) => 
            user.username?.toLowerCase() === nameToFind.toLowerCase()
        );

        return foundEntry ? foundEntry[0] : null;
    },

    // --- FUNÇÃO DE FALA PADRÃO ---
    async botSpeak(groupId: string, botName: string, text: string) {
        const messagesRef = ref(database, `grupos/${groupId}/messages`);
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
    },

    // --- INTERAÇÃO AUTÔNOMA (O PULSO DE VIDA) ---
    async tryAutonomousAction(groupId: string, botName: string) {
        // Chance de 10% de falar algo a cada mensagem enviada por humanos
        const chance = Math.random();
        
        if (chance < 0.10) { // 10% de chance
            const randomPhrase = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
            
            // Pequeno delay para parecer que ele está "pensando" ou digitando
            setTimeout(() => {
                this.botSpeak(groupId, botName, randomPhrase);
            }, 3000); 
        }
    }
    ,

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

        // 1. Sempre tenta uma interação autônoma (mesmo se não for comando)
        // Isso faz o bot parecer vivo enquanto vocês conversam
        this.tryAutonomousAction(groupId, botName);

        // 2. Se não for comando, para por aqui
        if (!triggerMessage.startsWith('/')) return;

        const args = triggerMessage.split(' ');
        const command = args[0].toLowerCase();
        const targetName = args.slice(1).join(' ');

        const senderPower = getPowerLevel(senderUser.type);

        const adminCommands = ['/promover', '/rebaixar', '/kick', '/ban'];
        if (adminCommands.includes(command) && senderPower < 50) {
            return await this.botSpeak(groupId, botName, `⛔ Sem permissão, ${senderUser.username}.`);
        }

        // --- COMANDOS ---

        if (command === '/ajuda') {
            await this.botSpeak(groupId, botName, `🤖 Comandos:
            /diario - Recompensa diária
            /dado - Rolar D20
            ${senderPower >= 50 ? '\n👮 Admin (Use o Nome):\n/promover [Nome]\n/rebaixar [Nome]\n/kick [Nome]\n/ban [Nome]' : ''}`);
        }

        else if (command === '/dado') {
            const result = Math.floor(Math.random() * 20) + 1;
            await this.botSpeak(groupId, botName, `🎲 ${senderUser.username} rolou: [ ${result} ]`);
        }

        else if (command === '/diario') {
            if (senderPower === 0) return await this.botSpeak(groupId, botName, "⛔ Visitantes não ganham XP.");
            const userRef = ref(database, `grupos/${groupId}/members/${senderUser.id}`);
            await update(userRef, { 
                relacionamento: '🌟 Membro Fiel',
                power: (senderUser.power || 0) + 1 
            });
            await this.botSpeak(groupId, botName, `🎁 ${senderUser.username} ganhou XP diário!`);
        }

        // --- COMANDOS ADMINISTRATIVOS POR NOME ---

        else if (command === '/promover') {
            if (senderPower < 90) return await this.botSpeak(groupId, botName, "⛔ Só o Dono promove.");
            if (!targetName) return await this.botSpeak(groupId, botName, "⚠️ Digite o nome. Ex: /promover Goku");

            const targetId = await BotSystem.findMemberIdByName(groupId, targetName);
            
            if (targetId) {
                const targetRef = ref(database, `grupos/${groupId}/members/${targetId}`);
                await update(targetRef, { type: 'Staff', power: 5 });
                await this.botSpeak(groupId, botName, `🛡️ ${targetName} foi promovido a STAFF!`);
            } else {
                await this.botSpeak(groupId, botName, `❌ Usuário "${targetName}" não encontrado na sala.`);
            }
        }

        else if (command === '/rebaixar') {
            if (senderPower < 90) return await this.botSpeak(groupId, botName, "⛔ Só o Dono rebaixa.");
            if (!targetName) return await this.botSpeak(groupId, botName, "⚠️ Digite o nome.");

            const targetId = await BotSystem.findMemberIdByName(groupId, targetName);

            if (targetId) {
                const targetRef = ref(database, `grupos/${groupId}/members/${targetId}`);
                await update(targetRef, { type: 'Membro', power: 0 });
                await this.botSpeak(groupId, botName, `⬇️ ${targetName} virou Membro comum.`);
            } else {
                await this.botSpeak(groupId, botName, `❌ Usuário "${targetName}" não encontrado.`);
            }
        }

        else if (command === '/kick') {
            if (!targetName) return await this.botSpeak(groupId, botName, "⚠️ Digite o nome.");

            const targetId = await BotSystem.findMemberIdByName(groupId, targetName);

            if (targetId) {
                const targetRef = ref(database, `grupos/${groupId}/members/${targetId}`);
                const snapshot = await get(targetRef);
                const targetData = snapshot.val();

                if (getPowerLevel(targetData.type) >= senderPower) {
                    return await this.botSpeak(groupId, botName, "⛔ Você não pode chutar alguém de cargo superior/igual.");
                }

                await remove(targetRef);
                await this.botSpeak(groupId, botName, `🥾 ${targetData.username} foi expulso.`);
            } else {
                await this.botSpeak(groupId, botName, `❌ Usuário não encontrado.`);
            }
        }

        else if (command === '/ban') {
            if (!targetName) return await this.botSpeak(groupId, botName, "⚠️ Digite o nome.");

            const targetId = await BotSystem.findMemberIdByName(groupId, targetName);

            if (targetId) {
                const targetRef = ref(database, `grupos/${groupId}/members/${targetId}`);
                const snapshot = await get(targetRef);
                const targetData = snapshot.val();

                if (getPowerLevel(targetData.type) >= senderPower) {
                    return await this.botSpeak(groupId, botName, "⛔ Sem permissão para banir este cargo.");
                }

                const banRef = ref(database, `grupos/${groupId}/banned/${targetId}`);
                await set(banRef, {
                    username: targetData.username,
                    bannedBy: senderUser.username,
                    date: Date.now()
                });

                await remove(targetRef);
                await this.botSpeak(groupId, botName, `🚫 ${targetData.username} foi BANIDO.`);
            } else {
                await this.botSpeak(groupId, botName, `❌ Usuário não encontrado.`);
            }
        }
    }
};
