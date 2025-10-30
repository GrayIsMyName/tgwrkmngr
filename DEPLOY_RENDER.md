# Деплой на Render.com - БЕСПЛАТНО

## Пошаговая инструкция

### Шаг 1: Создайте аккаунт
1. Перейдите на https://render.com
2. Нажмите "Get Started for Free"
3. Зарегистрируйтесь через GitHub

### Шаг 2: Создайте Web Service
1. Нажмите "New +"
2. Выберите "Web Service"
3. Подключите GitHub репозиторий `tgwrkmngr`

### Шаг 3: Настройте сервис
- **Name**: `workmanager-api` (любое)
- **Root Directory**: `bot`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Шаг 4: Выберите план
- Выберите **Free** план
- Нажмите "Create Web Service"

### Шаг 5: Дождитесь деплоя
- Render автоматически установит зависимости и запустит сервис
- Подождите 3-5 минут

### Шаг 6: Получите URL
- Render предоставит URL типа: `https://workmanager-api.onrender.com`
- Скопируйте его

### Шаг 7: Обновите frontend
Создайте `.env` в корне проекта:
```
VITE_API_URL=https://workmanager-api.onrender.com
```

Затем:
```bash
npm run build
xcopy dist\* docs\ /E /I /Y
git add .
git commit -m "Update API URL to Render"
git push
```

### Шаг 8: Проверьте работу
Откройте Mini App в Telegram и проверьте синхронизацию!

## ⚠️ Важно

Render free tier может "засыпать" после 15 минут бездействия, но просыпается при первом запросе (занимает ~30 секунд).

Для production можно обновить до Starter plan за $7/мес, но free tier подходит для большинства случаев.

## Альтернатива: Fly.io

Fly.io также предоставляет бесплатный tier:
1. https://fly.io
2. Установите flyctl
3. Запустите: `flyctl launch`
4. Получите URL

