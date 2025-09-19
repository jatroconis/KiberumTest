export function apiUrl(path: string) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${base}${path}`;
}

export async function http<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    const error = new Error(errText || res.statusText);
    (error as any).status = res.status;
    throw error;
  }
  const text = await res.text();
  try {
    return text ? JSON.parse(text) as T : (undefined as unknown as T);
  } catch {
    return (undefined as unknown as T);
  }
}
