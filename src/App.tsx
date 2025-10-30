import { useState, useEffect } from 'react';
import {
  initializeAdminPassword,
  loadTableData,
  getUserRole,
  saveTableData,
  setUserRole as setUserRoleStorage,
  getAllUsers,
  getOrCreateUser,
  setUserStatus,
  requestAccess,
  getPendingRequests,
  migrateToNewSystem,
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

  // Initialize Telegram Web App
  useEffect(() => {
    initTelegramWebApp();
    const user = getTelegramUser();
    setCurrentUserId(user.id);
    
    // Initialize admin password if needed
    initializeAdminPassword();
    
    // Migrate to new system
    migrateToNewSystem();
    
    // Create or get user
    const currentUser = getOrCreateUser(user.id, user.first_name, user.last_name, user.username);
    setUserStatusState(currentUser.status);
    
    // Load data and user role
    const data = loadTableData();
    setRows(data);
    setUserRole(getUserRole(user.id));
  }, []);

  // Check access permissions
  const hasAccess = userRole === 'admin' || userStatus === 'has_access';
  const isBlocked = userStatus === 'blocked';

  const handleRequestAccess = () => {
    setShowRequestDialog(true);
  };

  const handleSendRequest = (reason?: string) => {
    requestAccess(currentUserId, reason);
    alert('Запрос отправлен. Администратор скоро рассмотрит его.');
  };

  const handleBecomeAdmin = () => {
    setShowAdminDialog(true);
  };

  const handleAdminSuccess = () => {
    setUserRole('admin');
    setUserRoleStorage(currentUserId, 'admin');
    setUserStatusState('has_access');
    const user = getOrCreateUser(
      currentUserId,
      getTelegramUser().first_name,
      getTelegramUser().last_name,
      getTelegramUser().username
    );
    user.status = 'has_access';
    setUserStatus(user.id, 'has_access');
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
    setConfirmCallback(() => () => {
      setRows(prev => {
        const updated = prev.filter(r => r.id !== id);
        saveTableData(updated);
        return updated;
      });
    });
    setShowConfirmDialog(true);
  };

  const handleClearAll = () => {
    setConfirmMessage('Вы уверены, что хотите очистить всю таблицу? Это действие нельзя отменить.');
    setConfirmCallback(() => () => {
      setRows([]);
      saveTableData([]);
    });
    setShowConfirmDialog(true);
  };

  const handleUserManagement = () => {
    setView('user-management');
  };

  const handleBackFromUserManagement = () => {
    setView('table');
  };

  const handleGrantAccess = (userId: number) => {
    setUserStatus(userId, 'has_access');
    // Refresh users list
    const user = getAllUsers().find(u => u.id === userId);
    if (user) {
      user.status = 'has_access';
      user.requestedAt = undefined;
      user.requestReason = undefined;
    }
  };

  const handleBlockUser = (userId: number) => {
    setUserStatus(userId, 'blocked');
    // Refresh users list
    const user = getAllUsers().find(u => u.id === userId);
    if (user) {
      user.status = 'blocked';
    }
  };

  const handleUnblockUser = (userId: number) => {
    setUserStatus(userId, 'no_access');
    // Refresh users list
    const user = getAllUsers().find(u => u.id === userId);
    if (user) {
      user.status = 'no_access';
    }
  };

  const handleFormCancel = () => {
    setView('table');
    setEditingRow(null);
  };

  const handleFormSubmit = (formData: Omit<TableRow, 'id' | 'createdBy'>) => {
    if (view === 'edit' && editingRow) {
      // Update existing row
      setRows(prev => {
        const updated = prev.map(r => 
          r.id === editingRow.id 
            ? { ...r, ...formData }
            : r
        );
        saveTableData(updated);
        return updated;
      });
    } else {
      // Add new row
      const newRow: TableRow = {
        id: Date.now().toString(),
        ...formData,
        createdBy: currentUserId,
      };
      setRows(prev => {
        const updated = [...prev, newRow];
        saveTableData(updated);
        return updated;
      });
    }
    setView('table');
    setEditingRow(null);
  };

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
        users={getAllUsers()}
        pendingRequests={getPendingRequests()}
        onGrantAccess={handleGrantAccess}
        onBlockUser={handleBlockUser}
        onUnblockUser={handleUnblockUser}
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
        pendingRequestsCount={getPendingRequests().length}
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
