import { ThemeProvider } from '@/view-model/providers/ThemeProvider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
