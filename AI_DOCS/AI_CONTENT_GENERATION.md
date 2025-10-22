# 🤖 AI CONTENT GENERATION SYSTEM

> **Автоматизация создания контента для TikTok, Instagram, WhatsApp через ChatGPT + Midjourney**

---

## 🎯 КОНЦЕПЦИЯ

### Что мы автоматизируем:

```
Чат с клиентом (Telegram)
    ↓
ChatGPT анализирует потребности
    ↓
Автогенерация контента для:
- 📱 TikTok (short videos)
- 📸 Instagram (posts + reels + stories)
- 💬 WhatsApp (персональные рекомендации)
- 📧 Email (newsletters)
- 📄 Blog (SEO-статьи)
```

### Perplexity-Style Analytics:
```
Анализируем чаты → выявляем тренды → создаём контент
Пример: 80% спрашивают про Пхи-Пхи → создаём TikTok "Топ-5 ошибок туристов на Пхи-Пхи"
```

---

## 🧠 АРХИТЕКТУРА СИСТЕМЫ

### Components:

```
┌─────────────────────────────────────────┐
│   1. CHAT ANALYZER                      │
│   ChatGPT анализирует входящие чаты    │
│   ↓                                     │
│   Извлекает: интересы, вопросы, боли   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   2. TREND DETECTOR                     │
│   Выявляет популярные темы             │
│   ↓                                     │
│   "50% спрашивают про снорклинг"       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   3. CONTENT GENERATOR                  │
│   ChatGPT создаёт скрипты для контента │
│   Midjourney создаёт визуалы           │
│   ↓                                     │
│   Готовый контент для публикации       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   4. DISTRIBUTION                       │
│   Автопостинг в TikTok/Instagram/etc   │
└─────────────────────────────────────────┘
```

---

## 📊 1. CHAT ANALYZER (Анализ чатов)

### Что анализируем:

```typescript
interface ChatAnalysis {
  // Базовая информация
  user_id: string;
  conversation_id: string;
  timestamp: Date;
  
  // Интересы пользователя
  interests: string[];  // ["islands", "snorkeling", "beaches"]
  budget_range: string;  // "$50-100"
  duration: string;      // "2-days"
  
  // Вопросы и боли
  questions: string[];   // ["Можно ли с детьми?", "Безопасно ли?"]
  pain_points: string[]; // ["боится морской болезни", "ограниченный бюджет"]
  
  // Sentiment
  sentiment: "positive" | "neutral" | "negative";
  engagement_level: number;  // 1-10
  
  // Конверсия
  booking_intent: number;  // 0-100%
  recommended_tours: string[];
  conversion_status: "viewed" | "added_to_cart" | "booked" | "abandoned";
}
```

### ChatGPT Prompt для анализа:

```typescript
const chatAnalyzerPrompt = `
Ты - аналитик чатов туристического бота.
Твоя задача: извлечь из диалога ключевую информацию.

Анализируй:
1. ИНТЕРЕСЫ: какие туры/активности интересуют
2. БЮДЖЕТ: сколько готов потратить
3. ДЛИТЕЛЬНОСТЬ: сколько дней планирует
4. ВОПРОСЫ: что спрашивает
5. БОЛИ: какие опасения/проблемы
6. КОНВЕРСИЯ: насколько готов забронировать (0-100%)

Входные данные: полный текст диалога с клиентом
Выходные данные: JSON с извлечённой информацией

Пример:
Input: "Хочу на Пхи-Пхи, но боюсь морской болезни. Есть туры до $100?"
Output: {
  "interests": ["phi-phi", "islands"],
  "budget_range": "$50-100",
  "pain_points": ["морская болезнь"],
  "questions": ["Есть туры до $100?"],
  "booking_intent": 70
}
`;
```

---

## 🔥 2. TREND DETECTOR (Выявление трендов)

### Что отслеживаем:

