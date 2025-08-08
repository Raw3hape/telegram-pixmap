# 🎨 Telegram PixMap - Mini App Version

Адаптированная версия PixMap для работы как Telegram Mini App. Полноценная пиксельная карта 65k x 65k прямо в Telegram!

## 🚀 Быстрый старт за 5 минут

### Шаг 1: Создайте бота в Telegram
1. Откройте [@BotFather](https://t.me/botfather)
2. Отправьте `/newbot`
3. Выберите имя и username
4. Сохраните токен (выглядит как: `110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`)

### Шаг 2: Разверните на Railway
1. **Форкните этот репозиторий** на GitHub
2. **Зарегистрируйтесь на [Railway.app](https://railway.app)** (бесплатно $5/месяц)
3. **Создайте новый проект:**
   - New Project → Deploy from GitHub repo
   - Выберите ваш форк
4. **Добавьте базы данных в том же проекте:**
   - New → Database → Add Redis
   - New → Database → Add MySQL
5. **Настройте переменные (Variables):**
   ```
   TELEGRAM_BOT_TOKEN=ваш_токен_от_botfather
   SESSION_SECRET=любая_случайная_строка
   CAPTCHA_TIME=-1
   ```
6. **Получите URL:**
   - Settings → Networking → Generate Domain
   - Скопируйте URL (например: `https://your-app.up.railway.app`)

### Шаг 3: Настройте бота
1. Вернитесь в @BotFather
2. Выберите вашего бота
3. Отправьте `/setmenubutton`
4. Введите название: `🎨 Открыть канвас`
5. Введите URL от Railway

**Готово!** Откройте бота и нажмите кнопку меню.

## 🛠️ Локальная установка (для разработки)

```bash
# Клонируйте и перейдите в папку
git clone https://github.com/your-username/telegram-pixmap.git
cd telegram-pixmap

# Запустите автоматическую установку
./setup-local.sh

# Отредактируйте .env файл
nano .env  # Добавьте TELEGRAM_BOT_TOKEN

# Запустите сервер
pm2 start ecosystem.yml

# Создайте HTTPS туннель (в новом терминале)
ngrok http 8080

# Скопируйте HTTPS URL и настройте в @BotFather
```

## 📱 Что реализовано

### Telegram интеграция
- ✅ Автоматическая авторизация через Telegram ID
- ✅ Полноэкранный режим
- ✅ Haptic Feedback (вибрация)
- ✅ Адаптация под тему Telegram
- ✅ Кнопка "Поделиться" для отправки в чаты
- ✅ Работа без капчи для Telegram пользователей

### Мобильная оптимизация
- ✅ Жесты: pinch-to-zoom, swipe для навигации
- ✅ Оптимизированные тач-контролы
- ✅ Адаптивный интерфейс
- ✅ Быстрая загрузка тайлов
- ✅ Кнопки 44x44px для удобного нажатия

### Основной функционал PixMap
- ✅ Канвас 65k x 65k пикселей
- ✅ Real-time синхронизация через WebSocket
- ✅ 30 цветов палитры
- ✅ Система кулдаунов (3-5 секунд)
- ✅ Стекирование пикселей до минуты

## 🔧 Переменные окружения

### Обязательные
```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_botfather
SESSION_SECRET=случайная_строка_для_сессий
REDIS_URL=redis://... (Railway заполнит автоматически)
MYSQL_HOST=... (Railway заполнит автоматически)
MYSQL_USER=... (Railway заполнит автоматически)
MYSQL_PW=... (Railway заполнит автоматически)
MYSQL_DATABASE=... (Railway заполнит автоматически)
```

### Рекомендуемые
```env
CAPTCHA_TIME=-1  # Отключить капчу
USE_XREALIP=1    # Для работы за прокси
PORT=8080        # Порт сервера
HOST=0.0.0.0     # Хост сервера
```

## 📂 Структура проекта

```
telegram-pixmap/
├── src/
│   ├── core/
│   │   └── telegram.js         # Telegram авторизация
│   ├── components/
│   │   ├── TelegramLogin.jsx   # Компонент входа
│   │   └── MobileOptimizations.jsx
│   ├── routes/api/auth/
│   │   └── telegram.js         # API эндпоинт
│   ├── server/middleware/
│   │   └── security.js         # CORS и iframe
│   ├── styles/
│   │   └── telegram.css        # Мобильные стили
│   └── telegram-webapp.js      # WebApp SDK интеграция
├── deploy.sh                    # Скрипт деплоя
├── setup-local.sh              # Локальная установка
├── railway.json                # Конфиг Railway
├── ecosystem.yml               # PM2 конфигурация
└── .env.example                # Пример переменных
```

## 🚀 Деплой обновлений

### Railway (автоматически)
```bash
git add .
git commit -m "Update"
git push origin main
# Railway автоматически задеплоит
```

### Локально
```bash
git pull
npm install
npm run build
pm2 restart telegram-pixmap
```

## 🐛 Решение проблем

### "Не открывается в Telegram"
- ✅ Проверьте HTTPS (обязателен!)
- ✅ Проверьте токен бота
- ✅ Проверьте URL в @BotFather

### "Ошибка авторизации"
- ✅ Проверьте TELEGRAM_BOT_TOKEN
- ✅ Проверьте Redis подключение
- ✅ Смотрите логи: `pm2 logs`

### "WebSocket не подключается"
- ✅ Проверьте CORS настройки
- ✅ Проверьте, что порт открыт
- ✅ Railway должен сгенерировать domain

## 📊 Мониторинг

### Railway Dashboard
- Метрики в реальном времени
- Логи всех сервисов
- Использование ресурсов

### PM2 (локально)
```bash
pm2 status        # Статус процессов
pm2 logs          # Просмотр логов
pm2 monit         # Мониторинг
```

## 🎮 Использование

1. **Откройте бота** в Telegram
2. **Нажмите кнопку меню** (слева от поля ввода)
3. **Канвас откроется** в полноэкранном режиме
4. **Выберите цвет** внизу экрана
5. **Тапните** для размещения пикселя
6. **Pinch** для зума, **swipe** для перемещения

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку: `git checkout -b feature/awesome`
3. Внесите изменения
4. Коммит: `git commit -m 'Add awesome feature'`
5. Push: `git push origin feature/awesome`
6. Создайте Pull Request

## 📄 Лицензия

GPL-3.0 (унаследована от PixelPlanet)

## 🙏 Благодарности

- [PixelPlanet](https://pixelplanet.fun) - оригинальный код
- [PixMap](https://pixmap.fun) - форк с улучшениями
- [Telegram](https://telegram.org) - платформа Mini Apps

## 💬 Поддержка

Если есть вопросы:
- Создайте [Issue на GitHub](https://github.com/your-username/telegram-pixmap/issues)
- Telegram: @your_username

---

Made with ❤️ for Telegram Mini Apps