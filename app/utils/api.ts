interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  const { token, headers = {}, ...rest } = options;

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.error || response.statusText);
  }

  return response.json();
} 