import type { DataProvider } from 'react-admin';
import { apiUrl, http } from './httpClient';
import type { Task } from './types';

// Valida que el estado sea uno válido de la API
function parseStatus(v: unknown): 'pending' | 'completed' | undefined {
  if (v === 'pending' || v === 'completed') return v;
  return undefined;
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    if (resource !== 'tasks') throw new Error('Recurso no soportado');

    const { pagination, filter, sort } = params;
    const status = parseStatus(filter?.status);
    const q = (filter?.q ?? '').toString().trim().toLowerCase();

    // Pide al backend por estado si corresponde
    const url = apiUrl(`/tasks${status ? `?status=${status}` : ''}`);
    const all = await http<Task[]>(url);

    // Búsqueda local en título/descr.
    let filtered = all;
    if (q) {
      filtered = all.filter(t =>
        (t.title ?? '').toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q)
      );
    }

    // Orden local
    const { field = 'id', order = 'DESC' } = (sort ?? {}) as any;
    filtered = [...filtered].sort((a: any, b: any) => {
      const av = (a as any)[field];
      const bv = (b as any)[field];
      if (av == null && bv == null) return 0;
      if (av == null) return order === 'ASC' ? -1 : 1;
      if (bv == null) return order === 'ASC' ? 1 : -1;
      if (av < bv) return order === 'ASC' ? -1 : 1;
      if (av > bv) return order === 'ASC' ? 1 : -1;
      return 0;
    });

    // Paginación local
    let page = 1;
    let perPage = filtered.length || 25;
    if (pagination) {
      page = pagination.page;
      perPage = pagination.perPage;
    }
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return { data: filtered.slice(start, end) as any, total: filtered.length };
  },

  getOne: async (resource, params) => {
    if (resource !== 'tasks') throw new Error('Recurso no soportado');
    const list = await http<Task[]>(apiUrl('/tasks'));
    const found = list.find(t => t.id === Number(params.id));
    if (!found) throw new Error('No encontrado');
    return { data: found as any };
  },

  create: async (resource, params) => {
    if (resource !== 'tasks') throw new Error('Recurso no soportado');
    const created = await http<Task>(apiUrl('/tasks'), {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    return { data: created as any };
  },

  update: async (resource, params) => {
    if (resource !== 'tasks') throw new Error('Recurso no soportado');
    const updated = await http<Task>(apiUrl(`/tasks/${params.id}`), {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
    return { data: updated as any };
  },

  delete: async (resource, params) => {
    if (resource !== 'tasks') throw new Error('Recurso no soportado');
    await http<void>(apiUrl(`/tasks/${params.id}`), { method: 'DELETE' });
    return { data: { id: params.id } as any };
  },

  getMany: async (resource, params) => {
    const results = await Promise.all(
      params.ids.map(id => (dataProvider.getOne as any)(resource, { id }))
    );
    return { data: results.map(r => r.data) as any };
  },
  getManyReference: async () => ({ data: [], total: 0 }),
  updateMany: async () => ({ data: [] as any }),
  deleteMany: async () => ({ data: [] as any }),
};
