export interface TableRow {
  id: string;
  name: string;        // Наименование
  mlNumber: string;    // Номер МЛ
  date: string;        // Дата (ISO format)
  surname: string;     // Фамилия
  quantity: number;    // Количество (целое число)
  createdBy: number;   // Telegram User ID
  createdAt?: string;  // ISO timestamp создания строки
}

export type UserRole = 'user' | 'admin';
export type UserStatus = 'no_access' | 'has_access' | 'blocked';

export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  status: UserStatus;
  role?: 'user' | 'admin'; // Role for users with roles
  requestedAt?: string; // ISO timestamp запроса доступа
  requestReason?: string;
}

export interface AppState {
  rows: TableRow[];
  userRole: UserRole;
  currentUserId: number;
}

