#!/bin/bash

# Скрипт для загрузки на GitHub после создания репозитория

echo "📤 Загрузка проекта на GitHub..."

# Проверка, что репозиторий создан
echo "Проверка доступности репозитория..."
if ! git ls-remote https://github.com/Raw3hape/telegram-pixmap.git HEAD &>/dev/null; then
    echo "❌ Репозиторий не найден!"
    echo "Пожалуйста, создайте репозиторий на GitHub:"
    echo "1. Откройте https://github.com/new"
    echo "2. Название: telegram-pixmap"
    echo "3. НЕ добавляйте README или .gitignore"
    echo "4. Создайте репозиторий и запустите этот скрипт снова"
    exit 1
fi

echo "✅ Репозиторий найден!"

# Настройка remote
git remote remove origin 2>/dev/null
git remote add origin https://github.com/Raw3hape/telegram-pixmap.git

# Push
echo "📤 Загрузка кода..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Успешно загружено на GitHub!"
    echo ""
    echo "🔗 Ваш репозиторий: https://github.com/Raw3hape/telegram-pixmap"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Зайдите на railway.app"
    echo "2. Создайте новый проект из этого репозитория"
    echo "3. Следуйте инструкциям в DEPLOY_INSTRUCTIONS.md"
else
    echo "❌ Ошибка при загрузке"
    echo "Возможно, нужна авторизация GitHub"
    echo "Попробуйте: gh auth login"
fi