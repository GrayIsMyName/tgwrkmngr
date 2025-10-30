import { useState } from 'react';
import './RequestAccessDialog.css';

interface RequestAccessDialogProps {
  onClose: () => void;
  onRequest: (reason?: string) => void;
}

export default function RequestAccessDialog({ onClose, onRequest }: RequestAccessDialogProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequest(reason.trim() || undefined);
    onClose();
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>Запрос доступа</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="dialog-content">
            <p>Запросите доступ у администратора. Можно указать причину запроса (необязательно).</p>
            
            <div className="form-group">
              <label htmlFor="reason">Причина запроса (необязательно)</label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Укажите причину, по которой вам нужен доступ"
                rows={4}
              />
            </div>
          </div>

          <div className="dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Отправить запрос
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

