import { API_URL } from '../config.js';
import type { TableRow, User } from '../types';

// Helper functions for Google Sheets API

// Parse CSV-like data from Google Sheets
function parseSheetData(sheetData: string[][]): any[] {
  if (!sheetData || sheetData.length === 0) return [];
  
  const headers = sheetData[0];
  const rows = sheetData.slice(1);
  
  return rows.map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

// Table data operations
export async function getTableData(): Promise<TableRow[]> {
  try {
    const response = await fetch(`${API_URL}/sheets/table`);
    if (!response.ok) throw new Error('Failed to fetch table data');
    const data = await response.json();
    
    if (!data.values || data.values.length === 0) return [];
    const parsed = parseSheetData(data.values);
    return parsed as TableRow[];
  } catch (error) {
    console.error('Error loading table data:', error);
    return [];
  }
}

export async function saveTableRow(row: TableRow): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/sheets/table`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
    if (!response.ok) throw new Error('Failed to save row');
  } catch (error) {
    console.error('Error saving row:', error);
    throw error;
  }
}

export async function deleteTableRow(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/sheets/table/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete row');
  } catch (error) {
    console.error('Error deleting row:', error);
    throw error;
  }
}

export async function clearTable(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/sheets/table`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear table');
  } catch (error) {
    console.error('Error clearing table:', error);
    throw error;
  }
}

// User operations
export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_URL}/sheets/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    
    if (!data.values || data.values.length === 0) return [];
    const parsed = parseSheetData(data.values);
    return parsed as User[];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

export async function getUserById(userId: number): Promise<User | null> {
  const users = await getAllUsers();
  return users.find(u => u.id === userId) || null;
}

export async function saveUser(user: User): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/sheets/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to save user');
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

export async function getUserRole(userId: number): Promise<'user' | 'admin'> {
  try {
    const users = await getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (user && user.role === 'admin') {
      return 'admin';
    }
    return 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
}

export async function setUserRole(userId: number, role: 'user' | 'admin'): Promise<void> {
  try {
    const user = await getUserById(userId);
    if (user) {
      user.role = role;
      await saveUser(user);
    }
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
}

export async function getPendingRequests(): Promise<User[]> {
  try {
    const users = await getAllUsers();
    return users.filter(u => u.status === 'no_access' && u.requestedAt);
  } catch (error) {
    console.error('Error getting pending requests:', error);
    return [];
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  // For Google Sheets, we'll use a simple comparison
  // In production, store hashed password in Google Sheets
  const correctPassword = 'X9$kP2mQ@vL8nR4wT';
  return password === correctPassword;
}

