export interface TableRow {
  id: string;
  name: string;        // Наименование
  mlNumber: string;    // Номер МЛ
  date: string;        // Дата (ISO format)
  surname: string;     // Фамилия
  quantity: number;    // Количество (целое число)
  createdBy: number;   // Telegram User ID
}

export type UserRole = 'user' | 'admin';
export type UserStatus = 'no_access' | 'has_access' | 'blocked';

export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  status: UserStatus;
  requestedAt?: string; // ISO timestamp запроса доступа
  requestReason?: string;
}

export interface AppState {
  rows: TableRow[];
  userRole: UserRole;
  currentUserId: number;
}

