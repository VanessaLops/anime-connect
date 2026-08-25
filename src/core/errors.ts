import { DomainError } from "@/domain/shared/errors";
import { HttpError } from "@/data/http/client";

// Traduz um erro de domain/ ou data/ numa mensagem segura de mostrar na UI.
// Screens/hooks chamam isto no catch, em vez de expor error.message direto.
export function toUserMessage(error: unknown): string {
  if (error instanceof DomainError) return error.message;
  if (error instanceof HttpError) {
    if (error.status === 401 || error.status === 403) {
      return "Você não tem permissão pra fazer isso.";
    }
    return "Não foi possível completar a ação. Tente de novo.";
  }
  return "Algo deu errado. Tente de novo.";
}
