# hooks/

`use-<acao>.ts` — hooks que chamam use-cases do `domain/`, geralmente
dentro de um `useQuery`/`useMutation` (ver `core/query-client.ts`). Sem
hooks ainda — a landing page não tem regra de negócio, só UI estática.
