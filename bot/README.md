# WorkManager Bot Backend

Telegram bot backend для хранения данных Mini App.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Запустите бота локально:
```bash
npm run dev
```

## Деплой на Railway

1. Создайте аккаунт на https://railway.app
2. Создайте новый проект
3. Подключите GitHub репозиторий
4. Railway автоматически деплоит бота
5. Получите URL (например: `https://your-bot.railway.app`)

## Конфигурация

Бот не требует дополнительной конфигурации. База данных SQLite создается автоматически в папке `data/`.

## API Endpoints

Все endpoints принимают POST запросы:

- `POST /` - Health check
- `POST /api/table/get` - Получить все данные таблицы
- `POST /api/table/save` - Сохранить строку
- `POST /api/table/delete` - Удалить строку
- `POST /api/table/clear` - Очистить таблицу
- `POST /api/users/get` - Получить всех пользователей
- `POST /api/users/get-by-id` - Получить пользователя по ID
- `POST /api/users/save` - Сохранить пользователя
- `POST /api/users/role` - Получить роль пользователя
- `POST /api/users/set-role` - Установить роль
- `POST /api/users/pending-requests` - Получить запросы на доступ
- `POST /api/admin/verify-password` - Проверить пароль админа

## Структура базы данных

### users
- id (INTEGER PRIMARY KEY)
- firstName (TEXT)
- lastName (TEXT)
- username (TEXT)
- status (TEXT)
- requestedAt (TEXT)
- requestReason (TEXT)

### table_data
- id (TEXT PRIMARY KEY)
- name (TEXT)
- mlNumber (TEXT)
- date (TEXT)
- surname (TEXT)
- quantity (INTEGER)
- createdBy (INTEGER)
- createdAt (TEXT)

### user_roles
- userId (INTEGER PRIMARY KEY)
- role (TEXT)

### admin_settings
- key (TEXT PRIMARY KEY)
- value (TEXT)

