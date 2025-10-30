import { useState, useEffect, useRef } from 'react';
import './DropdownMenu.css';

interface DropdownMenuProps {
  isAdmin: boolean;
  onLogoutAdmin?: () => void;
  onLogoutUser?: () => void;
  onBecomeAdmin?: () => void;
  onUserManagement?: () => void;
  onClearAll?: () => void;
  pendingRequestsCount?: number;
}

export default function DropdownMenu({
  isAdmin,
  onLogoutAdmin,
  onLogoutUser,
  onBecomeAdmin,
  onUserManagement,
  onClearAll,
  pendingRequestsCount = 0,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (callback?: () => void) => {
    setIsOpen(false);
    callback?.();
  };

  return (
    <div className="dropdown-menu-container" ref={menuRef}>
      <button
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Меню действий"
      >
        ☰
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {isAdmin ? (
            <>
              <button
                className="dropdown-item"
                onClick={() => handleItemClick(onLogoutAdmin)}
              >
                Выйти из админки
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleItemClick(onUserManagement)}
              >
                Управление пользователями
                {pendingRequestsCount > 0 && (
                  <span className="dropdown-badge">{pendingRequestsCount}</span>
                )}
              </button>
              <button
                className="dropdown-item dropdown-item-danger"
                onClick={() => handleItemClick(onClearAll)}
              >
                Очистить таблицу
              </button>
            </>
          ) : (
            <>
              {onLogoutUser && (
                <button
                  className="dropdown-item"
                  onClick={() => handleItemClick(onLogoutUser)}
                >
                  Выйти
                </button>
              )}
              <button
                className="dropdown-item"
                onClick={() => handleItemClick(onBecomeAdmin)}
              >
                Стать администратором
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

