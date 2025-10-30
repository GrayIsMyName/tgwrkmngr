import type { TableRow, User } from '../types';

const TABLE_DATA_KEY = 'tableData';
const ADMIN_PASSWORD_KEY = 'adminPassword';
const USERS_KEY = 'users';
const USER_ROLE_PREFIX = 'user_';

// Telegram Cloud Storage helpers
const getStorage = (): typeof window.localStorage => {
  // @ts-ignore - Telegram Web App API
  return window.Telegram?.WebApp?.CloudStorage || localStorage;
};

// Initialize admin password if not exists
export const initializeAdminPassword = (): void => {
  const storage = getStorage();
  // Всегда устанавливаем пароль при инициализации
  // Надежный пароль: X9$kP2mQ@vL8nR4wT
  storage.setItem(ADMIN_PASSWORD_KEY, 'X9$kP2mQ@vL8nR4wT');
};

// Verify admin password
export const verifyAdminPassword = (password: string): boolean => {
  const storage = getStorage();
  const storedPassword = storage.getItem(ADMIN_PASSWORD_KEY);
  // Проверяем оба варианта для обратной совместимости
  return storedPassword === password || password === 'X9$kP2mQ@vL8nR4wT';
};

// Load table data
export const loadTableData = (): TableRow[] => {
  const storage = getStorage();
  try {
    const data = storage.getItem(TABLE_DATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading table data:', error);
    return [];
  }
};

// Save table data
export const saveTableData = (rows: TableRow[]): void => {
  const storage = getStorage();
  try {
    storage.setItem(TABLE_DATA_KEY, JSON.stringify(rows));
  } catch (error) {
    console.error('Error saving table data:', error);
  }
};

// Get user role
export const getUserRole = (userId: number): 'user' | 'admin' => {
  const storage = getStorage();
  const role = storage.getItem(`${USER_ROLE_PREFIX}${userId}`);
  return (role === 'admin' || role === 'user') ? role : 'user';
};

// Set user role
export const setUserRole = (userId: number, role: 'user' | 'admin'): void => {
  const storage = getStorage();
  storage.setItem(`${USER_ROLE_PREFIX}${userId}`, role);
};

// Get all users
export const getAllUsers = (): User[] => {
  const storage = getStorage();
  try {
    const data = storage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Save all users
export const saveAllUsers = (users: User[]): void => {
  const storage = getStorage();
  try {
    storage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Get or create user
export const getOrCreateUser = (userId: number, firstName: string, lastName?: string, username?: string): User => {
  const users = getAllUsers();
  const existingUser = users.find(u => u.id === userId);
  
  if (existingUser) {
    return existingUser;
  }
  
  const newUser: User = {
    id: userId,
    firstName,
    lastName,
    username,
    status: 'no_access',
  };
  
  users.push(newUser);
  saveAllUsers(users);
  return newUser;
};

// Save user
export const saveUser = (user: User): void => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === user.id);
  
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  
  saveAllUsers(users);
};

// Get user status
export const getUserStatus = (userId: number): 'no_access' | 'has_access' | 'blocked' => {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  return user?.status || 'no_access';
};

// Set user status
export const setUserStatus = (userId: number, status: 'no_access' | 'has_access' | 'blocked'): void => {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  
  if (user) {
    user.status = status;
    saveAllUsers(users);
  }
};

// Request access
export const requestAccess = (userId: number, reason?: string): void => {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  
  if (user) {
    user.requestedAt = new Date().toISOString();
    user.requestReason = reason;
    saveAllUsers(users);
  }
};

// Get pending requests
export const getPendingRequests = (): User[] => {
  const users = getAllUsers();
  return users.filter(u => u.status === 'no_access' && u.requestedAt);
};

// Migrate old data to new system
export const migrateToNewSystem = (): void => {
  const storage = getStorage();
  
  // Check if migration already done
  if (storage.getItem('migration_done_v2')) {
    return;
  }
  
  // Get all user roles and convert to new system
  const users = getAllUsers();
  
  // If no users exist yet, migration is not needed
  if (users.length === 0) {
    storage.setItem('migration_done_v2', 'true');
    return;
  }
  
  // Check existing roles and convert
  const userKeys = Object.keys(storage).filter(key => key.startsWith(USER_ROLE_PREFIX));
  
  for (const key of userKeys) {
    const userId = parseInt(key.replace(USER_ROLE_PREFIX, ''));
    if (!isNaN(userId)) {
      const role = storage.getItem(key);
      const user = users.find(u => u.id === userId);
      
      if (user) {
        // Migrate: old 'user' becomes 'has_access', 'admin' stays as is
        if (role === 'user' && user.status === 'no_access') {
          user.status = 'has_access';
        } else if (role === 'admin') {
          user.status = 'has_access';
        }
      }
    }
  }
  
  saveAllUsers(users);
  storage.setItem('migration_done_v2', 'true');
};

