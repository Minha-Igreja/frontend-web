import { render, screen } from '@testing-library/react';

import AuthLayout from './layout';

describe('AuthLayout', () => {
  it('renderiza a camada de background dedicada ao grupo auth', () => {
    render(
      <AuthLayout>
        <p>child</p>
      </AuthLayout>
    );

    const background = screen.getByTestId('auth-layout-background');

    expect(background).toBeInTheDocument();
    expect(background).toHaveAttribute('aria-hidden', 'true');
  });

  it('garante que o conteúdo filho permaneça disponível para interação', () => {
    render(
      <AuthLayout>
        <button type="button">Sign up</button>
      </AuthLayout>
    );

    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });
});
