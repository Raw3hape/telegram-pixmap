# 🚀 ИНСТРУКЦИЯ ПО ДЕПЛОЮ НА RAILWAY

## ✅ Что уже сделано:
- Git репозиторий инициализирован
- Все файлы добавлены и закоммичены
- Конфигурация Railway готова (railway.json)
- Telegram интеграция реализована

## 📋 Что нужно сделать ВАМ:

### 1️⃣ Создайте Telegram бота (5 минут)
1. Откройте Telegram и найдите **@BotFather**
2. Отправьте команду `/newbot`
3. Придумайте имя бота (например: "PixMap Game")
4. Придумайте уникальный username (например: "YourPixMapBot")
5. **СОХРАНИТЕ ТОКЕН** - выглядит как: `110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`

### 2️⃣ Загрузите проект на GitHub (3 минуты)
1. Создайте новый репозиторий на [github.com/new](https://github.com/new)
   - Название: `telegram-pixmap`
   - Приватность: можно оставить Public
   - НЕ добавляйте README, .gitignore или лицензию
2. В терминале выполните:
```bash
cd /Users/nikita/Desktop/Apps/BattleMap/telegram-pixmap
git remote add origin https://github.com/ВАШ_GITHUB/telegram-pixmap.git
git branch -M main
git push -u origin main
```

### 3️⃣ Разверните на Railway (10 минут)

#### A. Регистрация на Railway:
1. Перейдите на [railway.app](https://railway.app)
2. Нажмите "Start a New Project"
3. Войдите через GitHub

#### B. Создание проекта:
1. Нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Найдите и выберите **telegram-pixmap**

#### C. Добавьте базы данных:
1. В проекте нажмите **"+ New"** → **"Database"** → **"Add Redis"**
2. Снова нажмите **"+ New"** → **"Database"** → **"Add MySQL"**
3. Подождите пока базы данных запустятся (2-3 минуты)

#### D. Настройте переменные:
1. Кликните на основной сервис (не на базы данных)
2. Перейдите во вкладку **"Variables"**
3. Нажмите **"RAW Editor"** и вставьте:
```
PORT=8080
HOST=0.0.0.0
SESSION_SECRET=your_random_secret_string_32_chars_long
TELEGRAM_BOT_TOKEN=ВАШ_ТОКЕН_ОТ_BOTFATHER
CAPTCHA_TIME=-1
USE_PROXYCHECK=0
USE_XREALIP=1
HOURLY_EVENT=0
USE_MAILER=0
```
4. Замените `ВАШ_ТОКЕН_ОТ_BOTFATHER` на реальный токен из шага 1
5. Нажмите **"Update Variables"**

#### E. Получите URL приложения:
1. Перейдите в **"Settings"** → **"Networking"**
2. Нажмите **"Generate Domain"**
3. Скопируйте URL (например: `https://telegram-pixmap.up.railway.app`)

### 4️⃣ Настройте бота в Telegram (2 минуты)
1. Вернитесь к **@BotFather**
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Нажмите **"Bot Settings"**
5. Нажмите **"Menu Button"**
6. Отправьте URL от Railway (из шага 3E)
7. Введите текст кнопки: **"🎨 Играть"**

## ✨ ГОТОВО!

Откройте вашего бота в Telegram и нажмите кнопку меню (слева от поля ввода).

## 🔥 Проверка:
1. Откройте вашего бота
2. Нажмите кнопку "🎨 Играть"
3. Должен открыться канвас PixMap
4. Выберите цвет и тапните для размещения пикселя

## ⚠️ Если что-то не работает:

### Проблема: "Бот не отвечает"
- Проверьте что токен бота правильный
- Убедитесь что переменная TELEGRAM_BOT_TOKEN установлена в Railway

### Проблема: "Страница не загружается"
- Проверьте логи в Railway (Deployments → View Logs)
- Убедитесь что MySQL и Redis запущены (зеленые индикаторы)
- Подождите 5 минут после первого деплоя

### Проблема: "Ошибка авторизации"
- Проверьте что TELEGRAM_BOT_TOKEN точно соответствует токену от BotFather
- Проверьте что SESSION_SECRET установлен

## 💡 Полезные команды:

Просмотр логов в Railway:
- Откройте ваш проект → Deployments → View Logs

Перезапуск приложения:
- Settings → Restart

Обновление после изменений:
```bash
git add .
git commit -m "Update"
git push
```
Railway автоматически задеплоит изменения.

## 📞 Нужна помощь?
1. Проверьте логи в Railway
2. Убедитесь что все переменные установлены
3. Проверьте что URL в BotFather соответствует Railway URL

---
Удачи с вашим Telegram PixMap! 🎮✨