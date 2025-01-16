import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = vi.fn();

// Mock Headers, Request, and Response
global.Headers = vi.fn().mockImplementation(() => ({
  append: vi.fn(),
}));

global.Request = vi.fn().mockImplementation((input, init) => ({
  url: input,
  method: init?.method || 'GET',
  headers: init?.headers || {},
  body: init?.body,
}));

// Don't mock Response globally - let each test mock it as needed
// This allows NextResponse.json to work properly 