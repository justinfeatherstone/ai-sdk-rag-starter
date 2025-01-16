import { fetchWithAuth } from '../utils/api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('fetchWithAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds authorization header when token is provided', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: 'test' })
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await fetchWithAuth('/api/test', {
      token: 'test-token'
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
  });

  it('does not add authorization header when token is not provided', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: 'test' })
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await fetchWithAuth('/api/test');

    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });

  it('handles successful response', async () => {
    const mockData = { data: 'test' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockData)
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    const result = await fetchWithAuth('/api/test');
    expect(result).toEqual(mockData);
  });

  it('throws error on failed response with error detail', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ detail: 'Test error' })
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await expect(fetchWithAuth('/api/test')).rejects.toThrow('Test error');
  });

  it('throws error on failed response with generic error', async () => {
    const mockResponse = {
      ok: false,
      statusText: 'Not Found',
      json: () => Promise.reject()
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await expect(fetchWithAuth('/api/test')).rejects.toThrow('Not Found');
  });

  it('merges custom headers with default headers', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: 'test' })
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await fetchWithAuth('/api/test', {
      headers: {
        'Custom-Header': 'test'
      }
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      headers: {
        'Content-Type': 'application/json',
        'Custom-Header': 'test'
      }
    });
  });

  it('passes through other fetch options', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: 'test' })
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    await fetchWithAuth('/api/test', {
      method: 'POST',
      body: JSON.stringify({ test: true })
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      body: JSON.stringify({ test: true }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
}); 