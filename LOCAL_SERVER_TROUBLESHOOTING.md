# 🔧 ДИАГНОСТИКА И ВОССТАНОВЛЕНИЕ ЛОКАЛЬНОГО СЕРВЕРА

> **⚠️ КРИТИЧЕСКИ ВАЖНО ДЛЯ АГЕНТА:** Этот файл содержит ПОЛНУЮ инструкцию по диагностике проблем с локальным сервером. **АГЕНТ ДОЛЖЕН САМ РЕШАТЬ ПРОБЛЕМЫ**, не тревожа пользователя вопросами!

---

## 🎯 ГЛАВНОЕ ПРАВИЛО ДЛЯ АГЕНТА

**❌ НЕ ДЕЛАЙ:**
- ❌ "Проверь в браузере" → **САМ ПРОВЕРЯЙ через browser tools!**
- ❌ "Сервер не запускается, что делать?" → **САМ ДИАГНОСТИРУЙ и РЕШАЙ!**
- ❌ "Какой порт использовать?" → **ПРОВЕРЬ в vite.config.ts и package.json!**

**✅ ВСЕГДА ДЕЛАЙ:**
- ✅ Автоматически проверяй порты перед запуском
- ✅ Автоматически очищай старые процессы
- ✅ Автоматически проверяй работу через браузер (browser tools)
- ✅ Автоматически смотри логи ошибок
- ✅ Автоматически исправляй проблемы

---

## 📋 БЫСТРАЯ ДИАГНОСТИКА (ШАГИ ДЛЯ АГЕНТА)

### ШАГ 1: Проверка текущего состояния портов

```bash
# Проверить какие порты заняты
lsof -i :8080 -i :5001 -i :5173 -i :5000 | grep LISTEN

# Если порты заняты - запомнить PID процессов
lsof -ti:8080  # Вернет PID процесса на порту 8080
```

**Что проверять:**
- Порт 8080 → наш проект (phuket-telegram-shop)
- Порт 5001 → второй проект (da-teens-webapp-tele) или другой
- Порт 5173 → Vite default порт
- Порт 5000 → может быть занят другими сервисами

---

### ШАГ 2: Проверка конфигурации проекта

```bash
# Проверить vite.config.ts
cat vite.config.ts | grep -A 3 "port"

# Проверить package.json scripts
cat package.json | grep -A 5 '"scripts"'
```

**Что искать:**
- `port: 8080` в vite.config.ts → наш порт
- `"dev": "vite"` в package.json → команда запуска

---

### ШАГ 3: Очистка старых процессов (ЕСЛИ НУЖНО)

```bash
# Вариант 1: Убить процессы на конкретных портах
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:5001 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Вариант 2: Убить все vite процессы
pkill -f "vite" 2>/dev/null

# Вариант 3: Убить все npm dev процессы
pkill -f "npm run dev" 2>/dev/null

# Проверить что порты освобождены
lsof -i :8080 -i :5001 -i :5173 | grep LISTEN || echo "✅ Порты свободны"
```

---

### ШАГ 4: Запуск сервера

```bash
# Перейти в директорию проекта
cd /Users/evgeniymikhelev/phuket-telegram-shop

# Запустить в фоне
npm run dev > /tmp/phuket-dev.log 2>&1 &

# ИЛИ запустить в фоне через nohup
nohup npm run dev > /tmp/phuket-dev.log 2>&1 &
```

**Важно:**
- Запускать в фоне (`&`) чтобы не блокировать терминал
- Логи в `/tmp/phuket-dev.log` для диагностики

---

### ШАГ 5: Проверка запуска (автоматическая)

```bash
# Подождать 3-5 секунд
sleep 5

# Проверить что сервер запустился
curl -s http://localhost:8080 > /dev/null && echo "✅ Сервер работает!" || echo "❌ Сервер не отвечает"

# Проверить логи на ошибки
tail -20 /tmp/phuket-dev.log | grep -i "error\|failed\|cannot"

# Проверить процесс
ps aux | grep "vite\|npm run dev" | grep -v grep
```

---

### ШАГ 6: Автоматическая проверка через браузер

**КРИТИЧЕСКИ ВАЖНО:** Агент должен САМ проверять через browser tools!

```typescript
// АГЕНТ ДОЛЖЕН ИСПОЛЬЗОВАТЬ ЭТИ TOOLS:

// 1. Навигация на страницу
mcp_cursor-browser-extension_browser_navigate({ url: "http://localhost:8080/map" })

// 2. Сделать snapshot (проверить что страница загрузилась)
mcp_cursor-browser-extension_browser_snapshot()

// 3. Проверить консоль на ошибки
mcp_cursor-browser-extension_browser_console_messages()

// 4. Проверить network requests
mcp_cursor-browser-extension_browser_network_requests()

// 5. Сделать скриншот для проверки
mcp_cursor-browser-extension_browser_take_screenshot({ filename: "map-check.png" })
```

