import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeToggle } from './';

// Mock do hook useTheme
const mockSetTheme = jest.fn();

jest.mock('@/view-model/hooks/useTheme', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.documentElement.className = '';
  });

  describe('Rendering', () => {
    it('should render a button', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have accessible label for screen readers', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: /alternar tema/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Theme Toggle Behavior', () => {
    it('should toggle from light to dark mode', async () => {
      // Simula que o app está em light mode
      document.documentElement.classList.remove('dark');

      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('should toggle from dark to light mode', async () => {
      // Simula que o app está em dark mode
      document.documentElement.classList.add('dark');

      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('should call setTheme on each click', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');

      await user.click(button);
      expect(mockSetTheme).toHaveBeenCalledTimes(1);

      await user.click(button);
      expect(mockSetTheme).toHaveBeenCalledTimes(2);

      await user.click(button);
      expect(mockSetTheme).toHaveBeenCalledTimes(3);
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should be focusable via keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');

      await user.tab();

      expect(button).toHaveFocus();
    });

    it('should toggle theme when activated with Enter key', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{Enter}');

      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('should toggle theme when activated with Space key', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard(' ');

      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Interaction', () => {
    it('should respond to multiple user interactions', async () => {
      document.documentElement.classList.remove('dark');

      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');

      // Primeiro clique: light -> dark
      await user.click(button);
      expect(mockSetTheme).toHaveBeenLastCalledWith('dark');

      // Simula que next-themes aplicou a mudança
      document.documentElement.classList.add('dark');

      // Segundo clique: dark -> light
      await user.click(button);
      expect(mockSetTheme).toHaveBeenLastCalledWith('light');
    });
  });
});
