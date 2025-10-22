# 🏗️ SITE STRUCTURE - Архитектура сайта PhuketDa

> **Создано:** October 22, 2025  
> **Based on:** Анализ phuket-insider.com + best practices GetYourGuide/Viator  
> **Status:** Design Phase (перед имплементацией)

---

## 📊 КОНКУРЕНТНЫЙ АНАЛИЗ: PHUKET-INSIDER.COM

### Что у них работает хорошо:

✅ **Поисковая строка** на главной (как Perplexity!)  
✅ **10 категорий** в топ-меню (но СЛИШКОМ много)  
✅ **Популярные районы** - отличная идея!  
✅ **Telegram бот** - интеграция есть  
✅ **FAQ секция** - люди ищут ответы  
✅ **"Случайное фото"** - геймификация  
✅ **Гиды по темам** ("Романтичные кафе", "Смотровые площадки")  

### Что мы сделаем ЛУЧШЕ:

❌ **Слишком много пунктов меню** (10!) → У НАС: 5 разделов (минимализм Perplexity)  
❌ **Нет цен и бронирования** → У НАС: booking engine с Telegram Payments  
❌ **Нет AI-помощника** → У НАС: ChatGPT рекомендует топ-3 тура  
❌ **Длинная прокрутка** → У НАС: iOS 26 навигация, всё за 2 тапа  
❌ **Нет персонализации** → У НАС: AI анализирует предпочтения  

---

## 🎯 НАША ИНФОРМАЦИОННАЯ АРХИТЕКТУРА

### Принципы дизайна:

1. **MINIMALISM** - меньше выборов = больше конверсий  
2. **SPEED** - < 2 сек загрузка каждой страницы  
3. **CLARITY** - понятно куда жать за 3 секунды  
4. **MOBILE-FIRST** - 90% трафика с мобильных  
5. **SEO-DRIVEN** - каждая страница = точка входа из Google  

---

## 📱 ГЛАВНАЯ НАВИГАЦИЯ

