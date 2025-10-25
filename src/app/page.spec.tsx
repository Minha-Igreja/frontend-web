import { redirect } from 'next/navigation';

import Page from './page';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Root Page', () => {
  beforeEach(() => {
    (redirect as unknown as jest.Mock).mockClear();
  });

  it('redireciona imediatamente para /auth/signup', () => {
    Page();

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith('/signup');
  });
});