```typescript
interface Trend {
  topic: string;              // "phi-phi-islands"
  category: string;           // "tours" | "info" | "pain_point"
  frequency: number;          // Сколько раз упоминается
  growth_rate: number;        // % роста за неделю
  sentiment: number;          // -1 до +1
  keywords: string[];         // ["снорклинг", "лодка", "обед"]
  related_tours: string[];    // ID туров
}
```

### Примеры трендов:

```javascript
// TRENDING TOPICS (последние 7 дней)
const trends = [
  {
    topic: "phi-phi-islands",
    frequency: 487,  // упоминаний
    growth_rate: +35%,  // рост за неделю
    sentiment: 0.85,  // очень позитивный
    action: "Создать TikTok про топ-5 мест на Пхи-Пхи"
  },
  {
    topic: "sea-sickness",
    frequency: 123,
    growth_rate: +50%,  // резкий рост!
    sentiment: -0.4,  // негативный (боль)
    action: "Создать контент про советы от морской болезни"
  },
  {
    topic: "budget-tours",
    frequency: 256,
    growth_rate: +20%,
    sentiment: 0.6,
    action: "Рекламировать туры до $100"
  }
];
```

### Автоматические триггеры:

```javascript
// Если тренд растёт > 30% за неделю → создать контент
if (trend.growth_rate > 30) {
  generateContent(trend.topic);
}

// Если негативный sentiment + высокая частота → создать "решение проблемы"
if (trend.sentiment < 0 && trend.frequency > 100) {
  generateSolutionContent(trend.topic);
}

// Если позитивный sentiment + рост → усилить рекламу
if (trend.sentiment > 0.7 && trend.growth_rate > 20) {
  boostAdvertising(trend.related_tours);
}
```

---

## 🎬 3. CONTENT GENERATOR (Генерация контента)

### A) TikTok Content Generator

```typescript
interface TikTokVideo {
  // Метаданные
  title: string;
  description: string;
  hashtags: string[];
  duration: number;  // секунды
  
  // Скрипт
  hook: string;      // Первые 3 секунды (самое важное!)
  body: string[];    // Основная часть (по кадрам)
  cta: string;       // Call-to-action
  
  // Визуалы
  scenes: Scene[];
  music: string;
  effects: string[];
}

interface Scene {
  duration: number;
  description: string;  // Для Midjourney
  text_overlay: string;
  voiceover: string;
}
```

### TikTok Prompt для ChatGPT:

```typescript
const tiktokGeneratorPrompt = `
Ты - креатор TikTok контента для туристического бота.
Создай скрипт для 60-секундного видео.

Тренд: "${trend.topic}"
Целевая аудитория: Туристы 25-45 лет, едут в Пхукет
Цель: Привлечь внимание + мотивировать забронировать тур

Структура:
1. HOOK (0-3 сек): Цепляющий вопрос/факт
   Примеры: "99% туристов не знают об этом месте!"
            "Вот почему все едут на Пхи-Пхи в 2025"
            
2. BODY (3-55 сек): Основной контент
   - 5-7 коротких фактов/советов
   - Каждый факт = 7-10 секунд
   - Динамичная подача
   
3. CTA (55-60 сек): Призыв к действию
   "Забронируй через нашего бота → скидка 10%"

Формат вывода: JSON с полным скриптом
`;
```

### Пример сгенерированного TikTok:

```json
{
  "title": "5 ошибок туристов на Пхи-Пхи 😱",
  "duration": 60,
  "hook": "Вы делаете ЭТО на Пхи-Пхи? Тогда вы теряете лучшее! 🤯",
  "scenes": [
    {
      "duration": 3,
      "text": "5 ошибок на Пхи-Пхи",
      "voiceover": "Вы делаете ЭТО на Пхи-Пхи?"
    },
    {
      "duration": 10,
      "text": "❌ #1: Приезжают в 11 утра",
      "voiceover": "Все туристы приезжают в 11 утра когда уже ТОЛПЫ"
    },
    {
      "duration": 10,
      "text": "✅ Приезжайте в 7 утра!",
      "voiceover": "Приезжайте в 7 утра - пустые пляжи, идеальные фото!"
    },
    // ... 4 ошибки
  ],
  "cta": "Забронируй 2-дневный тур через наш бот → скидка 15%",
  "hashtags": ["#пхукет", "#пхипхи", "#таиланд", "#путешествия"]
}
```

