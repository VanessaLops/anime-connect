# presentation/

Tudo que é tela, componente e hook de UI. É a única camada que pode saber
de React, Next.js, `window`/`document` e de libs de cache de servidor
(React Query/SWR) — o hook chama o use-case de dentro de um
`useQuery`/`useMutation`, nunca o inverso.

Convenção:

```
presentation/
  screens/<feature>/     # tela de verdade (o que a rota do framework chama)
  components/ui/           # design system
  hooks/
    use-<acao>.ts           # useMutation/useQuery chamando o use-case do domain/
```

As rotas do Next.js continuam em `src/app/` (convenção do framework) — cada
`page.tsx` fica fina, só importando e renderizando a screen correspondente
daqui.

Notas do estado atual do projeto:

- `src/components/ui/` já existe e cumpre o papel de
  `presentation/components/ui/` — não foi duplicado nem movido pra cá ainda,
  pra não migrar tudo de uma vez (ver plano incremental no doc de
  arquitetura). Vai sendo consolidado aqui conforme cada feature migra.
- `screens/landing/` é a primeira screen nova, validando o padrão pra
  landing page.
