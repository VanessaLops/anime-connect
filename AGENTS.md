# AGENTS.md — anime-connect

Guia pra qualquer agente (Claude Code ou outro) trabalhando neste repo.

## Arquitetura

Doc completo em [ARQUITETURA-V3-WEB.md](ARQUITETURA-V3-WEB.md). Resumo:

```
domain/         regra de negócio pura — sem import de react/next/fetch/window
data/           implementa as interfaces do domain/ (HTTP, SDK, o que for)
presentation/   telas, componentes, hooks — única camada que sabe de React/cache de servidor
core/           DI, mapeamento de erro, query client — sem regra de negócio
```

Dependência sempre pra dentro: `presentation/` → `domain/` ← `data/`, e
`core/` amarra tudo. `domain/` nunca sabe que as outras camadas existem.

**Teste rápido pra saber onde um código vai:** isso rodaria num script Node
puro, sem navegador? Se sim, é `domain/` (regra) ou `data/` (I/O). Se não, é
`presentation/` (componente/hook) ou um adapter de browser específico em
`data/`.

**Migração incremental** — não mover tudo de uma vez. Escolha uma feature
pequena, valide o padrão nela, só então repita pra próxima.

## Status atual do projeto

Só existe a landing hoje: `src/app/page.tsx` →
`presentation/screens/landing/LandingScreen.tsx`. É conteúdo real (não
mais placeholder), tema "beta galaxy" — a ideia central do produto é
"AnimeConnect é uma galáxia conectada", com estética inspirada em space
opera (starfield, crawl de abertura, patentes em vez de "níveis"). Sem
`domain/`/`data/` porque é tela estática sem regra de negócio — só
`presentation/components/ui/` (`Starfield`, `OpeningCrawl`, `FeatureCard`).

**v3 é a versão da arquitetura do site, não do produto.** O app em si
ainda não foi publicado em lugar nenhum — está em beta, amadurecendo rumo
à sua v1. Não confundir os dois versionamentos.

O código antigo (chat, comunidade, dashboard, funcionalidades, levels, e
as libs que eles usavam — Firebase, MUI, Framer Motion, Swiper,
react-redux etc.) foi removido pra dar lugar à arquitetura nova. Cada uma
dessas features volta a ser construída dentro do padrão
domain/data/presentation/core, uma de cada vez — não é pra recriar tudo de
uma vez só porque o esqueleto existe. O doc funcional completo do produto
(requisitos, sistema de níveis/XP/gifts) é histórico do projeto anterior;
serve de referência de visão, não de spec exata — vários números já estão
sendo revistos.

## Regras de código

- **Sem magic numbers/strings.** Valor repetido ou cujo significado não é
  óbvio pelo contexto vira constante nomeada — perto do uso se for local
  daquela feature, em `core/` só se for de verdade cross-cutting.
- **Sem redundância.** Antes de escrever função/componente novo, procure se
  já existe algo reaproveitável (`data/http/client.ts` pra chamada HTTP,
  `core/errors.ts` pra mensagem de erro, um usecase já existente) em vez de
  duplicar lógica.
- `domain/` nunca importa `react`, `next`, `window`/`document`, cliente
  HTTP ou SDK de terceiro.
- Hook em `presentation/hooks/` chama o usecase *dentro* de
  `useQuery`/`useMutation` — nunca o inverso — e a lib de cache
  (React Query/SWR) não aparece em `domain/` nem em `data/`.
- Não criar repository/usecase pra tela estática sem regra de negócio (ex.:
  página "Sobre"). CRUD trivial sem regra chama `data/` direto de um hook
  simples.
- Erro de regra de negócio é sempre `DomainError`
  (`src/domain/shared/errors.ts`), nunca um `throw new Error(...)` cru
  dentro de um usecase.

## Convenções de nome

- Arquivos em `domain/` e `data/`: kebab-case (`follow-user.ts`,
  `user-repository.ts`).
- Componentes e screens em `presentation/`: PascalCase
  (`LandingScreen.tsx`).
- Uma interface de repository por feature em `domain/<feature>/repositories.ts`,
  implementação em `data/<feature>/<feature>-repository.ts`.

## Comandos

- `npm run build` — build de produção (Next.js + typecheck). Rodar depois
  de qualquer mudança estrutural.
- `npm run lint` — hoje quebrado por incompatibilidade entre
  `eslint-config-next@16` e `next@15` (erro "circular structure to JSON"),
  pré-existente e não relacionado ao código em si.
- Sem suíte de testes configurada ainda.
