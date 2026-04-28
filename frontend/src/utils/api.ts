import Constants from 'expo-constants';

const API_PORT = '3000';

function getDevServerHost() {
  const hostUri = Constants.expoConfig?.hostUri;
  return hostUri?.split(':')[0];
}

export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${getDevServerHost() ?? 'localhost'}:${API_PORT}/api`;

let _token: string | null = null;

export function setToken(token: string) {
  _token = token;
}

export function clearToken() {
  _token = null;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    const validationMessage = Array.isArray(data.errors)
      ? data.errors.map((error: any) => error.msg).filter(Boolean).join(', ')
      : '';
    throw new Error(data.message || validationMessage || `HTTP ${res.status}`);
  }
  return data as T;
}

const get  = <T>(path: string)              => request<T>('GET',    path);
const post = <T>(path: string, body: unknown) => request<T>('POST',   path, body);
const del  = <T>(path: string)              => request<T>('DELETE', path);

export const api = {
  auth: {
    login:    (email: string, password: string) => post<{ token: string; user: any }>('/auth/login',    { email, password }),
    register: (name: string, email: string, password: string) => post<{ token: string; user: any }>('/auth/register', { name, email, password }),
    me:       () => get<any>('/auth/me'),
  },
  species: {
    list: (params?: { category?: string; status?: string }) => {
      const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
      return get<any[]>(`/species${qs}`);
    },
    get: (id: string | number) => get<any>(`/species/${id}`),
  },
  sightings: {
    all:    () => get<any[]>('/sightings'),
    mine:   () => get<any[]>('/sightings/my'),
    create: (data: { species_id: number; latitude: number; longitude: number; location_name?: string; notes?: string }) =>
      post<any>('/sightings', data),
    remove: (id: number) => del<any>(`/sightings/${id}`),
  },
  challenges: {
    list: () => get<any[]>('/challenges'),
  },
  badges: {
    list: () => get<any[]>('/badges'),
  },
  leaderboard: {
    get: () => get<any[]>('/leaderboard'),
  },
};
