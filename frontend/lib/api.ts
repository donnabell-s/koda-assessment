import { Project, CreateProjectPayload, UpdateProjectPayload } from '@/types/project';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw errorData; // Returns structured field validation errors from DRF
  }
  if (response.status === 204) {
    return {} as T;
  }
  return response.json();
}

export const projectApi = {
  // GET /api/projects/
  getAll: async (): Promise<Project[]> => {
    const res = await fetch(`${API_BASE_URL}/projects/`, { cache: 'no-store' });
    return handleResponse<Project[]>(res);
  },

  // GET /api/projects/:id/
  getById: async (id: number | string): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/`, { cache: 'no-store' });
    return handleResponse<Project>(res);
  },

  // POST /api/projects/
  create: async (data: CreateProjectPayload): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/projects/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(res);
  },

  // PUT /api/projects/:id/
  update: async (id: number | string, data: UpdateProjectPayload): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(res);
  },

  // DELETE /api/projects/:id/
  delete: async (id: number | string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },
};