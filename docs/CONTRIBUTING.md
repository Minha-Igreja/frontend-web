# Contribuindo para "Minha Igreja" (Frontend Web)

Este documento orienta como instalar, desenvolver, testar e contribuir com qualidade e consistência neste projeto.

- Stack: Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, next-themes, Jest/RTL, Playwright.
- Node/Yarn: Node 20 e Yarn; lockfile `yarn.lock` para builds reprodutíveis.

## 1. Arquitetura (Clean Architecture + MVVM)

Camadas e responsabilidades
- App (Next.js): páginas, layout raiz e providers globais (`src/app/`).
- View (UI): componentes visuais e utilitários (`src/view/**`). View “burra”: apenas renderiza e interage.
- View-Model: hooks/providers; expõe actions e stores (estado global), modela dados para a View, recebe interações e repassa ao Controller; não contém regra de negócio.
- Controller: concentra regras de negócio, é chamado pelo View-Model; obtém dados via Model.
- Model: chamadas HTTP, estado HTTP e cache; usa `fetch` nativo do Next.js para otimização de cache.

Pastas compartilhadas
- `shared/`: funções, classes, tipos e DTOs que cruzam camadas.
- `config/`: arquivos de configuração de dependências externas.

Regras de importação (ESLint)
- `app` não pode importar `controller`/`model`.
- `view` não pode importar `controller`/`model`; consuma `view-model`, `shared`, `config`.
- `view-model` não importa `model` para regra de negócio; chama `controller`.
- `controller` não importa `app`/`view`/`view-model`.
- `model` não importa camadas superiores.

Atomic Design
- Pages: `src/app/**` (páginas do App Router).
- Em `src/view/components/**`: templates, organisms, molecules, atoms.

Tema (Light/Dark)
- Provider: `src/view-model/providers/ThemeProvider.tsx` usa `next-themes` com `attribute="class"`.
- Hook: `src/view-model/hooks/useTheme.ts` expõe `{ theme, setTheme }`.
- Toggle: `src/view/components/atoms/ThemeToggle/` alterna tema baseado na classe `dark` no `<html>`.
- Tokens: definidos em `src/app/globals.css` via CSS custom properties e mapeados no Tailwind v4.

## 2. Setup do Ambiente

Pré-requisitos
- Node 20
- Yarn

Instalação
```
yarn install
```

Executar em desenvolvimento
```
yarn dev
```
Abre em `http://localhost:3000`.

Build e produção
```
yarn build
yarn start
```

## 3. Convenções de Código

- TypeScript estrito; caminhos `@/*` (configure seu editor para ler `tsconfig.json`).
- Estilo: Prettier; execute `yarn format`/`yarn format:check`.
- ESLint (flat config): regras de camadas e `import/order` — mantenha imports em ordem e respeite zones.
- UI com Tailwind v4 e shadcn/ui; use tokens (`bg-background`, `text-foreground`, etc.) para compatibilidade com temas.
- Variantes de componentes com CVA (ex.: `button.tsx`) quando precisar de variações.
- Acessibilidade: use roles/labels, foco visível e semântica (`<header/>`, `<main/>`, etc.).

Next.js — Server Components e Cache
- Priorize Server Components quando possível.
- Centralize Client Components (somente onde necessário) para otimizar renderização.
- Utilize cache (`fetch`/RSC) quando fizer sentido para componentes e dados.

## 4. Estrutura de Pastas (resumo prático)

- `src/app/` — layout, páginas, estilos globais (App Router).
- `src/view/` — componentes (atoms/organisms/ui) e libs utilitárias.
- `src/view-model/` — hooks/providers (p.ex. tema).
- `e2e/` — testes E2E Playwright e snapshots.
- Configurações principais: `jest.config.js`, `playwright.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`.

## 5. Scripts Úteis

- Desenvolvimento: `yarn dev`
- Build/Start: `yarn build` / `yarn start`
- Qualidade: `yarn lint`, `yarn lint:fix`, `yarn format`, `yarn format:check`
- Testes:
  - Unitários: `yarn unit` (arquivos `*.spec.*`)
  - Integração: `yarn integra` (arquivos `*.test.*`)
  - Cobertura: `yarn coverage` (threshold global 80%)
  - E2E: `yarn e2e`, `yarn e2e:update`, `yarn e2e:ui`, `yarn e2e:report`

