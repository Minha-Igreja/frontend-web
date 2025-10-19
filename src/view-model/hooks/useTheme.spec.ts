import { act, renderHook } from '@testing-library/react';

import { useTheme } from './useTheme';

// Mock do next-themes
const mockSetTheme = jest.fn();
const mockUseNextTheme = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: () => mockUseNextTheme(),
}));

describe('useTheme Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Theme State', () => {
    it('should provide current theme value', () => {
      mockUseNextTheme.mockReturnValue({
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');
    });

    it('should update theme value when theme changes', () => {
      mockUseNextTheme.mockReturnValue({
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
      });

      const { result, rerender } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');

      // Simula mudança de tema
      mockUseNextTheme.mockReturnValue({
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
      });

      rerender();
      expect(result.current.theme).toBe('dark');
    });

    it('should handle undefined theme during initialization', () => {
      mockUseNextTheme.mockReturnValue({
        resolvedTheme: undefined,
        setTheme: mockSetTheme,
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBeUndefined();
    });
  });

  describe('Theme Change', () => {
    it('should allow changing theme to dark', () => {
      mockUseNextTheme.mockReturnValue({
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('should allow changing theme to light', () => {
      mockUseNextTheme.mockReturnValue({
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('should handle multiple theme changes', () => {
      mockUseNextTheme.mockReturnValue({
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
        result.current.setTheme('light');
        result.current.setTheme('dark');
      });

      expect(mockSetTheme).toHaveBeenCalledTimes(3);
    });
  });

  describe('Hook API', () => {
    it('should return theme and setTheme', () => {
      mockUseNextTheme.mockReturnValue({
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current).toEqual({
        theme: expect.any(String),
        setTheme: expect.any(Function),
      });
    });
  });
});
