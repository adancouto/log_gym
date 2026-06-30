import type { Exercise, Routine, User } from '../types/Routine';

const apiHost = window.location.hostname === '0.0.0.0'
  ? 'localhost'
  : window.location.hostname;
const API_BASE_URL = import.meta.env.VITE_API_URL ?? `http://${apiHost}:8080`;

interface LoginResponse {
  token: string;
}

interface ApiErrorBody {
  status?: number;
  error?: string;
  message?: string;
}

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  authenticated = true,
): Promise<T> {
  const token = localStorage.getItem('token');

  if (authenticated && !token) {
    throw new ApiRequestError('Sua sessao expirou. Entre novamente.', 401);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as ApiErrorBody | T | null;

  const reportedStatus =
    body &&
    typeof body === 'object' &&
    'status' in body &&
    typeof body.status === 'number'
      ? body.status
      : null;
  const reportedError = reportedStatus !== null && reportedStatus >= 400;

  if (!response.ok || reportedError) {
    const message =
      body && typeof body === 'object' && 'message' in body && body.message
        ? body.message
        : 'Nao foi possivel concluir a operacao.';

    throw new ApiRequestError(message, reportedStatus ?? response.status);
  }

  return body as T;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return 'Não foi possível conectar à API. Confirme se o backend está rodando na porta 8080.';
  }

  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
    false,
  );
}

export function register(name: string, email: string, password: string): Promise<User> {
  return request<User>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    },
    false,
  );
}

export function getMe(): Promise<User> {
  return request<User>('/users/me');
}

export function getRoutines(): Promise<Routine[]> {
  return request<Routine[]>('/routines');
}

export function createRoutine(name: string): Promise<Routine> {
  return request<Routine>('/routines', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export function getExercises(routineId: number): Promise<Exercise[]> {
  return request<Exercise[]>(`/routines/${routineId}/exercises`);
}

export function createExercise(
  routineId: number,
  exercise: Pick<Exercise, 'name' | 'weight' | 'reps'>,
): Promise<Exercise> {
  return request<Exercise>(`/routines/${routineId}/exercises`, {
    method: 'POST',
    body: JSON.stringify(exercise),
  });
}

export function updateExercise(
  routineId: number,
  exerciseId: number,
  exercise: Pick<Exercise, 'weight' | 'reps'>,
): Promise<Exercise> {
  return request<Exercise>(`/routines/${routineId}/exercises/${exerciseId}`, {
    method: 'PUT',
    body: JSON.stringify(exercise),
  });
}
