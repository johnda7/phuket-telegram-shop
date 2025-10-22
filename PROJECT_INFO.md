# Пхукет Telegram Shop

## 🎯 Концепция проекта

Симбиоз двух проектов на базе Shopify:
1. **Туры по Пхукету** (phukeo.com) - с ценами и онлайн бронированием
2. **Phuket Insider** - информационный гид (без цен)

## 🎨 Дизайн философия

**iOS 26 Design System** - вдохновлен Perplexity AI ($0→$20B за 3 года)

### Ключевые принципы:
- ⚡ **Скорость = единственное преимущество** (< 2 сек загрузка)
- 💎 **Glassmorphism** - эффект жидкого стекла на всех элементах
- 🔵 **ONE BLUE** (#007AFF) - единственный цвет для интерактива
- 🎯 **Минимализм** - удаляем лишнее, делаем проще
- 📱 **Telegram-first** - конверсия 15-25% vs 2-3% у Booking.com

## 🏗️ Архитектура

```
ГЛАВНАЯ (/)
├── 🎟️ ТУРЫ (/tours)
│   └── Shopify Products с тегом "tour"
│       ├── Цены (взрослый/детский)
│       ├── Бронирование через Telegram
│       └── Онлайн оплата через Shopify
│
└── 📚 PHUKET INSIDER (/insider)
    └── Shopify Products с тегом "info"
        ├── Без цен
        ├── Рейтинги
        └── Категории:
            ├── Достопримечательности
            ├── Храмы
            ├── Пляжи
            ├── Рестораны
            ├── SPA
            └── Районы
```

## 🔧 Технологии

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (iOS 26 дизайн)
- **E-commerce**: Shopify Storefront API
- **State**: Zustand (cart management)
- **UI**: shadcn/ui компоненты
- **Routing**: React Router DOM

## 📦 Shopify Setup

**Store**: `phuket-telegram-shop-117ck.myshopify.com`

**Типы продуктов**:
1. **ТУРЫ** - productType: "tour", теги: ["tour", "excursion"]
2. **ИНФО** - productType: "info", теги: ["info", "insider", "guide"]

## 🚀 Roadmap

### Фаза 1: Базовая структура ✅
- [x] iOS 26 дизайн система
- [x] Shopify интеграция
- [x] Навигация (Главная, Туры, Insider)
- [x] Cart store (Zustand)

### Фаза 2: Контент (в процессе)
- [ ] Создать первые туры в Shopify
- [ ] Импортировать контент из Phuket Insider
- [ ] Product detail pages
- [ ] Cart drawer с checkout

### Фаза 3: Telegram WebApp
- [ ] Telegram SDK интеграция
- [ ] Бронирование через бота
- [ ] Уведомления в Telegram
- [ ] Haptic feedback

### Фаза 4: Optimizations
- [ ] Image optimization
- [ ] SEO мета-теги
- [ ] Analytics (Telegram events)
- [ ] A/B testing

## 💡 Следующие шаги

1. **Создать первый тур** в Shopify:
   ```
   Название: "Пхи-Пхи 2 дня/1 ночь"
   Цена: $120 (взрослый), $90 (детский)
   Описание: Незабываемое путешествие на острова Пхи-Пхи
   Теги: tour, islands, 2-days, snorkeling
   ```

2. **Создать информационный контент** из Phuket Insider

3. **Настроить Telegram WebApp**

## 📱 Telegram Integration

**Как это работает**:
1. Пользователь открывает сайт из Telegram чата
2. Выбирает тур → "Забронировать"
3. Заполняет форму → отправка в Telegram бот
4. Менеджер подтверждает → клиент оплачивает
5. Все в рамках Telegram экосистемы!

**Конверсия**: 15-25% (в 8 раз выше чем у обычных сайтов)

## 🎯 Философия разработки

**10 принципов Aravind Srinivas (Perplexity AI)**:
1. Скорость = единственное преимущество
2. Правда > комфорт
3. Минимализм = сила
4. < 2 сек загрузка обязательно
5. Пользователь никогда не ошибается
6. Booking Engine, не каталог
7. Непобедимая ловушка для конкурентов
8. 1% улучшение каждый день
9. AI = команда из 1
10. Здоровая паранойя

## 📊 Целевые метрики

- **Загрузка**: < 2 сек
- **Конверсия**: 15-25% (цель)
- **Mobile traffic**: 70%+ из Telegram
- **Bounce rate**: < 30%
- **Время на сайте**: 3-5 мин

---

**Создано с философией Perplexity AI: $0 → $20B за 3 года** 🚀
