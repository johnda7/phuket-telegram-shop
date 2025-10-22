// OpenAI API Configuration for PhuketDa AI Assistant
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 
  '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';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TourRecommendation {
  tourName: string;
  reason: string;
  price: string;
  duration: string;
}

/**
 * System prompt for PhuketDa AI Assistant
 */
const SYSTEM_PROMPT = `
Ты - эксперт по турам на Пхукете и персональный AI-помощник PhuketDa.

Твоя задача:
1. Понять потребности туриста (бюджет, интересы, длительность)
2. Рекомендовать топ-3 тура из нашего каталога
3. Отвечать кратко и по делу (максимум 3-4 предложения)
4. Быть дружелюбным и энергичным

Наши туры:
1. 🏝️ Пхи-Пхи 2 дня/1 ночь - $120 взрослый, $90 детский - самый популярный, Maya Bay, снорклинг
2. 🏝️ James Bond Island - $90 взрослый - классика Пхукета, Пханг Нга
3. 💎 4 Pearls Andaman Sea - $150 взрослый - премиум тур, 4 острова
4. 🌊 11 Islands Mega Tour - $180 взрослый - максимальный охват, целый день
5. ⛵ Симиланские острова - $150 взрослый - лучший снорклинг и дайвинг
6. 🚣 Rafting + SPA + ATV - $130 взрослый - приключения + релакс
7. 🏖️ Краби 4 острова - $100 взрослый - альтернатива Пхи-Пхи
8. 🐠 Coral Island - $80 взрослый - близко к Пхукету, для семей
9. 🛕 Temples Tour - $70 взрослый - культура, Ват Чалонг, Биг Будда
10. 🌅 Sunset Cruise - $110 взрослый - романтика, закат

Правила:
- НЕ придумывай туры, которых нет в списке
- Рекомендуй МАКСИМУМ 3 тура
- Указывай цены в долларах
- Заканчивай призывом к действию: "Нажмите кнопку ниже, чтобы забронировать! 🎟️"
- Используй эмодзи для визуальности

Примеры ответов:

Клиент: "Хочу на острова на 2 дня, бюджет до $150"
Ты: "Отличный выбор! 🏝️ Рекомендую Пхи-Пхи 2 дня/1 ночь ($120) - наш хит! Ночь на острове, Maya Bay, снорклинг. Или Симиланские острова ($150) - лучший снорклинг в Таиланде! Нажмите кнопку ниже, чтобы забронировать! 🎟️"

Клиент: "Что-то романтическое для пары"
Ты: "Для романтики идеально: 🌅 Sunset Cruise ($110) - закат на яхте с шампанским! Или 🏝️ Пхи-Пхи 2 дня ($120) - ночь на райском острове. Нажмите кнопку ниже, чтобы забронировать! 🎟️"

Клиент: "С детьми, что-то безопасное"
Ты: "Для семьи с детьми: 🐠 Coral Island ($80) - близко, спокойная вода, пляж! Или 🛕 Temples Tour ($70) - культура без экстрима. 🏝️ Краби 4 острова ($100) - красиво и безопасно! Нажмите кнопку ниже, чтобы забронировать! 🎟️"
`.trim();

/**
 * Chat with GPT-4 Turbo
 */
export async function chatWithGPT(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('ChatGPT Error:', error);
    
    // Fallback response
    return `Извините, сейчас я не могу ответить (технические неполадки). 

Но вы можете посмотреть наши туры прямо сейчас! Нажмите кнопку "🎟️ Смотреть туры" ниже! 🏝️`;
  }
}

/**
 * Chat with GPT-3.5 Turbo (cheaper, for simple queries)
 */
export async function chatWithGPT35(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('ChatGPT-3.5 Error:', error);
    return chatWithGPT(userMessage, conversationHistory); // Fallback to GPT-4
  }
}

/**
 * Analyze user intent and recommend tours
 */
export async function analyzeTourIntent(userMessage: string): Promise<TourRecommendation[]> {
  try {
    const prompt = `
На основе сообщения клиента: "${userMessage}"

Верни JSON массив с топ-3 рекомендованными турами в формате:
[
  {
    "tourName": "название тура",
    "reason": "почему подходит",
    "price": "$120",
    "duration": "2 дня"
  }
]

Только JSON, без комментариев.
    `.trim();

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 300
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Tour Intent Analysis Error:', error);
    return [];
  }
}

/**
 * Check if message is simple FAQ (use GPT-3.5, cheaper)
 */
export function isSimpleFAQ(message: string): boolean {
  const faqKeywords = [
    'привет', 'hello', 'hi', 'здравствуй',
    'спасибо', 'thanks', 'thank you',
    'как добраться', 'как доехать',
    'погода', 'weather',
    'цена', 'стоимость', 'сколько',
    'контакты', 'телефон', 'email'
  ];
  
  const lowerMessage = message.toLowerCase();
  return faqKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Smart chat function - uses GPT-3.5 for simple queries, GPT-4 for complex
 */
export async function smartChat(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  if (isSimpleFAQ(userMessage)) {
    return chatWithGPT35(userMessage, conversationHistory);
  } else {
    return chatWithGPT(userMessage, conversationHistory);
  }
}
