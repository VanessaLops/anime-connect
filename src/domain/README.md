# domain/

Regra de negócio pura. Não importa nada de Next.js, React, Firebase, fetch
ou qualquer coisa de browser — se não rodaria num script Node puro, não é
código de `domain/`.

Convenção por feature:

```
domain/<feature>/
  entities.ts       # tipos de domínio (não confundir com o DTO da API)
  repositories.ts    # interfaces (ex.: UserRepository) — sem implementação
  usecases/
    <acao>.ts          # função pura que recebe o repository por parâmetro
```

Veja o exemplo completo em [../../ARQUITETURA-V3-WEB.md](../../ARQUITETURA-V3-WEB.md).

Ainda sem features migradas para cá — o código atual (chat, grupos, níveis)
continua em `src/utils/` e `src/pages/api/lib/` até ser migrado
incrementalmente, uma feature pequena por vez.
