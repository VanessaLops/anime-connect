import { ACCOUNT_DELETION_PATH, PRIVACY_PATH, TERMS_PATH } from "@/core/routes";

// TODO: trocar por um e-mail do domínio de produção assim que ele existir
// (mesma pendência do SITE_URL em core/seo.ts).
export const LEGAL_CONTACT_EMAIL = "contato@animeconnect.app";

// Data exibida no topo dos dois documentos — atualizar sempre que o texto
// de qualquer um deles mudar.
const LAST_UPDATED = "29 de outubro de 2026";

export interface LegalSection {
  /** Âncora usada no sumário (`#id`). */
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
}

export interface LegalDocument {
  path: string;
  /** Linha pequena acima do título, no mesmo espírito do "Episódio" da landing. */
  eyebrow: string;
  title: string;
  summary: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  path: PRIVACY_PATH,
  eyebrow: "Protocolo de Dados",
  title: "Política de Privacidade",
  summary:
    "Como o AnimeConnect coleta, usa, guarda e protege os dados de quem faz parte da frota — em linha com a Lei Geral de Proteção de Dados (LGPD).",
  lastUpdated: LAST_UPDATED,
  sections: [
    {
      id: "quem-somos",
      title: "1. Quem somos",
      paragraphs: [
        "O AnimeConnect é uma rede social para fãs de anime, com chat, comunidades, patentes e powers de perfil. O aplicativo está em fase beta, ainda em desenvolvimento rumo à sua primeira versão estável.",
        "Esta política vale para o aplicativo AnimeConnect e para este site. Para fins da LGPD (Lei nº 13.709/2018), a equipe responsável pelo AnimeConnect é a controladora dos dados pessoais tratados aqui.",
      ],
    },
    {
      id: "dados-coletados",
      title: "2. Dados que coletamos",
      paragraphs: ["Coletamos apenas o necessário para o app funcionar e melhorar:"],
      items: [
        "Dados de conta: nome de usuário, e-mail, senha (guardada de forma criptografada) e, se você quiser, foto e descrição de perfil.",
        "Conteúdo que você cria: mensagens, publicações, comentários e participação em comunidades e grupos.",
        "Dados de progresso: patente, pontos de experiência, powers e itens virtuais vinculados à sua conta.",
        "Dados técnicos: modelo do aparelho, versão do sistema e do app, identificadores do dispositivo, endereço IP e registros de erro (crash).",
        "Dados de uso: telas acessadas, recursos utilizados e horários de acesso, usados de forma agregada para entender o que funciona.",
      ],
    },
    {
      id: "uso-dos-dados",
      title: "3. Como usamos seus dados",
      paragraphs: ["Usamos os dados para:"],
      items: [
        "Criar e manter sua conta e autenticar seu acesso.",
        "Entregar mensagens, exibir seu perfil e conectar você a outros membros e comunidades.",
        "Calcular patentes, experiência e liberar powers.",
        "Enviar notificações sobre atividades da sua conta, quando você permitir.",
        "Corrigir erros, prevenir fraudes, spam e abusos, e manter a segurança da plataforma.",
        "Cumprir obrigações legais e responder a solicitações de autoridades competentes.",
      ],
    },
    {
      id: "bases-legais",
      title: "4. Bases legais",
      paragraphs: [
        "Tratamos seus dados com base na execução do contrato (os Termos de Uso que você aceita ao criar a conta), no legítimo interesse (segurança, prevenção de abuso e melhoria do app), no cumprimento de obrigação legal e, quando necessário, no seu consentimento — que pode ser retirado a qualquer momento.",
      ],
    },
    {
      id: "compartilhamento",
      title: "5. Compartilhamento",
      paragraphs: [
        "Não vendemos seus dados pessoais. Compartilhamos dados somente com:",
      ],
      items: [
        "Provedores de infraestrutura que nos ajudam a operar o app (hospedagem, banco de dados, autenticação, envio de notificações e monitoramento de erros), sob contrato e só para essa finalidade.",
        "Autoridades públicas, quando houver obrigação legal ou ordem judicial.",
        "Outros usuários, no caso de informações que você mesmo torna públicas no seu perfil ou nas comunidades.",
      ],
    },
    {
      id: "transferencia-internacional",
      title: "6. Transferência internacional",
      paragraphs: [
        "Alguns provedores de infraestrutura podem armazenar dados em servidores fora do Brasil. Nesses casos, adotamos as salvaguardas previstas na LGPD para garantir um nível de proteção adequado.",
      ],
    },
    {
      id: "retencao",
      title: "7. Por quanto tempo guardamos",
      paragraphs: [
        "Mantemos seus dados enquanto sua conta estiver ativa. Ao excluir a conta, apagamos ou anonimizamos os dados pessoais em até 30 dias, exceto o que precisarmos guardar por obrigação legal (por exemplo, registros de acesso, mantidos por 6 meses conforme o Marco Civil da Internet).",
      ],
    },
    {
      id: "seus-direitos",
      title: "8. Seus direitos",
      paragraphs: ["Pela LGPD, você pode, a qualquer momento:"],
      items: [
        "Confirmar se tratamos seus dados e acessar uma cópia deles.",
        "Corrigir dados incompletos, inexatos ou desatualizados.",
        "Pedir a anonimização, o bloqueio ou a exclusão de dados desnecessários.",
        "Pedir a portabilidade dos seus dados.",
        "Revogar o consentimento e saber as consequências disso.",
        "Excluir sua conta e os dados vinculados a ela — o passo a passo está na página Excluir Conta, linkada no rodapé do site.",
      ],
    },
    {
      id: "seguranca",
      title: "9. Segurança",
      paragraphs: [
        "Usamos conexão criptografada, controle de acesso e outras medidas técnicas para proteger seus dados. Nenhum sistema é 100% invulnerável; se houver um incidente que possa trazer risco relevante, avisaremos você e a Autoridade Nacional de Proteção de Dados (ANPD).",
      ],
    },
    {
      id: "menores",
      title: "10. Crianças e adolescentes",
      paragraphs: [
        "O AnimeConnect não é destinado a menores de 13 anos. Adolescentes entre 13 e 18 anos só devem usar o app com a autorização de um responsável. Se soubermos que uma conta pertence a alguém abaixo da idade mínima, ela será removida.",
      ],
    },
    {
      id: "alteracoes",
      title: "11. Alterações nesta política",
      paragraphs: [
        "Como o app está em beta, esta política pode mudar conforme novas funcionalidades chegarem. Mudanças relevantes serão avisadas no app ou neste site, e a data no topo desta página sempre indica a versão em vigor.",
      ],
    },
  ],
};

