import { ThemeToggle } from '@/view/components/atoms/ThemeToggle';

export const Header = () => {
  return (
    <header className="flex justify-end items-center p-4">
      <ThemeToggle />
    </header>
  );
};
