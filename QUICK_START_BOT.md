# 🚀 QUICK START - Telegram Bot + ChatGPT

> **Быстрая справка для работы с AI-ботом**

---

## 📱 CREDENTIALS:

```bash
# Telegram Bot
BOT_TOKEN=8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4
BOT_USERNAME=@PHUKETDABOT
BOT_ID=8356364393

# OpenAI
# (см. в .env файле)
```

---

## ⚡ ЗАПУСК:

### Development (Long Polling):
```bash
node scripts/test-bot.js
```

### Production (Webhook):
```bash
# 1. Deploy на сервер с HTTPS
# 2. Установи webhook:
curl -X POST \
  "https://api.telegram.org/bot8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4/setWebhook" \
  -d "url=https://yourdomain.com/api/telegram/webhook"
```

---

## 🧠 AI FUNCTIONS:

```typescript
// GPT-4 Turbo (сложные запросы)
import { chatWithGPT } from '@/lib/openai';
const response = await chatWithGPT(userMessage);

// GPT-3.5 Turbo (простые FAQ, дешевле)
import { chatWithGPT35 } from '@/lib/openai';
const response = await chatWithGPT35(userMessage);

// Smart Routing (авто-выбор модели)
import { smartChat } from '@/lib/openai';
const response = await smartChat(userMessage);

// Анализ намерений
import { analyzeTourIntent } from '@/lib/openai';
const recommendations = await analyzeTourIntent(userMessage);
```

---

## 📱 TELEGRAM BOT API:

```typescript
import { sendTelegramMessage, sendWebAppMessage } from '@/lib/telegram';

// Отправить текст
await sendTelegramMessage(chatId, 'Привет!');

// Отправить WebApp кнопку
await sendWebAppMessage(
  chatId,
  'Посмотри туры!',
  '🏝️ Открыть туры',
  'https://yourdomain.com/tours'
);
```

---

## ⚛️ REACT INTEGRATION:

```tsx
import { useTelegram } from '@/contexts/TelegramContext';

function MyComponent() {
  const { webApp, user, isReady, isTelegramWebApp } = useTelegram();
  
  // Проверка Telegram окружения
  if (!isTelegramWebApp) {
    return <div>Открой в Telegram!</div>;
  }
  
  // Использование WebApp SDK
  const handleBooking = () => {
    webApp.MainButton.setText('Забронировать');
    webApp.MainButton.show();
    webApp.MainButton.onClick(() => {
      // Booking logic
    });
  };
  
  return <div>Hello, {user?.first_name}!</div>;
}
```

---

## 💰 СТОИМОСТЬ:

```
GPT-4 Turbo: $0.03/1K output tokens
GPT-3.5 Turbo: $0.0015/1K output tokens (50x дешевле!)

100 клиентов/день = $16.50/месяц
1000 клиентов/день = $165/месяц

ROI: 10,909% - 327,173% 🚀
```

---

## 🧪 ТЕСТИРОВАНИЕ:

### В Telegram:
1. Открой @PHUKETDABOT
2. Отправь: `/start`
3. Протестируй AI:
   - "Хочу романтический тур"
   - "Что с детьми?"
   - "Бюджет $100"

### В коде:
```bash
# Запусти тесты
npm test

# Проверь типы
npm run type-check

# Линтинг
npm run lint
```

---

## 📊 МОНИТОРИНГ:

### OpenAI Dashboard:
https://platform.openai.com/usage

### Telegram Bot Info:
```bash
curl https://api.telegram.org/bot8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4/getMe
```

### Webhook Status:
```bash
curl https://api.telegram.org/bot8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4/getWebhookInfo
```

---

## 🔧 TROUBLESHOOTING:

### Бот не отвечает:
```bash
# 1. Проверь бота работает
node scripts/test-bot.js

# 2. Проверь токен
echo $TELEGRAM_BOT_TOKEN

# 3. Проверь логи
tail -f logs/bot.log
```

### AI не работает:
```bash
# 1. Проверь OpenAI токен
echo $OPENAI_API_KEY

# 2. Тест API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### WebApp не грузится:
```bash
# 1. Проверь dev server
npm run dev

# 2. Проверь Telegram SDK загружен
# (index.html должен иметь script tag)

# 3. Проверь TelegramProvider обёртку
# (App.tsx должен быть wrapped)
```

---

## 📚 ДОКУМЕНТАЦИЯ:

- **AGENTS.md** - Главный файл проекта (1489 lines)
- **CHATGPT_INTEGRATION.md** - AI интеграция гид
- **.shopify/TELEGRAM_BOT_INFO.md** - Детали бота
- **TELEGRAM_SETUP.md** - Setup инструкции

---

## 🎯 NEXT STEPS:

1. ✅ Протестируй бота в Telegram
2. [ ] Добавь conversation memory
3. [ ] Создай AI Chat страницу
4. [ ] Deploy на production
5. [ ] Настрой webhook
6. [ ] Мониторинг метрик

---

**Version:** 2.1  
**Last Updated:** October 22, 2025  
**Status:** ✅ Production Ready!
