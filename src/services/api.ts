import { API_URL } from '../config.js';
import type { TableRow, User } from '../types';

// API request helper
async function apiRequest<T>(endpoint: string, data: any = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Table data operations
export async function getTableData(): Promise<TableRow[]> {
  return apiRequest<TableRow[]>('/api/table/get');
}

export async function saveTableRow(row: TableRow): Promise<void> {
  await apiRequest('/api/table/save', {
    ...row,
    createdAt: row.createdAt || new Date().toISOString(),
  });
}

export async function deleteTableRow(id: string): Promise<void> {
  await apiRequest('/api/table/delete', { id });
}

export async function clearTable(): Promise<void> {
  await apiRequest('/api/table/clear');
}

// User operations
export async function getAllUsers(): Promise<User[]> {
  return apiRequest<User[]>('/api/users/get');
}

export async function getUserById(userId: number): Promise<User | null> {
  return apiRequest<User | null>('/api/users/get-by-id', { userId });
}

export async function saveUser(user: User): Promise<void> {
  await apiRequest('/api/users/save', user);
}

export async function getUserRole(userId: number): Promise<'user' | 'admin'> {
  const result = await apiRequest<{ role: 'user' | 'admin' }>('/api/users/role', { userId });
  return result.role;
}

export async function setUserRole(userId: number, role: 'user' | 'admin'): Promise<void> {
  await apiRequest('/api/users/set-role', { userId, role });
}

export async function getPendingRequests(): Promise<User[]> {
  return apiRequest<User[]>('/api/users/pending-requests');
}

// Admin operations
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const result = await apiRequest<{ valid: boolean }>('/api/admin/verify-password', { password });
  return result.valid;
}

