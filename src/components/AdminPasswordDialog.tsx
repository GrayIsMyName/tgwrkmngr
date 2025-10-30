import { useState } from 'react';
import { verifyAdminPassword } from '../services/storage';
import './AdminPasswordDialog.css';

interface AdminPasswordDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminPasswordDialog({ onClose, onSuccess }: AdminPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }

    const isValid = await verifyAdminPassword(password);
    if (isValid) {
      onSuccess();
      onClose();
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>Администраторский доступ</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Введите пароль администратора</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              autoFocus
            />
            {error && <div className="error">{error}</div>}
          </div>

          <div className="dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