## 6. Fluxo de Trabalho (Git, Hooks, CI, TDD)

Husky
- Pre-commit: roda `yarn unit --passWithNoTests` e `lint-staged` (ESLint + Prettier nos arquivos staged).
- Pre-push: roda `yarn integra --passWithNoTests` e `yarn coverage` (bloqueia push se cobertura < 80%).

CI (GitHub Actions)
- `.github/workflows/e2e-tests.yml` (push/PR para `develop`):
  - Instala Node 20, deps e browsers Playwright.
  - Verifica snapshots Linux por browser; se faltarem, gera e comita `*-linux.png` automaticamente.
  - Executa a suíte E2E em `chromium`, `firefox` e `webkit`. Publica artifacts (relatório, screenshots, vídeos) em caso de falha.
- `.github/workflows/update-snapshots.yml` (manual):
  - Atualiza snapshots no Linux para um browser específico ou todos e abre PR com as imagens.

TDD com Pair Programming
- Solicitações de feature/refactor seguem TDD: a IA escreve os testes (unitários/componentes e/ou integração) primeiro; o humano implementa.
- A IA não implementa a feature; sugere boas práticas e otimizações.
- Toda solicitação deve iniciar com um plano de ação objetivo (o que será feito e por quê) e, em seguida, os testes.

Branches e PRs (sugestão)
- Nomeie branches de feature como `feat/<escopo>`; correções como `fix/<escopo>`; chores como `chore/<escopo>`.
- Abra PRs pequenos, com descrição clara, checklist e referência a issues quando aplicável.

## 7. Adicionando Funcionalidades

Nova Página (App Router)
- Crie `src/app/<rota>/page.tsx` e use componentes da camada `view`.
- O layout raiz já fornece `<Providers>` e `<Header>`.

Novo Componente UI
- Crie em `src/view/components/{atoms|molecules|organisms}/Nome/` e exporte via `index.tsx`.
- Adicione teste unitário: `Nome.spec.tsx`.
- Estilize com Tailwind e considere CVA quando houver variações.

Novo Hook/Provider
- Adicione em `src/view-model/{hooks|providers}`.
- Exponha API simples e documente com JSDoc.

## 8. Testes

Unitários/Integração (Jest + Testing Library)
- Ambiente: `jest-environment-jsdom`; setup em `jest.setup.js` (inclui `whatwg-fetch`).
- Cobertura: threshold global 80% (ver `jest.config.js`).
- Exemplos existentes: hook `useTheme` e organismo `Header`.

E2E (Playwright)
- Config: `playwright.config.ts` (usa `yarn dev` como `webServer`).
- Regressão visual: `toHaveScreenshot` com tolerâncias para diferenças cross-platform.
- Atualizar snapshots localmente: `yarn e2e:update` (atenção: seus snapshots podem divergir dos do Linux do CI).
- Atualizar snapshots no CI: rode o workflow manual “Update E2E Snapshots” ou deixe o `e2e-tests.yml` gerar e commitar na primeira execução.

## 9. Padrões de Commit e Revisão (sugestão)

- Commits descritivos (ex.: Conventional Commits) ajudam na geração de changelogs.
- PR Checklist:
  - [ ] Respeita camadas e aliases
  - [ ] Testes unitários/integração adicionados/ajustados
  - [ ] E2E atualizado (quando necessário)
  - [ ] Lint/format passam
  - [ ] Cobertura ≥ 80%

## 10. Troubleshooting

- Regressão visual falhando no CI: atualize snapshots no Linux via workflow manual ou deixe o CI comitar os `*-linux.png`.
- Porta 3000 em uso no E2E: feche processos locais ou ajuste `PLAYWRIGHT_BASE_URL`.
- Erros ESLint de camadas: mova lógicas para `view-model`; `view` não pode importar `controller`/`model`.
- Cobertura < 80% no pre-push: adicione testes ou revise escopo de coleta (quando justificável) em `jest.config.js`.

## 11. Segurança e Privacidade

- Não comite segredos. Use variáveis de ambiente quando integrações forem adicionadas (documente-as no README).
- Dependências: mantenha atualizações de segurança via PRs dedicados.

## 12. Contato e Suporte

- Abra uma issue descrevendo o problema/feature com passos de reprodução e contexto.

