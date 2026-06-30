const API_BASE_URL = 'http://localhost:8080';

export async function authFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error('Erro na requisição autenticada');
  }

  return response.json();
}
