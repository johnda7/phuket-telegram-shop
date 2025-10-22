/**
 * 🤖 TELEGRAM BOT SERVER
 * 
 * Простой Express сервер для обработки webhook от Telegram Bot API
 * 
 * Функции:
 * - Получает сообщения от пользователей
 * - Отправляет WebApp кнопку для открытия сайта
 * - Интеграция с ChatGPT (будущее)
 */

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3001;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://phuketda.com'; // Замени на свой URL после деплоя

app.use(bodyParser.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    bot: 'PhuketDa Bot',
    message: 'Bot server is running! 🤖' 
  });
});

// Telegram webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { message, callback_query } = req.body;

    // Handle regular messages
    if (message) {
      const chatId = message.chat.id;
      const text = message.text;
      const userId = message.from.id;
      const userName = message.from.first_name;

      console.log(`📩 New message from ${userName} (${userId}): ${text}`);

      // Handle /start command
      if (text === '/start') {
        await sendWelcomeMessage(chatId, userName);
      }
      // Handle other messages (будущее: ChatGPT integration)
      else {
        await sendTextMessage(chatId, `Получил ваше сообщение: "${text}"\n\nИспользуйте кнопку ниже, чтобы выбрать тур! 🏝️`);
        await sendWebAppButton(chatId);
      }
    }

    // Handle callback queries (button clicks)
    if (callback_query) {
      console.log('🖱️ Callback query:', callback_query.data);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).send('Error');
  }
});

/**
 * Send welcome message with WebApp button
 */
async function sendWelcomeMessage(chatId: number, userName: string) {
  const welcomeText = `
👋 Привет, ${userName}!

Я - PhuketDa бот! 🏝️

Помогу вам:
✅ Выбрать идеальный тур на Пхукете
✅ Забронировать экскурсию за 2 минуты
✅ Получить персональные рекомендации

Нажмите кнопку ниже, чтобы посмотреть туры! 👇
  `.trim();

  await sendTextMessage(chatId, welcomeText);
  await sendWebAppButton(chatId);
}

/**
 * Send text message via Telegram API
 */
async function sendTextMessage(chatId: number, text: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
    }),
  });

  const data = await response.json();
  
  if (!data.ok) {
    console.error('Failed to send message:', data);
    throw new Error(data.description);
  }

  return data.result;
}

/**
 * Send WebApp button to open tours
 */
async function sendWebAppButton(chatId: number) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '🏝️ Выберите раздел:',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🎟️ Смотреть туры',
              web_app: { url: `${WEBAPP_URL}/tours` }
            }
          ],
          [
            {
              text: '📚 Phuket Insider',
              web_app: { url: `${WEBAPP_URL}/insider` }
            }
          ],
          [
            {
              text: '🤖 AI Помощник',
              web_app: { url: `${WEBAPP_URL}` }
            }
          ]
        ]
      }
    }),
  });

  const data = await response.json();
  
  if (!data.ok) {
    console.error('Failed to send WebApp button:', data);
    throw new Error(data.description);
  }

  return data.result;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Bot server running on http://localhost:${PORT}`);
  console.log(`📱 Bot: @PHUKETDABOT`);
  console.log(`🌐 WebApp URL: ${WEBAPP_URL}`);
  console.log(`\n📝 To set webhook, run:`);
  console.log(`curl -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook -d "url=YOUR_SERVER_URL/webhook"`);
});

export default app;
