import { render, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test component that uses the auth context
function TestComponent() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="token">{auth.token || 'no-token'}</div>
      <div data-testid="user">{JSON.stringify(auth.user)}</div>
      <button onClick={() => auth.login('test@example.com', 'password')}>Login</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('provides initial null state', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('token').textContent).toBe('no-token');
    expect(getByTestId('user').textContent).toBe('null');
  });

  it('loads stored token and user from localStorage', () => {
    const storedToken = 'stored-token';
    const storedUser = { id: 1, email: 'test@example.com' };
    
    mockLocalStorage.getItem
      .mockImplementation((key) => {
        if (key === 'token') return storedToken;
        if (key === 'user') return JSON.stringify(storedUser);
        return null;
      });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('token').textContent).toBe(storedToken);
    expect(JSON.parse(getByTestId('user').textContent)).toEqual(storedUser);
  });

  it('handles successful login', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        access_token: 'test-token',
        user: { id: 1, email: 'test@example.com' }
      })
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      getByText('Login').click();
    });

    await waitFor(() => {
      expect(getByTestId('token').textContent).toBe('test-token');
      expect(JSON.parse(getByTestId('user').textContent)).toEqual({
        id: 1,
        email: 'test@example.com'
      });
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ id: 1, email: 'test@example.com' })
    );
  });

  it('handles login failure', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Mock fetch to return an error
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      })
    );

    // Expect the login to fail
    await expect(
      result.current.login('test@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid credentials');

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles logout', async () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      getByText('Logout').click();
    });

    expect(getByTestId('token').textContent).toBe('no-token');
    expect(getByTestId('user').textContent).toBe('null');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
  });
}); 