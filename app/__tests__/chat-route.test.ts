import { NextResponse } from 'next/server';
import { POST } from '../api/chat/route';
import { headers } from 'next/headers';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the next/headers module
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map([['authorization', 'Bearer test-token']]))
}));

// Mock next/server
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({
      status: init?.status || 200,
      ok: init?.status ? init.status >= 200 && init.status < 300 : true,
      json: () => Promise.resolve(data),
      headers: new Headers({
        'content-type': 'application/json',
        ...(init?.headers || {})
      })
    }))
  }
}));

// Mock Request class
class MockRequest {
  private body: string;
  public method: string;
  public headers: Headers;

  constructor(url: string, init?: RequestInit) {
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers);
    this.body = init?.body as string || '';
  }

  async json() {
    try {
      return JSON.parse(this.body);
    } catch (error) {
      throw new Error('Invalid JSON');
    }
  }
}

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Chat API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when no authorization header is present', async () => {
    // Mock headers to return no authorization
    (headers as any).mockReturnValueOnce(new Map());

    const request = new MockRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'test message' })
    }) as unknown as Request;

    const response = await POST(request);
    expect(response.status).toBe(401);
    
    const data = await response.json();
    expect(data.error).toBe('No authorization token provided');
  });

  it('forwards the request to the backend with authorization', async () => {
    // Mock successful backend response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ response: 'test response' })
    });

    const request = new MockRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'test message' })
    }) as unknown as Request;

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toEqual({ response: 'test response' });

    // Verify the backend call
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/nutrition/advice`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token',
        },
        body: JSON.stringify({ message: 'test message' }),
      })
    );
  });

  it('handles backend errors', async () => {
    // Mock backend error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Backend error' })
    });

    const request = new MockRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'test message' })
    }) as unknown as Request;

    const response = await POST(request);
    expect(response.status).toBe(500);
    
    const data = await response.json();
    expect(data).toEqual({
      error: 'Failed to get response from backend: Backend error'
    });
  });

  it('handles network errors', async () => {
    // Mock network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const request = new MockRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'test message' })
    }) as unknown as Request;

    const response = await POST(request);
    expect(response.status).toBe(500);
    
    const data = await response.json();
    expect(data).toEqual({
      error: 'Network error'
    });
  });

  it('handles malformed request body', async () => {
    const request = new MockRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: 'invalid json'
    }) as unknown as Request;

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toContain('Failed to process message');
  });
});
