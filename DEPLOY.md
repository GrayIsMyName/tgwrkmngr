# Инструкция по развертыванию Work Manager Mini App

## Шаг 1: Выберите хостинг

### Вариант A: GitHub Pages (бесплатно)

1. Создайте репозиторий на GitHub
2. Загрузите код: 
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
3. В настройках репозитория: Settings → Pages
4. Source: Deploy from a branch → main → /docs
5. Скопируйте файлы из `dist` в папку `docs`:
   ```bash
   npm run build
   mv dist docs
   git add docs
   git commit -m "Deploy"
   git push
   ```
6. Ваш URL будет: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Вариант B: Vercel (бесплатно, рекомендуемый)

1. Установите Vercel CLI: `npm i -g vercel`
2. Войдите: `vercel login`
3. Деплой: `vercel --prod`
4. Ваш URL: `https://YOUR_APP.vercel.app`

### Вариант C: Netlify (бесплатно)

1. Установите Netlify CLI: `npm i -g netlify-cli`
2. Деплой: `netlify deploy --prod --dir=dist`
3. Ваш URL: `https://YOUR_APP.netlify.app`

---

## Шаг 2: Настройка в BotFather

После деплоя получите URL вашего приложения (например, `https://your-app.netlify.app`).

### 2.1. Откройте @BotFather в Telegram

### 2.2. Выберите вашего бота:
```
/mybots
```
Выберите `wrk_mngr_bot`

### 2.3. Выберите "Bot Settings" → "Menu Button"

### 2.4. На вопрос "What text should the button show?" введите:
```
Work Manager
```

### 2.5. На вопрос "What web app URL should the button open?" введите ваш URL:
```
https://your-app.netlify.app
```
(Замените на ваш реальный URL)

### 2.6. Готово! ✅

Теперь в вашем боте появится кнопка меню, которая откроет Mini App.

---

## Шаг 3: Тестирование

1. Откройте вашего бота `@wrk_mngr_bot`
2. Нажмите на кнопку меню (внизу экрана)
3. Mini App должно открыться

---

## Важные заметки

- Токен бота: `7958016927:AAGPBng4R2LYx0zwG5exF5ZKJNAZB7F4wxg` ⚠️ **Держите в секрете!**
- Пароль администратора: `X9$kP2mQ@vL8nR4wT` ⚠️ **Смените перед продакшеном!**
- URL должен быть HTTPS (обязательно)
- Все пользователи изначально будут без доступа

---

## Что делать дальше?

1. Задеплойте приложение на один из хостингов
2. Настройте Menu Button в BotFather
3. Откройте бота и войдите как администратор с паролем
4. Предоставьте доступ пользователям через панель управления

