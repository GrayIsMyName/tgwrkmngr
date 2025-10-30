# Быстрый деплой на GitHub Pages

## Инструкция

### Шаг 1: Настройка Git (если еще не настроено)

Выполните в терминале (замените на ваши данные):
```bash
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"
```

### Шаг 2: Создайте репозиторий на GitHub

1. Перейдите на https://github.com/new
2. Имя репозитория: `telegram-work-manager` (или любое другое)
3. НЕ ставите галочку "Initialize this repository with a README"
4. Нажмите "Create repository"

### Шаг 3: Подключите локальный репозиторий к GitHub

Скопируйте URL вашего репозитория (например: `https://github.com/YOUR_USERNAME/telegram-work-manager.git`)

В терминале выполните (ЗАМЕНИТЕ URL на ваш):
```bash
git remote add origin https://github.com/YOUR_USERNAME/telegram-work-manager.git
git branch -M main
git push -u origin main
```

### Шаг 4: Подготовьте файлы для деплоя

```bash
npm run build
mkdir docs
xcopy dist\* docs\ /E /I /Y
git add docs
git commit -m "Add deployment files"
git push
```

### Шаг 5: Включите GitHub Pages

1. Перейдите в Settings вашего репозитория на GitHub
2. В левом меню найдите "Pages"
3. Source: выберите "Deploy from a branch"
4. Branch: выберите `main` и папку `/docs`
5. Нажмите "Save"
6. Подождите 1-2 минуты

### Шаг 6: Получите URL

Ваш URL будет:
```
https://YOUR_USERNAME.github.io/REPOSITORY_NAME/
```

Например: `https://username.github.io/telegram-work-manager/`

---

## Настройка в BotFather

1. Откройте @BotFather
2. Напишите `/mybots`
3. Выберите `wrk_mngr_bot`
4. Выберите "Bot Settings" → "Menu Button"
5. Для текста кнопки: `Work Manager`
6. Для URL: вставьте ваш GitHub Pages URL
7. Готово!

---

## Важно

После деплоя измените пароль администратора в файле `src/services/storage.ts`!

Текущий пароль: `X9$kP2mQ@vL8nR4wT`

