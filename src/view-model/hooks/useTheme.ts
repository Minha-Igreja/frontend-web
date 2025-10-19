import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { resolvedTheme, setTheme } = useNextTheme();
  return {
    theme: resolvedTheme as 'light' | 'dark' | undefined,
    setTheme: (newTheme: 'light' | 'dark') => setTheme(newTheme),
  };
};
