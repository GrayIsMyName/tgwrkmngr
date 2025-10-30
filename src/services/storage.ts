import type { TableRow, User } from '../types';

const TABLE_DATA_KEY = 'tableData';
const ADMIN_PASSWORD_KEY = 'adminPassword';
const USERS_KEY = 'users';
const USER_ROLE_PREFIX = 'user_';

// Async storage helper functions
const getStorageItem = (key: string): Promise<string | null> => {
  return new Promise((resolve) => {
    // @ts-ignore - Telegram Web App API
    if (window.Telegram?.WebApp?.CloudStorage) {
      // @ts-ignore
      window.Telegram.WebApp.CloudStorage.getItem(key, (error: string | null, value: string | null) => {
        if (error) {
          console.error(`Error getting ${key}:`, error);
          resolve(null);
        } else {
          resolve(value || null);
        }
      });
    } else {
      // Fallback to localStorage
      resolve(localStorage.getItem(key));
    }
  });
};

const setStorageItem = (key: string, value: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // @ts-ignore - Telegram Web App API
    if (window.Telegram?.WebApp?.CloudStorage) {
      // @ts-ignore
      window.Telegram.WebApp.CloudStorage.setItem(key, value, (error: string | null) => {
        if (error) {
          console.error(`Error setting ${key}:`, error);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } else {
      // Fallback to localStorage
      localStorage.setItem(key, value);
      resolve(true);
    }
  });
};

const removeStorageItem = (key: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // @ts-ignore - Telegram Web App API
    if (window.Telegram?.WebApp?.CloudStorage) {
      // @ts-ignore
      window.Telegram.WebApp.CloudStorage.removeItem(key, (error: string | null) => {
        if (error) {
          console.error(`Error removing ${key}:`, error);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } else {
      localStorage.removeItem(key);
      resolve(true);
    }
  });
};

// Initialize admin password if not exists
export const initializeAdminPassword = async (): Promise<void> => {
  const existing = await getStorageItem(ADMIN_PASSWORD_KEY);
  if (!existing) {
    // Надежный пароль: X9$kP2mQ@vL8nR4wT
    await setStorageItem(ADMIN_PASSWORD_KEY, 'X9$kP2mQ@vL8nR4wT');
  }
};

// Verify admin password
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  const storedPassword = await getStorageItem(ADMIN_PASSWORD_KEY);
  // Проверяем оба варианта для обратной совместимости
  return storedPassword === password || password === 'X9$kP2mQ@vL8nR4wT';
};

// Load table data
export const loadTableData = async (): Promise<TableRow[]> => {
  try {
    const data = await getStorageItem(TABLE_DATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading table data:', error);
    return [];
  }
};

// Save table data
export const saveTableData = async (rows: TableRow[]): Promise<boolean> => {
  try {
    await setStorageItem(TABLE_DATA_KEY, JSON.stringify(rows));
    return true;
  } catch (error) {
    console.error('Error saving table data:', error);
    return false;
  }
};

// Get user role
export const getUserRole = async (userId: number): Promise<'user' | 'admin'> => {
  // Check legacy role storage
  const legacyRole = await getStorageItem(`${USER_ROLE_PREFIX}${userId}`);
  if (legacyRole === 'admin') {
    return 'admin';
  }
  
  return 'user';
};

// Set user role
export const setUserRole = async (userId: number, role: 'user' | 'admin'): Promise<boolean> => {
  // Save to legacy storage
  await setStorageItem(`${USER_ROLE_PREFIX}${userId}`, role);
  
  // Also ensure user exists and update their status
  if (role === 'admin') {
    const users = await getAllUsers();
    const existingUser = users.find(u => u.id === userId);
    if (existingUser && existingUser.status !== 'has_access') {
      existingUser.status = 'has_access';
      await saveAllUsers(users);
    }
  }
  
  return true;
};

// Remove user role (for logout)
export const removeUserRole = async (userId: number): Promise<boolean> => {
  return removeStorageItem(`${USER_ROLE_PREFIX}${userId}`);
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const data = await getStorageItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Save all users
export const saveAllUsers = async (users: User[]): Promise<boolean> => {
  try {
    await setStorageItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

// Get or create user
export const getOrCreateUser = async (
  userId: number,
  firstName: string,
  lastName?: string,
  username?: string
): Promise<User> => {
  const users = await getAllUsers();
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
  await saveAllUsers(users);
  return newUser;
};

// Save user
export const saveUser = async (user: User): Promise<boolean> => {
  const users = await getAllUsers();
  const index = users.findIndex(u => u.id === user.id);
  
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  
  return saveAllUsers(users);
};

// Get user status
export const getUserStatus = async (userId: number): Promise<'no_access' | 'has_access' | 'blocked'> => {
  const users = await getAllUsers();
  const user = users.find(u => u.id === userId);
  return user?.status || 'no_access';
};

// Set user status
export const setUserStatus = async (userId: number, status: 'no_access' | 'has_access' | 'blocked'): Promise<boolean> => {
  const users = await getAllUsers();
  const user = users.find(u => u.id === userId);
  
  if (user) {
    user.status = status;
    return saveAllUsers(users);
  }
  
  return false;
};

// Request access
export const requestAccess = async (userId: number, reason?: string): Promise<boolean> => {
  const users = await getAllUsers();
  const user = users.find(u => u.id === userId);
  
  if (user) {
    user.requestedAt = new Date().toISOString();
    user.requestReason = reason;
    return saveAllUsers(users);
  }
  
  return false;
};

// Get pending requests
export const getPendingRequests = async (): Promise<User[]> => {
  const users = await getAllUsers();
  return users.filter(u => u.status === 'no_access' && u.requestedAt);
};

// Migrate old data to new system
export const migrateToNewSystem = async (): Promise<void> => {
  const migrationDone = await getStorageItem('migration_done_v2');
  if (migrationDone) {
    return;
  }
  
  const users = await getAllUsers();
  
  if (users.length === 0) {
    await setStorageItem('migration_done_v2', 'true');
    return;
  }
  
  // Migrate legacy roles
  const updatedUsers = [...users];
  let hasChanges = false;
  
  for (const user of updatedUsers) {
    const legacyRole = await getStorageItem(`${USER_ROLE_PREFIX}${user.id}`);
    if (legacyRole) {
      if (legacyRole === 'user' && user.status === 'no_access') {
        user.status = 'has_access';
        hasChanges = true;
      } else if (legacyRole === 'admin') {
        user.status = 'has_access';
        hasChanges = true;
      }
    }
  }
  
  if (hasChanges) {
    await saveAllUsers(updatedUsers);
  }
  
  await setStorageItem('migration_done_v2', 'true');
};

// User with role information
export interface UserWithRole extends User {
  role: 'user' | 'admin';
}

// Get all users with their roles
export const getUsersWithRoles = async (): Promise<UserWithRole[]> => {
  const users = await getAllUsers();
  const usersWithRoles: UserWithRole[] = [];
  
  for (const user of users) {
    const role = await getUserRole(user.id);
    usersWithRoles.push({ ...user, role });
  }
  
  return usersWithRoles;
};

// Promote user to admin
export const promoteToAdmin = async (userId: number): Promise<boolean> => {
  try {
    // Set admin role
    await setUserRole(userId, 'admin');
    
    // Ensure user has access status
    await setUserStatus(userId, 'has_access');
    
    return true;
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    return false;
  }
};
