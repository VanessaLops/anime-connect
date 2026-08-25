// Erro de regra de negócio, lançado dentro de usecases/. Não é um erro de
// transporte (isso é HttpError, em data/http/client.ts) — é uma violação de
// uma regra do domínio (ex.: "não dá pra seguir você mesmo").
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
