const envBase = import.meta.env.VITE_API_URL;

export const API_BASE = envBase
  ? envBase
  : `${window.location.protocol}//${window.location.hostname}:3001`;

function readToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  } catch {
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = readToken();
  const headers = new Headers(init?.headers);
  if (!headers.has('content-type') && init?.body && !(init.body instanceof FormData)) {
    headers.set('content-type', 'application/json');
  }
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }

  const url = path.startsWith('http://') || path.startsWith('https://') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data.error === 'string') {
        message = data.error;
      }
    } catch {
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export async function apiUpload<T>(path: string, form: FormData): Promise<T> {
  const token = readToken();
  const headers = new Headers();
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: form,
  });
  if (!res.ok) {
    let message = `Upload failed (${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data.error === 'string') {
        message = data.error;
      }
    } catch {
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}
