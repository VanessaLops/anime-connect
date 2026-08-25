# core/

Ligação entre as outras camadas — nenhuma regra de negócio mora aqui.

- `di.ts` — monta os repositories concretos (com o client/base URL certos)
  e expõe pras screens/hooks injetarem. Vazio até a primeira feature migrar
  pra `domain/`+`data/`.
- `errors.ts` — traduz erro de domínio (`DomainError`, definido em
  `src/domain/shared/errors.ts`) em mensagem de UI.
- `query-client.ts` — instância do React Query/SWR, se o projeto passar a
  usar uma lib de cache de servidor. Ainda não está instalada nenhuma —
  arquivo comentado, pronto pra ativar quando for necessário.
- `seo.ts` — constantes de SEO (URL do site, nome, título e descrição
  padrão) compartilhadas entre `app/layout.tsx`, `app/robots.ts` e
  `app/sitemap.ts`.
