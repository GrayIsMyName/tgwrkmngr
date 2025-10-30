import * as api from './api.js';
import type { TableRow, User } from '../types';

// Initialize admin password if not exists (no-op for API)
export const initializeAdminPassword = async (): Promise<void> => {
  // API handles admin password, no initialization needed
};

// Verify admin password
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  return api.verifyAdminPassword(password);
};

// Load table data
export const loadTableData = async (): Promise<TableRow[]> => {
  try {
    return await api.getTableData();
  } catch (error) {
    console.error('Error loading table data:', error);
    return [];
  }
};

// Save table data
export const saveTableData = async (rows: TableRow[]): Promise<boolean> => {
  try {
    // Save all rows
    for (const row of rows) {
      await api.saveTableRow(row);
    }
    return true;
  } catch (error) {
    console.error('Error saving table data:', error);
    return false;
  }
};

// Get user role
export const getUserRole = async (userId: number): Promise<'user' | 'admin'> => {
  try {
    return await api.getUserRole(userId);
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
};

// Set user role
export const setUserRole = async (userId: number, role: 'user' | 'admin'): Promise<boolean> => {
  try {
    await api.setUserRole(userId, role);
    
    // Also ensure user has access if admin
    if (role === 'admin') {
      const user = await getUserById(userId);
      if (user && user.status !== 'has_access') {
        await setUserStatus(userId, 'has_access');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
};

// Remove user role (for logout)
export const removeUserRole = async (userId: number): Promise<boolean> => {
  try {
    await api.setUserRole(userId, 'user');
    return true;
  } catch (error) {
    console.error('Error removing user role:', error);
    return false;
  }
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await api.getAllUsers();
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Save all users (not needed with API, but keep for compatibility)
export const saveAllUsers = async (users: User[]): Promise<boolean> => {
  try {
    // Save each user
    for (const user of users) {
      await api.saveUser(user);
    }
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
  let user = await api.getUserById(userId);
  
  if (!user) {
    // Create new user
    user = {
      id: userId,
      firstName,
      lastName,
      username,
      status: 'no_access',
    };
    await api.saveUser(user);
  }
  
  return user;
};

// Save user
export const saveUser = async (user: User): Promise<boolean> => {
  try {
    await api.saveUser(user);
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

// Get user by ID
export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    return await api.getUserById(userId);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Get user status
export const getUserStatus = async (userId: number): Promise<'no_access' | 'has_access' | 'blocked'> => {
  const user = await getUserById(userId);
  return user?.status || 'no_access';
};

// Set user status
export const setUserStatus = async (userId: number, status: 'no_access' | 'has_access' | 'blocked'): Promise<boolean> => {
  const user = await getUserById(userId);
  
  if (user) {
    user.status = status;
    return saveUser(user);
  }
  
  return false;
};

// Request access
export const requestAccess = async (userId: number, firstName: string, lastName?: string, username?: string, reason?: string): Promise<boolean> => {
  try {
    const user = await getUserById(userId);
    
    const updatedUser: User = user || {
      id: userId,
      firstName,
      lastName,
      username,
      status: 'no_access',
    };
    
    updatedUser.requestedAt = new Date().toISOString();
    updatedUser.requestReason = reason;
    
    return saveUser(updatedUser);
  } catch (error) {
    console.error('Error requesting access:', error);
    return false;
  }
};

// Get pending requests
export const getPendingRequests = async (): Promise<User[]> => {
  try {
    return await api.getPendingRequests();
  } catch (error) {
    console.error('Error getting pending requests:', error);
    return [];
  }
};

// Migrate old data to new system (no-op for API)
export const migrateToNewSystem = async (): Promise<void> => {
  // No migration needed with API
};

// User with role information
export interface UserWithRole extends User {
  role: 'user' | 'admin';
}

// Get all users with their roles
export const getUsersWithRoles = async (): Promise<UserWithRole[]> => {
  try {
    const users = await api.getAllUsers();
    return users.map(user => ({
      ...user,
      role: user.role || 'user'
    }));
  } catch (error) {
    console.error('Error getting users with roles:', error);
    return [];
  }
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
