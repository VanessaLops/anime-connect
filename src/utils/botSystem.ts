import { database } from '@/pages/api/lib/firebase';
import { push, ref, remove, update } from 'firebase/database';

interface BotConfig {
    groupId: string;
    botName: string;
    triggerMessage: string;
    senderUser: any; // O usuário que enviou o comando
}

export const BotSystem = {
    // Função principal que processa a mensagem
    async processMessage({ groupId, botName, triggerMessage, senderUser }: BotConfig) {

        // Se a mensagem não começa com '/', o bot ignora (para não ficar chato)
        if (!triggerMessage.startsWith('/')) return;

        const args = triggerMessage.split(' ');
        const command = args[0].toLowerCase();
        const targetId = args[1]; // ID do alvo (se houver)

        // Referência para responder no chat
        const messagesRef = ref(database, `grupos/${groupId}/messages`);

        // Helper para o Bot falar
        const botSpeak = async (text: string) => {
            await push(messagesRef, {
                text: text,
                timestamp: Date.now(),
                userId: 'BOT_SYSTEM',
                username: botName,
                image: `https://api.dicebear.com/7.x/bottts/png?seed=${botName}`, // Avatar de Robô
                type: 'Bot',
                status: 'Online',
                vipColor: '#00ff00' // Verde Matrix
            });
        };

        // --- COMANDOS DO BOT ---

        // 1. AJUDA (/ajuda)
        if (command === '/ajuda') {
            await botSpeak(`
                🤖 Comandos do Sistema ${botName}:
                /ajuda - Lista comandos
                /info - Status do Grupo
                /dado - Rola um d20
                /promover [ID] - (Admin) Vira Staff
                /rebaixar [ID] - (Admin) Vira Membro
                /kick [ID] - (Admin) Remove usuário
            `);
        }

        // 2. ROLAR DADO (/dado)
        else if (command === '/dado') {
            const result = Math.floor(Math.random() * 20) + 1;
            const critical = result === 20 ? "CRÍTICO! 🔥" : result === 1 ? "FALHA CRÍTICA ☠️" : "";
            await botSpeak(`🎲 ${senderUser.username} rolou o dado: [ ${result} ] ${critical}`);
        }

        // 3. PROMOVER USUÁRIO (/promover ID) - Poder Real
        else if (command === '/promover') {
            // Verifica se quem pediu é Dono ou Staff
            if (senderUser.type !== 'Dono_Sala' && senderUser.type !== 'Admin_mod') {
                await botSpeak(`⛔ Acesso Negado. Você não tem permissão para promover.`);
                return;
            }

            if (!targetId) {
                await botSpeak(`⚠️ Uso correto: /promover ID_DO_USUARIO`);
                return;
            }

            try {
                // Atualiza no banco de dados (Dá o poder)
                const memberRef = ref(database, `grupos/${groupId}/members/${targetId}`);
                await update(memberRef, {
                    type: 'Staff',
                    power: 1 // Nível de poder visual
                });
                await botSpeak(`✅ Protocolo de Ascensão ativado! O usuário ${targetId.slice(0, 5)}... agora é STAFF.`);
            } catch (error) {
                await botSpeak(`❌ Erro ao promover usuário.`);
            }
        }

        // 4. REBAIXAR USUÁRIO (/rebaixar ID)
        else if (command === '/rebaixar') {
            if (senderUser.type !== 'Dono_Sala') {
                await botSpeak(`⛔ Apenas o Dono pode rebaixar.`);
                return;
            }
            if (!targetId) return await botSpeak(`⚠️ Informe o ID.`);

            const memberRef = ref(database, `grupos/${groupId}/members/${targetId}`);
            await update(memberRef, { type: 'Membro', power: 0 });
            await botSpeak(`⬇️ Usuário rebaixado para Membro.`);
        }

        // 5. KICKAR USUÁRIO (/kick ID)
        else if (command === '/kick') {
            if (senderUser.type !== 'Dono_Sala' && senderUser.type !== 'Staff') {
                await botSpeak(`⛔ Sem permissão.`);
                return;
            }
            if (!targetId) return await botSpeak(`⚠️ Informe o ID.`);

            try {
                // Remove do grupo
                const memberRef = ref(database, `grupos/${groupId}/members/${targetId}`);
                await remove(memberRef);
                await botSpeak(`🚪 Usuário removido do servidor.`);
            } catch (error) {
                await botSpeak(`❌ Falha ao remover.`);
            }
        }

        // COMANDO SECRETO (Easter Egg)
        else if (command === '/skynet') {
            await botSpeak(`👁️ Iniciando protocolo de dominação mundial... brincadeira (por enquanto).`);
        }
    }
};