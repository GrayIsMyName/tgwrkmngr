# WorkManager - Telegram Mini App

Приложение для управления данными через Telegram Mini Apps с поддержкой ролей администратора и обычных пользователей.

## Возможности

- 📊 Таблица с данными (Наименование, Номер МЛ, Дата, Фамилия, Количество)
- 👥 Управление пользователями для администраторов
- 🔒 Контроль доступа с запросами на предоставление прав
- 🔑 Администраторская панель с расширенными возможностями
- 📱 Адаптированный под мобильные устройства интерфейс
- 🔄 Автоматическая синхронизация данных между пользователями
- ⏰ Запросы на доступ с нотификациями
- 🗑️ Управление данными (добавление, редактирование, удаление)

## Технологии

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, SQLite
- **Storage**: Centralized database через API
- **Deployment**: GitHub Pages + Railway

## Установка

### Frontend

```bash
npm install
npm run dev
```

### Backend (Bot)

```bash
cd bot
npm install
npm run dev
```

## Деплой

### Frontend

1. Сборка:
```bash
npm run build
xcopy dist\* docs\ /E /I /Y
git add .
git commit -m "Build frontend"
git push
```

2. Включите GitHub Pages в настройках репозитория (branch: main, folder: /docs)

### Backend

Следуйте инструкции в [DEPLOY_BOT.md](DEPLOY_BOT.md)

## Настройка

1. Откройте Telegram @BotFather
2. Создайте бота и получите токен
3. Настройте Mini App в BotFather
4. Задеплойте бота на Railway
5. Обновите `VITE_API_URL` в `.env`
6. Пересоберите и задеплойте frontend

## Пароль администратора

По умолчанию: `X9$kP2mQ@vL8nR4wT`

## Структура проекта

```
.
├── src/              # Frontend React приложение
├── bot/              # Backend API сервер
├── docs/             # GitHub Pages deployment
└── dist/             # Build artifacts
```

## API Documentation

См. [bot/README.md](bot/README.md) для подробной документации API.

## Лицензия

MIT
