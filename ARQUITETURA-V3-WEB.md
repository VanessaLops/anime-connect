# Arquitetura v3 — Web (frontend)

Mesma filosofia de [ARQUITETURA-V3.md](ARQUITETURA-V3.md) (camadas com
dependência sempre pra dentro, `domain/` sem saber nada de framework nem de
banco), adaptada pra projeto web. Não é específico de Firebase nem de
nenhum banco — o `domain/` não sabe se o dado vem de REST, GraphQL,
Firebase, Supabase ou Postgres direto. Isso é decisão só do `data/`.

Não é específico de framework também: o exemplo de pastas usa convenção
Next.js (`app/` de rota), mas a mesma separação funciona em Vite+React,
Remix ou qualquer outra coisa — só muda onde a rota fica fina chamando a
`presentation/`.

## Estrutura de pastas alvo

```
domain/
  <feature>/
    entities.ts          # tipos de domínio — não confundir com o DTO da API
    repositories.ts       # interfaces (ex.: UserRepository) — sem implementação
    usecases/
      follow-user.ts       # regra de negócio pura, roda em Node ou browser

data/
  http/
    client.ts              # wrapper fino de fetch/axios — timeout, headers, erro padrão
  <feature>/
    <feature>-repository.ts  # implementa a interface do domain/ (REST, GraphQL, SDK — tanto faz)
    mappers.ts               # DTO da API → entidade de domínio

presentation/
  routes/ (ou app/, pages/)   # rotas do framework — arquivo fino, só monta a tela
  screens/<feature>/           # tela de verdade, como no mobile
  components/ui/               # design system
  hooks/
    use-follow-user.ts          # useMutation/useQuery chamando o use-case

core/
  di.ts                    # monta os repositories (com a base URL/client certo) e injeta
  errors.ts                  # erro de domínio → mensagem de UI
  query-client.ts             # instância do React Query/SWR, se usar
```

## Onde entra o cache de servidor (React Query/SWR)

Esse é o ponto que não existe no mobile: a maioria dos apps web usa uma
lib de cache de dado de servidor. Ela fica **na borda entre `presentation/`
e `data/`** — o hook em `presentation/hooks/` chama o use-case dentro de um
`useQuery`/`useMutation`, nunca o inverso. O `domain/` não sabe que React
Query existe.

```ts
// presentation/hooks/use-follow-user.ts
export function useFollowUser() {
  const { userRepo } = useDI();
  return useMutation({
    mutationFn: (targetId: string) => followUser(userRepo, targetId),
    onSuccess: () => queryClient.invalidateQueries(['profile', targetId]),
  });
}
```

## Regra prática pra SSR (Next.js/Remix)

Se o `domain/` e o `data/` não importarem nada de `window`, `document` ou
qualquer API só-de-browser, o mesmo use-case roda tanto num Server
Component/Server Action quanto no client. Esse é o teste rápido pra saber
se uma função está no lugar certo: "isso rodaria num terminal Node sem
navegador?" Se não, ou é `presentation/` (componente/hook) ou é um detalhe
de um adapter específico de browser em `data/`.

## Exemplo concreto: seguir um usuário

```ts
// domain/social/repositories.ts
export interface UserRepository {
  follow(userId: string, targetId: string): Promise<void>;
  isFollowing(userId: string, targetId: string): Promise<boolean>;
}

// domain/social/usecases/follow-user.ts — puro, testável sem HTTP
export async function followUser(repo: UserRepository, userId: string, targetId: string) {
  if (userId === targetId) throw new DomainError('Não dá pra seguir você mesmo.');
  const already = await repo.isFollowing(userId, targetId);
  if (already) return;
  await repo.follow(userId, targetId);
}

// data/social/user-repository.ts — troque REST por Firebase/GraphQL sem tocar no domain/
export class RestUserRepository implements UserRepository {
  constructor(private http: HttpClient) {}
  async follow(userId: string, targetId: string) {
    await this.http.post(`/users/${userId}/follow`, { targetId });
  }
  async isFollowing(userId: string, targetId: string) {
    return this.http.get(`/users/${userId}/following/${targetId}`);
  }
}
```

Trocar de backend (REST → GraphQL → Firebase) é escrever um novo
`UserRepository`, não reescrever tela, hook nem regra de negócio.

## Feature-Sliced Design como alternativa

Se o projeto for grande o suficiente pra várias equipes mexerem em
features diferentes ao mesmo tempo, vale considerar
[Feature-Sliced Design](https://feature-sliced.design/) em vez dessa
estrutura por camada técnica — lá a pasta de topo é a feature, e dentro
dela têm as mesmas sub-camadas (`model/`, `api/`, `ui/`). É a mesma ideia
de dependência pra dentro, só organizada por feature primeiro e camada
depois. Comece com a estrutura deste doc; migre pra FSD só se o número de
features e de pessoas no time justificar.

## O que NÃO fazer

- Não colocar chamada de `fetch`/SDK direto dentro de componente ou hook —
  isso é o mesmo erro do `toggleLike` acoplado do doc mobile, só que na web.
- Não criar repository/use-case pra uma tela estática sem regra de negócio
  (ex.: página "Sobre"). CRUD trivial sem regra pode chamar `data/` direto
  de um hook simples.
- Não migrar um projeto existente de uma vez — mesmo plano incremental do
  doc mobile: escolha uma feature pequena, valide o padrão, só então repita.

## Status no anime-connect

Estrutura de pastas montada em `src/domain/`, `src/data/`, `src/presentation/`
e `src/core/` (cada uma com um `README.md` explicando a convenção local).
O código existente (`src/components/ui/`, `src/utils/`, `src/pages/api/lib/`)
ainda não foi migrado — continua onde está, funcionando normalmente.

Primeira feature a validar o padrão: a landing page, em
`src/presentation/screens/landing/`, chamada de forma fina por
`src/app/page.tsx`. Por enquanto ela só renderiza um placeholder
("Olá mundo") — o conteúdo de verdade (Header, Hero, LevelSystem, Footer,
que já existem em `src/components/ui/`) volta a ser plugado ali conforme o
desenvolvimento continuar.
