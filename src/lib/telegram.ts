// Telegram Bot API Configuration
export const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8356364393:AAFP9HK9JM8PCRJqEHcZ9WAg2J_WYx7ftn4';
export const TELEGRAM_BOT_USERNAME = 'PHUKETDABOT';
export const TELEGRAM_BOT_ID = 8356364393;

// Telegram API Base URL
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: {
    id: number;
    type: string;
  };
  text?: string;
  date: number;
}

/**
 * Send message to Telegram chat
 */
export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  options?: {
    parse_mode?: 'HTML' | 'Markdown';
    reply_markup?: any;
  }
): Promise<TelegramMessage | null> {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...options,
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`);
    }

    return data.result;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return null;
  }
}

/**
 * Send message with inline keyboard (WebApp button)
 */
export async function sendWebAppMessage(
  chatId: number | string,
  text: string,
  webAppUrl: string,
  buttonText: string = '🏝️ Открыть туры'
): Promise<TelegramMessage | null> {
  return sendTelegramMessage(chatId, text, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: buttonText,
            web_app: { url: webAppUrl }
          }
        ]
      ]
    }
  });
}

/**
 * Get bot information
 */
export async function getBotInfo() {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/getMe`);
    const data = await response.json();
    return data.ok ? data.result : null;
  } catch (error) {
    console.error('Failed to get bot info:', error);
    return null;
  }
}

/**
 * Get updates (for development/testing)
 */
export async function getUpdates(offset?: number) {
  try {
    const url = offset 
      ? `${TELEGRAM_API_BASE}/getUpdates?offset=${offset}`
      : `${TELEGRAM_API_BASE}/getUpdates`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data.ok ? data.result : [];
  } catch (error) {
    console.error('Failed to get updates:', error);
    return [];
  }
}

/**
 * Set webhook for production
 */
export async function setWebhook(webhookUrl: string) {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Failed to set webhook:', error);
    return false;
  }
}

/**
 * Delete webhook (for development)
 */
export async function deleteWebhook() {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/deleteWebhook`);
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Failed to delete webhook:', error);
    return false;
  }
}
