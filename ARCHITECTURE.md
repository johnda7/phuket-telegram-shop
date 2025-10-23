# Архитектура проекта PhuketDA

## Общая концепция

PhuketDA - это умный консьерж-помощник для туристов на Пхукете, который объединяет:
- 📍 **База мест** - все достопримечательности, рестораны, пляжи (400+ мест)
- 🎟️ **Shopify туры** - бронирование экскурсий через Telegram
- 🤖 **AI Консьерж** - персональные рекомендации на основе предпочтений

## Структура данных

### 1. Места (Places Database)
**Файл:** `src/data/places.ts`

Централизованная база всех мест на Пхукете с полной информацией:

```typescript
interface Place {
  id: string;
  handle: string; // URL-friendly ID
  title: string;
  description: string;
  category: PlaceCategory; // 25 категорий
  district: string; // Географ район
  coordinates: { lat, lng };
  rating: number;
  priceLevel: 1-4; // Уровень цен
  duration: string;
  images: string[];
  tags: string[]; // Для поиска и фильтрации
  relatedTours: string[]; // Связь с Shopify
  relatedPlaces: string[]; // Рекомендации мест
  amenities: string[];
  tips: string[]; // Инсайдерские советы
  contact: { phone, website, instagram };
}
```

### 2. Категории мест (32 категории)

#### Что посетить (13):
- Пляжи - лучшие пляжи для купания, фото, семейного отдыха
- Достопримечательности - Big Buddha, Wat Chalong, Old Town
- Экскурсии - туры по острову и на соседние острова
- Слоны - этичные заповедники без катания
- Аквапарки - Splash Jungle, Andamanda
- Парки развлечений - FantaSea, Carnival Magic, Hanuman World
- Смотровые площадки - Karon Viewpoint, Promthep Cape
- Храмы - буддийские храмы и святыни
- Музеи - культурные и исторические
- Ночные рынки - Walking Street, Chillva Market
- Прогулочные - парки, набережные
- Торговые центры - Central, Jungceylon
- Афиша событий - фестивали и мероприятия

#### Массажи и СПА (3):
- Лучшие СПА - премиум Banyan Tree, Oasis Spa
- Массажные салоны - традиционный тайский массаж
- Бани - русская баня, хаммам

#### Кафе и рестораны (7):
- По районам - лучшие в Патонге, Old Town, Раваи
- Видовые - с панорамным видом на море
- Инстаграмные - красивые для фото
- Лучшие - мишленовский уровень (PRU)
- Романтичные - для свиданий
- Кофейни - specialty coffee
- С детской комнатой - семейные

#### Отдых и развлечения (9):
- Рыбалка - морская и озерная
- Дайвинг - сертификация и туры
- Аренда яхт - частные круизы
- Зоопарки - контактные фермы
- Компьютерные клубы - gaming
- Аренда байков - мотобайки и велосипеды
- Ночная жизнь - клубы и бары

## Связь с Shopify турами

### Как места связаны с турами:

```typescript
// Пример: Место "Big Buddha"
{
  handle: 'big-buddha',
  relatedTours: [
    'dostoprimechatelnosti-phuketa', // Тур "Достопримечательности"
    'phi-phi-2-days-1-night'         // Обзорный тур с Big Buddha
  ]
}
```

### Shopify Product структура:

```typescript
// Продукт в Shopify = Экскурсия
{
  id: "gid://shopify/Product/...",
  handle: "dostoprimechatelnosti-phuketa",
  title: "Достопримечательности Пхукета",
  productType: "tour",
  tags: [
    "tour",
    "excursion", 
    "big-buddha",
    "wat-chalong",
    "old-town"
  ],
  variants: [
    { title: "Взрослый", price: "1500 THB" },
    { title: "Детский", price: "750 THB" }
  ]
}
```

### Теги для связывания:
- `tour` - это экскурсия
- `place` - это место (не продается)
- `beach` - пляж
- `[handle места]` - для поиска связанных мест

## AI Консьерж - система рекомендаций

### Контекст для AI:

```typescript
interface UserContext {
  preferences: {
    budget: 'low' | 'medium' | 'high';
    travelStyle: 'beach' | 'culture' | 'adventure' | 'family';
    interests: string[]; // [снорклинг, храмы, еда]
    location: string; // текущий район
  };
  history: {
    viewedPlaces: string[];
    bookedTours: string[];
    savedPlaces: string[];
  };
}
```

