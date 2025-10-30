# Быстрый деплой backend - БЕСПЛАТНО

## Выберите хостинг (все бесплатные)

### Вариант 1: Render.com (рекомендую)
- ✅ Полностью бесплатно
- ✅ Не засыпает (free tier includes webhooks)
- ✅ Автоматический деплой из GitHub

### Вариант 2: Railway
- ✅ Легко настроить
- ⚠️ Бесплатно только первый месяц, потом платно

## Инструкция для Render.com

### Шаг 1: Откройте Render
1. Перейдите на https://render.com
2. Нажмите "Get Started for Free"
3. Зарегистрируйтесь через GitHub

### Шаг 2: Создайте Web Service
1. Нажмите "New +"
2. Выберите "Web Service"
3. Подключите GitHub репозиторий `tgwrkmngr`
4. Настройте:
   - **Root Directory**: `bot`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Шаг 3: Дождитесь деплоя
1. Render автоматически:
   - Установит зависимости
   - Соберет проект
   - Запустит сервер
2. Подождите 3-5 минут

### Шаг 4: Получите URL
1. После деплоя Render предоставит URL
2. Пример: `https://workmanager-api.onrender.com`
3. Скопируйте этот URL

### Шаг 5: Обновите frontend

В корне проекта создайте файл `.env`:
```
VITE_API_URL=https://your-railway-url.up.railway.app
```

Замените `your-render-url` на ваш URL из шага 4.

### Шаг 6: Пересоберите frontend
```bash
npm run build
xcopy dist\* docs\ /E /I /Y
git add .
git commit -m "Add backend API URL"
git push
```

### Шаг 7: Проверьте работу
1. Откройте Mini App в Telegram
2. Проверьте, что данные загружаются
3. Добавьте строку в таблицу
4. Откройте на другом устройстве - данные должны синхронизироваться!

## Готово! 🎉

Теперь у вас есть полностью рабочее приложение с синхронизацией данных между пользователями!

