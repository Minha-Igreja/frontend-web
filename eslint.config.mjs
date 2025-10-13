import importPlugin from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // ❌ CONTROLE RIGOROSO DE CAMADAS
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // app só pode importar: view, view-model, shared, config
            {
              target: "./src/app/**/*",
              from: "./src/controller/**/*",
              message: "❌ app NÃO pode importar 'controller'. Use 'view-model'."
            },
            {
              target: "./src/app/**/*",
              from: "./src/model/**/*",
              message: "❌ app NÃO pode importar 'model'. Use 'view-model'."
            },

            // view só pode importar: view-model, shared, config
            {
              target: "./src/view/**/*",
              from: "./src/controller/**/*",
              message: "❌ view NÃO pode importar 'controller'. Use 'view-model'."
            },
            {
              target: "./src/view/**/*",
              from: "./src/model/**/*",
              message: "❌ view NÃO pode importar 'model'. Use 'view-model'."
            },

            // view-model só pode importar: controller, shared, config
            {
              target: "./src/view-model/**/*",
              from: "./src/model/**/*",
              message: "❌ view-model NÃO pode importar 'model'. Use 'controller'."
            },

            // controller só pode importar: model, shared, config
            {
              target: "./src/controller/**/*",
              from: "./src/view/**/*",
              message: "❌ controller NÃO pode importar 'view'."
            },
            {
              target: "./src/controller/**/*",
              from: "./src/view-model/**/*",
              message: "❌ controller NÃO pode importar 'view-model'."
            },
            {
              target: "./src/controller/**/*",
              from: "./src/app/**/*",
              message: "❌ controller NÃO pode importar 'app'."
            },

            // model só pode importar: shared, config
            {
              target: "./src/model/**/*",
              from: "./src/view/**/*",
              message: "❌ model NÃO pode importar 'view'."
            },
            {
              target: "./src/model/**/*",
              from: "./src/view-model/**/*",
              message: "❌ model NÃO pode importar 'view-model'."
            },
            {
              target: "./src/model/**/*",
              from: "./src/controller/**/*",
              message: "❌ model NÃO pode importar 'controller'."
            },
            {
              target: "./src/model/**/*",
              from: "./src/app/**/*",
              message: "❌ model NÃO pode importar 'app'."
            },
          ],
        },
      ],

      // ✅ ORGANIZAÇÃO PERFEITA DE IMPORTS POR CAMADAS
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"], // React, Next.js, libs externas
            "internal",              // @/... (todas as camadas)
            ["parent", "sibling"],   // ../ e ./
          ],
          "newlines-between": "always",
          pathGroups: [
            // 1. React, Next.js primeiro
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "next/**",
              group: "external",
              position: "before",
            },
            // 2. Outras camadas (view-model, controller, model, shared, config)
            {
              pattern: "@/view-model/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/controller/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/model/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/shared/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/config/**",
              group: "internal",
              position: "before",
            },
            // 3. Mesma camada (view)
            {
              pattern: "@/view/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];