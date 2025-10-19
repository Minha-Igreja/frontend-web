import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E
 * Otimizado para performance e velocidade
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Diretório onde os testes E2E estão localizados
  testDir: './e2e',

  // Padrão de arquivos de teste E2E
  testMatch: '**/*.e2e.ts',

  // Timeout por teste (reduzido para forçar testes rápidos)
  timeout: 30000,

  // Timeout para expects (asserções)
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      // Permite diferença de até 0.05 (5%) dos pixels para cross-platform
      // (Windows vs Linux renderizam fontes e anti-aliasing diferentes)
      maxDiffPixelRatio: 0.05,
      // Threshold para diferenças de pixel individuais
      threshold: 0.2,
    },
  },

  // Executa testes em paralelo (MÁXIMA PERFORMANCE)
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry apenas em CI
  retries: process.env.CI ? 2 : 0,

  // Workers: máximo paralelismo local, serial em CI
  workers: process.env.CI ? 1 : '100%',

  // Reporter: apenas essencial
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // Configurações compartilhadas para PERFORMANCE
  use: {
    // Base URL
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Trace apenas em retry (economiza espaço)
    trace: 'on-first-retry',

    // Screenshot apenas em falha
    screenshot: 'only-on-failure',

    // Vídeo apenas em falha
    video: 'retain-on-failure',

    // Desabilita animações CSS (MAIS RÁPIDO)
    hasTouch: false,

    // Navegação otimizada
    navigationTimeout: 10000,
    actionTimeout: 5000,

    // Locale e timezone para consistência
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  },

  // APENAS 3 BROWSERS PRINCIPAIS (Chrome, Firefox, Safari)
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Otimizações específicas do Chrome
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
          ],
        },
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // Firefox otimizado
        launchOptions: {
          firefoxUserPrefs: {
            'dom.animations-api.autoremove.enabled': false,
          },
        },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        // Safari (WebKit) otimizado
      },
    },
  ],

  // Inicia servidor dev de forma otimizada
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60000, // Reduzido de 120s
    stdout: 'ignore', // Não mostra logs do servidor (mais limpo)
    stderr: 'pipe',
  },
});