### Логика рекомендаций:

1. **На основе категорий:**
   - Пользователь смотрит "Big Buddha" → рекомендуем Wat Chalong
   - Пользователь интересуется слонами → рекомендуем Elephant Sanctuary

2. **На основе района:**
   - Пользователь в Патонге → рестораны/массаж в Патонге
   - Близкие места в радиусе 10км

3. **На основе турэ:**
   - Забронировал "Пхи-Пхи" → рекомендуем Рача Яй, Симиланы
   - Забронировал City Tour → рекомендуем рестораны Old Town

4. **На основе бюджета:**
   - Low: местные рынки, бесплатные пляжи, viewpoints
   - Medium: Splash Jungle, Let's Relax Spa
   - High: Banyan Tree Spa, PRU Restaurant, яхты

### Промпт для AI Консьержа:

```
Ты - инсайдер Пхукета с 10-летним опытом. У тебя есть база из 400+ мест:
- 13 категорий достопримечательностей
- 7 типов ресторанов  
- 9 видов развлечений
- 32 тура в Shopify

Данные пользователя:
${userContext}

База мест:
${placesDatabase}

Туры в Shopify:
${shopifyTours}

Задача: дай 3-5 персональных рекомендаций на основе:
1. Интересов пользователя
2. Бюджета
3. Локации
4. Времени года/суток

Формат ответа:
- Название места
- Почему подходит
- Ссылка /place/{handle}
- Связанные туры /product/{handle}
```

## Навигация и UX

### Главные точки входа:

1. **Главная (/)** → Категории + AI Консьерж
2. **Категории (/categories)** → 32 категории
3. **Категория (/category/{id})** → Список мест
4. **Место (/place/{handle})** → Детали + Связанные туры
5. **Тур (/product/{handle})** → Shopify продукт + Корзина

### Взаимосвязи:

```
AI Консьерж
    ↓
Рекомендует → Место (Place) → Связанные туры (Shopify)
    ↓                              ↓
Категория                      Корзина → Checkout
```

## Telegram бот интеграция

### Сценарии использования:

1. **Поиск мест:**
   ```
   Пользователь: "где покушать в патонге"
   Бот: → рестораны категории restaurants-districts
        → фильтр по Патонг
        → топ-5 с рейтингом
   ```

2. **Бронирование туров:**
   ```
   Пользователь: "хочу на пхи-пхи"
   Бот: → Shopify Product "phi-phi-2-days"
        → Варианты дат
        → Оплата через Shopify Checkout
   ```

3. **AI рекомендации:**
   ```
   Пользователь: "что посетить с детьми"
   Бот: → AI анализирует тег "family", "kids"
        → Рекомендует: Splash Jungle, Sheep Farm, Aquarium
        → Кнопки быстрых действий
   ```

## Следующие шаги развития

### Фаза 1: Заполнение базы (сейчас)
- ✅ Создана структура 32 категорий
- 🔄 Добавить все 400+ мест из Phuket Insider
- 🔄 Связать с существующими Shopify турами
- 🔄 Добавить фото для каждого места

### Фаза 2: AI Консьерж
- Интеграция OpenAI с контекстом places.ts
- Персонализация на основе истории
- Сохранение избранного в Telegram
- Умные push-уведомления

### Фаза 3: Расширенные функции
- Карты с pins всех мест
- Маршруты "день на Пхукете"
- Отзывы и рейтинги пользователей
- Интеграция с Google Maps API
- Система скидок и промокодов

## Технический стек

- **Frontend:** React + TypeScript + Vite
- **UI:** shadcn/ui + Tailwind CSS
- **E-commerce:** Shopify Storefront API
- **Payments:** Shopify Checkout
- **AI:** OpenAI GPT-4 (через Lovable Cloud)
- **Bot:** Telegram Bot API
- **Data:** TypeScript interfaces + JSON
- **Routing:** React Router
- **State:** Zustand (корзина)

## Метрики успеха

1. **Конверсия:** Просмотр места → Бронирование тура
2. **Engagement:** Время в боте, просмотренных мест
3. **AI Quality:** % полезных рекомендаций
4. **Revenue:** GMV через Shopify