### Bottom Navigation (iOS 26 Style)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  🏝️       📍      🤖      🛒       👤            │
│ Tours   Insider   AI    Cart   Profile            │
│                                                     │
│ [активный = #007AFF, неактивный = gray]           │
│ [анимация переходов как в iOS]                     │
└─────────────────────────────────────────────────────┘
```

**Всегда видно на всех страницах!** (fixed position)

---

## 🏝️ РАЗДЕЛ 1: TOURS (Booking Engine)

### URL Structure:

```
/tours                          → Все туры
/tours/islands                  → Категория "Островные туры"
/tours/islands/phi-phi-2-days   → Детальная страница тура
/tours/temples                  → Категория "Храмы"
/tours/adventures               → Категория "Приключения"
```

### Главная страница /tours:

```
┌─────────────────────────────────────┐
│  🔍 Поиск туров...                 │ ← Как Perplexity
├─────────────────────────────────────┤
│  Категории (горизонтальный скролл):│
│  [🏝️ Острова] [🛕 Храмы] [🚁 Приключения] [🍜 Еда] [💎 VIP]
├─────────────────────────────────────┤
│  Фильтры:                           │
│  💰 Цена: [до $50] [$50-100] [$100+]│
│  ⏱️ Длительность: [Полдня] [День] [2+ дня]
│  📍 Локация: [Пхукет] [Краби] [Пханг Нга]
├─────────────────────────────────────┤
│  Популярные туры:                   │
│  ┌──────────┐ ┌──────────┐         │
│  │ Пхи-Пхи  │ │ James    │         │
│  │ 2д/1н    │ │ Bond     │         │
│  │ от $120  │ │ от $90   │         │
│  │ ⭐4.9     │ │ ⭐4.7     │         │
│  └──────────┘ └──────────┘         │
└─────────────────────────────────────┘
```

### Категории туров (tags в Shopify):

```typescript
const tourCategories = {
  islands: {
    emoji: "🏝️",
    title: "Островные туры",
    description: "Пхи-Пхи, Симиланы, 4 острова",
    seoTitle: "Экскурсии на острова Пхукета",
    tours: ["phi-phi-2-days", "similan-1-day", "4-pearls"]
  },
  temples: {
    emoji: "🛕",
    title: "Храмы",
    description: "Ват Чалонг, Большой Будда",
    seoTitle: "Храмы Пхукета - экскурсии",
    tours: ["temples-tour", "big-buddha-tour"]
  },
  adventures: {
    emoji: "🚁",
    title: "Приключения",
    description: "Рафтинг, ATV, зиплайн",
    seoTitle: "Экстремальный отдых на Пхукете",
    tours: ["rafting-spa-atv", "zipline-tour"]
  },
  water_sports: {
    emoji: "🏄",
    title: "Водные виды спорта",
    description: "Дайвинг, снорклинг, кайтсерфинг",
    seoTitle: "Водные развлечения Пхукет",
    tours: ["diving-course", "snorkeling-tour"]
  },
  culture: {
    emoji: "🎭",
    title: "Культурные туры",
    description: "Old Town, музеи, шоу",
    seoTitle: "Культура и традиции Пхукета",
    tours: ["old-town-tour", "siam-niramit"]
  },
  food: {
    emoji: "🍜",
    title: "Гастрономические",
    description: "Тайская кухня, кулинарные мастер-классы",
    seoTitle: "Гастро туры Пхукет",
    tours: ["cooking-class", "food-market-tour"]
  },
  vip: {
    emoji: "💎",
    title: "VIP туры",
    description: "Приватные яхты, вертолетные туры",
    seoTitle: "Премиум экскурсии на Пхукете",
    tours: ["private-yacht", "helicopter-tour"]
  }
};
```

### Детальная страница тура:

**URL:** `/tours/islands/phi-phi-2-days`

```
┌─────────────────────────────────────────┐
│  ← Назад              [❤️ Избранное]   │
├─────────────────────────────────────────┤
│  [Большое фото тура - карусель]        │
│  📸 📸 📸 📸 📸                          │
├─────────────────────────────────────────┤
│  🏝️ Пхи-Пхи 2 дня / 1 ночь           │
│  ⭐ 4.9 (328 отзывов)                  │
│                                         │
│  от $120 💰 (взрослый)                 │
│  от $90 💰 (детский 4-11 лет)          │
│                                         │
│  [ЗАБРОНИРОВАТЬ] ← #007AFF большая кнопка
├─────────────────────────────────────────┤
│  📋 Что включено:                       │
│  ✅ Трансфер от отеля                   │
│  ✅ Завтрак, обед, ужин                 │
│  ✅ Снорклинг                           │
│  ✅ Ночь в отеле на Пхи-Пхи            │
│  ✅ Русскоговорящий гид                 │
├─────────────────────────────────────────┤
│  📍 Что посетим:                        │
│  • Пляж Maya Bay (фильм "Пляж")        │
│  • Lagoon и Viking Cave                 │
│  • Monkey Beach                         │
│  • Snorkeling у коралловых рифов        │
├─────────────────────────────────────────┤
│  🕐 Расписание:                         │
│  День 1: 08:00 - 18:00                  │
│  День 2: 08:00 - 17:00                  │
├─────────────────────────────────────────┤
│  💬 Отзывы (328):                       │
│  [Карточки отзывов с фото]              │
├─────────────────────────────────────────┤
│  🎯 Похожие туры:                       │
│  [4 Pearls] [James Bond] [Krabi]        │
└─────────────────────────────────────────┘
```

### Процесс бронирования:

```
1. Клик "ЗАБРОНИРОВАТЬ"
    ↓
2. Выбор даты в календаре (iOS 26 date picker)
    ↓
3. Выбор количества (взрослые/дети)
    ↓
4. Добавить в корзину / Купить сейчас
    ↓
5. Переход в Telegram WebApp
    ↓
6. Оплата через Telegram Payments
    ↓
7. Подтверждение → в чат с менеджером
```

---

## 📍 РАЗДЕЛ 2: PHUKET INSIDER (Content Marketing)

### URL Structure:

```
/insider                          → Главная Insider
/insider/beaches                  → Категория "Пляжи"
/insider/beaches/patong           → Статья про пляж Патонг
/insider/temples                  → Категория "Храмы"
/insider/temples/wat-chalong      → Статья про Ват Чалонг
/insider/restaurants              → Категория "Рестораны"
/insider/districts/patong         → Гид по району Патонг
```

### 7 категорий контента (из AGENTS.md):

```typescript
const insiderCategories = {
  beaches: {
    emoji: "🏖️",
    title: "Пляжи",
    description: "Все пляжи Пхукета: описание, фото, как добраться",
    seoTitle: "Пляжи Пхукета - полный гид",
    articles: 20, // цель
    keywords: ["пляж патонг", "пляж карон", "freedom beach"]
  },
  temples: {
    emoji: "🛕",
    title: "Храмы",
    description: "Храмы и святыни: история, правила посещения",
    seoTitle: "Храмы Пхукета - что посетить",
    articles: 10,
    keywords: ["ват чалонг", "биг будда", "храмы пхукета"]
  },
  restaurants: {
    emoji: "🍜",
    title: "Рестораны",
    description: "Где поесть: тайская кухня, морепродукты, vegan",
    seoTitle: "Рестораны Пхукета - лучшие места",
    articles: 30,
    keywords: ["рестораны патонга", "где поесть пхукет", "тайская кухня"]
  },
  viewpoints: {
    emoji: "🌅",
    title: "Смотровые площадки",
    description: "Лучшие виды для фото и закатов",
    seoTitle: "Смотровые площадки Пхукета",
    articles: 10,
    keywords: ["viewpoint пхукет", "промтеп кейп", "карон вьюпоинт"]
  },
  nightlife: {
    emoji: "🌃",
    title: "Ночная жизнь",
    description: "Клубы, бары, шоу, Bangla Road",
    seoTitle: "Ночная жизнь Пхукета",
    articles: 15,
    keywords: ["bangla road", "клубы пхукета", "бары патонга"]
  },
  shopping: {
    emoji: "🛍️",
    title: "Шопинг",
    description: "Рынки, торговые центры, сувениры",
    seoTitle: "Шопинг на Пхукете - где купить",
    articles: 12,
    keywords: ["рынки пхукета", "торговые центры", "сувениры"]
  },
  districts: {
    emoji: "📍",
    title: "Районы Пхукета",
    description: "Где жить: плюсы, минусы, инфраструктура",
    seoTitle: "Районы Пхукета - где лучше жить",
    articles: 15,
    keywords: ["патонг", "карон", "ката", "банг тао", "раваи"]
  }
};
```

### Главная страница /insider:

```
┌─────────────────────────────────────┐
│  📍 Phuket Insider                  │
│  Всё о Пхукете: гиды, советы, лайфхаки
├─────────────────────────────────────┤
│  🔍 Поиск по статьям...            │
├─────────────────────────────────────┤
│  Категории (горизонтальный скролл):│
│  [🏖️ Пляжи] [🛕 Храмы] [🍜 Рестораны] [🌅 Виды]
├─────────────────────────────────────┤
│  🔥 Популярные статьи:              │
│  ┌──────────┐ ┌──────────┐         │
│  │ Freedom  │ │ Ват      │         │
│  │ Beach    │ │ Чалонг   │         │
│  │ 📖 5 мин │ │ 📖 7 мин │         │
│  └──────────┘ └──────────┘         │
├─────────────────────────────────────┤
│  📍 Популярные районы:              │
│  [Патонг] [Карон] [Ката] [Банг Тао]│
├─────────────────────────────────────┤
│  💡 Гиды по темам:                  │
│  • Романтичные места                │
│  • Инстаграмные кафе                │
│  • Смотровые площадки               │
│  • Бич-клабы                        │
└─────────────────────────────────────┘
```

### Детальная страница статьи:

**URL:** `/insider/beaches/freedom-beach`

```
┌─────────────────────────────────────────┐
│  ← Назад              [🔖 Сохранить]   │
├─────────────────────────────────────────┤
│  [Большое фото пляжа]                  │
├─────────────────────────────────────────┤
│  🏖️ Freedom Beach - райский пляж      │
│  📖 5 мин чтения  •  📍 Патонг         │
│                                         │
│  Freedom Beach - один из самых         │
│  красивых пляжей Пхукета. Белый песок, │
│  бирюзовая вода, пальмы...             │
│                                         │
│  ## Как добраться:                      │
│  🚤 Лонгтейл-бот от Патонга (300฿)    │
│  🚗 На машине + пешком 15 мин          │
│                                         │
│  ## Что взять с собой:                  │
│  • Наличные (на пляже нет банкоматов)  │
│  • Снорклинг маску                      │
│  • Крем от солнца                       │
│                                         │
│  ## Лучшее время:                       │
│  ☀️ Ноябрь - Апрель (сухой сезон)     │
│  ⏰ 10:00-16:00 (солнце прямо)         │
├─────────────────────────────────────────┤
│  🎯 ХОТИТЕ ПОСЕТИТЬ?                    │ ← КЛЮЧ!
│                                         │
│  Забронируйте тур с посещением          │
│  Freedom Beach:                         │
│                                         │
│  [🏝️ 4 Pearls Tour - от $110]         │
│                                         │
│  [ЗАБРОНИРОВАТЬ] ← #007AFF кнопка      │
├─────────────────────────────────────────┤
│  📚 Похожие статьи:                     │
│  • Paradise Beach                       │
│  • Ya Nui Beach                         │
│  • Banana Beach                         │
└─────────────────────────────────────────┘
```

**⚠️ КРИТИЧЕСКИ ВАЖНО:** Внизу КАЖДОЙ статьи Insider → ссылка на релевантный тур!

---

## 🤖 РАЗДЕЛ 3: AI CHAT (Perplexity-Style)

### URL: `/ai`

```
┌─────────────────────────────────────────┐
│  🤖 AI-помощник PhuketDa                │
│  Я помогу выбрать идеальный тур!       │
├─────────────────────────────────────────┤
│  💬 Чат (как Perplexity):               │
│                                         │
│  [Пользователь:]                        │
│  Хочу на острова, бюджет до $150,      │
│  с ночевкой                             │
│                                         │
│  [AI:]                                  │
│  Отлично! Вам подойдут 3 тура:         │
│                                         │
│  1. 🏝️ Пхи-Пхи 2д/1н - $120           │
│     ⭐ Лучший выбор для вас!           │
│     • 2 острова + ночевка              │
│     • Снорклинг включен                │
│     [Забронировать]                     │
│                                         │
│  2. 🏝️ Краби 4 острова - $140         │
│     • 4 острова за 1 день              │
│     [Забронировать]                     │
│                                         │
│  3. 🏝️ 4 Pearls - $110                │
│     • Без ночевки, но 4 локации        │
│     [Забронировать]                     │
├─────────────────────────────────────────┤
│  [Введите сообщение...]                 │
│                              [Отправить]│
└─────────────────────────────────────────┘
```

### Как работает AI:

```typescript
// Prompt для ChatGPT
const systemPrompt = `
Ты - AI-помощник PhuketDa. Твоя задача:

1. Понять потребности клиента:
   - Бюджет
   - Интересы (острова, храмы, приключения)
   - Длительность (полдня, день, 2+ дня)
   - Количество людей (взрослые/дети)

2. Рекомендовать топ-3 тура из этого списка:
   ${JSON.stringify(availableTours)}

3. Объяснить ПОЧЕМУ это лучший выбор

4. Дать ссылку "Забронировать" для каждого

ВАЖНО:
- Всегда рекомендуй 3 варианта (не больше!)
- Первый = лучший match
- Объясняй простым языком
- Добавляй эмодзи для визуала
`;
```

---

## 🛒 РАЗДЕЛ 4: CART (Корзина)

### URL: `/cart`

```
┌─────────────────────────────────────────┐
│  🛒 Корзина (2 тура)                    │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐ │
│  │ 🏝️ Пхи-Пхи 2д/1н                │ │
│  │ 2 взрослых + 1 ребенок            │ │
│  │ 15 ноября 2025                    │ │
│  │ $330                     [Удалить]│ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🛕 Temples Tour                   │ │
│  │ 2 взрослых                        │ │
│  │ 16 ноября 2025                    │ │
│  │ $80                      [Удалить]│ │
│  └───────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  💰 Итого: $410                         │
│  🎁 Скидка 10% при бронировании 2+ туров│
│  💵 К оплате: $369                      │
├─────────────────────────────────────────┤
│  [ОФОРМИТЬ ЗАКАЗ] ← #007AFF большая    │
├─────────────────────────────────────────┤
│  ✨ Рекомендуем добавить:               │
│  [Трансфер в аэропорт - $25]           │
│  [Страховка - $15]                      │
└─────────────────────────────────────────┘
```

---

## 👤 РАЗДЕЛ 5: PROFILE (Личный кабинет)

### URL: `/profile`

```
┌─────────────────────────────────────────┐
│  👤 Иван Петров                         │
│  📧 ivan@example.com                    │
│  📱 +7 999 123-45-67                    │
├─────────────────────────────────────────┤
│  🎯 Мои бронирования:                   │
│                                         │
│  Предстоящие (2):                       │
│  • 🏝️ Пхи-Пхи 2д/1н - 15 ноя          │
│  • 🛕 Temples Tour - 16 ноя             │
│                                         │
│  Прошедшие (5):                         │
│  • James Bond Island - 10 окт           │
│  • Sunset Cruise - 05 окт               │
│  ...                                    │
├─────────────────────────────────────────┤
│  💎 Программа лояльности:               │
│  Накоплено: 450 баллов                  │
│  До VIP статуса: 550 баллов             │
│                                         │
│  [Использовать баллы]                   │
├─────────────────────────────────────────┤
│  🎁 Реферальная программа:              │
│  Пригласи друга - получи 10% скидку     │
│                                         │
│  Твоя ссылка:                           │
│  phuketda.com/ref/ivan123               │
│                                         │
│  [Поделиться]                           │
├─────────────────────────────────────────┤
│  ⚙️ Настройки:                          │
│  • Изменить профиль                     │
│  • Язык (RU / EN / TH)                  │
│  • Валюта ($, €, ฿, ₽)                 │
│  • Уведомления                          │
│  • Выйти                                │
└─────────────────────────────────────────┘
```

---

## 🗺️ ДОПОЛНИТЕЛЬНЫЕ РАЗДЕЛЫ

### Footer Navigation:

```
┌─────────────────────────────────────────┐
│  PhuketDa                               │
│  AI-powered туры на Пхукете             │
├─────────────────────────────────────────┤
│  📱 Telegram: @phuketda_chat            │
│  📧 Email: hello@phuketda.com           │
│  ☎️ WhatsApp: +66 XXX XXX XXXX          │
├─────────────────────────────────────────┤
│  Туры:                                  │
│  • Островные                            │
│  • Храмы                                │
│  • Приключения                          │
│  • VIP туры                             │
│                                         │
│  Phuket Insider:                        │
│  • Пляжи                                │
│  • Рестораны                            │
│  • Смотровые площадки                   │
│  • Районы Пхукета                       │
│                                         │
│  Сервисы:                               │
│  • 🚗 Аренда авто                       │
│  • 💱 Обмен валюты ($1,200/mo!)         │
│  • 🏠 Недвижимость (скоро)              │
│                                         │
│  Компания:                              │
│  • О нас                                │
│  • Контакты                             │
│  • FAQ                                  │
│  • Политика конфиденциальности          │
│  • Пользовательское соглашение          │
├─────────────────────────────────────────┤
│  © 2025 PhuketDa. Все права защищены.  │
└─────────────────────────────────────────┘
```

---

## 🎨 ДИЗАЙН СИСТЕМА (iOS 26)

### Цветовая палитра:

```css
:root {
  /* Primary */
  --primary: #007AFF;
  --primary-hover: #0051D5;
  --primary-active: #004FC4;
  
  /* Background */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F2F2F7;
  --bg-glass: rgba(255, 255, 255, 0.7);
  
  /* Text */
  --text-primary: rgba(0, 0, 0, 0.85);
  --text-secondary: rgba(0, 0, 0, 0.55);
  --text-tertiary: rgba(0, 0, 0, 0.35);
  
  /* Success/Warning/Error */
  --success: #34C759;
  --warning: #FF9500;
  --error: #FF3B30;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
}
```

### Типографика:

```css
/* SF Pro Text/Display */
--font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 
               'Segoe UI', Roboto, sans-serif;

/* Large Title (34px) */
.text-large-title {
  font-size: 34px;
  font-weight: 700;
  line-height: 41px;
  letter-spacing: 0.37px;
}

/* Title 1 (28px) */
.text-title-1 {
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  letter-spacing: 0.36px;
}

/* Title 2 (22px) */
.text-title-2 {
  font-size: 22px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0.35px;
}

/* Title 3 (20px) */
.text-title-3 {
  font-size: 20px;
  font-weight: 600;
  line-height: 25px;
  letter-spacing: 0.38px;
}

/* Headline (17px) - основной текст */
.text-headline {
  font-size: 17px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: -0.41px;
}

/* Body (17px) */
.text-body {
  font-size: 17px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: -0.41px;
}

/* Callout (16px) */
.text-callout {
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: -0.32px;
}

/* Footnote (13px) */
.text-footnote {
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: -0.08px;
}

/* Caption 1 (12px) */
.text-caption {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0px;
}
```

### Spacing System:

```css
/* iOS 26 spacing (8px grid) */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

### Border Radius:

```css
--radius-sm: 8px;   /* Chips, badges */
--radius-md: 14px;  /* Cards, buttons */
--radius-lg: 20px;  /* Modals */
--radius-xl: 28px;  /* Bottom sheets */
--radius-full: 9999px; /* Pills */
```

---

## 📊 SEO STRATEGY

### URL Structure (SEO-friendly):

```
✅ GOOD:
/tours/islands/phi-phi-2-days
/insider/beaches/freedom-beach
/insider/districts/patong

❌ BAD:
/product/12345
/article?id=678
/page.php?cat=beaches
```

### Meta Tags Template:

```typescript
// Для туров
{
  title: "🏝️ Пхи-Пхи 2 дня/1 ночь от $120 | PhuketDa",
  description: "Забронируй тур на Пхи-Пхи с ночевкой: снорклинг, Maya Bay, Viking Cave. Трансфер включен. ⭐4.9 (328 отзывов)",
  keywords: ["пхи-пхи тур", "phi phi islands", "тур с ночевкой пхукет", "экскурсия на пхи-пхи"],
  ogImage: "https://phuketda.com/images/tours/phi-phi-og.jpg",
  canonical: "https://phuketda.com/tours/islands/phi-phi-2-days"
}

// Для Insider статей
{
  title: "🏖️ Freedom Beach Пхукет - полный гид 2025 | PhuketDa Insider",
  description: "Freedom Beach - лучший пляж Пхукета! Как добраться, что взять, лучшее время. Фото, отзывы, советы инсайдеров.",
  keywords: ["freedom beach", "фридом бич пхукет", "лучшие пляжи пхукета", "патонг пляжи"],
  ogImage: "https://phuketda.com/images/insider/freedom-beach-og.jpg",
  canonical: "https://phuketda.com/insider/beaches/freedom-beach"
}
```

### Schema.org Markup:

```json
// Для туров (Product + Tour)
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Пхи-Пхи 2 дня / 1 ночь",
  "description": "Незабываемое путешествие...",
  "image": "https://phuketda.com/images/tours/phi-phi.jpg",
  "offers": {
    "@type": "Offer",
    "price": "120.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "328"
  }
}

// Для Insider статей (Article)
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Freedom Beach - райский пляж Пхукета",
  "image": "https://phuketda.com/images/insider/freedom-beach.jpg",
  "author": {
    "@type": "Organization",
    "name": "PhuketDa Insider"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PhuketDa",
    "logo": {
      "@type": "ImageObject",
      "url": "https://phuketda.com/logo.png"
    }
  },
  "datePublished": "2025-10-22",
  "dateModified": "2025-10-22"
}
```

### Internal Linking Strategy:

```
Главная → Tours → Category → Tour Detail
             ↓
           Insider → Category → Article → Ссылка на релевантный Tour ✅

Insider Article → Related Tours (3-5 туров)
Tour Detail → Related Articles from Insider
Category Page → Top 10 туров/статей
```

### Sitemap.xml Structure:

```xml
<urlset>
  <!-- Главная -->
  <url>
    <loc>https://phuketda.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Туры (высокий приоритет) -->
  <url>
    <loc>https://phuketda.com/tours</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://phuketda.com/tours/islands/phi-phi-2-days</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Insider (SEO-трафик) -->
  <url>
    <loc>https://phuketda.com/insider</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://phuketda.com/insider/beaches/freedom-beach</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

---

## 🚀 PERFORMANCE TARGETS

### Core Web Vitals:

```
✅ Lighthouse Score: 90+

Performance Metrics:
├─ First Contentful Paint (FCP): < 1.2s
├─ Largest Contentful Paint (LCP): < 2.5s
├─ Time to Interactive (TTI): < 3.5s
├─ Total Blocking Time (TBT): < 300ms
└─ Cumulative Layout Shift (CLS): < 0.1

SEO Score: 95+
Accessibility Score: 95+
Best Practices: 95+
```

### Optimization Techniques:

```typescript
// 1. Image Optimization
- WebP формат с fallback на JPEG
- Lazy loading для off-screen images
- Responsive images (srcset)
- Blur placeholder пока грузится

// 2. Code Splitting
- React.lazy() для роутов
- Dynamic imports для тяжелых компонентов
- Separate vendors chunk

// 3. Caching Strategy
- Service Worker для offline
- Cache-First для статики
- Network-First для API данных
- Stale-While-Revalidate для Shopify

// 4. Bundle Size
- Tree shaking
- Remove unused CSS (PurgeCSS)
- Minification (Vite)
- Gzip/Brotli compression

// 5. Prefetching
- Prefetch следующей страницы при hover
- Preload критических ресурсов
- DNS prefetch для внешних ресурсов
```

---

## 📱 MOBILE-FIRST APPROACH

### Breakpoints:

```css
/* Mobile First */
/* Default: 320px - 480px (mobile) */

/* Tablet */
@media (min-width: 768px) {
  /* iPad portrait */
}

/* Desktop */
@media (min-width: 1024px) {
  /* iPad landscape, small desktop */
}

/* Large Desktop */
@media (min-width: 1440px) {
  /* Full HD */
}
```

### Touch Targets:

```css
/* iOS 26 minimum touch target: 44x44px */
.btn,
.link,
.tab {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

---

## ♿ ACCESSIBILITY (WCAG 2.1 AA)

### Обязательные требования:

```typescript
// 1. Semantic HTML
<nav>, <main>, <article>, <aside>, <footer>

// 2. ARIA labels
<button aria-label="Добавить в избранное">❤️</button>

// 3. Keyboard Navigation
- Tab navigation
- Enter/Space для кнопок
- Esc для закрытия модалок

// 4. Focus Indicators
button:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

// 5. Color Contrast
- Text: минимум 4.5:1
- Large text: минимум 3:1
- Interactive elements: минимум 3:1

// 6. Alt text для изображений
<img src="phi-phi.jpg" alt="Пляж Maya Bay на острове Пхи-Пхи" />

// 7. Form labels
<label for="email">Email:</label>
<input id="email" type="email" />
```

---

## 🔄 USER FLOW EXAMPLES

### Flow 1: Бронирование тура (новый пользователь)

```
1. Лендинг на главной (SEO/реклама)
    ↓
2. Клик на раздел "Tours" в bottom nav
    ↓
3. Просмотр категорий → выбор "Островные туры"
    ↓
4. Скролл → карточка "Пхи-Пхи 2д/1н" выглядит идеально
    ↓
5. Клик → детальная страница тура
    ↓
6. Прокрутка: фото, описание, отзывы ⭐4.9 → убедился
    ↓
7. Клик "ЗАБРОНИРОВАТЬ" (#007AFF кнопка)
    ↓
8. Выбор даты в календаре
    ↓
9. Выбор: 2 взрослых + 1 ребенок
    ↓
10. "Добавить в корзину" / "Купить сейчас"
    ↓
11. Переход в Telegram WebApp (бесшовно!)
    ↓
12. Заполнение: имя, телефон, отель
    ↓
13. Оплата через Telegram Payments (карта/криптa)
    ↓
14. Подтверждение → автоматически попадает в чат с менеджером
    ↓
15. Менеджер отправляет детали → бронирование завершено!

⏱️ Время: 3-5 минут
✅ Конверсия цель: 15-25%
```

### Flow 2: Поиск информации → бронирование (SEO-трафик)

```
1. Google поиск: "freedom beach пхукет как добраться"
    ↓
2. Клик на результат → /insider/beaches/freedom-beach
    ↓
3. Читает статью: красивые фото, полезная инфо
    ↓
4. Прокручивает вниз → видит блок:
   "🎯 ХОТИТЕ ПОСЕТИТЬ?
   Забронируйте тур с посещением Freedom Beach:
   [🏝️ 4 Pearls Tour - от $110] [ЗАБРОНИРОВАТЬ]"
    ↓
5. Думает: "О, это же удобно!" → клик на тур
    ↓
6. Переход на /tours/islands/4-pearls
    ↓
7. Flow как в примере 1 → бронирование!

⏱️ Время: 5-7 минут
✅ Это КЛЮЧЕВАЯ фишка Insider → Tour integration!
```

### Flow 3: AI-помощник (персонализация)

```
1. Пользователь не знает что выбрать → раздел "AI" в bottom nav
    ↓
2. Открывается чат с AI (как Perplexity)
    ↓
3. AI приветствует: "Привет! Помогу выбрать тур. Расскажи что тебе интересно?"
    ↓
4. Пользователь: "Хочу на острова, бюджет до $150, с детьми"
    ↓
5. AI анализирует → рекомендует топ-3:
   1️⃣ Пхи-Пхи 2д/1н - $120 ⭐ ЛУЧШИЙ ДЛЯ ВАС!
   2️⃣ 4 Pearls - $110
   3️⃣ James Bond Island - $90
   С объяснением ПОЧЕМУ каждый подходит
    ↓
6. Клик на первый → переход на страницу тура
    ↓
7. Бронирование как обычно

⏱️ Время: 4-6 минут
✅ Конверсия выше чем обычный поиск!
```

---

## 📈 ANALYTICS & TRACKING

### Events для Google Analytics 4:

```typescript
// Page Views
gtag('event', 'page_view', {
  page_title: document.title,
  page_location: window.location.href,
  page_path: window.location.pathname
});

// Tour Views
gtag('event', 'view_item', {
  currency: 'USD',
  value: 120.00,
  items: [{
    item_id: 'phi-phi-2-days',
    item_name: 'Пхи-Пхи 2д/1н',
    item_category: 'islands',
    price: 120.00
  }]
});

// Add to Cart
gtag('event', 'add_to_cart', {
  currency: 'USD',
  value: 120.00,
  items: [{ /* tour data */ }]
});

// Purchase
gtag('event', 'purchase', {
  transaction_id: 'T12345',
  value: 369.00,
  currency: 'USD',
  items: [{ /* tours data */ }]
});

// AI Chat Interactions
gtag('event', 'ai_chat_message', {
  message_type: 'user_query',
  category: 'ai_assistant'
});

// Insider → Tour Conversion
gtag('event', 'insider_to_tour_click', {
  article_id: 'freedom-beach',
  tour_id: '4-pearls',
  category: 'conversion'
});
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1)

- [ ] Создать роутинг для 5 разделов (React Router)
- [ ] Реализовать Bottom Navigation (iOS 26 style)
- [ ] Настроить TypeScript типы для Shopify
- [ ] Создать базовые компоненты (Button, Card, Input)
- [ ] Настроить дизайн-систему (CSS variables)

### Phase 2: Tours Section (Week 2)

- [ ] Страница /tours с фильтрами
- [ ] Страницы категорий /tours/:category
- [ ] Детальная страница тура /tours/:category/:handle
- [ ] Интеграция Shopify Storefront API
- [ ] Booking flow (calendar, quantity selector)
- [ ] Корзина /cart

### Phase 3: Insider Section (Week 3)

- [ ] Страница /insider
- [ ] Страницы категорий /insider/:category
- [ ] Детальные страницы статей
- [ ] **КРИТИЧНО:** Блок "Хотите посетить?" внизу каждой статьи
- [ ] Поисковая строка
- [ ] Фильтры по районам

### Phase 4: AI Chat (Week 4)

- [ ] UI чата (как Perplexity)
- [ ] Интеграция ChatGPT API
- [ ] Промпт для AI-помощника
- [ ] Кнопки "Забронировать" в ответах AI
- [ ] Сохранение истории чата

### Phase 5: Profile & Additional (Week 5)

- [ ] Личный кабинет /profile
- [ ] История бронирований
- [ ] Программа лояльности
- [ ] Реферальная система
- [ ] Footer navigation
- [ ] FAQ страница

### Phase 6: SEO & Performance (Week 6)

- [ ] Meta tags для всех страниц (React Helmet)
- [ ] Schema.org markup
- [ ] Sitemap.xml generation
- [ ] Robots.txt
- [ ] Image optimization (WebP)
- [ ] Code splitting
- [ ] Lighthouse score 90+

### Phase 7: Telegram Integration (Week 7)

- [ ] Telegram WebApp SDK
- [ ] Telegram Payments
- [ ] Автоматическое создание чата с менеджером
- [ ] Отправка деталей бронирования в Telegram
- [ ] Кнопка "Перейти в Telegram-чат" на каждой странице

### Phase 8: Testing & Launch (Week 8)

- [ ] Unit tests (критичные компоненты)
- [ ] E2E tests (booking flow)
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] Mobile testing (iOS/Android)
- [ ] Beta launch с реальными пользователями
- [ ] Сбор feedback → итерации

---

## 🎯 SUCCESS METRICS

### Цели первого месяца:

```
Traffic:
├─ Organic (SEO): 1,000 visitors
├─ Direct: 500 visitors
├─ Telegram: 500 visitors
└─ Total: 2,000 visitors

Conversion:
├─ Tours page → Tour detail: 40%
├─ Tour detail → Add to cart: 20%
├─ Cart → Purchase: 60%
└─ Overall conversion: 4.8% (40% × 20% × 60%)

Revenue:
├─ Bookings: 96 (2,000 × 4.8%)
├─ AOV: $150
└─ Total: $14,400

SEO:
├─ Indexed pages: 50+
├─ Average position: Top 20
├─ Core Web Vitals: All Green
└─ Lighthouse Score: 90+
```

---

## 💡 NEXT STEPS

### После прочтения этого файла:

1. ✅ **Понял структуру?** → Переходи к Phase 1 Implementation
2. ✅ **Есть вопросы?** → Задай в AGENTS.md или создай issue
3. ✅ **Готов кодить?** → Начинай с Bottom Navigation
4. ✅ **Нужны макеты?** → Используй этот файл как Figma-замена

---

**Last Updated:** October 22, 2025  
**Next Review:** После Phase 1 Implementation  
**Maintained by:** AI Agents Team

---

🚀 **LET'S BUILD THE NEXT PERPLEXITY FOR TRAVEL!**