**Процесс для агента:**
1. ✅ Запустил сервер → проверь через `curl`
2. ✅ Подождал 3-5 сек → проверь логи
3. ✅ Открой в браузере через `browser_navigate`
4. ✅ Сделай snapshot → проверь что загрузилось
5. ✅ Проверь console messages → нет ли ошибок
6. ✅ Проверь network requests → все ли загрузилось
7. ✅ Если ошибки → исправь и перезапусти

---

## 🔍 ЧАСТЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ

### Проблема #1: "Port already in use"

**Симптомы:**
```
Error: Port 8080 is already in use
```

**Решение:**
```bash
# 1. Найти процесс на порту
lsof -ti:8080

# 2. Убить процесс
lsof -ti:8080 | xargs kill -9

# 3. Подождать секунду
sleep 1

# 4. Перезапустить
npm run dev
```

---

### Проблема #2: "Cannot GET /"

**Симптомы:**
- Браузер показывает ERR_CONNECTION_REFUSED
- Или пустая страница

**Диагностика:**
```bash
# 1. Проверить что сервер запущен
ps aux | grep vite | grep -v grep

# 2. Проверить что порт слушает
lsof -i :8080 | grep LISTEN

# 3. Проверить логи на ошибки
tail -50 /tmp/phuket-dev.log | grep -i error

# 4. Проверить через curl
curl -v http://localhost:8080
```

**Решение:**
- Если сервер не запущен → запустить заново
- Если порт занят → очистить и перезапустить
- Если ошибки в логах → исправить ошибки

---

### Проблема #3: "Module not found" или ошибки компиляции

**Симптомы:**
```
Failed to resolve import
Cannot find module
```

**Диагностика:**
```bash
# 1. Проверить логи
tail -100 /tmp/phuket-dev.log | grep -A 5 "error\|failed"

# 2. Проверить node_modules
ls node_modules | head -5

# 3. Проверить package.json
cat package.json | grep "dependencies"
```

**Решение:**
```bash
# Переустановить зависимости
rm -rf node_modules package-lock.json
npm install

# Перезапустить
npm run dev
```

---

### Проблема #4: Два проекта конфликтуют

**Симптомы:**
- Один проект не запускается когда работает другой
- Порты меняются автоматически

**Диагностика:**
```bash
# Проверить оба проекта
lsof -i :8080 -i :5001 -i :5173 -i :5000 | grep LISTEN
```

**Решение:**
```bash
# Очистить ВСЕ vite процессы
pkill -f vite

# Подождать
sleep 2

# Запустить проекты по очереди:
# 1. Первый проект на порту 8080
cd /Users/evgeniymikhelev/phuket-telegram-shop && npm run dev &

# 2. Второй проект на своем порту (5173 или другой)
cd /Users/evgeniymikhelev/Documents/GitHub/da-teens-webapp-tele && npm run dev &
```

---

## 🛠️ СКРИПТЫ ДЛЯ АВТОМАТИЗАЦИИ

### Скрипт: Очистка портов

```bash
#!/bin/bash
# scripts/fix-ports.sh

echo "🧹 Очищаю порты..."

PORTS=(8080 5001 5173 5000)
for PORT in "${PORTS[@]}"; do
    PIDS=$(lsof -ti:$PORT 2>/dev/null)
    if [ ! -z "$PIDS" ]; then
        echo "   🔴 Убиваю процесс на порту $PORT: $PIDS"
        kill -9 $PIDS 2>/dev/null
    fi
done

pkill -f "vite" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null

sleep 2
echo "✅ Порты очищены!"
```

**Использование:**
```bash
chmod +x scripts/fix-ports.sh
./scripts/fix-ports.sh
```

---

### Скрипт: Проверка и запуск

```bash
#!/bin/bash
# scripts/start-dev.sh

echo "🔍 Проверяю состояние..."

# Проверка портов
PORT=$(cat vite.config.ts | grep "port:" | grep -oE "[0-9]+" | head -1)
echo "   📍 Конфиг порт: $PORT"

# Проверка занятости
if lsof -i :$PORT | grep LISTEN > /dev/null; then
    echo "   ⚠️  Порт $PORT занят, очищаю..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null
    sleep 1
fi

# Запуск
echo "🚀 Запускаю сервер..."
npm run dev > /tmp/phuket-dev.log 2>&1 &
PID=$!

# Ждем запуска
sleep 5

# Проверка
if curl -s http://localhost:$PORT > /dev/null; then
    echo "✅ Сервер запущен! http://localhost:$PORT"
    echo "   PID: $PID"
    echo "   Логи: tail -f /tmp/phuket-dev.log"
else
    echo "❌ Сервер не запустился, смотри логи:"
    tail -20 /tmp/phuket-dev.log
fi
```

---

## 📊 ПОРТЫ ПРОЕКТОВ

### Текущий проект: phuket-telegram-shop
- **Порт:** 8080 (настроен в `vite.config.ts`)
- **URL:** http://localhost:8080/
- **Карта:** http://localhost:8080/map
- **Директория:** `/Users/evgeniymikhelev/phuket-telegram-shop`

