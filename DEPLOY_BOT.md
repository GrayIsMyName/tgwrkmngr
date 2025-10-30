# Инструкция по деплою бота на Railway

## Шаг 1: Установка зависимостей

```bash
cd bot
npm install
```

## Шаг 2: Тест локально

```bash
npm run dev
```

Откройте браузер и перейдите на http://localhost:3000
Должно отобразиться: `{"status":"ok","message":"WorkManager Bot API"}`

## Шаг 3: Деплой на Railway

### 3.1 Создайте аккаунт

1. Перейдите на https://railway.app
2. Зарегистрируйтесь через GitHub

### 3.2 Создайте проект

1. Нажмите "New Project"
2. Выберите "Deploy from GitHub repo"
3. Выберите репозиторий `tgwrkmngr`
4. Railway автоматически обнаружит папку `bot`

### 3.3 Настройте деплой

1. Railway автоматически определит Node.js проект
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Port: Railway автоматически выберет порт

### 3.4 Получите URL

1. После деплоя Railway предоставит URL
2. Пример: `https://your-bot-production.up.railway.app`
3. Скопируйте этот URL

## Шаг 4: Обновите frontend

1. Создайте файл `.env` в корне проекта:
```
VITE_API_URL=https://your-bot-production.up.railway.app
```

2. Пересоберите frontend:
```bash
npm run build
```

3. Обновите GitHub Pages:
```bash
xcopy dist\* docs\ /E /I /Y
git add .
git commit -m "Update API URL to Railway"
git push
```

## Шаг 5: Тестирование

1. Откройте Mini App в Telegram
2. Проверьте, что данные загружаются
3. Создайте новую строку
4. На другом устройстве откройте приложение
5. Проверьте, что данные синхронизировались

## Troubleshooting

### Бот не запускается

Проверьте логи в Railway Dashboard:
- Убедитесь, что все зависимости установлены
- Проверьте, что порт правильно настроен

### Данные не синхронизируются

1. Проверьте URL API в `.env`
2. Проверьте CORS настройки (если есть)
3. Проверьте логи бота в Railway

### База данных не сохраняется

Railway предоставляет персистентное хранилище. База данных сохраняется в папке `data/`.

## Альтернатива: Render.com

Если Railway не подходит:

1. Создайте аккаунт на https://render.com
2. Выберите "New Web Service"
3. Подключите GitHub репозиторий
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Получите URL

## Альтернатива: VPS

Для полного контроля:

1. Арендуйте VPS (Hetzner, DigitalOcean)
2. Установите Node.js
3. Загрузите код
4. Настройте PM2 для процесса
5. Настройте nginx как reverse proxy

