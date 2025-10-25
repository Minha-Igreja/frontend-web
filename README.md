# Minha Igreja — Frontend Web

Aplicação web construída com Next.js 15 (App Router), React 19 e TypeScript. O projeto oferece uma base de UI com tema claro/escuro, arquitetura em camadas, testes (unitários, integração e E2E) e pipelines de qualidade automatizados.

## Sumário

- O que é
- Requisitos
- Como rodar
- Scripts
- Testes
- Estrutura
- CI/CD
- Contribuição
 - Arquitetura e Regras

## O que é

- Frontend web para “Minha Igreja”, com foco inicial em tema e fundação de design.
- Arquitetura em camadas: `app` (rotas/layout), `view` (componentes), `view-model` (hooks/providers).
- Estilos com Tailwind v4 e tokens CSS; `next-themes` para persistência de tema.

## Requisitos

- Node 20
- Yarn

## Como rodar

Instalação
```
yarn install
```

Desenvolvimento
```
yarn dev
```
Abra `http://localhost:3000` no navegador.

Build/Produção
```
yarn build
yarn start
```

## Scripts

- Lint/Format: `yarn lint`, `yarn lint:fix`, `yarn format`, `yarn format:check`
- Testes unitários: `yarn unit`
- Testes de integração: `yarn integra`
- Cobertura: `yarn coverage` (mínimo global 80%)
- E2E (Playwright): `yarn e2e`, `yarn e2e:update`, `yarn e2e:ui`, `yarn e2e:report`

## Testes

- Jest + Testing Library para unit/integration (JS DOM). Setup em `jest.setup.js`.
- Playwright para E2E com `webServer` (`yarn dev`) e snapshots visuais.
- Dica: snapshots podem variar por SO; o CI gera e mantém os snapshots Linux.

## Estrutura

- `src/app/` — layout, páginas, estilos globais (App Router)
- `src/view/` — componentes e libs utilitárias (Tailwind + CVA)
- `src/view-model/` — hooks/providers (p.ex. tema)
- `e2e/` — testes Playwright e snapshots
- Configs: `jest.config.js`, `playwright.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`

## CI/CD

- E2E (push/PR para `develop`): `.github/workflows/e2e-tests.yml` — instala deps/browsers, gera snapshots Linux se faltarem, executa matriz de browsers e publica artifacts em falhas.
- Atualização manual de snapshots: `.github/workflows/update-snapshots.yml` — workflow dispatch abre PR com imagens atualizadas.
- Hooks Git (Husky):
  - `pre-commit`: unit tests + lint-staged
  - `pre-push`: integração + cobertura ≥ 80%

## Contribuição

Consulte o guia completo em `docs/CONTRIBUTING.md`.

## Stack

- Next.js 15, React 19, TypeScript 5
- Tailwind CSS v4, next-themes, CVA, Radix Slot, lucide-react
- Jest/RTL, Playwright
- ESLint (flat), Prettier, Husky + lint-staged

## Arquitetura e Regras

- Clean Architecture + MVVM com camadas: View → View-Model → Controller → Model.
- View segue Atomic Design (pages no App Router; templates/organisms/molecules/atoms em `src/view/components`).
- Pastas compartilhadas: `shared/` (tipos/utilitários/DTOs) e `config/` (configurações externas).
- Priorizar Server Components, centralizar Client Components, e usar cache (`fetch`/RSC) quando aplicável.
- Regras detalhadas para o agente e para o time em `AGENTS.md`.
