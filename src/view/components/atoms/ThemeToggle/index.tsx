'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/view-model/hooks/useTheme';

import { Button } from '@/view/components/ui/button';

export const ThemeToggle = () => {
  const { setTheme } = useTheme();

  const toggleTheme = () => {
    // Lê o tema atual direto do DOM (next-themes já sincronizou)
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Alternar tema"
      className="relative"
      onClick={toggleTheme}
      suppressHydrationWarning
    >
      {/* Sun visível no light mode, escondido no dark mode */}
      <Sun
        className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        aria-hidden="true"
      />

      {/* Moon escondido no light mode, visível no dark mode */}
      <Moon
        className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        aria-hidden="true"
      />

      <span className="sr-only">Alternar tema</span>
    </Button>
  );
};
