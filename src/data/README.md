# data/

Implementa as interfaces definidas em `domain/<feature>/repositories.ts`.
É a única camada que sabe se o dado vem de REST, GraphQL, Firebase, SDK
de terceiro etc. — trocar de backend é escrever um novo repository aqui,
sem tocar em tela, hook ou regra de negócio.

Convenção:

```
data/
  http/
    client.ts                # wrapper fino de fetch — timeout, headers, erro padrão
  <feature>/
    <feature>-repository.ts    # implementa a interface do domain/
    mappers.ts                  # DTO da API → entidade de domínio
```

`http/client.ts` já está pronto pra uso (`httpClient`). Repositories de
feature entram aqui conforme cada feature for migrada — veja o plano
incremental em [../../ARQUITETURA-V3-WEB.md](../../ARQUITETURA-V3-WEB.md).
