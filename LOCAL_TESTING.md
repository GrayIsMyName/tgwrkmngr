# Тестирование локально без деплоя

## Шаг 1: Запустите backend

```bash
cd bot
npm install
npm run dev
```

Backend будет работать на http://localhost:3000

## Шаг 2: Установите ngrok

1. Скачайте https://ngrok.com/download
2. Распакуйте
3. Откройте терминал в папке с ngrok

## Шаг 3: Запустите ngrok

```bash
ngrok http 3000
```

Вы получите публичный URL, например: `https://abc123.ngrok.io`

## Шаг 4: Обновите конфигурацию

Создайте `.env` в корне проекта:
```
VITE_API_URL=https://abc123.ngrok.io
```

## Шаг 5: Пересоберите frontend

```bash
npm run build
xcopy dist\* docs\ /E /I /Y
git add .
git commit -m "Use ngrok for local testing"
git push
```

## Шаг 6: Тестируйте!

Откройте Mini App в Telegram и проверьте работу.

## ⚠️ Важно

- ngrok предоставляет **бесплатный URL** на 2 часа
- После перезапуска ngrok URL изменится
- Для production лучше использовать Railway

## Постоянный URL

Можно зарегистрироваться на ngrok и получить постоянный домен:
1. Зарегистрируйтесь на https://ngrok.com (бесплатно)
2. Получите authtoken
3. Настройте: `ngrok config add-authtoken YOUR_TOKEN`
4. Запустите: `ngrok http 3000`

Но Railway проще и надежнее для постоянного использования!