### Второй проект: da-teens-webapp-tele
- **Порт:** 5174 (настроен в `vite.config.ts`)
- **URL:** http://localhost:5174/
- **Директория:** `/Users/evgeniymikhelev/Documents/GitHub/da-teens-webapp-tele`

**ВАЖНО:** Порты разные, конфликта быть не должно!

---

## 🚨 ЧЕКЛИСТ ДЛЯ АГЕНТА ПЕРЕД ОБРАЩЕНИЕМ К ПОЛЬЗОВАТЕЛЮ

**Агент ДОЛЖЕН проверить ВСЁ сам:**

- [ ] Проверил порты (`lsof -i :8080`)
- [ ] Проверил конфиг (`vite.config.ts`)
- [ ] Проверил логи (`tail -50 /tmp/phuket-dev.log`)
- [ ] Попробовал очистить процессы (`pkill -f vite`)
- [ ] Попробовал перезапустить (`npm run dev`)
- [ ] Проверил через curl (`curl http://localhost:8080`)
- [ ] Проверил через браузер (browser_navigate + snapshot)
- [ ] Проверил console errors (browser_console_messages)
- [ ] Проверил network requests (browser_network_requests)
- [ ] Проверил зависимости (`npm list --depth=0`)
- [ ] Проверил node_modules существует
- [ ] Проверил package.json корректный

**ТОЛЬКО ЕСЛИ ВСЁ ВЫШЕ НЕ ПОМОГЛО → можно спросить пользователя!**

---

## 📝 КОМАНДЫ ДЛЯ БЫСТРОГО ДОСТУПА

```bash
# Проверка портов
lsof -i :8080 -i :5001 -i :5173

# Очистка порта 8080
lsof -ti:8080 | xargs kill -9

# Очистка всех vite
pkill -f vite

# Запуск в фоне с логами
npm run dev > /tmp/phuket-dev.log 2>&1 &

# Просмотр логов
tail -f /tmp/phuket-dev.log

# Проверка что работает
curl http://localhost:8080

# Проверка процессов
ps aux | grep vite | grep -v grep
```

---

## 🎯 ПРОЦЕСС ДЛЯ АГЕНТА (АЛГОРИТМ)

### Когда пользователь говорит "вкл сервер" или "покажи локал":

1. **Проверка состояния:**
   ```bash
   lsof -i :8080 | grep LISTEN
   ```

2. **Если порт занят:**
   - Проверить PID процесса
   - Если наш процесс → ок, сообщить что работает
   - Если чужой → очистить и запустить

3. **Если порт свободен:**
   - Запустить сервер в фоне
   - Подождать 5 секунд
   - Проверить через curl

4. **Автоматическая проверка браузера:**
   - `browser_navigate("http://localhost:8080/map")`
   - `browser_snapshot()` → проверить что загрузилось
   - `browser_console_messages()` → проверить ошибки
   - `browser_take_screenshot()` → показать результат

5. **Сообщение пользователю:**
   - ✅ "Сервер работает! Открой: http://localhost:8080/map"
   - ❌ "Обнаружены ошибки: [список]. Исправляю..."

**НЕ СПРАШИВАТЬ ПОЛЬЗОВАТЕЛЯ ПРО БРАУЗЕР ИЛИ ЛОГИ!**

---

## 🔗 ПРОВЕРКА ЧЕРЕЗ БРАУЗЕР (АВТОМАТИЧЕСКИ)

**Агент ДОЛЖЕН использовать browser tools для проверки:**

```typescript
// Пример проверки карты
async function checkMapPage() {
  // 1. Открыть страницу
  await browser_navigate({ url: "http://localhost:8080/map" });
  
  // 2. Подождать загрузки
  await browser_wait_for({ time: 3 });
  
  // 3. Сделать snapshot
  const snapshot = await browser_snapshot();
  
  // 4. Проверить консоль
  const consoleMessages = await browser_console_messages();
  const errors = consoleMessages.filter(m => m.level === 'error');
  
  // 5. Проверить network
  const network = await browser_network_requests();
  const failed = network.filter(r => r.status >= 400);
  
  // 6. Если ошибки - исправить
  if (errors.length > 0 || failed.length > 0) {
    // Логировать и исправлять
    console.error("Ошибки:", errors, failed);
    // Исправить проблему
  }
  
  // 7. Скриншот для подтверждения
  await browser_take_screenshot({ filename: "map-verification.png" });
}
```

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

### Документация:
- **Vite Dev Server:** https://vitejs.dev/config/server-options.html
- **Node Process Management:** `man pkill`, `man lsof`

### Логи:
- **Vite лог:** `/tmp/phuket-dev.log` (при запуске в фоне)
- **System logs:** `tail -f /var/log/system.log` (если нужно)

---

**Последнее обновление:** November 1, 2025  
**Версия:** 1.0  
**Для:** AI Agents

**ПОМНИ:** Агент должен РЕШАТЬ проблемы САМ, не тревожа пользователя! 🚀



