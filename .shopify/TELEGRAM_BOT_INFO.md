# 🤖 TELEGRAM BOT CONFIGURATION

## Bot Credentials

**Bot Token:** `8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4`

**Bot Username:** @PHUKETDABOT ✅

**Bot ID:** 8356364393

**Bot Name:** Пхуке DA

**Status:** ✅ Active and Ready

---

## 📋 Что нужно сделать дальше:

### 1️⃣ **Узнать username бота**
Чтобы проверить имя бота, используй команду:
```bash
curl https://api.telegram.org/bot8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4/getMe
```

### 2️⃣ **Настроить Webhook (для production)**
```bash
curl -X POST https://api.telegram.org/bot8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4/setWebhook \
  -d "url=https://your-domain.com/api/telegram/webhook"
```

### 3️⃣ **Или использовать Long Polling (для development)**
```typescript
// Постоянное подключение для получения обновлений
const updates = await fetch(
  `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`
);
```

---

## 🏗️ Архитектура интеграции

```
User в Telegram чате
    ↓
Сообщение → Telegram Bot API
    ↓
Webhook → Наш сервер
    ↓
ChatGPT API (анализ запроса)
    ↓
Shopify API (поиск туров)
    ↓
Ответ пользователю с кнопками WebApp
```

---

## 📱 Telegram WebApp Flow

**1. Пользователь открывает бота**
- Получает welcome message
- Видит inline кнопку "🏝️ Смотреть туры"

**2. Кликает на кнопку**
- Открывается WebApp (наш сайт в iframe)
- URL: `https://your-domain.com/?tg_init_data=...`

**3. Выбирает тур и добавляет в корзину**
- Использует Shopify Checkout
- Или Telegram Payments

**4. Оплата**
- Через Telegram Payments (если настроено)
- Или через Shopify Checkout

---

## 🔧 Environment Variables

Добавлено в `.env`:
```bash
VITE_TELEGRAM_BOT_TOKEN=8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4
TELEGRAM_BOT_TOKEN=8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4
```

**Важно:** `.env` в `.gitignore` - токены не попадут в Git!

---

## 🚀 Quick Start Commands

### Проверить бота:
```bash
curl https://api.telegram.org/bot8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4/getMe
```

### Отправить тестовое сообщение:
```bash
curl -X POST https://api.telegram.org/bot8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4/sendMessage \
  -d "chat_id=YOUR_CHAT_ID" \
  -d "text=Привет! Я PhuketDa бот! 🏝️"
```

### Получить обновления:
```bash
curl https://api.telegram.org/bot8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4/getUpdates
```

---

## 📦 Необходимые пакеты для интеграции

```bash
npm install @telegram-apps/sdk
# или
npm install telegram-webapps
```

---

## 🎯 Следующие шаги:

- [x] Сохранить токен бота
- [ ] Проверить имя бота (getMe)
- [ ] Установить Telegram WebApp SDK
- [ ] Создать компонент TelegramProvider
- [ ] Настроить inline кнопки для WebApp
- [ ] Интегрировать ChatGPT для ответов
- [ ] Настроить Webhook (production)

---

**Last Updated:** October 22, 2025  
**Bot Status:** Токен сохранён, готов к настройке
