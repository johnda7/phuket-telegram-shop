#!/bin/bash
# 🔧 Скрипт для очистки портов 8080, 5000, 5001, 5173

echo "🧹 Очищаю порты от старых процессов..."

# Находим и убиваем процессы на портах
PORTS=(8080 5000 5001 5173)

for PORT in "${PORTS[@]}"; do
    PIDS=$(lsof -ti:$PORT)
    if [ ! -z "$PIDS" ]; then
        echo "   🔴 Убиваю процессы на порту $PORT: $PIDS"
        kill -9 $PIDS 2>/dev/null
    else
        echo "   ✅ Порт $PORT свободен"
    fi
done

# Очищаем старые npm/vite процессы
echo ""
echo "🧹 Очищаю старые Node.js процессы..."

pkill -f "vite" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null

sleep 2

echo ""
echo "✅ Готово! Теперь можно запускать серверы:"
echo "   npm run dev"