---

### B) Instagram Content Generator

#### Типы контента:

1. **Posts (карусель)**
2. **Reels (короткие видео)**
3. **Stories (24h контент)**

```typescript
interface InstagramPost {
  type: "carousel" | "reel" | "story";
  
  // Для carousel
  slides: Slide[];
  
  // Для всех типов
  caption: string;
  hashtags: string[];
  location: string;
  cta: string;
}

interface Slide {
  image_prompt: string;  // Для Midjourney
  text_overlay: string;
  description: string;
}
```

### Instagram Prompt:

```typescript
const instagramCarouselPrompt = `
Создай карусель из 10 слайдов для Instagram.

Тема: "${trend.topic}"
Формат: Образовательный (edutainment)

Структура:
Слайд 1: Цепляющий заголовок
Слайды 2-9: Полезная информация (факты, советы, лайфхаки)
Слайд 10: CTA + информация о боте

Стиль:
- iOS 26 дизайн (минимализм, #007AFF)
- Короткие тексты (макс 15 слов на слайд)
- Эмодзи для визуального разделения
- Профессионально, но дружелюбно

Caption:
- 1-й абзац: Краткое описание (150 символов)
- 2-й абзац: Детали
- 3-й абзац: CTA
- Hashtags: 10-15 релевантных
`;
```

### Пример Instagram карусели:

```json
{
  "type": "carousel",
  "slides": [
    {
      "text": "🏝️ Пхи-Пхи:\nПолный гид 2025",
      "background": "#007AFF"
    },
    {
      "text": "1️⃣ Лучшее время\n7:00-9:00 утра\n(Пустые пляжи!)"
    },
    {
      "text": "2️⃣ Что взять?\n✅ Крем SPF 50\n✅ Подводная камера\n✅ Деньги наличные"
    },
    // ... слайды 3-9
    {
      "text": "Забронируй тур\nчерез наш бот 🤖\n\nСкидка 15% по коду\nPHIPHI15"
    }
  ],
  "caption": "Едешь на Пхи-Пхи? Сохрани этот гид! 🏝️\n\nМы собрали всё что нужно знать перед поездкой...",
  "hashtags": ["#пхукет", "#пхипхи", "#таиланд2025"]
}
```

---

### C) WhatsApp Персональные рекомендации

```typescript
interface WhatsAppMessage {
  user_id: string;
  template: "tour_recommendation" | "follow_up" | "abandoned_cart";
  
  // Персонализация
  user_name: string;
  personalized_content: string;
  recommended_tours: Tour[];
  
  // Время отправки
  send_at: Date;  // Оптимальное время для этого юзера
}
```

### WhatsApp Prompt:

```typescript
const whatsappPersonalizedPrompt = `
Создай персональное сообщение для клиента в WhatsApp.

Данные клиента:
${JSON.stringify(chatAnalysis)}

История:
- Смотрел туры на Пхи-Пхи
- Бюджет: $80-120
- Боится морской болезни
- Добавил в корзину, но не забронировал (3 дня назад)

Задача: Мягко напомнить + помочь решить проблему (морская болезнь)

Тон: Дружелюбный, как от друга
Длина: 3-5 предложений
CTA: Мягкий призыв к действию

НЕ используй:
❌ "Специальное предложение только сегодня!"
❌ "Скидка истекает через 2 часа!"
❌ Агрессивные продажи

Используй:
✅ Персонализацию по имени
✅ Решение конкретной проблемы клиента
✅ Честные рекомендации
✅ Мягкий CTA
`;
```

### Пример WhatsApp сообщения:

```
Привет, Иван! 👋

Помню, ты интересовался Пхи-Пхи, но беспокоился о морской болезни.

У меня хорошие новости! Наш 2-дневный тур использует большой катамаран (почти не качает) + мы даём таблетки от укачивания бесплатно.

95% наших клиентов с этой проблемой говорят, что всё прошло отлично 😊

Могу зарезервировать места на ближайшие выходные?
```

---

## 🎨 4. VISUAL GENERATION (Midjourney)

### Prompts для туристических визуалов:

```typescript
const midjourneyPrompts = {
  // Пхи-Пхи острова
  phiPhi: `
    Professional travel photography, Phi Phi Islands Thailand,
    crystal clear turquoise water, longtail boats,
    dramatic limestone cliffs, golden hour lighting,
    aerial drone view, ultra-detailed, 8K resolution,
    cinematic composition, National Geographic style,
    --ar 16:9 --v 6
  `,
  
  // Пляж
  beach: `
    Pristine tropical beach, Phuket Thailand,
    white sand, palm trees, sunset golden hour,
    people enjoying activities in background (blurred),
    lifestyle travel photography, vibrant colors,
    professional DSLR shot, shallow depth of field,
    --ar 4:5 --v 6
  `,
  
  // Снорклинг
  snorkeling: `
    Underwater photography, snorkeling in crystal clear water,
    colorful tropical fish, coral reefs, Thailand,
    GoPro style, bright natural lighting,
    vibrant blue water, person snorkeling in frame,
    adventure travel aesthetic, ultra HD,
    --ar 16:9 --v 6
  `,
  
  // Instagram Story Template
  storyTemplate: `
    Modern iOS 26 design, mobile UI template,
    clean minimalist layout, #007AFF accent color,
    glassmorphism background, SF Pro font,
    travel app aesthetic, vertical 9:16 format,
    white space, professional design,
    --ar 9:16 --v 6
  `
};
```

---

## 📈 5. ANALYTICS & OPTIMIZATION

### Что отслеживаем:

```typescript
interface ContentPerformance {
  // Идентификация
  content_id: string;
  platform: "tiktok" | "instagram" | "whatsapp";
  topic: string;
  created_at: Date;
  
  // Метрики
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;  // Instagram
  
  // Конверсия
  link_clicks: number;
  bot_visits: number;
  cart_additions: number;
  bookings: number;
  revenue: number;
  
  // Коэффициенты
  engagement_rate: number;  // (likes + comments + shares) / views
  conversion_rate: number;  // bookings / link_clicks
  roi: number;  // revenue / cost
  
  // A/B тесты
  variant: "A" | "B";
  test_winner: boolean;
}
```

### Автоматическая оптимизация:

```typescript
// Если engagement_rate > 5% → создать похожий контент
if (performance.engagement_rate > 0.05) {
  createSimilarContent(content.topic, content.style);
}

// Если conversion_rate < 2% → изменить CTA
if (performance.conversion_rate < 0.02) {
  optimizeCTA(content.id);
}

// Если ROI < 1 → остановить продвижение
if (performance.roi < 1) {
  pausePromotion(content.id);
}
```

### Dashboard метрик:

```
┌─────────────────────────────────────────┐
│   📊 CONTENT ANALYTICS (Last 30 Days)  │
├─────────────────────────────────────────┤
│                                         │
│   TikTok:                              │
│   📹 Videos: 47                        │
│   👀 Total Views: 2.4M                 │
│   💚 Engagement: 8.2% (отлично!)      │
│   🎯 Conversions: 342 bookings         │
│   💰 Revenue: ฿513,000 ($14,250)      │
│   📈 ROI: 12.5x                       │
│                                         │
│   Instagram:                           │
│   📸 Posts: 28                         │
│   👀 Reach: 850K                       │
│   💙 Engagement: 6.1%                 │
│   🎯 Conversions: 198 bookings         │
│   💰 Revenue: ฿297,000 ($8,250)       │
│   📈 ROI: 8.3x                        │
│                                         │
│   WhatsApp:                            │
│   💬 Messages: 1,247                   │
│   ✅ Open Rate: 89%                   │
│   🎯 Conversions: 156 bookings         │
│   💰 Revenue: ฿234,000 ($6,500)       │
│   📈 ROI: 18.7x (лучшее!)            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🤖 6. AUTOMATION WORKFLOW

### Полностью автоматизированный процесс:

```javascript
// Каждый понедельник 9:00
cron.schedule('0 9 * * MON', async () => {
  // 1. Анализируем чаты за неделю
  const weeklyChats = await analyzePastWeekChats();
  
  // 2. Выявляем топ-5 трендов
  const trends = detectTrends(weeklyChats);
  const topTrends = trends.slice(0, 5);
  
  // 3. Генерируем контент для каждого тренда
  for (const trend of topTrends) {
    // TikTok
    const tiktok = await generateTikTokScript(trend);
    const tiktokVisuals = await generateMidjourneyImages(tiktok.scenes);
    await schedulePost('tiktok', tiktok, tiktokVisuals);
    
    // Instagram
    const instagram = await generateInstagramCarousel(trend);
    const instaVisuals = await generateMidjourneyImages(instagram.slides);
    await schedulePost('instagram', instagram, instaVisuals);
  }
  
  // 4. Отправляем отчёт основателю
  await sendWeeklyReport(trends, scheduledContent);
});

// Каждый день 18:00 - персональные WhatsApp
cron.schedule('0 18 * * *', async () => {
  // Находим пользователей с abandoned cart (3+ дня)
  const abandonedCarts = await getAbandonedCarts(3);
  
  for (const cart of abandonedCarts) {
    const analysis = await getUserChatAnalysis(cart.user_id);
    const message = await generatePersonalizedWhatsApp(analysis, cart);
    await sendWhatsApp(cart.phone, message);
  }
});
```

---

## 💡 7. CONTENT CALENDAR (Контент-план)

### Еженедельный ритм:

```
ПОНЕДЕЛЬНИК:
- 🎬 Анализ трендов прошлой недели
- 📝 Генерация контент-плана на неделю
- 🎨 Создание визуалов (Midjourney)

ВТОРНИК-ПЯТНИЦА:
- 📱 1 TikTok в день (17:00 - лучшее время)
- 📸 1 Instagram carousel (12:00)
- 📖 1 Instagram Reel (19:00)
- 💬 WhatsApp персонализация (18:00)

СУББОТА:
- 🎉 "Weekend vibes" контент
- 🏝️ Inspiration для планирования поездки
- 🎯 Акции и спецпредложения

ВОСКРЕСЕНЬЕ:
- 📊 Анализ метрик недели
- 💡 Оптимизация стратегии
- 🔄 A/B тесты
```

---

## 🎯 8. BEST PRACTICES

### Контент, который работает:

```
✅ РАБОТАЕТ:
- Образовательный контент ("Топ-5 ошибок")
- Behind-the-scenes (реальные туры)
- User-generated content (клиенты на турах)
- Problem-solving ("Как избежать морской болезни")
- Локальные инсайты (скрытые места)
- Честные отзывы
- Быстрые лайфхаки

❌ НЕ РАБОТАЕТ:
- Прямая реклама ("Купи наш тур!")
- Слишком постановочное
- Длинные видео (>90 сек)
- Низкое качество съёмки
- Обманчивые заголовки (clickbait)
- Сложные объяснения
```

### Формула вирусного TikTok:

```
Вирусность = (Hook × Value × Emotion) / Friction

Hook: Первые 3 секунды решают всё
Value: Полезная информация
Emotion: Вызывает чувства (wow, смех, восхищение)
Friction: Сложность восприятия (должна быть минимальной)
```

---

## 🚀 IMPLEMENTATION ROADMAP

### Фаза 1: MVP (2 недели)
- [ ] Настроить ChatGPT API для анализа чатов
- [ ] Создать базовую систему выявления трендов
- [ ] Интегрировать Midjourney API
- [ ] Ручная публикация контента (proof of concept)

### Фаза 2: Automation (1 месяц)
- [ ] Автоматическая генерация TikTok скриптов
- [ ] Автоматическая генерация Instagram контента
- [ ] Персонализированные WhatsApp сообщения
- [ ] Scheduling система (Buffer/Hootsuite API)

### Фаза 3: Analytics (2 недели)
- [ ] Dashboard для метрик
- [ ] A/B testing framework
- [ ] ROI tracking по каждому контенту
- [ ] Автоматическая оптимизация

### Фаза 4: Scale (ongoing)
- [ ] Мультиязычность (EN, RU, CN, DE)
- [ ] Локализация под каждую страну
- [ ] AI-оптимизация на основе данных
- [ ] Predictive analytics (предсказание трендов)

---

## 💎 COMPETITIVE ADVANTAGES

### Почему конкуренты не могут повторить:

1. **AI-First Approach:**
   - Booking.com: Нанимает 50+ контент-менеджеров ($50K/year × 50 = $2.5M)
   - МЫ: ChatGPT + Midjourney = $500/month (в 5,000 раз дешевле!)

2. **Perplexity-Style Analytics:**
   - Конкуренты: Угадывают что создавать
   - МЫ: Данные из чатов → точные тренды → viral контент

3. **Персонализация:**
   - Конкуренты: Массовая рассылка
   - МЫ: Персональные рекомендации для каждого клиента

4. **Скорость:**
   - GetYourGuide: Контент создаётся неделями
   - МЫ: От тренда до публикации за 24 часа

---

## 🎓 ПРИМЕРЫ КОНТЕНТА (Templates)

### TikTok Template #1: "Топ-5 ошибок"
```
HOOK (0-3s): "99% туристов делают ЭТО на Пхукете 😱"
#1 (3-13s): Ошибка + последствие
#2 (13-23s): Ошибка + последствие
#3 (23-33s): Ошибка + последствие
#4 (33-43s): Ошибка + последствие
#5 (43-53s): Ошибка + последствие
CTA (53-60s): "Забронируй умный тур через наш бот"
```

### Instagram Template #2: "Гид по месту"
```
Слайд 1: Заголовок места + эмодзи
Слайды 2-4: Основная информация
Слайды 5-7: Лайфхаки
Слайд 8: Что взять с собой
Слайд 9: Как добраться
Слайд 10: CTA + ссылка на бота
```

### WhatsApp Template #3: "Решение проблемы"
```
Привет, ${name}! 👋

Помню, ты ${specific_pain_point}.

У меня есть решение: ${solution}

${social_proof}

${soft_cta}
```

---

## 💰 EXPECTED RESULTS

### ROI по платформам (прогноз):

```
TikTok:
- Cost: $100/month (ads boost)
- Traffic: 100K views/month
- Conversions: 300 bookings/month
- Revenue: $30,000/month
- ROI: 300x

Instagram:
- Cost: $150/month (ads)
- Traffic: 50K reach/month
- Conversions: 150 bookings/month
- Revenue: $15,000/month
- ROI: 100x

WhatsApp:
- Cost: $50/month (API)
- Messages: 2,000/month
- Conversions: 200 bookings/month
- Revenue: $20,000/month
- ROI: 400x (BEST!)

TOTAL:
- Investment: $300/month
- Revenue: $65,000/month
- ROI: 216x 🚀
```

---

## 🔥 CALL TO ACTION

**Начни с малого:**
1. Проанализируй 100 чатов вручную → найди топ-3 тренда
2. Создай 3 TikTok вручную (используй ChatGPT для скриптов)
3. Опубликуй и отслеживай метрики
4. Если ROI > 5x → автоматизируй процесс
5. Масштабируй на другие платформы

**Помни:** 1% ежедневного улучшения = 3,678% роста за год!

---

**Created:** October 22, 2025  
**Updated:** October 22, 2025  
**Status:** AI CONTENT SYSTEM BLUEPRINT  
**For:** Marketing & Growth Team (AI Agents)

