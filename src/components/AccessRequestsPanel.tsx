import type { User } from '../types';
import './AccessRequestsPanel.css';

interface AccessRequestsPanelProps {
  pendingRequests: User[];
  onGrantAccess: (userId: number) => void;
  onBack: () => void;
}

export default function AccessRequestsPanel({
  pendingRequests,
  onGrantAccess,
  onBack,
}: AccessRequestsPanelProps) {
  const getUserDisplayName = (user: User) => {
    const parts = [user.firstName];
    if (user.lastName) parts.push(user.lastName);
    if (user.username) parts.push(`@${user.username}`);
    return parts.join(' ');
  };

  return (
    <div className="access-requests-panel">
      <div className="access-requests-header">
        <button className="btn-back" onClick={onBack}>
          ← Назад
        </button>
        <h1>Запросы на доступ</h1>
        {pendingRequests.length > 0 && (
          <span className="badge badge-count">{pendingRequests.length}</span>
        )}
      </div>

      {pendingRequests.length === 0 ? (
        <div className="empty-state">
          <p>Нет запросов на доступ</p>
        </div>
      ) : (
        <div className="requests-list">
          {pendingRequests.map((user) => (
            <div key={user.id} className="request-card">
              <div className="request-info">
                <div className="user-name">{getUserDisplayName(user)}</div>
                <div className="request-details">
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
              <div className="request-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => onGrantAccess(user.id)}
                >
                  Предоставить доступ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

