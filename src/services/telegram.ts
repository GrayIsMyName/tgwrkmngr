// Get current Telegram user
export const getTelegramUser = () => {
  // @ts-ignore - Telegram Web App API
  const tg = window.Telegram?.WebApp;
  
  if (tg?.initDataUnsafe?.user) {
    return tg.initDataUnsafe.user;
  }
  
  // Fallback for development
  return {
    id: 123456789,
    first_name: 'Test',
    last_name: 'User',
    username: 'testuser'
  };
};

// Initialize Telegram WebApp
export const initTelegramWebApp = () => {
  // @ts-ignore - Telegram Web App API
  const tg = window.Telegram?.WebApp;
  
  if (tg) {
    tg.ready();
    tg.expand();
  }
};

// Show Telegram alert
export const showAlert = (message: string): void => {
  // @ts-ignore - Telegram Web App API
  const tg = window.Telegram?.WebApp;
  
  if (tg?.showAlert) {
    tg.showAlert(message);
  } else {
    alert(message);
  }
};

// Show Telegram confirm
export const showConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // @ts-ignore - Telegram Web App API
    const tg = window.Telegram?.WebApp;
    
    if (tg?.showConfirm) {
      tg.showConfirm(message, (confirmed: boolean) => {
        resolve(confirmed);
      });
    } else {
      resolve(confirm(message));
    }
  });
};

