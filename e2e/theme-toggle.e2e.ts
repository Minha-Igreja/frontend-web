import { test, expect } from '@playwright/test';

test.describe('Theme Toggle - Persistência de Tema', () => {
  test.beforeEach(async ({ page }) => {
    // Limpa o localStorage antes de ir para a página
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('usuário deve poder trocar o tema da aplicação entre claro e escuro', async ({ page }) => {
    // ========================================
    // CENÁRIO: Trocar tema e verificar aplicação completa
    // ========================================

    // 1. Verifica estado inicial (light theme)
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    // 2. Localiza e clica no botão de toggle
    const themeToggle = page.getByRole('button', { name: /alternar tema/i });
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();

    // 3. Aguarda a classe 'dark' ser aplicada
    await expect(html).toHaveClass(/dark/);

    // 4. Verifica persistência no localStorage
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('dark');

    // 5. Volta para light theme
    await themeToggle.click();
    await expect(html).not.toHaveClass(/dark/);

    // 6. Verifica que localStorage foi atualizado
    const updatedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(updatedTheme).toBe('light');
  });

  test('aplicação como um TODO muda de tema visualmente - light para dark', async ({ page }) => {
    // ========================================
    // CENÁRIO: Verificar mudança visual COMPLETA da aplicação
    // ========================================

    // 1. Aguarda página carregar completamente em light mode
    await page.waitForLoadState('domcontentloaded');

    // 2. Screenshot da aplicação inteira em LIGHT mode
    await expect(page).toHaveScreenshot('aplicacao-tema-light.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // 3. Clica para mudar para DARK mode
    const themeToggle = page.getByRole('button', { name: /alternar tema/i });
    await themeToggle.click();

    // 4. Aguarda transição CSS completar
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // 5. Screenshot da aplicação inteira em DARK mode
    await expect(page).toHaveScreenshot('aplicacao-tema-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('header e componentes principais mudam de tema visualmente', async ({ page }) => {
    // ========================================
    // CENÁRIO: Verificar componentes-chave mudam visualmente
    // ========================================

    await page.waitForLoadState('domcontentloaded');

    // 1. Screenshot do header em light mode
    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header-light.png', {
      animations: 'disabled',
    });

    // 2. Screenshot do body em light mode
    const body = page.locator('body');
    await expect(body).toHaveScreenshot('body-light.png', {
      animations: 'disabled',
    });

    // 3. Muda para dark mode
    const themeToggle = page.getByRole('button', { name: /alternar tema/i });
    await themeToggle.click();

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // Aguarda um momento para garantir que as transições CSS finalizaram
    await page.waitForTimeout(100);

    // 4. Screenshot do header em dark mode (deve ser DIFERENTE)
    await expect(header).toHaveScreenshot('header-dark.png', {
      animations: 'disabled',
    });

    // 5. Screenshot do body em dark mode (deve ser DIFERENTE)
    await expect(body).toHaveScreenshot('body-dark.png', {
      animations: 'disabled',
    });
  });

  test('tema escolhido deve ficar como padrão sempre que abrir o site', async ({ page }) => {
    // ========================================
    // CENÁRIO: Persistência entre sessões
    // ========================================

    // 1. Muda para dark theme
    const themeToggle = page.getByRole('button', { name: /alternar tema/i });
    await themeToggle.click();

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // 2. Simula fechar e reabrir o site
    await page.reload({ waitUntil: 'domcontentloaded' });

    // 3. Verifica que o tema PERMANECE dark
    await expect(html).toHaveClass(/dark/);

    // 4. Verifica localStorage ainda tem o tema
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('dark');

    // 5. Screenshot visual - garante que VISUALMENTE está dark
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveScreenshot('persistencia-tema-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('tema persiste ao navegar entre páginas diferentes', async ({ page, context }) => {
    // ========================================
    // CENÁRIO: Persistência durante navegação
    // ========================================

    // 1. Define tema como dark
    const themeToggle = page.getByRole('button', { name: /alternar tema/i });
    await themeToggle.click();

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // 2. Abre nova aba (mesma sessão/localStorage)
    const newPage = await context.newPage();
    await newPage.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // 3. Verifica que a NOVA página também está em dark
    const newHtml = newPage.locator('html');
    await expect(newHtml).toHaveClass(/dark/);

    // 4. Screenshot visual da nova aba - garante tema aplicado
    await newPage.waitForLoadState('domcontentloaded');
    await expect(newPage).toHaveScreenshot('nova-aba-tema-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });

    await newPage.close();
  });

  test('tema light é o padrão para novos usuários', async ({ page }) => {
    // ========================================
    // CENÁRIO: Primeira visita ao site
    // ========================================

    // localStorage já foi limpo no beforeEach
    const html = page.locator('html');

    // Verifica que NÃO tem classe dark
    await expect(html).not.toHaveClass(/dark/);

    // Screenshot visual - garante que tema padrão é VISUALMENTE light
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveScreenshot('tema-padrao-light.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('transição entre temas deve ser instantânea e visualmente consistente', async ({ page }) => {
    // ========================================
    // CENÁRIO: Performance e consistência visual
    // ========================================

    const html = page.locator('html');
    const themeToggle = page.getByRole('button', { name: /alternar tema/i });

    await page.waitForLoadState('domcontentloaded');

    // 1. Screenshot inicial (light)
    await expect(page).toHaveScreenshot('transicao-01-light.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // 2. Primeira troca: Light -> Dark
    await themeToggle.click();
    await expect(html).toHaveClass(/dark/);

    await expect(page).toHaveScreenshot('transicao-02-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // 3. Segunda troca: Dark -> Light
    await themeToggle.click();
    await expect(html).not.toHaveClass(/dark/);

    await expect(page).toHaveScreenshot('transicao-03-light.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // 4. Terceira troca: Light -> Dark novamente
    await themeToggle.click();
    await expect(html).toHaveClass(/dark/);

    await expect(page).toHaveScreenshot('transicao-04-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // 5. Verifica estado final no localStorage
    const finalTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(finalTheme).toBe('dark');
  });
});
