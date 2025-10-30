import { useState, useEffect } from 'react';
import {
  initializeAdminPassword,
  loadTableData,
  getUserRole,
  saveTableData,
  setUserRole as setUserRoleStorage,
  removeUserRole,
  getAllUsers,
  getUsersWithRoles,
  getOrCreateUser,
  setUserStatus,
  requestAccess,
  getPendingRequests,
  migrateToNewSystem,
  promoteToAdmin,
} from './services/storage';
import { getTelegramUser, initTelegramWebApp } from './services/telegram';
import type { TableRow, UserRole } from './types';
import TableView from './components/TableView';
import AddEditForm from './components/AddEditForm';
import AccessDeniedView from './components/AccessDeniedView';
import RequestAccessDialog from './components/RequestAccessDialog';
import UserManagementPanel from './components/UserManagementPanel';
import AdminPasswordDialog from './components/AdminPasswordDialog';
import ConfirmDialog from './components/ConfirmDialog';

type View = 'table' | 'add' | 'edit' | 'user-management';

function App() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [userStatus, setUserStatusState] = useState<'no_access' | 'has_access' | 'blocked'>('no_access');
  const [view, setView] = useState<View>('table');
  const [editingRow, setEditingRow] = useState<TableRow | null>(null);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Telegram Web App
  useEffect(() => {
    const initApp = async () => {
      initTelegramWebApp();
      const user = getTelegramUser();
      setCurrentUserId(user.id);
      
      // Initialize admin password if needed
      await initializeAdminPassword();
      
      // Migrate to new system
      await migrateToNewSystem();
      
      // Create or get user
      const currentUser = await getOrCreateUser(user.id, user.first_name, user.last_name, user.username);
      setUserStatusState(currentUser.status);
      
      // Load data and user role
      const [data, role] = await Promise.all([
        loadTableData(),
        getUserRole(user.id),
      ]);
      setRows(data);
      setUserRole(role);
      
      // Load users and pending requests
      const [users, pending] = await Promise.all([
        getUsersWithRoles(),
        getPendingRequests(),
      ]);
      setAllUsers(users);
      setPendingRequestsCount(pending.length);
      
      setIsLoading(false);
    };
    
    initApp();
  }, []);

  // Poll for role changes every 5 seconds
  useEffect(() => {
    if (!currentUserId || isLoading) return;

    const interval = setInterval(async () => {
      const currentRole = await getUserRole(currentUserId);
      if (currentRole !== userRole) {
        setUserRole(currentRole);
        if (currentRole === 'admin') {
          setUserStatusState('has_access');
          // Show notification
          // @ts-ignore
          if (window.Telegram?.WebApp?.HapticFeedback) {
            // @ts-ignore
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          }
        }
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [currentUserId, userRole, isLoading]);

  // Check access permissions
  const hasAccess = userRole === 'admin' || userStatus === 'has_access';
  const isBlocked = userStatus === 'blocked';

  const handleRequestAccess = () => {
    setShowRequestDialog(true);
  };

  const handleSendRequest = async (reason?: string) => {
    await requestAccess(currentUserId, reason);
    alert('Запрос отправлен. Администратор скоро рассмотрит его.');
    setShowRequestDialog(false);
  };

  const handleBecomeAdmin = () => {
    setShowAdminDialog(true);
  };

  const handleAdminSuccess = async () => {
    const user = getTelegramUser();
    await setUserRoleStorage(currentUserId, 'admin');
    const updatedUser = await getOrCreateUser(currentUserId, user.first_name, user.last_name, user.username);
    updatedUser.status = 'has_access';
    await saveUser(updatedUser);
    
    setUserRole('admin');
    setUserStatusState('has_access');
    setShowAdminDialog(false);
  };

  const handleLogoutAdmin = async () => {
    await removeUserRole(currentUserId);
    await setUserStatus(currentUserId, 'has_access');
    setUserRole('user');
    setUserStatusState('has_access');
  };

  const handleLogoutUser = async () => {
    await setUserStatus(currentUserId, 'no_access');
    setUserStatusState('no_access');
  };

  const handleAdd = () => {
    setEditingRow(null);
    setView('add');
  };

  const handleEdit = (row: TableRow) => {
    if (userRole === 'admin') {
      setEditingRow(row);
      setView('edit');
    }
  };

  const handleDelete = (id: string) => {
    setConfirmMessage('Вы уверены, что хотите удалить эту строку?');
    setConfirmCallback(() => async () => {
      const updated = rows.filter(r => r.id !== id);
      await saveTableData(updated);
      setRows(updated);
    });
    setShowConfirmDialog(true);
  };

  const handleClearAll = () => {
    setConfirmMessage('Вы уверены, что хотите очистить всю таблицу? Это действие нельзя отменить.');
    setConfirmCallback(() => async () => {
      await saveTableData([]);
      setRows([]);
    });
    setShowConfirmDialog(true);
  };

  const handleUserManagement = () => {
    setView('user-management');
  };

  const handleBackFromUserManagement = () => {
    setView('table');
  };

  const handleGrantAccess = async (userId: number) => {
    await setUserStatus(userId, 'has_access');
    const users = await getUsersWithRoles();
    setAllUsers(users);
    const pending = await getPendingRequests();
    setPendingRequestsCount(pending.length);
  };

  const handleBlockUser = async (userId: number) => {
    await setUserStatus(userId, 'blocked');
    const users = await getUsersWithRoles();
    setAllUsers(users);
  };

  const handleUnblockUser = async (userId: number) => {
    await setUserStatus(userId, 'no_access');
    const users = await getUsersWithRoles();
    setAllUsers(users);
  };

  const handlePromoteToAdmin = async (userId: number) => {
    await promoteToAdmin(userId);
    const users = await getUsersWithRoles();
    setAllUsers(users);
  };

  const handleFormCancel = () => {
    setView('table');
    setEditingRow(null);
  };

  const handleFormSubmit = async (formData: Omit<TableRow, 'id' | 'createdBy'>) => {
    if (view === 'edit' && editingRow) {
      const updated = rows.map(r => 
        r.id === editingRow.id ? { ...r, ...formData } : r
      );
      await saveTableData(updated);
      setRows(updated);
    } else {
      const newRow: TableRow = {
        id: Date.now().toString(),
        ...formData,
        createdBy: currentUserId,
      };
      const updated = [...rows, newRow];
      await saveTableData(updated);
      setRows(updated);
    }
    setView('table');
    setEditingRow(null);
  };

  const saveUser = async (user: any) => {
    const users = await getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    await saveAllUsers(users);
  };

  const saveAllUsers = async (users: any[]) => {
    await setStorageItem('users', JSON.stringify(users));
  };

  const setStorageItem = async (key: string, value: string) => {
    // @ts-ignore
    if (window.Telegram?.WebApp?.CloudStorage) {
      return new Promise((resolve) => {
        // @ts-ignore
        window.Telegram.WebApp.CloudStorage.setItem(key, value, (error: string | null) => {
          resolve(!error);
        });
      });
    } else {
      localStorage.setItem(key, value);
      return Promise.resolve(true);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>;
  }

  // If user is blocked, show access denied
  if (isBlocked) {
    return (
      <AccessDeniedView
        onRequestAccess={() => {}}
        onAdminLogin={handleBecomeAdmin}
      />
    );
  }

  // If no access, show access denied
  if (!hasAccess) {
    return (
      <>
        <AccessDeniedView
          onRequestAccess={handleRequestAccess}
          onAdminLogin={handleBecomeAdmin}
        />
        {showRequestDialog && (
          <RequestAccessDialog
            onClose={() => setShowRequestDialog(false)}
            onRequest={handleSendRequest}
          />
        )}
        {showAdminDialog && (
          <AdminPasswordDialog
            onClose={() => setShowAdminDialog(false)}
            onSuccess={handleAdminSuccess}
          />
        )}
      </>
    );
  }

  // Show user management panel for admin
  if (view === 'user-management') {
    return (
      <UserManagementPanel
        users={allUsers}
        pendingRequests={allUsers.filter(u => u.status === 'no_access' && u.requestedAt)}
        currentUserId={currentUserId}
        onGrantAccess={handleGrantAccess}
        onBlockUser={handleBlockUser}
        onUnblockUser={handleUnblockUser}
        onPromoteToAdmin={handlePromoteToAdmin}
        onBack={handleBackFromUserManagement}
      />
    );
  }

  // Show form for add/edit
  if (view === 'add' || view === 'edit') {
    return (
      <AddEditForm
        initialData={editingRow}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  // Show main table view
  return (
    <>
      <TableView
        rows={rows}
        isAdmin={userRole === 'admin'}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
        onBecomeAdmin={handleBecomeAdmin}
        onUserManagement={handleUserManagement}
        pendingRequestsCount={pendingRequestsCount}
        onLogoutAdmin={handleLogoutAdmin}
        onLogoutUser={handleLogoutUser}
      />
      
      {showAdminDialog && (
        <AdminPasswordDialog
          onClose={() => setShowAdminDialog(false)}
          onSuccess={handleAdminSuccess}
        />
      )}
      
      {showConfirmDialog && (
        <ConfirmDialog
          message={confirmMessage}
          onConfirm={() => {
            confirmCallback?.();
            setShowConfirmDialog(false);
          }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </>
  );
}

export default App;
