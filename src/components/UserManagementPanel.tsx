import type { UserWithRole } from '../services/storage';
import type { User } from '../types';
import './UserManagementPanel.css';

interface UserManagementPanelProps {
  users: UserWithRole[];
  pendingRequests: User[];
  currentUserId: number;
  onGrantAccess: (userId: number) => void;
  onBlockUser: (userId: number) => void;
  onUnblockUser: (userId: number) => void;
  onPromoteToAdmin?: (userId: number) => void;
  onBack: () => void;
}

export default function UserManagementPanel({
  users,
  pendingRequests,
  currentUserId,
  onGrantAccess,
  onBlockUser,
  onUnblockUser,
  onPromoteToAdmin,
  onBack,
}: UserManagementPanelProps) {
  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'has_access':
        return <span className="badge badge-success">✓ Доступ</span>;
      case 'no_access':
        return <span className="badge badge-warning">✗ Нет доступа</span>;
      case 'blocked':
        return <span className="badge badge-danger">🚫 Заблокирован</span>;
    }
  };

  const getRoleBadge = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      return <span className="badge badge-admin">👑 Админ</span>;
    }
    return <span className="badge badge-user">👤 Пользователь</span>;
  };

  const getUserDisplayName = (user: User) => {
    const parts = [user.firstName];
    if (user.lastName) parts.push(user.lastName);
    if (user.username) parts.push(`@${user.username}`);
    return parts.join(' ');
  };

  const requestedUserIds = new Set(pendingRequests.map(u => u.id));

  return (
    <div className="user-management">
      <div className="user-management-header">
        <button className="btn-back" onClick={onBack}>
          ← Назад
        </button>
        <h1>Управление пользователями</h1>
      </div>

      {pendingRequests.length > 0 && (
        <div className="requests-section">
          <h2>
            Запросы на доступ
            <span className="badge badge-count">{pendingRequests.length}</span>
          </h2>
          <div className="users-list">
            {pendingRequests.map((user) => (
              <div key={user.id} className="user-card request-card">
                <div className="user-info">
                  <div className="user-name">{getUserDisplayName(user)}</div>
                  <div className="user-details">
                    ID: {user.id}
                    {user.requestReason && (
                      <div className="request-reason">
                        <strong>Причина:</strong> {user.requestReason}
                      </div>
                    )}
                    {user.requestedAt && (
                      <div className="request-time">
                        {new Date(user.requestedAt).toLocaleString('ru-RU')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="user-actions">
                  {getStatusBadge(user.status)}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onGrantAccess(user.id)}
                  >
                    Предоставить доступ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="users-section">
        <h2>Все пользователи</h2>
        {users.length === 0 ? (
          <div className="empty-state">
            <p>Нет пользователей</p>
          </div>
        ) : (
          <div className="users-list">
            {users.map((user) => (
              <div
                key={user.id}
                className={`user-card ${requestedUserIds.has(user.id) ? 'has-request' : ''}`}
              >
                <div className="user-info">
                  <div className="user-name">{getUserDisplayName(user)}</div>
                  <div className="user-details">
                    ID: {user.id}
                    {getRoleBadge(user.role)}
                  </div>
                </div>
                <div className="user-actions">
                  {getStatusBadge(user.status)}
                  <div className="action-buttons">
                    {user.status === 'no_access' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onGrantAccess(user.id)}
                      >
                        Предоставить доступ
                      </button>
                    )}
                    {user.status === 'blocked' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => onUnblockUser(user.id)}
                      >
                        Снять блок
                      </button>
                    )}
                    {user.status === 'has_access' && user.id !== currentUserId && (
                      <>
                        {user.role === 'user' && onPromoteToAdmin && (
                          <button
                            className="btn btn-sm btn-admin"
                            onClick={() => onPromoteToAdmin(user.id)}
                          >
                            Сделать администратором
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onBlockUser(user.id)}
                        >
                          Заблокировать
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

