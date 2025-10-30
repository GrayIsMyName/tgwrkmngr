import './AccessDeniedView.css';

interface AccessDeniedViewProps {
  onRequestAccess: () => void;
  onAdminLogin: () => void;
}

export default function AccessDeniedView({ onRequestAccess, onAdminLogin }: AccessDeniedViewProps) {
  return (
    <div className="access-denied">
      <div className="access-denied-content">
        <div className="access-denied-icon">🔒</div>
        <h1>Доступ ограничен</h1>
        <p>Для работы с приложением требуется доступ администратора.</p>
        
        <div className="access-denied-actions">
          <button className="btn btn-primary" onClick={onRequestAccess}>
            Запросить доступ
          </button>
          
          <button className="btn btn-secondary" onClick={onAdminLogin}>
            Войти как администратор
          </button>
        </div>
      </div>
    </div>
  );
}

