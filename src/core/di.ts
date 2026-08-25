// Monta os repositories concretos (com o client/base URL certos) e injeta
// nas screens/hooks. Ainda vazio — sem features migradas pra domain/+data/.
//
// Quando a primeira feature migrar, fica assim:
//
//   import { httpClient } from "@/data/http/client";
//   import { RestUserRepository } from "@/data/social/user-repository";
//
//   export const di = {
//     userRepo: new RestUserRepository(httpClient),
//   };
//
// e a screen/hook lê `di.userRepo` em vez de instanciar o repository direto.

export const di = {};