export const TERMS_OF_USE: LegalDocument = {
  path: TERMS_PATH,
  eyebrow: "Código da Frota",
  title: "Termos de Uso",
  summary:
    "As regras para fazer parte da frota do AnimeConnect: o que você pode esperar do app e o que esperamos de cada tripulante.",
  lastUpdated: LAST_UPDATED,
  sections: [
    {
      id: "aceitacao",
      title: "1. Aceitação",
      paragraphs: [
        "Ao criar uma conta ou usar o AnimeConnect, você concorda com estes Termos de Uso e com a nossa Política de Privacidade. Se não concordar, não use o app.",
      ],
    },
    {
      id: "beta",
      title: "2. Versão beta",
      paragraphs: [
        "O AnimeConnect está em fase beta. Isso significa que funcionalidades podem mudar, ser removidas ou ficar instáveis, e que dados de progresso (patentes, experiência, powers e itens virtuais) podem ser ajustados ou reiniciados antes da versão final. O app é oferecido “no estado em que se encontra”, sem garantia de disponibilidade contínua.",
      ],
    },
    {
      id: "conta",
      title: "3. Sua conta",
      paragraphs: [
        "Você precisa ter pelo menos 13 anos para usar o app; se tiver menos de 18, precisa da autorização de um responsável. As informações do cadastro devem ser verdadeiras, e você é responsável por manter sua senha em segredo e por toda atividade feita na sua conta.",
      ],
    },
    {
      id: "conduta",
      title: "4. Regras de conduta",
      paragraphs: ["Para manter a galáxia um lugar bom pra todo mundo, é proibido:"],
      items: [
        "Assediar, ameaçar, discriminar ou incitar ódio contra qualquer pessoa ou grupo.",
        "Publicar conteúdo sexual envolvendo menores, conteúdo sexual explícito sem sinalização adequada, violência gráfica ou qualquer material ilegal.",
        "Compartilhar dados pessoais de terceiros sem autorização.",
        "Enviar spam, golpes, links maliciosos ou se passar por outra pessoa ou pela equipe do AnimeConnect.",
        "Compartilhar links ou arquivos que violem direitos autorais, incluindo episódios e mangás pirateados.",
        "Usar bots, scripts ou falhas do app para ganhar experiência, powers ou vantagens de forma indevida.",
        "Tentar acessar contas, sistemas ou dados que não são seus.",
      ],
    },
    {
      id: "conteudo",
      title: "5. Conteúdo que você publica",
      paragraphs: [
        "O conteúdo que você publica continua sendo seu. Ao publicar, você nos dá uma licença gratuita e não exclusiva para armazenar, exibir e distribuir esse conteúdo dentro do AnimeConnect, apenas para fazer o app funcionar.",
        "Você é responsável pelo que publica. Podemos remover conteúdo que viole estes termos ou a lei, e responder a pedidos legítimos de remoção feitos por titulares de direitos.",
      ],
    },
    {
      id: "itens-virtuais",
      title: "6. Patentes, powers e itens virtuais",
      paragraphs: [
        "Patentes, experiência, powers e demais itens virtuais são recursos de personalização dentro do app. Eles não têm valor monetário, não podem ser trocados por dinheiro e não são transferíveis entre contas, salvo quando o próprio app oferecer essa opção.",
      ],
    },
    {
      id: "propriedade",
      title: "7. Propriedade intelectual",
      paragraphs: [
        "A marca AnimeConnect, o design, o código e os elementos visuais do app pertencem à equipe do AnimeConnect. Nomes e imagens de animes citados por usuários pertencem aos seus respectivos detentores de direitos.",
      ],
    },
    {
      id: "suspensao",
      title: "8. Suspensão e encerramento",
      paragraphs: [
        "Podemos advertir, limitar, suspender ou encerrar contas que violem estes termos, de acordo com a gravidade do caso. Você pode excluir sua conta a qualquer momento pelo app ou pelo contato abaixo.",
      ],
    },
    {
      id: "responsabilidade",
      title: "9. Limitação de responsabilidade",
      paragraphs: [
        "Fazemos o possível para manter o app seguro e funcionando, mas não nos responsabilizamos por conteúdo publicado por outros usuários, por interrupções do serviço ou por perdas decorrentes do uso do app durante a fase beta, nos limites permitidos pela lei brasileira.",
      ],
    },
    {
      id: "alteracoes",
      title: "10. Alterações nos termos",
      paragraphs: [
        "Estes termos podem ser atualizados conforme o app evolui. Mudanças relevantes serão avisadas no app ou neste site. Continuar usando o AnimeConnect depois da atualização significa que você concorda com a nova versão.",
      ],
    },
    {
      id: "foro",
      title: "11. Lei aplicável",
      paragraphs: [
        "Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro do domicílio do usuário para resolver qualquer questão relacionada a eles.",
      ],
    },
  ],
};

