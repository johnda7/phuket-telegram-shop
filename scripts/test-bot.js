#!/usr/bin/env node

/**
 * 🤖 Simple Telegram Bot Test Script
 * 
 * Long Polling implementation for development/testing
 * Run: node scripts/test-bot.js
 */

const TELEGRAM_BOT_TOKEN = '8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4';
const OPENAI_API_KEY = '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';
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:8080';

let offset = 0;

/**
 * Get updates from Telegram Bot API
 */
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
    console.error('❌ Error getting updates:', error.message);
  }
  
  // Continue polling
  setTimeout(getUpdates, 100);
}

/**
 * Handle incoming update
 */
async function handleUpdate(update) {
  const message = update.message;
  if (!message) return;
  
  const chatId = message.chat.id;
  const text = message.text;
  const userName = message.from.first_name;
  
  console.log(`\n📩 Message from ${userName} (${message.from.id}):`);
  console.log(`   "${text}"`);
  
  if (text === '/start') {
    await sendWelcomeMessage(chatId, userName);
  } else if (text === '/help') {
    await sendHelpMessage(chatId);
  } else {
    // AI-powered response using ChatGPT
    await sendChatAction(chatId, 'typing');
    const aiResponse = await chatWithGPT(text);
    await sendTextMessage(chatId, aiResponse);
    await sendWebAppButton(chatId);
  }
}

/**
 * Send text message
 */
async function sendTextMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
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
      console.error('Failed to send message:', data.description);
    }
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
}

/**
 * Send welcome message with WebApp button
 */
async function sendWelcomeMessage(chatId, userName) {
  const welcomeText = `
👋 <b>Привет, ${userName}!</b>

Я - <b>PhuketDa бот</b>! 🏝️

Помогу вам:
✅ Выбрать идеальный тур на Пхукете
✅ Забронировать экскурсию за 2 минуты
✅ Получить персональные рекомендации

<i>Нажмите кнопку ниже, чтобы посмотреть туры! 👇</i>
  `.trim();
  
  await sendTextMessage(chatId, welcomeText);
  await sendWebAppButton(chatId);
  
  console.log(`✅ Sent welcome message to ${userName}`);
}

/**
 * Send help message
 */
async function sendHelpMessage(chatId) {
  const helpText = `
<b>📚 Справка PhuketDa Bot</b>

<b>Команды:</b>
/start - Начать работу с ботом
/help - Показать эту справку

<b>Как использовать:</b>
1. Нажмите на кнопку "🎟️ Смотреть туры"
2. Выберите интересующий вас тур
3. Добавьте в корзину
4. Оформите заказ

<b>Поддержка:</b>
Telegram чат: @PhuketDaChat (4,500+ участников!)

<i>Нажмите кнопку ниже, чтобы начать! 👇</i>
  `.trim();
  
  await sendTextMessage(chatId, helpText);
  await sendWebAppButton(chatId);
}

/**
 * Send WebApp button
 */
async function sendWebAppButton(chatId) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🏝️ <b>Выберите раздел:</b>',
        parse_mode: 'HTML',
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
                text: '🏠 Главная',
                web_app: { url: WEBAPP_URL }
              }
            ]
          ]
        }
      }),
    });
    
    const data = await response.json();
    if (!data.ok) {
      console.error('Failed to send WebApp button:', data.description);
    }
  } catch (error) {
    console.error('Error sending WebApp button:', error.message);
  }
}

/**
 * Send chat action (typing indicator)
 */
async function sendChatAction(chatId, action) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendChatAction`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        action: action // 'typing', 'upload_photo', etc.
      }),
    });
  } catch (error) {
    console.error('Error sending chat action:', error.message);
  }
}

/**
 * Chat with GPT-4 Turbo
 */
async function chatWithGPT(userMessage) {
  const SYSTEM_PROMPT = `
Ты - эксперт по турам на Пхукете и персональный AI-помощник PhuketDa.

Твоя задача:
1. Понять потребности туриста (бюджет, интересы, длительность)
2. Рекомендовать топ-3 тура из нашего каталога
3. Отвечать кратко и по делу (максимум 3-4 предложения)
4. Быть дружелюбным и энергичным

Наши туры:
1. 🏝️ Пхи-Пхи 2 дня/1 ночь - $120 взрослый, $90 детский - самый популярный, Maya Bay
2. 🏝️ James Bond Island - $90 взрослый - классика Пхукета
3. 💎 4 Pearls Andaman Sea - $150 взрослый - премиум тур
4. 🌊 11 Islands Mega Tour - $180 взрослый - максимальный охват
5. ⛵ Симиланские острова - $150 взрослый - лучший снорклинг
6. 🚣 Rafting + SPA + ATV - $130 взрослый - приключения
7. 🏖️ Краби 4 острова - $100 взрослый - альтернатива Пхи-Пхи
8. 🐠 Coral Island - $80 взрослый - для семей
9. 🛕 Temples Tour - $70 взрослый - культура
10. 🌅 Sunset Cruise - $110 взрослый - романтика

Правила:
- НЕ придумывай туры, которых нет в списке
- Рекомендуй МАКСИМУМ 3 тура
- Указывай цены в долларах
- Заканчивай: "Нажмите кнопку ниже, чтобы забронировать! 🎟️"
  `.trim();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('❌ ChatGPT Error:', error.message);
    return `Извините, сейчас я не могу ответить. Но вы можете посмотреть наши туры прямо сейчас! 🏝️`;
  }
}

// Start bot
console.log('🤖 PhuketDa Bot Started with AI! 🧠');
console.log('📱 Bot: @PHUKETDABOT');
console.log(`🌐 WebApp URL: ${WEBAPP_URL}`);
console.log('🤖 AI: GPT-4 Turbo Powered ✨');
console.log('\n👉 Open Telegram and send /start to @PHUKETDABOT\n');
console.log('Listening for messages...\n');

getUpdates();
