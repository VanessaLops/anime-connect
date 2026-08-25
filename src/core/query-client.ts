// Instância do React Query/SWR, se o projeto passar a usar uma lib de cache
// de servidor. Nenhuma das duas está instalada ainda — instale a que
// escolher (`npm i @tanstack/react-query` ou `npm i swr`) e descomente.
//
// Exemplo com React Query:
//
//   import { QueryClient } from "@tanstack/react-query";
//
//   export const queryClient = new QueryClient({
//     defaultOptions: {
//       queries: { staleTime: 60_000, retry: 1 },
//     },
//   });
//
// Depois envolva a árvore em src/app/layout.tsx com <QueryClientProvider>.
export {};
