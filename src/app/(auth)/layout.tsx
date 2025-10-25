import { AUTH_BACKGROUND_IMAGE } from '@/shared/constants/auth';

import { Header } from '@/view/components/organisms/Header';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen bg-background">
      <div
        data-testid="auth-layout-background"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50 dark:opacity-25"
        style={{ backgroundImage: `url(${AUTH_BACKGROUND_IMAGE})` }}
      />

      <Header />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
