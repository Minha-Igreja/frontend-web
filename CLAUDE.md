# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using TypeScript, Tailwind CSS 4, and shadcn/ui components. The project is configured with Yarn as the package manager and uses Turbopack for faster builds.

## Commands

### Development

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build production application with Turbopack
- `yarn start` - Start production server

### Code Quality

- `yarn lint` - Run ESLint on src/
- `yarn lint:fix` - Run ESLint with auto-fix
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting without writing

### Testing

- `yarn test` - Run tests in watch mode
- `yarn unit` - Run only unit tests (*.spec.*)
- `yarn integra` - Run only integration tests (*.test.*)
- `yarn coverage` - Run tests with coverage report
  - Coverage threshold: 80% for branches, functions, lines, and statements

## Architecture

This project enforces a **strict layered architecture** using ESLint import restrictions. The layers flow in one direction only:

```text
app → view → view-model → controller → model
         ↓         ↓           ↓         ↓
                  shared, config
```

### Layer Responsibilities and Import Rules

1. **app/** (Next.js App Router)
   - **Can import**: `view`, `view-model`, `shared`, `config`
   - **Cannot import**: `controller`, `model`
   - **Responsibilities**:
     - Next.js routing and page components
     - Server Components and Client Components
     - Route handlers (API routes)
     - Layout components

2. **view/** (Presentation Layer)
   - **Can import**: `view-model`, `shared`, `config`
   - **Cannot import**: `controller`, `model`
   - **Responsibilities**:
     - All React components (atoms, molecules, organisms, templates)
     - UI components from shadcn/ui
     - Component-specific types and interfaces
     - Visual presentation logic only
   - **Structure**: Follows Atomic Design (see UI Components section)

3. **view-model/** (Presentation Logic Layer)
   - **Can import**: `controller`, `shared`, `config`
   - **Cannot import**: `model`
   - **Responsibilities**:
     - Custom hooks (data fetching, state management, side effects)
     - Server Actions (Next.js actions)
     - State management stores (Zustand, Context, etc.)
     - View-specific business logic
     - Data transformation for presentation
   - **Examples**: `useAuth.ts`, `useUserProfile.ts`, `userStore.ts`, `loginAction.ts`

4. **controller/** (Business Logic Layer)
   - **Can import**: `model`, `shared`, `config`
   - **Cannot import**: `view`, `view-model`, `app`
   - **Responsibilities**:
     - Business rules and validations
     - Application logic orchestration
     - Use case implementations
     - Coordination between multiple models
     - Pure business logic (framework-agnostic)
   - **Examples**: `UserController.ts`, `AuthController.ts`, `PaymentController.ts`

5. **model/** (Data Layer)
   - **Can import**: `shared`, `config`
   - **Cannot import**: `view`, `view-model`, `controller`, `app`
   - **Responsibilities**:
     - External API calls (HTTP clients, REST, GraphQL)
     - Backend communication
     - Database interactions
     - Third-party service integrations
     - Data fetching and persistence
     - External dependencies management
   - **Examples**: `UserRepository.ts`, `apiClient.ts`, `database.ts`, `authService.ts`

6. **shared/** (Shared Utilities)
   - **Can be imported by**: Any layer
   - **Responsibilities**:
     - Helper functions and utilities
     - DTOs (Data Transfer Objects)
     - Validation schemas (Zod, Yup, etc.)
     - Common types and interfaces
     - Constants and enums
     - Pure utility functions usable across all layers
   - **Examples**: `formatters.ts`, `validators.ts`, `UserDTO.ts`, `schemas.ts`, `constants.ts`

7. **config/** (Configuration)
   - **Can be imported by**: Any layer
   - **Responsibilities**:
     - Application configuration
     - Environment variables setup
     - External library configurations
     - Feature flags
     - API endpoints and routes
   - **Examples**: `env.ts`, `apiConfig.ts`, `featureFlags.ts`, `themeConfig.ts`

**IMPORTANT**: ESLint will reject any imports that violate these rules with clear error messages. When adding new features, always respect the layer boundaries.

## Import Organization

Both ESLint and Prettier enforce a specific import order:

1. React and Next.js imports
2. External libraries
3. Internal imports in layer order:
   - `@/view-model`
   - `@/controller`
   - `@/model`
   - `@/shared`
   - `@/config`
   - `@/view` (same layer imports last)
4. Relative imports (`../` then `./`)

Imports are alphabetized within each group with blank lines between groups.

## Path Aliases

The project uses `@/*` as an alias for `src/*`:

```typescript
import { cn } from "@/lib/utils"
```

## UI Components

This project uses shadcn/ui (New York style) with:

- Base color: neutral
- Icon library: lucide-react
- CSS variables enabled
- Component aliases:
  - `@/components` - shadcn components
  - `@/components/ui` - UI primitives
  - `@/lib/utils` - utility functions (including `cn()` for class merging)

### Atomic Design Structure

The project follows the **Atomic Design** methodology for organizing components and pages:

```text
app/
└── [pages]           → Pages (route components)

view/
└── components/
    ├── atoms/        → Smallest UI elements (buttons, inputs, labels, icons)
    ├── molecules/    → Simple combinations of atoms (form fields, search bars)
    ├── organisms/    → Complex UI sections (headers, forms, cards with multiple elements)
    ├── templates/    → Page-level layouts without specific content
    └── ui/           → shadcn/ui components (managed by CLI)
```

#### Component Organization Rules

1. **Pages** (`app/`)
   - Next.js route components
   - Compose templates, organisms, and other components
   - Handle routing and data fetching at page level

2. **Templates** (`view/components/templates/`)
   - Page-level component structures
   - Define layout and content areas
   - Reusable across multiple pages
   - Example: `DashboardTemplate`, `AuthTemplate`

3. **Organisms** (`view/components/organisms/`)
   - Complex components composed of molecules and atoms
   - Represent distinct sections of the interface
   - Example: `LoginForm`, `NavigationBar`, `UserProfileCard`

4. **Molecules** (`view/components/molecules/`)
   - Simple groups of atoms functioning together
   - Form fields, search bars, card headers
   - Example: `FormField`, `SearchInput`, `CardHeader`

5. **Atoms** (`view/components/atoms/`)
   - Basic building blocks that can't be broken down further
   - Buttons, inputs, labels, icons, text elements
   - Example: `Button`, `Input`, `Label`, `Icon`, `Text`

6. **UI Components** (`view/components/ui/`)
   - Components installed and managed by shadcn/ui CLI
   - Base UI primitives styled with Tailwind CSS
   - Do not manually create files here - use `npx shadcn@latest add [component]`

**IMPORTANT**: When creating new components, AI must:

- Classify the component according to Atomic Design principles
- Place it in the correct folder based on its complexity and composition
- Never manually create components in the `ui/` folder (reserved for shadcn/ui CLI)
- Follow the layered architecture import rules (view layer restrictions still apply)

## Development Workflow

### CRITICAL - TDD (Test-Driven Development) is MANDATORY

This project follows a **strict TDD approach**. The AI must NEVER implement code directly unless explicitly requested by the developer.

### Workflow Rules for AI

1. **Always Create an Operational Plan First**
   - When asked to perform any task, create a detailed plan following the existing system patterns
   - Use the TodoWrite tool to track all planned tasks
   - Break down the work into clear, actionable steps

2. **TDD Approach for All Implementations**
   - When asked to "implement" a page/component/hook/store/class/function/method, the AI must:
     - Create a comprehensive operational plan
     - Include TDD steps: write tests FIRST, then implementation
     - **AI ONLY writes the test files** (`*.spec.ts`, `*.spec.tsx`, `*.test.ts`, `*.test.tsx`)
     - **Developer implements the actual code** to make tests pass

3. **AI's Role During Implementation**
   - **WRITE**: Test files only
   - **PROVIDE**: Advice on best practices and implementation approaches
   - **NEVER**: Implement the actual component/function/class unless:
     - Developer explicitly and literally requests it
     - Request specifies exactly which part to implement
     - This is the ONLY exception to the rule

### Example Workflow

```text
Developer: "Implement a login form component"

AI Response:
1. Creates TodoWrite plan:
   - Analyze requirements and layered architecture placement
   - Create test file: src/view/components/LoginForm.spec.tsx
   - [DEVELOPER] Implement LoginForm component
   - [DEVELOPER] Run tests and iterate until passing
   - Review and provide feedback on implementation

2. AI writes the test file with comprehensive test cases
3. AI provides guidance on best practices for implementation
4. Developer implements the component
5. AI reviews and suggests improvements
```

### When AI Can Implement Code

- Configuration files (non-production code)
- Documentation
- Test files (this is AI's responsibility)
- Explicitly requested specific implementations with exact scope

## Testing Strategy

### Test Types and Naming Conventions

This project follows **strict test naming conventions** based on test type. AI must always use the correct extension and follow the scope definitions.

#### 1. Component Tests (`.spec.tsx`)

**Purpose**: Test only the behavior and functionality of an isolated component (React), without testing styles or visual layout.

**File Extension**: `.spec.tsx`

**Must Cover**:

- Conditional rendering based on props or state
- Interaction events (click, typing, submit, etc.)
- Function or handler calls

**Must NOT Cover**:

- Colors, sizes, CSS classes, or visual styles
- Layout appearance

**Tools**: Jest + @testing-library/react (RTL)

**Examples**:

```text
Button.spec.tsx
LoginForm.spec.tsx
UserCard.spec.tsx
```

#### 2. Unit Tests (`.spec.ts`)

**Purpose**: Test pure functions, hooks, services, utilities, or isolated methods without external dependencies.

**File Extension**: `.spec.ts`

**Must Cover**:

- Business rules and calculations
- Expected outputs for different inputs
- Error handling and invalid values

**Must NOT Cover**:

- Interactions between modules or layers
- Real API calls

**Tools**: Jest

**Examples**:

```text
formatDate.spec.ts
calculateDiscount.spec.ts
useLoginViewModel.spec.ts
validateEmail.spec.ts
```

#### 3. Integration Tests (`.test.ts` / `.test.tsx`)

**Purpose**: Test the interaction between two or more parts of the system, verifying that modules work correctly together.

**File Extension**: `.test.ts` or `.test.tsx`

**Must Cover**:

- Communication between layers (e.g., controller → model)
- Integration between view → view-model → controller (in MVVM)
- Real flows with partially mocked dependencies
- End-to-end user flows within the application
- API endpoint testing

**Must NOT Cover**:

- Internal rules of each isolated unit
- Component appearance

**Tools**: Supertest (for API/HTTP testing)

**Examples**:

```text
UserFlow.test.ts
LoginIntegration.test.ts
PaymentController.test.ts
UserRegistration.test.tsx
```

### Test Convention Summary

| Test Type | Extension/Suffix | Primary Focus | Isolation Level | Tools |
|-----------|------------------|---------------|-----------------|-------|
| Unit | `.spec.ts` | Isolated logic | Maximum | Jest |
| Component | `.spec.tsx` | UI behavior | Medium | Jest + RTL |
| Integration | `.test.ts` / `.test.tsx` | Module communication | Minimum | Supertest |

### AI Behavior for Testing

When creating tests, the AI must:

1. **Always use the correct extension** based on test type
2. **Follow scope definitions** strictly - never mix test types in the same file
3. **Explain test objective** and scope before showing code (unless developer specifies otherwise)
4. **Never mix test types** in the same file
5. **Generate comprehensive test cases** covering happy path, edge cases, and error scenarios
6. **Follow AAA pattern**: Arrange, Act, Assert

### Test Environment

- Test environment: jsdom
- Coverage threshold: 80% for branches, functions, lines, and statements
- Coverage excludes:
  - Type definitions (`*.d.ts`)
  - Most app router files (except `page.tsx`)
  - UI component library (`view/components/ui/`)
  - Assets and lib folders
  - Config files

## Git Workflow

The project uses Husky and lint-staged for pre-commit hooks:

- Runs ESLint with `--max-warnings 0` (no warnings allowed)
- Runs Prettier to format code
- Only checks staged files matching `src/**/*.{js,jsx,ts,tsx}`

## TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- Module resolution: bundler
- Path alias: `@/*` → `src/*`
