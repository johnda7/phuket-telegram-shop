# 🤖 Telegram Bot Integration Guide

## ✅ Что уже сделано

### 1. Токен бота сохранён
- **Bot Token:** `8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4`
- **Username:** @PHUKETDABOT
- **Bot ID:** 8356364393
- **Status:** ✅ Active

### 2. Файлы созданы

```
.env                                  ← Environment variables
.shopify/TELEGRAM_BOT_INFO.md        ← Bot documentation
src/lib/telegram.ts                   ← Telegram API client
src/contexts/TelegramContext.tsx      ← React context for WebApp
server/bot.ts                         ← Bot webhook server (Node.js)
index.html                            ← Telegram WebApp script added
```

### 3. React интеграция
- ✅ `TelegramProvider` обёрнут вокруг App
- ✅ Telegram WebApp SDK скрипт добавлен в `index.html`
- ✅ `useTelegram()` hook доступен во всех компонентах
- ✅ Автоматическое определение: WebApp или обычный браузер

---

## 🚀 Как запустить бота (Development)

### Вариант 1: Long Polling (простой, для тестов)

Создай файл `test-bot.js`:

```javascript
const TELEGRAM_BOT_TOKEN = '8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4';
const WEBAPP_URL = 'http://localhost:8080'; // Локальная разработка

let offset = 0;

async function getUpdates() {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        offset = update.update_id + 1;
        await handleUpdate(update);
      }
    }
  } catch (error) {
    console.error('Error getting updates:', error);
  }
  
  // Продолжаем слушать
  setTimeout(getUpdates, 100);
}

async function handleUpdate(update) {
  const message = update.message;
  if (!message) return;
  
  const chatId = message.chat.id;
  const text = message.text;
  const userName = message.from.first_name;
  
  console.log(`📩 Message from ${userName}: ${text}`);
  
  if (text === '/start') {
    await sendWelcomeMessage(chatId, userName);
  } else {
    await sendTextMessage(chatId, 'Используйте кнопку ниже! 👇');
    await sendWebAppButton(chatId);
  }
}

async function sendTextMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function sendWelcomeMessage(chatId, userName) {
  const text = `👋 Привет, ${userName}!\n\nЯ - PhuketDa бот! 🏝️\n\nПомогу выбрать идеальный тур на Пхукете.\n\nНажмите кнопку ниже! 👇`;
  await sendTextMessage(chatId, text);
  await sendWebAppButton(chatId);
}

async function sendWebAppButton(chatId) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '🏝️ Выберите раздел:',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎟️ Смотреть туры', web_app: { url: `${WEBAPP_URL}/tours` }}],
          [{ text: '📚 Phuket Insider', web_app: { url: `${WEBAPP_URL}/insider` }}],
        ]
      }
    }),
  });
}

console.log('🤖 Bot started! Send /start to @PHUKETDABOT');
getUpdates();
```

Запусти:
```bash
node test-bot.js
```

### Вариант 2: Webhook (для production)

1. **Нужен публичный URL с HTTPS**
   - Ngrok: `ngrok http 3001`
   - Cloudflare Tunnel
   - Deploy на Vercel/Railway/Render

2. **Установи webhook:**
```bash
curl -X POST https://api.telegram.org/bot8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4/setWebhook \
  -d "url=https://your-domain.com/webhook"
```

3. **Запусти сервер:**
```bash
# Нужно установить зависимости
npm install express body-parser

# Запустить (если сервер написан на TypeScript)
npx tsx server/bot.ts
```

---

## 🧪 Как протестировать

### 1. Проверить бота
```bash
curl https://api.telegram.org/bot8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4/getMe
```

### 2. Открыть бота в Telegram
- Открой Telegram
- Найди: `@PHUKETDABOT`
- Отправь: `/start`
- Должна появиться кнопка "🎟️ Смотреть туры"

### 3. Проверить WebApp
- Нажми на кнопку
- Должен открыться ваш сайт внутри Telegram
- Проверь console: `✅ Telegram WebApp initialized`

---

## 🎨 Использование в компонентах

```tsx
import { useTelegram } from '@/contexts/TelegramContext';

function MyComponent() {
  const { webApp, user, isTelegramWebApp } = useTelegram();
  
  if (isTelegramWebApp && user) {
    return <div>Привет, {user.first_name}! 👋</div>;
  }
  
  return <div>Открой в Telegram! 📱</div>;
}
```

### Использовать MainButton (кнопка внизу)

```tsx
import { useTelegram } from '@/contexts/TelegramContext';
import { useEffect } from 'react';

function Checkout() {
  const { webApp } = useTelegram();
  
  useEffect(() => {
    if (!webApp) return;
    
    // Показать кнопку
    webApp.MainButton.setText('Оформить заказ - $120');
    webApp.MainButton.show();
    
    // Обработчик клика
    const handleClick = () => {
      alert('Заказ оформлен!');
      webApp.close(); // Закрыть WebApp
    };
    
    webApp.MainButton.onClick(handleClick);
    
    // Cleanup
    return () => {
      webApp.MainButton.offClick(handleClick);
      webApp.MainButton.hide();
    };
  }, [webApp]);
  
  return <div>Checkout page...</div>;
}
```

### Использовать BackButton

```tsx
import { useTelegram } from '@/contexts/TelegramContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function ProductDetail() {
  const { webApp } = useTelegram();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!webApp) return;
    
    // Показать кнопку назад
    webApp.BackButton.show();
    
    const handleBack = () => {
      navigate('/tours');
    };
    
    webApp.BackButton.onClick(handleBack);
    
    return () => {
      webApp.BackButton.offClick(handleBack);
      webApp.BackButton.hide();
    };
  }, [webApp, navigate]);
  
  return <div>Product details...</div>;
}
```

---

## 🎯 Следующие шаги

- [x] Сохранить токен бота
- [x] Создать Telegram API клиент
- [x] Создать React context для WebApp
- [x] Интегрировать в App.tsx
- [ ] Запустить тестовый бот (Long Polling)
- [ ] Протестировать WebApp в Telegram
- [ ] Настроить webhook для production
- [ ] Интегрировать ChatGPT для ответов
- [ ] Добавить Telegram Payments

---

## 📚 Полезные ссылки

- **Telegram Bot API Docs:** https://core.telegram.org/bots/api
- **Telegram WebApp Docs:** https://core.telegram.org/bots/webapps
- **Наш бот:** https://t.me/PHUKETDABOT

---

**Status:** ✅ Integration Ready! Bot настроен и готов к тестированию! 🚀
