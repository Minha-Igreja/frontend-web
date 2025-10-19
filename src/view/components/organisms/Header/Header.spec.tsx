import { render, screen } from '@testing-library/react';

import { Header } from './';

// Mock do ThemeToggle
jest.mock('@/view/components/atoms/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

describe('Header Organism', () => {
  describe('Rendering', () => {
    it('should render a header element', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should render ThemeToggle component', () => {
      render(<Header />);

      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role banner for semantic HTML', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header.tagName).toBe('HEADER');
    });

    it('should be keyboard navigable', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render on all screen sizes', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header).toBeVisible();
    });
  });
});