// Mesmo prazo citado na seção "Por quanto tempo guardamos" da política.
const DELETION_DEADLINE_DAYS = 30;

export const ACCOUNT_DELETION_EMAIL_SUBJECT = "Solicitação de exclusão de conta";
export const ACCOUNT_DELETION_EMAIL_BODY = [
  "Olá, equipe AnimeConnect.",
  "",
  "Quero excluir minha conta e os dados vinculados a ela.",
  "",
  "E-mail da conta:",
  "Nome de usuário:",
].join("\n");

export const ACCOUNT_DELETION: LegalDocument = {
  path: ACCOUNT_DELETION_PATH,
  eyebrow: "Deixar a Frota",
  title: "Excluir Conta",
  summary:
    "Como pedir a exclusão da sua conta do AnimeConnect e o que acontece com os seus dados depois disso.",
  lastUpdated: LAST_UPDATED,
  sections: [
    {
      id: "como-solicitar",
      title: "1. Como solicitar",
      paragraphs: [
        "Você pode pedir a exclusão a qualquer momento, mesmo sem o app instalado:",
      ],
      items: [
        "Envie um e-mail para o endereço de contato no fim desta página (ou use o botão acima), de preferência a partir do mesmo e-mail cadastrado na conta.",
        "Informe o e-mail da conta e o seu nome de usuário.",
        "Se o pedido vier de outro e-mail, podemos pedir uma confirmação extra pra garantir que a conta é mesmo sua.",
        "Você recebe uma resposta confirmando o pedido e, depois, a conclusão da exclusão.",
      ],
    },
    {
      id: "dados-excluidos",
      title: "2. O que é excluído",
      paragraphs: [
        `Em até ${DELETION_DEADLINE_DAYS} dias após a confirmação do pedido, apagamos ou anonimizamos:`,
      ],
      items: [
        "Dados de conta: nome de usuário, e-mail, senha, foto e descrição de perfil.",
        "Conteúdo que você criou: mensagens, publicações, comentários e participação em comunidades e grupos.",
        "Dados de progresso: patente, experiência, powers e itens virtuais.",
        "Dados de uso e identificadores do dispositivo vinculados à conta.",
      ],
    },
    {
      id: "dados-mantidos",
      title: "3. O que pode ser mantido",
      paragraphs: [
        "Alguns dados só são guardados quando a lei exige, e apenas pelo prazo necessário:",
      ],
      items: [
        "Registros de acesso ao aplicativo (data, hora e IP), mantidos por 6 meses conforme o Marco Civil da Internet.",
        "Informações necessárias pra cumprir obrigação legal, ordem judicial ou pra investigar fraude e abuso já denunciados.",
        "Dados estatísticos totalmente anonimizados, que não identificam mais você.",
      ],
    },
    {
      id: "importante",
      title: "4. Antes de excluir",
      paragraphs: [
        "A exclusão é definitiva: depois de concluída, não dá pra recuperar a conta, o progresso nem os powers. Se quiser só dar um tempo, basta sair da conta ou desinstalar o app — a conta continua guardada.",
        "Mensagens que você enviou em conversas com outras pessoas deixam de ser associadas ao seu perfil.",
      ],
    },
  ],
};

/** Documento linkado no "Veja também" do rodapé de cada página legal. */
export const LEGAL_COUNTERPART: Record<string, LegalDocument> = {
  [PRIVACY_PATH]: TERMS_OF_USE,
  [TERMS_PATH]: PRIVACY_POLICY,
  [ACCOUNT_DELETION_PATH]: PRIVACY_POLICY,
};
