module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  plugins: ['prettier-plugin-organize-imports'],
  importOrder: [
    // 1. React, Next.js e correlatos
    '^react',
    '^next',

    // 2. Libs externas
    '^[a-z]',
    '^@[a-z]',

    // 3. Imports de outras camadas (@/)
    '^@/view-model',
    '^@/controller',
    '^@/model',
    '^@/shared',
    '^@/config',

    // 4. Imports da mesma camada (@/view)
    '^@/view',

    // 5. Imports irmãos e correlatos (relativos)
    '^\\.\\./',
    '^\\.',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};