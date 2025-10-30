import type { TableRow } from '../types';
import DropdownMenu from './DropdownMenu';
import './TableView.css';

interface TableViewProps {
  rows: TableRow[];
  isAdmin: boolean;
  onAdd: () => void;
  onEdit: (row: TableRow) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onBecomeAdmin: () => void;
  onUserManagement?: () => void;
  pendingRequestsCount?: number;
  onLogoutAdmin?: () => void;
  onLogoutUser?: () => void;
}

export default function TableView({
  rows,
  isAdmin,
  onAdd,
  onEdit,
  onDelete,
  onClearAll,
  onBecomeAdmin,
  onUserManagement,
  pendingRequestsCount = 0,
  onLogoutAdmin,
  onLogoutUser,
}: TableViewProps) {
  return (
    <div className="table-view">
      <div className="header">
        <button className="btn btn-primary" onClick={onAdd}>
          + Добавить
        </button>
        <DropdownMenu
          isAdmin={isAdmin}
          onLogoutAdmin={onLogoutAdmin}
          onLogoutUser={onLogoutUser}
          onBecomeAdmin={onBecomeAdmin}
          onUserManagement={onUserManagement}
          onClearAll={onClearAll}
          pendingRequestsCount={pendingRequestsCount}
        />
      </div>

      {rows.length === 0 ? (
        <div className="empty-state">
          <p>Таблица пуста. Добавьте первую строку!</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Номер МЛ</th>
                <th>Дата</th>
                <th>Фамилия</th>
                <th>Количество</th>
                {isAdmin && <th>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} onClick={() => isAdmin && onEdit(row)} className={isAdmin ? 'clickable' : ''}>
                  <td>{row.name}</td>
                  <td>{row.mlNumber}</td>
                  <td>{new Date(row.date).toLocaleDateString('ru-RU')}</td>
                  <td>{row.surname}</td>
                  <td>{row.quantity}</td>
                  {isAdmin && (
                    <td>
                      <button
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row.id);
                        }}
                        aria-label="Удалить"
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

