# AGENTS — Regras e Convenções do Projeto

Escopo: todo o repositório. Este documento define regras que o agente (IA) e humanos devem seguir ao trabalhar neste projeto.

## Arquitetura: Clean Architecture + MVVM

Camadas e responsabilidades:
- View (App Router e componentes):
  - Renderização e interação com o usuário (view “burra”).
  - Não contém regra de negócio.
  - Padrão Atomic Design: pages (em `src/app/**`), e em `src/view/components/**`: templates, organisms, molecules, atoms.
- View-Model:
  - Hooks e providers; expõe actions e stores (estado global), modela dados para a View.
  - Recebe interações da View (hooks/server actions/stores) e repassa ao Controller para obter/alterar dados.
  - Não contém lógica de negócio.
- Controller:
  - Regras de negócio da aplicação.
  - É chamado pelo View-Model; orquestra casos de uso e validações.
  - Obtém dados exclusivamente via Model.
- Model:
  - Responsável por chamadas HTTP, estado HTTP e cache.
  - Usa `fetch` nativo do Next.js, otimizando cacheamento.

Pastas compartilhadas:
- `shared/`: funções, classes, tipos e DTOs que atravessam camadas.
- `config/`: configurações de dependências externas.

## Next.js — Server Components e Cache
- Priorizar Server Components sempre que possível.
- Centralizar Client Components (apenas onde necessário) para otimizar a árvore de renderização.
- Usar cache e recursos do `fetch`/RSC conforme apropriado; componentizar dados com cache quando fizer sentido.

## Estilos
- Tailwind CSS + shadcn/ui para componentes.
- Utilizar tokens e CSS variables definidos em `src/app/globals.css`.

## Regras de Import e Camadas (ESLint)
- `view` não importa `controller`/`model`. Deve consumir somente `view-model`, `shared`, `config` e a própria `view`.
- `view-model` não importa `model` diretamente para regra de negócio; chama `controller` que por sua vez usa `model`.
- `controller` não importa `app`/`view`/`view-model`.
- `model` não importa camadas superiores.

## Processo de Desenvolvimento — TDD com Pair Programming
- Padrão TDD: a IA escreve os testes (unitários/componentes e/ou integração) para cada item solicitado.
- O humano implementa a funcionalidade; a IA se limita a sugerir boas práticas e otimizações.
- Em todo pedido, a IA deve:
  1) Apresentar um plano de ação objetivo (o que será feito e por quê).
  2) Desenvolver os testes correspondentes (sem implementar a feature), prontos para rodar.

## Observações
- As regras acima prevalecem sobre convenções genéricas. Em caso de conflito, seguir este arquivo.

