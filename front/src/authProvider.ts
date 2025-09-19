import type { AuthProvider } from 'react-admin';
import { apiUrl, http } from './httpClient';

const isAuthRequired = () => import.meta.env.VITE_AUTH_REQUIRED === 'true';

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    if (!isAuthRequired()) {
      localStorage.setItem('skipAuth', 'true');
      return;
    }
    const data = await http<{ token: string; user: { email: string } }>(
      apiUrl('/auth/login'),
      {
        method: 'POST',
        body: JSON.stringify({ email: username, password }),
      }
    );
    localStorage.setItem('token', data.token);
    localStorage.removeItem('skipAuth');
  },

  checkAuth: async () => {
    if (!isAuthRequired()) return; 
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('not authenticated');
    }
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('skipAuth');
    return Promise.resolve('/login'); 
  },

  checkError: async (error) => {
    const status = (error as any)?.status;
    if (status === 401 || 403 === status) {
      localStorage.removeItem('token');
      localStorage.removeItem('skipAuth');
      throw error;
    }
  },

  getPermissions: async () => {
    return;
  },

  getIdentity: async () => {
    const token = localStorage.getItem('token');
    if (!token) return undefined as any;
    return { id: 'me', fullName: 'Usuario' } as any;
  },
};
