# presentation/

Tudo que é tela, componente e hook de UI. É a única camada que pode saber
de React, Next.js, `window`/`document` e de libs de cache de servidor
(React Query/SWR) — o hook chama o use-case de dentro de um
`useQuery`/`useMutation`, nunca o inverso.

Convenção:

```
presentation/
  screens/<feature>/
    <Feature>Screen.tsx     # tela de verdade (o que a rota do framework chama) — só compõe
    sections/                # pedaços grandes de uma screen específica (não reaproveitável fora dela)
    content.tsx               # dado/copy da screen (arrays, texto) — separado do JSX de layout
  components/ui/             # design system — componente genérico, usado por 2+ screens
  hooks/
    use-<acao>.ts             # useMutation/useQuery chamando o use-case do domain/
```

Regra pra decidir `sections/<feature>/` vs `components/ui/`: se o
componente só faz sentido dentro dessa screen (composição específica,
copy fixo daquela feature), fica em `sections/`. Se é genérico o bastante
pra outra screen usar sem mudar nada (um badge, um card, um campo de
estrelas de fundo), vai pra `components/ui/`.

As rotas do Next.js continuam em `src/app/` (convenção do framework) — cada
`page.tsx` fica fina, só importando e renderizando a screen correspondente
daqui.

Notas do estado atual do projeto:

- `components/ui/` já tem os primeiros componentes reais: `Starfield`,
  `OpeningCrawl`, `FeatureCard` e `RankBadge`, usados pela landing. O antigo
  `src/components/ui/` (arquitetura pré-v3) foi removido — tudo daqui pra
  frente nasce direto no padrão novo.
- `screens/landing/` é a primeira screen no padrão, com conteúdo real (tema
  "beta galaxy"), quebrada em `sections/` (`Hero`, `CrawlSection`,
  `Systems`, `FleetRanks`, `BetaFooter`) + `content.tsx` com o copy/dados —
  é o exemplo de referência pra próxima screen que crescer.
