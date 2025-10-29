# 🎯 МАСТЕР-ГАЙД: КАК СОЗДАТЬ КАТЕГОРИЮ ОТ А ДО Я

> **⚠️ КРИТИЧЕСКИ ВАЖНО!** Это ЕДИНСТВЕННЫЙ полный гайд для создания категорий. Прочитай ПОЛНОСТЬЮ перед началом работы!

## 🚨 ГЛАВНОЕ ПРАВИЛО: ВСЁ ДИНАМИЧЕСКИ ЧЕРЕЗ SHOPIFY!

**❌ НЕ ДЕЛАЙТЕ:**
- Создавать статические файлы с данными (JSON, TS, MD)
- Хранить контент в коде приложения
- Использовать другие CMS (Contentful, Strapi, etc.)
- Создавать hardcoded массивы с местами/турами

**✅ ДЕЛАЙТЕ ВСЕГДА:**
- ВСЁ создавать через Shopify Admin API
- ВСЁ читать через Shopify Storefront API
- Использовать metafields для дополнительных данных
- Fallback данные только как временная мера

---

## 📋 СОДЕРЖАНИЕ

1. [🎯 Концепция и философия](#-концепция-и-философия)
2. [🏗️ ПОЛНЫЙ ПРОЦЕСС СОЗДАНИЯ КАТЕГОРИИ](#️-полный-процесс-создания-категории)
3. [🗺️ Откуда берём данные (Phuket Insider)](#️-откуда-берём-данные-phuket-insider)
4. [⚡ Быстрый старт (5 шагов)](#-быстрый-старт-5-шагов)
5. [📝 ШАГ 0: Изучение категории на Phuket Insider](#-шаг-0-изучение-категории-на-phuket-insider)
6. [🏆 ШАГ 1: Создание эталонной карточки](#-шаг-1-создание-эталонной-карточки)
7. [📊 ШАГ 2: Сбор данных для всех мест](#-шаг-2-сбор-данных-для-всех-мест)
8. [🔧 ШАГ 3: Создание мастер-скрипта](#-шаг-3-создание-мастер-скрипта)
9. [⚡ ШАГ 4: Массовое применение](#-шаг-4-массовое-применение)
10. [✅ ШАГ 5: Проверка и финализация](#-шаг-5-проверка-и-финализация)
11. [🔧 Работа с Shopify API (GraphQL vs REST)](#-работа-с-shopify-api-graphql-vs-rest)
12. [📚 Примеры категорий](#-примеры-категорий)
13. [🚨 Частые ошибки и решения](#-частые-ошибки-и-решения)

---

## 🎨 КОНЦЕПЦИЯ И ФИЛОСОФИЯ

### ⚠️ ПРАВИЛЬНЫЙ vs НЕПРАВИЛЬНЫЙ подход:

**❌ НЕПРАВИЛЬНО (как мы делали с "Торговыми центрами"):**
```
1. Создали 7 карточек кое-как
2. Потом применяли шаблон к каждой
3. Много ручной работы
4. Неединообразные данные
```

**✅ ПРАВИЛЬНО (как надо делать):**
```
1. Изучаем Phuket Insider → понимаем всю категорию
2. Создаём 1 ИДЕАЛЬНУЮ карточку-эталон
3. Собираем данные для ВСЕХ мест
4. Создаём мастер-скрипт
5. Применяем ко всем одним запуском → готово!
```

### Главная идея:
**ИЗУЧЕНИЕ → 1 ЭТАЛОН → ДАННЫЕ → МАСТЕР-СКРИПТ → ВСЯ КАТЕГОРИЯ**

```
Этап 0: Изучаем Phuket Insider (понимаем категорию)
   ↓
Этап 1: Создаём 1 идеальную карточку-эталон
   ↓
Этап 2: Собираем данные для ВСЕХ мест
   ↓
Этап 3: Создаём генератор (мастер-скрипт)
   ↓
Этап 4: Применяем ко всем местам одним запуском
   ↓
Этап 5: Проверяем и финализируем
   ↓
Результат: Вся категория готова за 1 день!
```

### Почему это работает:
- ✅ **Единообразие** - все карточки в одном стиле
- ✅ **Скорость** - 1 скрипт вместо 20 ручных правок
- ✅ **Качество** - отшлифованный шаблон для всех
- ✅ **Масштабируемость** - легко добавить новые места

---

## 🏗️ ПОЛНЫЙ ПРОЦЕСС СОЗДАНИЯ КАТЕГОРИИ

### ⚠️ КРИТИЧЕСКИ ВАЖНО ДЛЯ АГЕНТОВ!

**Это ПОЛНЫЙ процесс от начала до конца! Читай ВНИМАТЕЛЬНО!**

### 🎯 ГЛАВНАЯ ИДЕЯ:

```
СНАЧАЛА → СТРАНИЦА КАТЕГОРИИ (дизайн, фильтры, навигация)
ПОТОМ  → КАРТОЧКИ ТОВАРОВ (эталон → данные → мастер-скрипт)
```

**ПОЧЕМУ ИМЕННО В ТАКОМ ПОРЯДКЕ:**
1. Страница категории = ВИТРИНА для всех мест
2. Мы должны знать КАК будут выглядеть карточки на странице
3. Дизайн страницы влияет на дизайн карточек
4. Фильтры страницы определяют теги карточек

---

### 📊 ЭТАП 1: ИЗУЧЕНИЕ PHUKET INSIDER

**Что делаем:**
1. Открываем категорию на Phuket Insider
2. Изучаем ВСЕ места в категории
3. Понимаем что общего
4. Определяем структуру

**Пример: Торговые центры**
```
URL: https://phuket-insider.com/ru/category/torgovye-czentry/

АНАЛИЗ:
- Всего мест: 7 ТЦ
- Общие характеристики:
  ├── Часы работы (10:00-22:00)
  ├── Парковка (бесплатная/платная)
  ├── Магазины (бренды)
  ├── Развлечения (кино, боулинг)
  └── Районы (Патонг, Карон, Чернгталай)

ВЫВОД:
→ Нужны фильтры по районам
→ Quick Info: Часы работы + Парковка
→ Features: Магазины + Развлечения
```

**Временные затраты:** 30-60 минут

---

### 🎨 ЭТАП 2: СОЗДАНИЕ СТРАНИЦЫ КАТЕГОРИИ

**⚠️ ЭТО КЛЮЧЕВОЙ ЭТАП! Здесь мы создаём дизайн для ВСЕЙ категории!**

#### 2.1. ДИЗАЙН ФИЛОСОФИЯ (4 УРОВНЯ)

**Наш дизайн = Perplexity + Steve Jobs + iOS 26 + Telegram WebApp**

```
УРОВЕНЬ 1: Perplexity AI
├── Скорость < 2 сек
├── Минимализм (только важное)
├── 1% улучшение каждый день
└── Непобедимая ловушка (лучше конкурентов)

УРОВЕНЬ 2: Steve Jobs
├── Каждый пиксель имеет значение
├── Интуитивность (бабушка поймёт)
├── Восхищение (УХ! эффект)
└── Простота = сложность решённая

УРОВЕНЬ 3: iOS 26
├── SF Pro шрифт
├── #007AFF для ВСЕХ интерактивных элементов
├── Glassmorphism (blur + saturate)
├── 44px минимум touch targets
└── Rounded corners (14px стандарт)

УРОВЕНЬ 4: Telegram WebApp Wallet
├── Компактные карточки
├── Градиенты для блоков
├── Минимум текста, максимум смысла
└── "Дорогой классный дизайн"
```

#### 2.2. СТРУКТУРА СТРАНИЦЫ КАТЕГОРИИ

**Обязательные элементы:**

```jsx
<CategoryPage>
  ├── 1. Sticky Navigation Header
  │   ├── Кнопка "Назад"
  │   ├── Breadcrumbs (Главная > Категории > [Название])
  │   └── Glassmorphism фон
  │
  ├── 2. Hero Section (опционально)
  │   ├── Название категории + эмодзи
  │   ├── Краткое описание
  │   └── Статистика (X мест)
  │
  ├── 3. Фильтры (Chips)
  │   ├── По районам (Патонг, Карон, и т.д.)
  │   ├── По типу (если применимо)
  │   └── iOS 26 стиль (pills с #007AFF)
  │
  ├── 4. Сетка карточек
  │   ├── Grid 2-3 колонки (responsive)
  │   ├── Единообразные карточки
  │   └── Hover эффекты
  │
  └── 5. Наши сервисы (внизу)
      ├── Туры на Пхукете
      ├── Аренда авто
      └── Обмен валюты
</CategoryPage>
```

#### 2.3. ФАЙЛ: `src/pages/CategoryPageDynamic.tsx`

**Что создаём:**
- React компонент для ЛЮБОЙ категории
- Динамическая загрузка через Shopify Storefront API
- Фильтрация по тегам
- Unified дизайн для всех категорий

**Ключевые элементы дизайна:**

**1. Sticky Navigation (iOS 26):**
```typescript
<div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
  <div className="container mx-auto px-4 py-3">
    <Link to="/categories" className="inline-flex items-center gap-2 text-[#007AFF]">
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">Назад</span>
    </Link>
    
    {/* Breadcrumbs */}
    <nav className="flex items-center gap-2 text-sm text-gray-600">
      <Link to="/" className="hover:text-[#007AFF]">Главная</Link>
      <span>•</span>
      <Link to="/categories" className="hover:text-[#007AFF]">Категории</Link>
      <span>•</span>
      <span className="text-gray-900 font-medium">{categoryTitle}</span>
    </nav>
  </div>
</div>
```

**2. Фильтры (Chips - Telegram Style):**
```typescript
<div className="flex gap-2 overflow-x-auto scrollbar-hide">
  {districts.map(district => (
    <button
      key={district}
      onClick={() => setSelectedDistrict(district)}
      className={`
        px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
        transition-all duration-200
        ${selectedDistrict === district
          ? 'bg-[#007AFF] text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      {district}
    </button>
  ))}
</div>
```

**3. Сетка карточек (Responsive):**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredPlaces.map(place => (
    <PlaceCard
      key={place.id}
      place={place}
      category={categoryId}
    />
  ))}
</div>
```

**4. Наши сервисы (Telegram Wallet Style):**
```typescript
<div className="mt-12">
  <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
    Наши сервисы
  </h3>
  
  <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
    {/* Туры */}
    <Link to="/phuket" className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <Ship className="w-5 h-5 text-[#007AFF]" />
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">Туры на Пхукете</div>
          <div className="text-xs text-gray-500">Экскурсии с гидом</div>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </Link>
    
    {/* Аренда авто + Обмен валюты аналогично */}
  </div>
</div>
```

#### 2.4. ВЗАИМОСВЯЗЬ С КАРТОЧКАМИ ТОВАРОВ

**КАК СТРАНИЦА КАТЕГОРИИ СВЯЗАНА С КАРТОЧКАМИ:**

```
СТРАНИЦА КАТЕГОРИИ          КАРТОЧКА ТОВАРА
├── Фильтры по районам  →  Tags: district:Patong
├── Сетка 2-3 колонки   →  PlaceCard компонент
├── Hover эффекты        →  scale + shadow анимация
└── iOS 26 дизайн       →  Единый стиль везде

ДАННЫЕ:
├── Storefront API      →  fetchProducts(category:shopping)
├── Tags фильтрация     →  product.tags.includes('district:Patong')
└── Handle навигация    →  /place/${product.handle}
```

**Пример PlaceCard.tsx (используется на странице категории):**
```typescript
export const PlaceCard = ({ place, category }) => {
  return (
    <Link
      to={`/place/${place.handle}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,122,255,0.15)] hover:scale-[1.02] transition-all duration-300"
    >
      {/* Фото */}
      <div className="relative h-48 overflow-hidden">
        {place.images?.[0] ? (
          <img
            src={place.images[0].url}
            alt={place.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
      </div>
      
      {/* Контент */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#007AFF] transition-colors">
          {place.title}
        </h3>
        
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{district}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
```

#### 2.5. ВРЕМЕННЫЕ ЗАТРАТЫ

- **Создание CategoryPageDynamic.tsx:** 2-3 часа (если первый раз)
- **Адаптация под категорию:** 30 минут (если уже есть шаблон)
- **Проверка в браузере:** 15 минут
- **Шлифовка дизайна:** 30-60 минут

**ИТОГО:** 3-5 часов на ИДЕАЛЬНУЮ страницу категории

---

### 🏆 ЭТАП 3: СОЗДАНИЕ ЭТАЛОННОЙ КАРТОЧКИ ТОВАРА

**⚠️ ТОЛЬКО ПОСЛЕ ТОГО КАК СТРАНИЦА КАТЕГОРИИ ГОТОВА!**

**Что делаем:**
1. Выбираем ЛУЧШЕЕ место из категории
2. Создаём для него ИДЕАЛЬНУЮ детальную страницу
3. Шлифуем дизайн
4. Проверяем взаимосвязь со страницей категории

#### 3.1. ВЫБОР ЭТАЛОННОГО МЕСТА

**Критерии:**
- ✅ Самое популярное место
- ✅ Много информации доступно
- ✅ Репрезентативное для категории
- ✅ Есть фотографии

**Примеры:**
- Торговые центры → Central Phuket (самый большой)
- Пляжи → Patong Beach (самый популярный)
- Храмы → Wat Chalong (главный храм)
- Рестораны → Blue Elephant (известный)

#### 3.2. СТРУКТУРА ДЕТАЛЬНОЙ СТРАНИЦЫ

**Файл: `src/pages/PlaceDetail.tsx`**

```jsx
<PlaceDetailPage>
  ├── 1. Sticky Navigation
  │   ├── Кнопка "Назад"
  │   ├── Breadcrumbs (Главная > Категории > [Категория] > [Место])
  │   └── Glassmorphism фон
  │
  ├── 2. Hero с фотогалереей
  │   ├── Swiper слайдер (6-8 фото)
  │   ├── Pagination dots внизу
  │   ├── Навигация (стрелки)
  │   └── Название + основная инфо
  │
  ├── 3. Описание (из Shopify descriptionHtml)
  │   ├── Hero секция с градиентом
  │   ├── Quick Info Cards (2 карточки)
  │   ├── Main Description (белая карточка)
  │   ├── Features Grid (2 блока)
  │   ├── Must-See (iOS 26 премиум блок)
  │   ├── Удобства (grid)
  │   └── Final CTA (серый блок)
  │
  ├── 4. Удобства (из metafields/fallback)
  │   ├── Grid 2-3 колонки
  │   ├── Lucide React иконки
  │   └── Компактный дизайн
  │
  ├── 5. Наши сервисы
  │   ├── Туры на Пхукете
  │   ├── Аренда авто
  │   └── Обмен валюты
  │
  └── 6. ДА Бот (AI консьерж)
      ├── Синий анимированный робот
      ├── "Открыть бот" кнопка
      └── Примеры вопросов
</PlaceDetailPage>
```

#### 3.3. ВЗАИМОСВЯЗЬ: СТРАНИЦА КАТЕГОРИИ ↔ ДЕТАЛЬНАЯ СТРАНИЦА

```
СТРАНИЦА КАТЕГОРИИ               ДЕТАЛЬНАЯ СТРАНИЦА
├── Карточка (preview)      →   Полное описание
├── Название + рейтинг      →   Hero с галереей
├── 1-2 строки описания     →   Развёрнутая информация
├── Hover эффект            →   Плавная загрузка
└── Link to /place/[handle] →   URL параметр

ЕДИНООБРАЗИЕ ДИЗАЙНА:
├── Те же цвета (#007AFF)
├── Те же шрифты (SF Pro)
├── Те же эффекты (glassmorphism)
├── Те же иконки (Lucide React)
└── Те же компоненты (кнопки, карточки)
```

#### 3.4. СОЗДАНИЕ ЧЕРЕЗ SHOPIFY

**Что обновляем:**
- `descriptionHtml` - полное HTML описание
- `metafields` - дополнительные данные (рейтинг, район)
- `images` - 6-8 фотографий
- `tags` - для фильтрации

**Скрипт для эталона:**
```bash
scripts/update-[place-handle]-telegram-style.cjs
```

**Временные затраты:**
- Сбор данных: 1 час
- Создание HTML: 1 час
- Применение скрипта: 5 минут
- Проверка: 30 минут
- Шлифовка: 30 минут

**ИТОГО:** 3-4 часа на ИДЕАЛЬНУЮ карточку-эталон

---

### 📊 ЭТАП 4: СБОР ДАННЫХ ДЛЯ ВСЕХ МЕСТ

**Что делаем:**
1. Создаём таблицу Excel/Google Sheets
2. Собираем данные для ВСЕХ мест категории
3. Определяем градиенты для каждого
4. Собираем уникальные особенности

**Структура таблицы:**
```
| Handle | Title | Subtitle | Rating | District | Hours | Features | Must-See |
|--------|-------|----------|--------|----------|-------|----------|----------|
| central-phuket | Central Phuket | Крупнейший ТРЦ | 4.6 | Чернгталай | 10-22 | Магазины, Кино | Aquaria |
| jungceylon | Jungceylon | ТРЦ в Патонге | 4.4 | Патонг | 11-23 | Магазины, Развлечения | ... |
```

**Источники данных:**
- Phuket Insider (базовая инфо)
- Google Maps (рейтинг, часы, координаты)
- TripAdvisor (отзывы, рейтинг)
- Официальный сайт (точные данные)

**Временные затраты:** 2-3 часа для 10-20 мест

---

### 🔧 ЭТАП 5: СОЗДАНИЕ МАСТЕР-СКРИПТА

**Что делаем:**
1. Копируем структуру эталона
2. Создаём массив данных для ВСЕХ мест
3. Функция генерации HTML
4. Shopify API интеграция

**Файл: `scripts/apply-telegram-style-to-all-[category].cjs`**

**Структура:**
```javascript
// 1. ДАННЫЕ ВСЕХ МЕСТ
const places = [
  { handle: '...', data: {...} },
  { handle: '...', data: {...} },
  // ... все места
];

// 2. ФУНКЦИЯ ГЕНЕРАЦИИ HTML
function generateTelegramStyleHTML(place) {
  return `<div class="space-y-6">...</div>`;
}

// 3. SHOPIFY API
async function updatePlace(place) {
  // GraphQL mutation
}

// 4. ГЛАВНАЯ ФУНКЦИЯ
async function main() {
  for (let place of places) {
    await updatePlace(place);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Пауза!
  }
}
```

**Временные затраты:** 30-60 минут

---

### ⚡ ЭТАП 6: МАССОВОЕ ПРИМЕНЕНИЕ

**Что делаем:**
1. Запускаем мастер-скрипт
2. Все места обновляются автоматически
3. Проверяем результат

**Команда:**
```bash
node scripts/apply-telegram-style-to-all-[category].cjs
```

**Вывод:**
```
🚀 ПРИМЕНЕНИЕ TELEGRAM WEBAPP STYLE КО ВСЕМ [КАТЕГОРИЯ]
============================================================

📝 [1/7] Central Phuket
✅ ID: gid://shopify/Product/XXXXXXX
✅ Описание обновлено!

📝 [2/7] Jungceylon
✅ ID: gid://shopify/Product/XXXXXXX
✅ Описание обновлено!

...

============================================================
✅ Успешно обновлено: 7/7
🔗 Проверьте: http://localhost:8080/category/shopping
```

**Временные затраты:** 5 минут + (1.5 сек × количество мест)

---

### ✅ ЭТАП 7: ПРОВЕРКА И ФИНАЛИЗАЦИЯ

**Что проверяем:**

**1. Страница категории:**
- ✅ Фильтры работают
- ✅ Карточки единообразные
- ✅ Hover эффекты плавные
- ✅ Мобильная версия OK
- ✅ Навигация работает

**2. Детальные страницы:**
- ✅ Каждое место открывается
- ✅ Описание соответствует месту
- ✅ Фотографии загружены (или placeholder)
- ✅ Все ссылки работают
- ✅ ДА Бот доступен

**3. Взаимосвязь:**
- ✅ Клик на карточке → детальная страница
- ✅ Breadcrumbs корректные
- ✅ "Назад" возвращает на категорию
- ✅ Единый дизайн везде

**Временные затраты:** 30-60 минут

---

### 📐 ЕДИНООБРАЗИЕ ДИЗАЙНА (КРИТИЧНО!)

**КАК ВСЁ СВЯЗАНО:**

```
ГЛАВНАЯ СТРАНИЦА
├── Header (glassmorphism)
├── Bottom Navigation (#007AFF)
└── Typography (SF Pro)
   ↓
СТРАНИЦА КАТЕГОРИЙ
├── Grid карточек категорий
├── Те же цвета + шрифты
└── Link to /category/[id]
   ↓
СТРАНИЦА КАТЕГОРИИ (Торговые центры)
├── Sticky Navigation (glassmorphism)
├── Фильтры (chips #007AFF)
├── Grid карточек мест
└── Наши сервисы (Telegram Wallet)
   ↓
ДЕТАЛЬНАЯ СТРАНИЦА (Central Phuket)
├── Sticky Navigation (идентичная)
├── Hero + Галерея
├── Описание (descriptionHtml)
├── Удобства (Lucide иконки)
├── Наши сервисы (идентичные)
└── ДА Бот (AI консьерж)
```

**КЛЮЧЕВОЕ:** Все элементы используют ОДНИ И ТЕ ЖЕ:
- Цвета: `#007AFF`, `text-gray-900`, `text-gray-600`
- Шрифты: SF Pro (через Tailwind)
- Эффекты: `backdrop-blur-md`, `shadow-[...]`
- Радиусы: `rounded-xl` (12px), `rounded-2xl` (16px)
- Иконки: Lucide React (НИКАКИХ эмодзи!)
- Анимации: `transition-all duration-300`

---

### ⏱️ ИТОГОВЫЕ ВРЕМЕННЫЕ ЗАТРАТЫ

**ПОЛНЫЙ ПРОЦЕСС СОЗДАНИЯ КАТЕГОРИИ:**

```
Этап 1: Изучение Phuket Insider       → 30-60 мин
Этап 2: Создание страницы категории   → 3-5 часов (первый раз)
                                      → 30 мин (если есть шаблон)
Этап 3: Эталонная карточка товара     → 3-4 часа
Этап 4: Сбор данных (10-20 мест)      → 2-3 часа
Этап 5: Мастер-скрипт                 → 30-60 мин
Этап 6: Массовое применение           → 5 мин
Этап 7: Проверка и финализация        → 30-60 мин

════════════════════════════════════════════════════
ИТОГО (ПЕРВАЯ КАТЕГОРИЯ):              → 10-15 часов
ИТОГО (ПОСЛЕДУЮЩИЕ КАТЕГОРИИ):         → 6-8 часов
════════════════════════════════════════════════════
```

---

### 🎯 ЧЕКЛИСТ ДЛЯ НОВОЙ КАТЕГОРИИ

**ПЕРЕД НАЧАЛОМ:**
```markdown
- [ ] Изучил Phuket Insider категорию
- [ ] Понял что общего у всех мест
- [ ] Определил структуру фильтров
- [ ] Выбрал лучшее место для эталона
- [ ] Прочитал этот раздел ПОЛНОСТЬЮ
```

**СТРАНИЦА КАТЕГОРИИ:**
```markdown
- [ ] Создал/адаптировал CategoryPageDynamic.tsx
- [ ] Добавил фильтры под категорию
- [ ] Проверил дизайн (iOS 26 + Telegram)
- [ ] Проверил в браузере - всё работает
- [ ] Единообразие с остальным сайтом
```

**ЭТАЛОННАЯ КАРТОЧКА:**
```markdown
- [ ] Собрал данные для лучшего места
- [ ] Создал скрипт update-[handle]-telegram-style.cjs
- [ ] Применил к эталону
- [ ] Проверил детальную страницу
- [ ] Проверил взаимосвязь со страницей категории
- [ ] Отшлифовал дизайн
```

**МАССОВОЕ ЗАПОЛНЕНИЕ:**
```markdown
- [ ] Собрал данные для ВСЕХ мест
- [ ] Создал мастер-скрипт
- [ ] Заполнил массив places[]
- [ ] Запустил скрипт
- [ ] Все места обновлены
```

**ФИНАЛИЗАЦИЯ:**
```markdown
- [ ] Проверил каждое место
- [ ] Проверил страницу категории
- [ ] Проверил фильтры
- [ ] Проверил навигацию
- [ ] Проверил мобильную версию
- [ ] Единообразие дизайна везде
- [ ] Коммит в Git
```

---

## 🗺️ ОТКУДА БЕРЁМ ДАННЫЕ (PHUKET INSIDER)

### 🎯 ГЛАВНЫЙ ИСТОЧНИК: phuket-insider.com

**МЫ ПОЛНОСТЬЮ ПЕРЕНОСИМ ВСЕ КАТЕГОРИИ ИЗ PHUKET INSIDER!**

### Доступные категории на Phuket Insider:

```
https://phuket-insider.com/ru/category/

📍 ОСНОВНЫЕ КАТЕГОРИИ:
├── torgovye-czentry/          → Торговые центры (✅ ГОТОВО!)
├── plyazhi/                   → Пляжи
├── khramy/                    → Храмы
├── restorany/                 → Рестораны
├── smotrovye-ploshhadki/      → Смотровые площадки
├── nochnaya-zhizn/            → Ночная жизнь
├── parki-razvlechenij/        → Парки развлечений
├── ekskursii/                 → Экскурсии
├── spa-i-massazh/             → СПА и массаж
├── muzei/                     → Музеи
├── vodopady/                  → Водопады
└── ...                        → И другие
```

### Что мы делаем с Phuket Insider:

**1. ИЗУЧАЕМ:**
- Заходим на https://phuket-insider.com/ru/category/[категория]/
- Смотрим сколько мест в категории
- Изучаем структуру описаний
- Понимаем что важно для этой категории

**2. ЗАБИРАЕМ:**
- ✅ Список всех мест
- ✅ Названия (русское + английское)
- ✅ Основное описание
- ✅ Практическую информацию (часы, цены, как добраться)
- ✅ Фотографии (но улучшаем качество!)

**3. УЛУЧШАЕМ:**
- 🚀 Telegram WebApp дизайн вместо старого
- 🚀 Интерактивные карточки вместо текста
- 🚀 Конверсионные блоки (туры, авто, валюта)
- 🚀 Must-See секции для каждого места
- 🚀 Современные градиенты и иконки

### Пример трансформации:

**❌ Phuket Insider (устаревший дизайн):**
```
Central Festival Phuket

Крупнейший торговый центр на Пхукете...
[Текст текст текст...]

Адрес: ...
Часы работы: ...
```

**✅ МЫ (Telegram WebApp Style):**
```html
<!-- Hero с градиентом -->
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
  🏢 Central Phuket
  ⭐ 4.6 | 💰 $$$ | 📍 Чернгталай
</div>

<!-- Quick Info Cards -->
[2 карточки: Часы работы | Парковка]

<!-- Features -->
[2 блока с градиентами: Магазины | Развлечения]

<!-- Must-See -->
[Желто-оранжевый блок: Aquaria Phuket]

<!-- Action Buttons -->
[3 кнопки: Туры | Авто | Валюта]
```

---

## ⚡ БЫСТРЫЙ СТАРТ (5 ШАГОВ)

### Временные затраты:
- **ШАГ 0:** Изучение Phuket Insider (30 минут)
- **ШАГ 1:** Эталонная карточка (1-2 часа)
- **ШАГ 2:** Сбор данных (2-3 часа для 10-20 мест)
- **ШАГ 3:** Мастер-скрипт (30 минут)
- **ШАГ 4:** Применение (5 минут)
- **ШАГ 5:** Проверка (30 минут)

**ИТОГО:** 5-7 часов на категорию из 20 мест!

### Краткая схема:

```
ШАГ 0: Phuket Insider
  → Заходим на категорию
  → Изучаем все места
  → Понимаем структуру
  → Список всех мест (10-20 штук)

ШАГ 1: Эталон
  → Выбираем ЛУЧШЕЕ место
  → Создаём идеальную карточку
  → Проверяем в браузере
  → Шлифуем дизайн

ШАГ 2: Данные
  → Собираем для ВСЕХ мест
  → Таблица Excel/Google Sheets
  → Уникальные градиенты
  → Специфичные особенности

ШАГ 3: Скрипт
  → Создаём мастер-скрипт
  → Массив данных всех мест
  → Функция генерации HTML
  → Shopify API интеграция

ШАГ 4: Применение
  → Запускаем скрипт
  → Все места обновляются
  → 5 минут вместо 5 часов!

ШАГ 5: Проверка
  → Каждое место в браузере
  → Страница категории
  → Мобильная версия
  → Финальные правки
```

---

## 📝 ШАГ 0: ИЗУЧЕНИЕ КАТЕГОРИИ НА PHUKET INSIDER

### 0.1. Выбор категории

**Приоритетные категории (в порядке важности):**

1. ✅ **Торговые центры** (torgovye-czentry) - ГОТОВО!
2. 🏖️ **Пляжи** (plyazhi) - СЛЕДУЮЩАЯ
3. 🛕 **Храмы** (khramy)
4. 🌅 **Смотровые площадки** (smotrovye-ploshhadki)
5. 🍽️ **Рестораны** (restorany)
6. 🌃 **Ночная жизнь** (nochnaya-zhizn)
7. 🎡 **Парки развлечений** (parki-razvlechenij)

### 0.2. Изучение категории на Phuket Insider

**Шаг за шагом:**

```bash
# 1. Открой категорию
https://phuket-insider.com/ru/category/[категория]/

# 2. Создай TODO лист
```

**TODO для изучения:**
```markdown
- [ ] Сколько всего мест в категории?
- [ ] Какие самые популярные места?
- [ ] Какая информация указана для каждого места?
- [ ] Какие фото использованы?
- [ ] Есть ли карта?
- [ ] Какие особенности этой категории?
```

### 0.3. Создание списка всех мест

**Создай файл:** `data/[category]-places-list.md`

```markdown
# Категория: Пляжи (Beaches)

## Источник:
https://phuket-insider.com/ru/category/plyazhi/

## Всего мест: 15

## Список:
1. Patong Beach (Патонг) - самый популярный
2. Karon Beach (Карон)
3. Kata Beach (Ката)
4. Freedom Beach (Фридом)
5. Paradise Beach (Парадайз)
6. Nai Harn Beach (Най Харн)
7. Surin Beach (Сурин)
8. Kamala Beach (Камала)
9. Bang Tao Beach (Банг Тао)
10. Mai Khao Beach (Май Кхао)
... и т.д.

## Лучшее место для эталона:
**Patong Beach** - самый популярный, много информации
```

### 0.4. Анализ структуры описаний

**Что есть на Phuket Insider:**
- 📝 Название (русское + английское)
- 📝 Описание (2-5 абзацев)
- 📸 Фотографии (3-10 штук)
- 📍 Адрес и как добраться
- 🕐 Часы работы (если применимо)
- 💰 Цены (если платный вход)
- ⭐ Особенности и советы

**Что мы добавляем:**
- ✨ Hero с градиентом и метриками
- ✨ Quick Info Cards (2 карточки)
- ✨ Feature Blocks (2 блока)
- ✨ Must-See секция
- ✨ Удобства (Amenities)
- ✨ Конверсионные кнопки (Туры, Авто, Валюта)

### 0.5. Определение специфики категории

**Для каждой категории определи:**

**Пляжи:**
- Quick Info: Лучшее время, Вход (свободный/платный)
- Features: Инфраструктура, Активности
- Must-See: Что уникального на пляже

**Храмы:**
- Quick Info: Часы работы, Дресс-код
- Features: История, Архитектура
- Must-See: Главная святыня

**Рестораны:**
- Quick Info: Часы работы, Средний чек
- Features: Кухня, Фирменные блюда
- Must-See: Must-try блюдо

**Смотровые площадки:**
- Quick Info: Лучшее время, Вход
- Features: Виды, Фото-споты
- Must-See: Лучший вид

### 0.6. Создание TODO для категории

```markdown
# TODO: Категория "Пляжи"

## ШАГ 0: Изучение ✅
- [x] Изучил Phuket Insider
- [x] Список всех мест (15 штук)
- [x] Определил эталон (Patong Beach)
- [x] Понял специфику категории

## ШАГ 1: Эталон
- [ ] Собрать данные для Patong Beach
- [ ] Создать скрипт update-patong-beach-telegram-style.cjs
- [ ] Применить к эталону
- [ ] Проверить в браузере
- [ ] Отшлифовать дизайн

## ШАГ 2: Данные
- [ ] Собрать данные для всех 15 пляжей
- [ ] Создать таблицу Excel
- [ ] Определить градиенты
- [ ] Собрать уникальные особенности

## ШАГ 3: Скрипт
- [ ] Создать apply-telegram-style-to-all-beaches.cjs
- [ ] Заполнить массив places[]
- [ ] Адаптировать Quick Info и Features
- [ ] Протестировать на 1-2 местах

## ШАГ 4: Применение
- [ ] Запустить мастер-скрипт
- [ ] Все 15 мест обновлены

## ШАГ 5: Проверка
- [ ] Проверить каждый пляж
- [ ] Проверить категорию
- [ ] Мобильная версия
- [ ] Финальные правки
```
- ✅ **Масштабируемость** - легко добавить новые места

### Дизайн: Telegram WebApp Style
- 🎴 **Hero с градиентом** - яркий заголовок
- 📊 **Quick Info Cards** - 2 быстрые карточки
- 📝 **Белая карточка** - основное описание
- 🎨 **Feature Cards** - 2 карточки с градиентами
- ⭐ **Must-See** - iOS 26 премиум блок (голубой градиент с glassmorphism)
- ✨ **Удобства** - компактный grid
- 🎯 **Action Buttons** - 3 кнопки с градиентами
- 💬 **Final CTA** - серый блок с текстом

---

## 🚀 ПОШАГОВЫЙ ПРОЦЕСС

### Общая схема:

```
1. Выбрать категорию (например, "Пляжи")
   ↓
2. Изучить phuket-insider.com/ru/category/[категория]
   ↓
3. Создать 1 эталонную карточку для лучшего места
   ↓
4. Собрать данные для всех остальных мест
   ↓
5. Создать мастер-скрипт apply-telegram-style-to-all-[category].cjs
   ↓
6. Запустить скрипт → вся категория готова!
   ↓
7. Проверить в браузере → доработать если нужно
```

### Временные затраты:
- **Эталонная карточка:** 1-2 часа
- **Сбор данных:** 2-3 часа (для 10-20 мест)
- **Создание скрипта:** 30 минут
- **Применение:** 5 минут
- **Проверка:** 30 минут

**ИТОГО:** 4-6 часов на категорию из 20 мест!

---

## 📝 ШАГ 1: СОЗДАНИЕ ЭТАЛОННОЙ КАРТОЧКИ

### 1.1. Выбор места для эталона
Выбери **САМОЕ ПОПУЛЯРНОЕ** место в категории:
- Для "Торговых центров" → Central Phuket
- Для "Пляжей" → Patong Beach
- Для "Храмов" → Wat Chalong
- Для "Ресторанов" → Blue Elephant

### 1.2. Изучение места
Собери информацию:
- 📖 **phuket-insider.com** - базовая информация
- 📖 **TripAdvisor** - отзывы и рейтинги  
- 📖 **Google Maps** - актуальные данные, фото
- 📖 **Официальный сайт** - точные часы работы, адрес

### 1.3. Структура данных для эталона

```javascript
const examplePlace = {
  // БАЗОВАЯ ИНФОРМАЦИЯ
  handle: 'central-phuket-floresta',           // URL slug
  heroGradient: 'from-blue-500 to-purple-600', // Цвет градиента
  heroIcon: '🏢',                              // Эмодзи иконка
  title: 'Central Phuket (Централ Пхукет)',   // Полное название
  subtitle: 'Крупнейший торговый центр',       // Подзаголовок
  
  // МЕТРИКИ
  rating: '4.6',        // Рейтинг из TripAdvisor/Google
  priceLevel: '$$$',    // $, $$, $$$ (бюджет, средний, премиум)
  district: 'Чернгталай', // Район Пхукета
  
  // ПРАКТИЧЕСКАЯ ИНФОРМАЦИЯ
  workingHours: '10:00-22:00 ежедневно',
  parking: 'Бесплатная (3000+ мест)',
  
  // ОСНОВНОЕ ОПИСАНИЕ (2-3 предложения)
  description: 'Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум.',
  
  // ОСОБЕННОСТИ (2 блока)
  features: [
    {
      gradient: 'from-orange-50 to-orange-100',
      border: 'orange-200',
      icon: '🛍️',
      title: 'Central Festival',
      subtitle: 'Масс-маркет бренды',
      items: [
        { icon: '👔', text: 'Zara, H&M, Uniqlo, Nike' },
        { icon: '🍽️', text: '2 фуд-корта + рестораны' },
        { icon: '🎬', text: 'Кинотеатр Major Cineplex' }
      ]
    },
    {
      gradient: 'from-purple-50 to-purple-100',
      border: 'purple-200',
      icon: '💎',
      title: 'Central Floresta',
      subtitle: 'Люксовые бутики',
      items: [
        { icon: '👑', text: 'Louis Vuitton, Prada, Gucci' },
        { icon: '👶', text: 'Детский мир' },
        { icon: '🐠', text: 'Аквариум Aquaria' }
      ]
    }
  ],
  
  // MUST-SEE (самое интересное)
  mustSee: {
    icon: '🐠',
    title: 'Aquaria Phuket',
    description: 'Крупнейший океанариум на острове — более 25,000 морских обитателей'
  },
  
  // УДОБСТВА (6-8 пунктов)
  amenities: [
    '📶 Wi-Fi',
    '🅿️ Парковка',
    '🍽️ Фуд-корт',
    '🎬 Кино',
    '🐠 Аквариум',
    '🏧 Банкомат'
  ],
  
  // ФИНАЛЬНЫЙ ПРИЗЫВ
  finalCta: 'Central Phuket — это не просто торговый центр, это целый мир развлечений...'
};
```

### 1.4. Создание скрипта для эталона

Создай файл `scripts/update-[place-handle]-telegram-style.cjs`:

```javascript
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

// Telegram WebApp Style Description
const telegramStyleDescription = `
<div class="space-y-6">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">🏢 Central Phuket</h1>
    <p class="text-blue-100 text-lg">Крупнейший торговый центр</p>
    <div class="flex items-center gap-4 mt-4">
      <div class="flex items-center gap-1">
        <span class="text-yellow-300">⭐</span>
        <span class="font-semibold">4.6</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-green-300">💰</span>
        <span>$$$</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-blue-300">📍</span>
        <span>Чернгталай</span>
      </div>
    </div>
  </div>
  
  <!-- ... остальной HTML ... -->
</div>
`;

async function updatePlace() {
  // ... код обновления ...
}

updatePlace();
```

### 1.5. Применение эталона

```bash
# Запуск скрипта для эталонной карточки
node scripts/update-central-phuket-telegram-style.cjs

# Проверка в браузере
# http://localhost:8080/place/central-phuket-floresta
```

### 1.6. Отшлифовка эталона

Проверь в браузере и убедись:
- ✅ Градиенты выглядят красиво
- ✅ Все секции на месте
- ✅ Текст читаемый
- ✅ Кнопки работают
- ✅ Мобильная версия OK

**ТОЛЬКО ПОСЛЕ ЭТОГО переходи к шагу 2!**

---

## 📊 ШАГ 2: СБОР ДАННЫХ ДЛЯ ВСЕХ МЕСТ

### 2.1. Список всех мест категории

Для категории "Торговые центры":
```javascript
const places = [
  'Central Phuket',
  'Jungceylon',
  'Premium Outlet',
  'Big C',
  'Robinson Lifestyle',
  'Tesco Lotus',
  'Patong Night Market'
];
```

### 2.2. Шаблон для сбора данных

Создай таблицу в Excel/Google Sheets:

| Handle | Title | Subtitle | Rating | Price | District | Hours | Parking |
|--------|-------|----------|--------|-------|----------|-------|---------|
| central-phuket | Central Phuket | Крупнейший ТРЦ | 4.6 | $$$ | Чернгталай | 10-22 | Бесплатная |
| jungceylon | Jungceylon | ТРЦ в Патонге | 4.4 | $$ | Патонг | 11-23 | Бесплатная |

### 2.3. Источники данных

Для каждого места собери:

**1. Основное:**
- 📖 phuket-insider.com/ru/category/[категория]/[место]
- 📖 Google Maps (координаты, часы, рейтинг)
- 📖 TripAdvisor (рейтинг, отзывы)
- 📖 Официальный сайт (если есть)

**2. Специфичное для категории:**

**Торговые центры:**
- Магазины и бренды
- Фуд-корты
- Развлечения (кино, боулинг)
- Парковка

**Пляжи:**
- Тип пляжа (песчаный, галечный)
- Инфраструктура (лежаки, зонтики)
- Активности (снорклинг, кайт)
- Безопасность

**Храмы:**
- История
- Дресс-код
- Время работы
- Вход (бесплатно/платно)

**Рестораны:**
- Кухня
- Средний чек
- Фирменные блюда
- Резервация

### 2.4. Определение градиентов

Для каждого места выбери уникальный градиент:

```javascript
// Палитра градиентов
const gradients = [
  'from-blue-500 to-purple-600',    // Синий-фиолетовый
  'from-orange-500 to-red-600',     // Оранжевый-красный
  'from-green-500 to-emerald-600',  // Зелёный-изумрудный
  'from-pink-500 to-purple-600',    // Розовый-фиолетовый
  'from-teal-500 to-cyan-600',      // Бирюзовый-голубой
  'from-indigo-500 to-purple-600',  // Индиго-фиолетовый
  'from-red-500 to-pink-600',       // Красный-розовый
];
```

**Правило:** Градиент должен соответствовать характеру места!
- 🏢 Торговые центры → яркие (синий, оранжевый, фиолетовый)
- 🏖️ Пляжи → морские (голубой, бирюзовый, синий)
- 🛕 Храмы → спокойные (золотой, оранжевый, красный)
- 🍽️ Рестораны → аппетитные (красный, оранжевый, желтый)

---

## 🔧 ШАГ 3: СОЗДАНИЕ МАСТЕР-СКРИПТА

### 3.1. Структура мастер-скрипта

Создай файл `scripts/apply-telegram-style-to-all-[category].cjs`:

```javascript
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

/**
 * 🎨 ГЕНЕРАТОР TELEGRAM WEBAPP STYLE ОПИСАНИЙ
 * 
 * Категория: [НАЗВАНИЕ]
 * Мест: [КОЛИЧЕСТВО]
 * Создан: [ДАТА]
 */

// ===== 1. ДАННЫЕ ВСЕХ МЕСТ =====
const places = [
  {
    handle: 'place-1',
    heroGradient: 'from-blue-500 to-purple-600',
    // ... все данные места 1
  },
  {
    handle: 'place-2',
    heroGradient: 'from-orange-500 to-red-600',
    // ... все данные места 2
  },
  // ... остальные места
];

// ===== 2. ФУНКЦИЯ ГЕНЕРАЦИИ HTML =====
function generateTelegramStyleHTML(place) {
  // Генерация amenities
  const amenitiesHTML = place.amenities.map(amenity => {
    const [icon, text] = amenity.split(' ');
    return `
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span class="text-blue-500">${icon}</span>
        <span class="text-sm text-gray-700">${text}</span>
      </div>`;
  }).join('');

  // Генерация features
  const featuresHTML = place.features.map(feature => `
    <div class="bg-gradient-to-br ${feature.gradient} rounded-xl p-5 border border-${feature.border}">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-3xl">${feature.icon}</span>
        <h3 class="text-lg font-bold text-gray-900">${feature.title}</h3>
      </div>
      <p class="text-gray-600 text-sm mb-3">${feature.subtitle}</p>
      <div class="space-y-2">
        ${feature.items.map(item => `
        <div class="flex items-center gap-2">
          <span class="text-blue-500">${item.icon}</span>
          <span class="text-sm text-gray-700">${item.text}</span>
        </div>`).join('')}
      </div>
    </div>`).join('');

  // Полный HTML шаблон
  return `
<div class="space-y-6">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r ${place.heroGradient} rounded-2xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">${place.heroIcon} ${place.title}</h1>
    <p class="text-blue-100 text-lg">${place.subtitle}</p>
    <div class="flex items-center gap-4 mt-4">
      <div class="flex items-center gap-1">
        <span class="text-yellow-300">⭐</span>
        <span class="font-semibold">${place.rating}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-green-300">💰</span>
        <span>${place.priceLevel}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-blue-300">📍</span>
        <span>${place.district}</span>
      </div>
    </div>
  </div>

  <!-- Quick Info Cards -->
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🕐</span>
        <span class="font-semibold text-gray-900">Часы работы</span>
      </div>
      <p class="text-gray-600 text-sm">${place.workingHours}</p>
    </div>
    
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🚗</span>
        <span class="font-semibold text-gray-900">Парковка</span>
      </div>
      <p class="text-gray-600 text-sm">${place.parking}</p>
    </div>
  </div>

  <!-- Main Description -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h2 class="text-xl font-bold text-gray-900 mb-4">О месте</h2>
    <p class="text-gray-600 leading-relaxed mb-4">
      ${place.description}
    </p>
  </div>

  <!-- Features Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    ${featuresHTML}
  </div>

  <!-- Must-See Highlight - iOS 26 Premium Style -->
  <div class="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-200/50 shadow-sm">
    <div class="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/20"></div>
    <div class="relative">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
          <span class="text-white text-lg">⭐</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900">Обязательно посетите!</h3>
      </div>
      <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 space-y-2">
        <div class="flex items-center gap-3">
          <span class="text-3xl">${place.mustSee.icon}</span>
          <div>
            <p class="font-bold text-lg text-gray-900">${place.mustSee.title}</p>
            <p class="text-gray-600 text-sm leading-relaxed">${place.mustSee.description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Amenities -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Удобства</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      ${amenitiesHTML}
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-gray-900">Планируете поездку?</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <a href="/phuket" class="group bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-xl">🏝️</span>
          <span class="font-semibold">Туры</span>
        </div>
        <p class="text-blue-100 text-sm">С гидом</p>
      </a>
      
      <a href="/services/car-rental" class="group bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-xl">🚗</span>
          <span class="font-semibold">Аренда авто</span>
        </div>
        <p class="text-green-100 text-sm">Самостоятельно</p>
      </a>
      
      <a href="/services/currency-exchange" class="group bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-xl">💱</span>
          <span class="font-semibold">Обмен валюты</span>
        </div>
        <p class="text-purple-100 text-sm">Выгодный курс</p>
      </a>
    </div>
  </div>

  <!-- Final CTA -->
  <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 text-center">
    <p class="text-gray-600 italic">
      ${place.finalCta}
    </p>
  </div>
</div>
`;
}

// ===== 3. SHOPIFY API ФУНКЦИИ =====
async function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_STORE,
      path: '/admin/api/2025-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getProductId(handle) {
  const query = `
    query {
      products(first: 10, query: "handle:${handle}") {
        edges {
          node {
            id
            handle
            title
          }
        }
      }
    }
  `;
  
  const result = await makeGraphQLRequest(query);
  const product = result.data?.products?.edges?.[0]?.node;
  return product?.id;
}

// ===== 4. ФУНКЦИЯ ОБНОВЛЕНИЯ =====
async function updatePlace(place, index, total) {
  try {
    console.log(`\n📝 [${index + 1}/${total}] ${place.title}`);
    
    const productId = await getProductId(place.handle);
    if (!productId) {
      console.error('❌ Продукт не найден');
      return false;
    }
    
    console.log(`✅ ID: ${productId}`);
    
    const html = generateTelegramStyleHTML(place);
    
    const mutation = `
      mutation {
        productUpdate(input: {
          id: "${productId}",
          descriptionHtml: "${html.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
        }) {
          product { id title }
          userErrors { field message }
        }
      }
    `;
    
    const result = await makeGraphQLRequest(mutation);
    
    if (result.data?.productUpdate?.userErrors?.length > 0) {
      console.error('❌ Ошибки:', result.data.productUpdate.userErrors);
      return false;
    }
    
    console.log('✅ Описание обновлено!');
    
    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
    
  } catch (error) {
    console.error(`❌ Ошибка: ${error.message}`);
    return false;
  }
}

// ===== 5. ГЛАВНАЯ ФУНКЦИЯ =====
async function main() {
  console.log('🚀 ПРИМЕНЕНИЕ TELEGRAM WEBAPP STYLE КО ВСЕМ [КАТЕГОРИЯ]');
  console.log('='.repeat(60));
  
  let successCount = 0;
  
  for (let i = 0; i < places.length; i++) {
    const success = await updatePlace(places[i], i, places.length);
    if (success) successCount++;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Успешно обновлено: ${successCount}/${places.length}`);
  console.log('🔗 Проверьте: http://localhost:8080/category/[category]');
}

main().catch(console.error);
```

### 3.2. Адаптация под категорию

**Важно!** Для каждой категории нужно адаптировать:

**1. Quick Info Cards** (что показывать):
- Торговые центры: Часы работы, Парковка
- Пляжи: Лучшее время, Вход (свободный/платный)
- Храмы: Часы работы, Дресс-код
- Рестораны: Часы работы, Средний чек

**2. Features (2 блока):**
- Торговые центры: Магазины, Развлечения
- Пляжи: Инфраструктура, Активности
- Храмы: История, Архитектура
- Рестораны: Кухня, Фирменные блюда

**3. Must-See:**
- Что ОБЯЗАТЕЛЬНО посмотреть/попробовать в этом месте

**4. Amenities:**
- Что доступно в этом месте (удобства, сервисы)

---

## ⚡ ШАГ 4: ПРИМЕНЕНИЕ КО ВСЕМ МЕСТАМ

### 4.1. Финальная проверка

Перед запуском убедись:
- ✅ Все данные собраны для всех мест
- ✅ Градиенты уникальные для каждого
- ✅ Функция генерации работает
- ✅ Shopify tokens правильные

### 4.2. Запуск мастер-скрипта

```bash
# Запуск
node scripts/apply-telegram-style-to-all-shopping.cjs

# Вывод:
# 🚀 ПРИМЕНЕНИЕ TELEGRAM WEBAPP STYLE КО ВСЕМ ТОРГОВЫМ ЦЕНТРАМ
# ============================================================
# 
# 📝 [1/7] Central Phuket (Централ Пхукет)
# ✅ ID: gid://shopify/Product/7972352950326
# ✅ Описание обновлено!
# 
# 📝 [2/7] Jungceylon (Джангцелон)
# ✅ ID: gid://shopify/Product/7974403080246
# ✅ Описание обновлено!
# ...
# 
# ============================================================
# ✅ Успешно обновлено: 7/7
# 🔗 Проверьте: http://localhost:8080/category/shopping
```

### 4.3. Что делать при ошибках

**Ошибка: "Продукт не найден"**
```bash
# Проверь handle
node scripts/check-shopping-centers-tags.cjs
```

**Ошибка: "GraphQL Errors"**
```bash
# Проверь экранирование
# В скрипте должно быть:
.replace(/"/g, '\\"').replace(/\n/g, '\\n')
```

**Ошибка: "Failed to parse response"**
```bash
# Проверь токен Shopify
cat .shopify/TOKENS.txt
```

---

## ✅ ШАГ 5: ПРОВЕРКА И ДОРАБОТКА

### 5.1. Проверка в браузере

Открой каждое место:
```bash
# Примеры
http://localhost:8080/place/central-phuket-floresta
http://localhost:8080/place/jungceylon-shopping-center
http://localhost:8080/place/premium-outlet-phuket
```

Проверь:
- ✅ Hero градиент правильный
- ✅ Все секции отображаются
- ✅ Текст читаемый
- ✅ Кнопки работают
- ✅ Мобильная версия OK

### 5.2. Проверка категории

Открой страницу категории:
```bash
http://localhost:8080/category/shopping
```

Проверь:
- ✅ Все карточки отображаются
- ✅ Дизайн единообразный
- ✅ Фильтры работают
- ✅ Карта работает

### 5.3. Финальная шлифовка

Если нужно что-то подправить:

**Для 1 места:**
```bash
# Отредактируй данные в мастер-скрипте
# Найди нужное место в массиве places[]
# Измени данные
# Запусти снова
node scripts/apply-telegram-style-to-all-shopping.cjs
```

**Для всех мест:**
```bash
# Измени функцию generateTelegramStyleHTML()
# Запусти снова
node scripts/apply-telegram-style-to-all-shopping.cjs
```

### 5.4. Коммит в Git

```bash
git add .
git commit -m "✅ Категория [название] полностью готова

- 7/7 мест с Telegram WebApp дизайном
- Уникальные данные для каждого места
- Мастер-скрипт для быстрого обновления"
git push
```

---

## 📚 ПРИМЕРЫ

### Пример 1: Категория "Торговые центры"

**Файлы:**
```
scripts/
├── update-central-phuket-telegram-style.cjs       # Эталон
├── apply-telegram-style-to-all-shopping.cjs       # Мастер-скрипт
├── check-shopping-centers-tags.cjs                # Проверка
└── final-shopping-status.cjs                      # Итоговый отчет
```

**Результат:**
- ✅ 7 торговых центров
- ✅ Каждый с уникальными данными
- ✅ Единый Telegram WebApp дизайн
- ✅ Время: 4 часа

**Эталон:** Central Phuket (central-phuket-floresta)

**Особенности:**
- 2 feature блока (Central Festival + Central Floresta)
- Must-See: Aquaria Phuket
- Quick Info: Часы работы, Парковка

### Пример 2: Категория "Пляжи" (планируется)

**Эталон:** Patong Beach

**Структура данных:**
```javascript
{
  handle: 'patong-beach',
  heroGradient: 'from-blue-400 to-cyan-500',
  heroIcon: '🏖️',
  title: 'Patong Beach (Патонг)',
  subtitle: 'Самый популярный пляж Пхукета',
  rating: '4.3',
  priceLevel: '$$',
  district: 'Патонг',
  
  // Quick Info (АДАПТИРОВАНО!)
  bestTime: 'Ноябрь - Апрель',
  entrance: 'Бесплатный',
  
  // Features (АДАПТИРОВАНО!)
  features: [
    {
      icon: '🏖️',
      title: 'Инфраструктура',
      subtitle: 'Все для комфорта',
      items: [
        { icon: '☂️', text: 'Лежаки и зонтики (₿ 200)' },
        { icon: '🚿', text: 'Душ и туалеты' },
        { icon: '🍹', text: 'Пляжные бары' }
      ]
    },
    {
      icon: '🏄',
      title: 'Активности',
      subtitle: 'Развлечения',
      items: [
        { icon: '🏊', text: 'Плавание и купание' },
        { icon: '🏄', text: 'Сёрфинг (сезонно)' },
        { icon: '🚤', text: 'Водные виды спорта' }
      ]
    }
  ],
  
  // Must-See (АДАПТИРОВАНО!)
  mustSee: {
    icon: '🌅',
    title: 'Закат на Патонге',
    description: 'Невероятные закаты с видом на Андаманское море — лучшее время 18:00-19:00'
  },
  
  // Amenities (АДАПТИРОВАНО!)
  amenities: [
    '☂️ Лежаки',
    '🚿 Душ',
    '🍹 Бары',
    '🏊 Спасатели',
    '🚻 Туалеты',
    '🅿️ Парковка'
  ]
}
```

### Пример 3: Категория "Храмы" (планируется)

**Эталон:** Wat Chalong

**Quick Info:**
- Часы работы: 07:00-17:00
- Дресс-код: Закрытые плечи и колени

**Features:**
- История храма
- Архитектурные особенности

**Must-See:**
- Пагода с реликвиями Будды

---

## 🔧 РАБОТА С SHOPIFY API (GRAPHQL VS REST)

### ⚠️ КРИТИЧЕСКИ ВАЖНО ДЛЯ АГЕНТОВ!

**Агенты часто теряются в API!** Вот полное руководство:

### Что использовать и когда:

```
┌─────────────────────────────────────────────────────────────┐
│                SHOPIFY API DECISION TREE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Нужно обновить ОПИСАНИЕ продукта?                         │
│  ├── ДА → GraphQL Admin API ✅                             │
│  └── НЕТ → Читай дальше                                   │
│                                                             │
│  Нужно загрузить ФОТО?                                     │
│  ├── Trial Account → REST API (base64) ✅                  │
│  └── Paid Account → GraphQL Admin API ✅                   │
│                                                             │
│  Нужно ПРОЧИТАТЬ данные для сайта?                         │
│  └── Storefront API (GraphQL) ✅                           │
│                                                             │
│  Нужно СОЗДАТЬ/УДАЛИТЬ продукт?                            │
│  └── GraphQL Admin API ✅                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. GraphQL Admin API (ОСНОВНОЙ)

**Используй для:**
- ✅ Обновление `descriptionHtml`
- ✅ Обновление `title`, `handle`, `tags`
- ✅ Создание/удаление продуктов
- ✅ Обновление metafields
- ✅ Публикация продуктов

**Endpoint:**
```
https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json
```

**Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'X-Shopify-Access-Token': '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'
}
```

**Пример обновления описания:**
```javascript
const mutation = `
  mutation {
    productUpdate(input: {
      id: "gid://shopify/Product/XXXXXXXXX",
      descriptionHtml: "${html.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
    }) {
      product { id title }
      userErrors { field message }
    }
  }
`;

const result = await makeGraphQLRequest(mutation);

// ВСЕГДА проверяй ошибки!
if (result.data?.productUpdate?.userErrors?.length > 0) {
  console.error('❌ Ошибки:', result.data.productUpdate.userErrors);
}
```

**⚠️ ВАЖНО - Экранирование:**
```javascript
// ❌ НЕПРАВИЛЬНО
descriptionHtml: html  // Кавычки не экранированы!

// ✅ ПРАВИЛЬНО
descriptionHtml: "${html.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
```

### 2. REST API (для фото на Trial)

**Используй ТОЛЬКО для загрузки фото на Trial аккаунте!**

**Endpoint:**
```
https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/products/{product_id}/images.json
```

**Пример загрузки фото:**
```javascript
const fs = require('fs');

// 1. Скачай фото локально
const imageBuffer = fs.readFileSync('./local-photo.jpg');
const base64Image = imageBuffer.toString('base64');

// 2. Загрузи через REST API
const response = await fetch(
  `https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/products/${productId}/images.json`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': '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'
    },
    body: JSON.stringify({
      image: {
        attachment: base64Image,
        filename: 'photo.jpg'
      }
    })
  }
);

const data = await response.json();
console.log('✅ Фото загружено:', data.image.src);
```

**⚠️ НИКОГДА не используй URL на Trial:**
```javascript
// ❌ НЕПРАВИЛЬНО - БЛОКИРУЕТСЯ!
attachment: "https://example.com/photo.jpg"

// ✅ ПРАВИЛЬНО - BASE64!
attachment: base64Image
```

### 3. Storefront API (для чтения)

**Используй для отображения данных на сайте:**

**Endpoint:**
```
https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json
```

**Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': '89e6c827e100c3d0b35e5957424b3cc7'
}
```

**Пример чтения продуктов:**
```javascript
const query = `
  query {
    products(first: 20, query: "tag:category:shopping") {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(identifiers: [
            { namespace: "custom", key: "rating" }
            { namespace: "custom", key: "district" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

const result = await storefrontApiRequest(query);
const products = result.data.products.edges;
```

### 4. Типичные ошибки агентов:

**❌ ОШИБКА #1: Путаница между Admin и Storefront**
```javascript
// ❌ НЕПРАВИЛЬНО
// Пытаешься обновить через Storefront API
const mutation = `mutation { productUpdate(...) }`;
await storefrontApiRequest(mutation);  // НЕ РАБОТАЕТ!

// ✅ ПРАВИЛЬНО
// Обновление ТОЛЬКО через Admin API
await adminApiRequest(mutation);  // РАБОТАЕТ!
```

**❌ ОШИБКА #2: Забыл product ID prefix**
```javascript
// ❌ НЕПРАВИЛЬНО
id: "7972352950326"  // Просто число!

// ✅ ПРАВИЛЬНО
id: "gid://shopify/Product/7972352950326"  // С префиксом!
```

**❌ ОШИБКА #3: Не проверил userErrors**
```javascript
// ❌ НЕПРАВИЛЬНО
const result = await makeGraphQLRequest(mutation);
console.log("Готово!");  // Может быть ошибка!

// ✅ ПРАВИЛЬНО
const result = await makeGraphQLRequest(mutation);
if (result.data?.productUpdate?.userErrors?.length > 0) {
  console.error('❌ Ошибки:', result.data.productUpdate.userErrors);
  throw new Error("Failed to update product");
}
console.log("✅ Готово!");
```

**❌ ОШИБКА #4: Неправильный namespace для metafields**
```javascript
// ❌ НЕПРАВИЛЬНО
namespace: "custom"  // Trial аккаунт не разрешает!

// ✅ ПРАВИЛЬНО
namespace: "place_info"  // Кастомный namespace!
```

### 5. Шаблон функции для GraphQL запросов:

```javascript
async function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    
    const options = {
      hostname: 'phuket-telegram-shop-117ck.myshopify.com',
      path: '/admin/api/2025-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': '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',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}
```

### 6. Получение ID продукта по handle:

```javascript
async function getProductId(handle) {
  const query = `
    query {
      products(first: 10, query: "handle:${handle}") {
        edges {
          node {
            id
            handle
            title
          }
        }
      }
    }
  `;
  
  const result = await makeGraphQLRequest(query);
  const product = result.data?.products?.edges?.[0]?.node;
  
  if (!product) {
    throw new Error(`Продукт с handle "${handle}" не найден!`);
  }
  
  return product.id;  // Вернёт: gid://shopify/Product/XXXXXXXXX
}
```

### 7. Чеклист перед запуском скрипта:

```markdown
- [ ] Использую правильный API (Admin для обновления)
- [ ] Использую правильный токен (Admin API token)
- [ ] Экранировал кавычки в HTML (.replace(/"/g, '\\"'))
- [ ] Экранировал переносы строк (.replace(/\n/g, '\\n'))
- [ ] Добавил проверку userErrors
- [ ] Добавил паузу между запросами (1500ms)
- [ ] Использую правильный product ID (с gid://)
- [ ] Логирую прогресс (console.log)
```

### 8. Отладка проблем:

**Если не работает:**

1. **Проверь endpoint:**
```bash
curl -X POST \
  'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json' \
  -H 'Content-Type: application/json' \
  -H 'X-Shopify-Access-Token: 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' \
  -d '{"query":"{ shop { name } }"}' | jq '.'
```

2. **Проверь токен:**
```bash
cat .shopify/TOKENS.txt
```

3. **Проверь product ID:**
```bash
node scripts/check-product-id.cjs central-phuket-floresta
```

4. **Проверь GraphQL запрос:**
- Скопируй запрос в https://shopify.dev/docs/api/admin-graphql
- Проверь syntax errors
- Проверь экранирование

---

## 🔑 SHOPIFY CREDENTIALS И ДОСТУПЫ

### ⚠️ КРИТИЧЕСКИ ВАЖНО ДЛЯ АГЕНТОВ!

**Агенты часто не знают где взять токены!** Вот всё что нужно:

### 1. Где найти credentials:

```
.shopify/TOKENS.txt           ← БЫСТРЫЙ ДОСТУП (copy-paste)
.shopify/CREDENTIALS.md       ← Детальная информация
.shopify/README.md            ← Полная документация
```

### 2. Shopify Admin Login:

```
URL:      https://admin.shopify.com/store/phuket-telegram-shop-117ck
Email:    anotherstoriz@gmail.com
Password: Qazwsx1.
```

**Когда нужен:**
- Проверить загрузились ли фото
- Проверить metafields
- Проверить продукты
- Ручное редактирование (крайний случай!)

### 3. API Tokens:

**Storefront API Token (READ-ONLY):**
```
89e6c827e100c3d0b35e5957424b3cc7
```

**Используй для:**
- ✅ Чтение продуктов для сайта
- ✅ Получение descriptionHtml
- ✅ Получение изображений
- ❌ НЕ для обновления данных!

**Admin API Token (FULL ACCESS):**
```
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
```

**Используй для:**
- ✅ Обновление descriptionHtml
- ✅ Обновление title, handle, tags
- ✅ Создание/удаление продуктов
- ✅ Загрузка фото (REST API)
- ✅ Обновление metafields

### 4. Store Domain:

```
phuket-telegram-shop-117ck.myshopify.com
```

### 5. API Version:

```
2025-07
```

**⚠️ ВАЖНО:** Всегда используй версию `2025-07` в URLs!

### 6. Правильные Endpoints:

**Admin GraphQL API:**
```
https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json
```

**Storefront GraphQL API:**
```
https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json
```

**REST API (Images):**
```
https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/products/{product_id}/images.json
```

### 7. Быстрый тест подключения:

**Тест Admin API:**
```bash
curl -X POST \
  'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json' \
  -H 'Content-Type: application/json' \
  -H 'X-Shopify-Access-Token: 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' \
  -d '{"query":"{ shop { name } }"}' | jq '.'

# Ожидаемый результат:
# {
#   "data": {
#     "shop": {
#       "name": "Phuket Telegram Shop"
#     }
#   }
# }
```

**Тест Storefront API:**
```bash
curl -X POST \
  'https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json' \
  -H 'Content-Type: application/json' \
  -H 'X-Shopify-Storefront-Access-Token: 89e6c827e100c3d0b35e5957424b3cc7' \
  -d '{"query":"{ products(first: 5) { edges { node { title } } } }"}' | jq '.'

# Ожидаемый результат:
# {
#   "data": {
#     "products": {
#       "edges": [...]
#     }
#   }
# }
```

### 8. Типичные ошибки с credentials:

**❌ ОШИБКА #1: Перепутал токены**
```javascript
// ❌ НЕПРАВИЛЬНО - Storefront токен для обновления
headers: {
  'X-Shopify-Storefront-Access-Token': '89e6c...'  // НЕ РАБОТАЕТ!
}

// ✅ ПРАВИЛЬНО - Admin токен для обновления
headers: {
  'X-Shopify-Access-Token': 'shpat_bb97...'  // РАБОТАЕТ!
}
```

**❌ ОШИБКА #2: Неправильный endpoint**
```javascript
// ❌ НЕПРАВИЛЬНО - Storefront endpoint для обновления
'https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json'

// ✅ ПРАВИЛЬНО - Admin endpoint для обновления
'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json'
```

**❌ ОШИБКА #3: Неправильная версия API**
```javascript
// ❌ НЕПРАВИЛЬНО - Старая версия
'/admin/api/2024-10/graphql.json'

// ✅ ПРАВИЛЬНО - Актуальная версия
'/admin/api/2025-07/graphql.json'
```

**❌ ОШИБКА #4: Забыл header**
```javascript
// ❌ НЕПРАВИЛЬНО - Нет токена!
headers: {
  'Content-Type': 'application/json'
}

// ✅ ПРАВИЛЬНО - С токеном
headers: {
  'Content-Type': 'application/json',
  'X-Shopify-Access-Token': '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'
}
```

### 9. Проверка credentials в скрипте:

```javascript
const https = require('https');

// КОНСТАНТЫ (копируй из .shopify/TOKENS.txt)
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ADMIN_TOKEN = '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';
const SHOPIFY_STOREFRONT_TOKEN = '89e6c827e100c3d0b35e5957424b3cc7';
const API_VERSION = '2025-07';

// Тест подключения
async function testConnection() {
  const query = '{ shop { name } }';
  const data = JSON.stringify({ query });
  
  const options = {
    hostname: SHOPIFY_STORE,
    path: `/admin/api/${API_VERSION}/graphql.json`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      'Content-Length': Buffer.byteLength(data)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.data?.shop?.name) {
            console.log('✅ Подключение к Shopify успешно!');
            console.log(`   Магазин: ${parsed.data.shop.name}`);
            resolve(true);
          } else {
            console.error('❌ Ошибка подключения:', parsed);
            reject(new Error('Invalid response'));
          }
        } catch (error) {
          console.error('❌ Ошибка парсинга:', error.message);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Ошибка сети:', error.message);
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

// Запуск теста
testConnection().catch(console.error);
```

### 10. Чеклист перед запуском любого скрипта:

```markdown
- [ ] Скопировал токены из .shopify/TOKENS.txt
- [ ] Использую правильный endpoint (admin для обновления)
- [ ] Использую правильный токен (Admin API)
- [ ] Использую версию API 2025-07
- [ ] Добавил правильные headers
- [ ] Протестировал подключение
```

---

## ⚠️ TRIAL ACCOUNT ОГРАНИЧЕНИЯ И РЕШЕНИЯ

### КРИТИЧЕСКИ ВАЖНО ДЛЯ АГЕНТОВ!

**У нас Trial аккаунт Shopify! Есть ограничения!**

### Что НЕ работает на Trial:

```
❌ Загрузка фото по внешним URL через GraphQL
❌ Некоторые namespace для metafields ("custom")
❌ Автоматическая публикация на Sales Channels
❌ Webhook интеграции
```

### Что РАБОТАЕТ на Trial:

```
✅ GraphQL Admin API (обновление данных)
✅ REST API (загрузка фото через base64)
✅ Storefront API (чтение данных)
✅ Кастомные namespace для metafields ("place_info", "tour_info")
✅ Ручная публикация продуктов
```

### 1. ФОТОГРАФИИ - ГЛАВНАЯ ПРОБЛЕМА

**❌ НЕ РАБОТАЕТ на Trial:**
```javascript
// GraphQL - загрузка по URL
mutation {
  productCreateMedia(
    productId: "gid://shopify/Product/XXXXXXX",
    media: [{
      originalSource: "https://example.com/photo.jpg",  // БЛОКИРУЕТСЯ!
      alt: "Photo",
      mediaContentType: IMAGE
    }]
  ) { ... }
}
```

**✅ РАБОТАЕТ на Trial:**
```javascript
// REST API - загрузка через base64
const fs = require('fs');

// 1. Скачай фото ЛОКАЛЬНО
const response = await fetch(photoUrl);
const arrayBuffer = await response.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
fs.writeFileSync('./temp-photo.jpg', buffer);

// 2. Конвертируй в base64
const base64Image = fs.readFileSync('./temp-photo.jpg', 'base64');

// 3. Загрузи через REST API
const uploadResponse = await fetch(
  `https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/products/${productId}/images.json`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': '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'
    },
    body: JSON.stringify({
      image: {
        attachment: base64Image,  // BASE64!
        filename: 'photo.jpg'
      }
    })
  }
);

// 4. Удали временный файл
fs.unlinkSync('./temp-photo.jpg');
```

**ВАЖНО:** Весь процесс в `.shopify/PHOTO_UPLOAD_GUIDE.md`!

### 2. METAFIELDS - NAMESPACE ПРОБЛЕМА

**❌ НЕ РАБОТАЕТ на Trial:**
```javascript
mutation {
  productUpdate(input: {
    id: "gid://shopify/Product/XXXXXXX",
    metafields: [{
      namespace: "custom",  // БЛОКИРУЕТСЯ!
      key: "rating",
      value: "4.5",
      type: "single_line_text_field"
    }]
  }) { ... }
}
```

**✅ РАБОТАЕТ на Trial:**
```javascript
mutation {
  productUpdate(input: {
    id: "gid://shopify/Product/XXXXXXX",
    metafields: [{
      namespace: "place_info",  // КАСТОМНЫЙ namespace!
      key: "rating",
      value: "4.5",
      type: "single_line_text_field"
    }]
  }) { ... }
}
```

**Правильные namespace:**
- `place_info` - для информационных мест
- `tour_info` - для туров
- `product_info` - для продуктов

### 3. STOREFRONT API - НЕ ВОЗВРАЩАЕТ METAFIELDS

**Проблема:**
```javascript
// Storefront API НЕ возвращает metafields с кастомными namespace!
const query = `
  query {
    products(first: 10) {
      edges {
        node {
          metafields(identifiers: [
            { namespace: "place_info", key: "rating" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

const result = await storefrontApiRequest(query);
// metafields = null или пустой массив!
```

**Решение - FALLBACK ДАННЫЕ:**
```typescript
// src/data/placeMetafields.ts
export const placeMetafields = {
  'central-phuket-floresta': {
    rating: '4.6',
    priceLevel: '3',
    district: 'Чернгталай',
    workingHours: '10:00-22:00',
    coordinates: '7.9936,98.2964'
  },
  'jungceylon-shopping-center': {
    rating: '4.4',
    priceLevel: '2',
    district: 'Патонг',
    workingHours: '11:00-23:00',
    coordinates: '7.8965,98.2965'
  },
  // ... остальные места
};

// Использование в компонентах
import { placeMetafields } from '@/data/placeMetafields';

const rating = placeMetafields[handle]?.rating || '4.5';
const district = placeMetafields[handle]?.district || 'Пхукет';
```

**ВАЖНО:** Полный гайд в `.shopify/METAFIELDS_GUIDE.md`!

### 4. ПУБЛИКАЦИЯ ПРОДУКТОВ

**Trial требует ручной публикации:**

```javascript
// После создания продукта
mutation {
  productPublish(input: {
    id: "gid://shopify/Product/XXXXXXX",
    productPublications: [{
      publicationId: "gid://shopify/Publication/XXXXXXX"
    }]
  }) { ... }
}
```

**Проще через Shopify Admin:**
1. Открой продукт в админке
2. Нажми "Manage" в секции Sales Channels
3. Выбери "Online Store"
4. Сохрани

### 5. ЛИМИТЫ RATE LIMITING

**Trial имеет лимиты на количество запросов:**

```javascript
// ❌ НЕПРАВИЛЬНО - Спамит API
for (const product of products) {
  await updateProduct(product);  // БЛОКИРОВКА!
}

// ✅ ПРАВИЛЬНО - Пауза между запросами
for (const product of products) {
  await updateProduct(product);
  await new Promise(resolve => setTimeout(resolve, 1500));  // 1.5 сек!
}
```

**Правило:** МИНИМУМ 1.5 секунды между запросами!

### 6. РАЗМЕР ДАННЫХ

**Trial имеет лимиты на размер запросов:**

```javascript
// ❌ НЕПРАВИЛЬНО - Слишком большое описание
const hugeHtml = generateHtml(10000);  // 10KB+ HTML!
mutation {
  productUpdate(input: {
    descriptionHtml: hugeHtml  // МОЖЕТ НЕ ПРОЙТИ!
  }) { ... }
}

// ✅ ПРАВИЛЬНО - Оптимизированное описание
const optimizedHtml = generateHtml(5000);  // < 5KB
mutation {
  productUpdate(input: {
    descriptionHtml: optimizedHtml  // OK!
  }) { ... }
}
```

**Правило:** Держи descriptionHtml < 5KB!

### 7. ЧЕКЛИСТ ДЛЯ РАБОТЫ С TRIAL ACCOUNT

```markdown
Перед загрузкой фото:
- [ ] Скачал фото ЛОКАЛЬНО (не URL!)
- [ ] Конвертировал в base64
- [ ] Использую REST API (не GraphQL!)
- [ ] Добавил паузу 1.5 сек

Перед обновлением metafields:
- [ ] Использую кастомный namespace (не "custom"!)
- [ ] Создал fallback данные в src/data/
- [ ] Обновил компоненты для использования fallback
- [ ] Добавил паузу 1.5 сек

Перед обновлением описания:
- [ ] HTML < 5KB
- [ ] Экранировал кавычки и переносы
- [ ] Проверил на валидность
- [ ] Добавил паузу 1.5 сек

После создания продукта:
- [ ] Опубликовал вручную через админку
- [ ] Проверил на сайте (может занять 5-10 мин)
- [ ] Обновил fallback данные
```

### 8. ТИПИЧНЫЕ ОШИБКИ С TRIAL ACCOUNT

**❌ ОШИБКА #1: Пытаюсь загрузить фото по URL**
```
Error: "Trial accounts cannot use productCreateMedia with URLs"
```
**Решение:** Используй REST API + base64

**❌ ОШИБКА #2: Использую namespace "custom"**
```
Error: "Namespace 'custom' is not available for trial accounts"
```
**Решение:** Используй "place_info" или "tour_info"

**❌ ОШИБКА #3: Спамлю API без пауз**
```
Error: "Throttled. Try again later"
```
**Решение:** Добавь паузу 1.5 сек между запросами

**❌ ОШИБКА #4: Жду metafields от Storefront API**
```
Result: metafields = null
```
**Решение:** Используй fallback данные из src/data/

**❌ ОШИБКА #5: Не опубликовал продукт**
```
Result: Продукт не отображается на сайте
```
**Решение:** Опубликуй вручную через админку

### 9. КОГДА АПГРЕЙДИТЬ НА PAID ACCOUNT?

**Сейчас НЕ нужно! Trial достаточно для:**
- ✅ Разработки и тестирования
- ✅ Заполнения всех категорий
- ✅ Отладки дизайна
- ✅ Демонстрации инвесторам

**Апгрейд нужен когда:**
- 📈 Начнутся продажи
- 📈 Нужна автоматизация
- 📈 Нужны webhook интеграции
- 📈 Нужна поддержка Shopify

**До тех пор:** Работаем с Trial! Всё работает отлично!

---

## 🎨 ДИЗАЙН СТРАНИЦЫ КАТЕГОРИИ

### ⚠️ КРИТИЧЕСКИ ВАЖНО!

**Страница категории = ВИТРИНА всех мест!**

Агент должен сначала создать **СТРАНИЦУ КАТЕГОРИИ**, потом **КАРТОЧКИ ТОВАРОВ**!

### 🧠 ФИЛОСОФИЯ ДИЗАЙНА (4 УРОВНЯ)

**Наш дизайн = Perplexity + Steve Jobs + iOS 26 + Telegram WebApp**

```
УРОВЕНЬ 1: Perplexity AI (10 принципов)
├── Скорость < 2 сек
├── Минимализм (1 кнопка решает проблему)
├── Правда > комфорт (честные данные)
├── 1% улучшение каждый день
└── Непобедимая ловушка (0% комиссия)

УРОВЕНЬ 2: Steve Jobs (Design is how it works)
├── Каждый пиксель имеет значение
├── Интуитивность (бабушка поймёт за 5 сек)
├── Восхищение (УХ! эффект)
└── Простота = сложность решённая

УРОВЕНЬ 3: iOS 26 (Human Interface Guidelines)
├── SF Pro шрифт
├── #007AFF для ВСЕХ интерактивных элементов
├── Glassmorphism (blur + saturate)
├── 44px минимум touch targets
├── Плавные анимации (200-300ms)
└── Rounded corners (14px стандарт)

УРОВЕНЬ 4: Telegram WebApp (Wallet Style)
├── Компактные карточки
├── Градиенты для блоков
├── Эмодзи иконки
├── Минимум текста, максимум смысла
└── "Дорогой классный дизайн"
```

### 🎯 ПРИМЕНЕНИЕ ФИЛОСОФИИ К КАТЕГОРИИ

**Каждый элемент категории должен соответствовать всем 4 уровням:**

**Hero секция:**
- ✅ Perplexity: Загрузка < 0.5 сек, главная инфо сразу видна
- ✅ Jobs: "УХ!" эффект от градиента
- ✅ iOS 26: Правильная типографика, 14px border-radius
- ✅ Telegram: Компактная, эмодзи иконка, градиент

**Фильтры:**
- ✅ Perplexity: 1 клик = фильтрация работает
- ✅ Jobs: Интуитивно понятно что делать
- ✅ iOS 26: Rounded pills, #007AFF для активного
- ✅ Telegram: Компактные chips, минимум места

**Карточки мест:**
- ✅ Perplexity: Вся ключевая инфо сразу (рейтинг, район, цены)
- ✅ Jobs: 1 взгляд = понял что это за место
- ✅ iOS 26: Glassmorphism, shadows, hover эффекты
- ✅ Telegram: Градиент, эмодзи, компактная карточка

**Кнопки:**
- ✅ Perplexity: 1 клик = действие выполнено
- ✅ Jobs: Понятно что произойдёт при клике
- ✅ iOS 26: #007AFF, 50px высота, rounded-xl
- ✅ Telegram: Градиент, эмодзи, анимация hover

### 1. Процесс создания страницы категории:

```
ШАГ 1: Изучить Phuket Insider категорию
   ↓
ШАГ 2: Определить что общего у всех мест
   ↓
ШАГ 3: Создать меню/фильтры для категории
   ↓
ШАГ 4: Создать Telegram WebApp дизайн
   ↓
ШАГ 5: Применить ко всем карточкам в категории
```

### 2. Что должно быть на странице категории:

**Обязательные элементы:**
- ✅ **Hero секция** - название категории, описание
- ✅ **Фильтры/Меню** - по району, типу, рейтингу
- ✅ **Карточки мест** - сетка 2-3 колонки
- ✅ **Карта** - показать все места на карте
- ✅ **Breadcrumbs** - навигация (Главная > Категории > [Название])

### 3. Изучение Phuket Insider категории:

**Шаг за шагом:**

```bash
# 1. Открой категорию на Phuket Insider
https://phuket-insider.com/ru/category/[категория]/

# 2. Ответь на вопросы:
# - Сколько мест в категории?
# - Какие есть фильтры/меню?
# - Какая информация на карточках?
# - Что общего у всех мест?
```

**Пример: Торговые центры**
```
Phuket Insider: https://phuket-insider.com/ru/category/torgovye-czentry/

Всего мест: 7
Фильтры: По району (Патонг, Карон, Чернгталай)
Общее:
- Часы работы
- Парковка
- Магазины
- Развлечения
```

### 4. Определение общих характеристик:

**Для КАЖДОЙ категории определи:**

**Торговые центры:**
- 🕐 Часы работы
- 🅿️ Парковка
- 🛍️ Магазины
- 🎪 Развлечения
- 💰 Уровень цен

**Пляжи:**
- 🌅 Лучшее время
- 🏖️ Тип пляжа (песок/галька)
- 🌊 Волны (для сёрфинга)
- 🚿 Инфраструктура
- 💰 Вход (свободный/платный)

**Храмы:**
- 🕐 Часы работы
- 👔 Дресс-код
- 💰 Вход (свободный/платный)
- 📸 Можно фото?
- 🙏 Тип храма

**Рестораны:**
- 🕐 Часы работы
- 🍽️ Кухня
- 💰 Средний чек
- 📞 Резервация
- 🎵 Атмосфера

### 5. Создание меню/фильтров:

**На основе общих характеристик:**

```typescript
// Пример для Торговых центров
const categoryFilters = {
  district: ['Все', 'Патонг', 'Карон', 'Чернгталай', 'Чалонг'],
  priceLevel: ['Все', '$', '$$', '$$$'],
  hasParking: ['Все', 'Есть парковка', 'Нет парковки'],
  hasEntertainment: ['Все', 'С развлечениями', 'Только магазины']
};
```

### 6. Telegram WebApp дизайн для категории:

**Обязательные элементы:**

```jsx
// Hero секция
<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
  <h1>🛍️ Торговые центры Пхукета</h1>
  <p>7 лучших ТРЦ острова с магазинами, ресторанами и развлечениями</p>
</div>

// Быстрые фильтры (chips)
<div className="flex gap-2 overflow-x-auto">
  <button className="chip">Все</button>
  <button className="chip">Патонг</button>
  <button className="chip">Карон</button>
</div>

// Сетка карточек
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {places.map(place => <PlaceCard key={place.id} place={place} />)}
</div>

// Карта
<Map places={places} />
```

### 7. Единообразие карточек в категории:

**ВАЖНО:** Все карточки должны быть ОДИНАКОВЫЕ!

```jsx
// Шаблон карточки для категории
<div className="card rounded-xl overflow-hidden shadow-lg">
  {/* Фото */}
  <img src={photo} className="w-full h-48 object-cover" />
  
  {/* Badges */}
  <div className="absolute top-2 right-2">
    <span className="badge">{priceLevel}</span>
  </div>
  
  {/* Контент */}
  <div className="p-4">
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
    
    {/* Quick Info */}
    <div className="flex gap-2 mt-2">
      <span className="icon">⭐ {rating}</span>
      <span className="icon">📍 {district}</span>
    </div>
  </div>
</div>
```

### 8. Адаптация под категорию:

**Что меняется от категории к категории:**

| Элемент | Торговые центры | Пляжи | Храмы | Рестораны |
|---------|----------------|-------|-------|-----------|
| **Hero градиент** | blue-purple | cyan-blue | orange-red | red-yellow |
| **Quick Info** | Часы, Парковка | Время, Вход | Часы, Дресс-код | Часы, Чек |
| **Фильтры** | Район, Цены | Тип, Волны | Тип, Вход | Кухня, Цены |
| **Иконка** | 🛍️ | 🏖️ | 🛕 | 🍽️ |

### 9. Чеклист для страницы категории:

```markdown
- [ ] Изучил Phuket Insider категорию
- [ ] Определил общие характеристики
- [ ] Создал меню/фильтры
- [ ] Создал Hero секцию с правильным градиентом
- [ ] Создал единообразные карточки
- [ ] Добавил карту (если нужно)
- [ ] Добавил breadcrumbs
- [ ] Проверил в браузере - всё работает
- [ ] Telegram WebApp дизайн применён
```

---

## 🔄 АДАПТАЦИЯ ШАБЛОНА ПОД НОВУЮ КАТЕГОРИЮ

### ⚠️ КРИТИЧЕСКИ ВАЖНО ДЛЯ АГЕНТОВ!

**Как взять шаблон Central Phuket и адаптировать под новую категорию?**

### Процесс адаптации:

```
1. Берём Central Phuket (эталон для ТЦ)
   ↓
2. Изучаем Phuket Insider новой категории
   ↓
3. Определяем что изменить (Quick Info, Features)
   ↓
4. Создаём новый эталон для категории
   ↓
5. Применяем ко всем местам категории
```

### 1. Что берём из Central Phuket (НЕ МЕНЯЕМ):

**Структура HTML (остаётся как есть):**
- ✅ Hero с градиентом
- ✅ Quick Info Cards (2 карточки)
- ✅ Main Description (белая карточка)
- ✅ Features Grid (2 блока)
- ✅ Must-See Highlight (iOS 26 премиум - голубой градиент с glassmorphism)
- ✅ Amenities (grid)
- ✅ Action Buttons (3 кнопки)
- ✅ Final CTA (серый блок)

**Дизайн (остаётся как есть):**
- ✅ Telegram WebApp Style
- ✅ Rounded corners (rounded-xl, rounded-2xl)
- ✅ Shadows и borders
- ✅ Градиенты для блоков
- ✅ Typography (text-2xl, text-xl, text-lg)

### 2. Что МЕНЯЕМ под категорию:

**Hero секция:**
```javascript
// Торговые центры
heroGradient: 'from-blue-500 to-purple-600',
heroIcon: '🏢',

// Пляжи
heroGradient: 'from-blue-400 to-cyan-500',
heroIcon: '🏖️',

// Храмы
heroGradient: 'from-orange-400 to-red-500',
heroIcon: '🛕',

// Рестораны
heroGradient: 'from-red-500 to-orange-500',
heroIcon: '🍽️',
```

**Quick Info Cards (2 карточки):**
```javascript
// Торговые центры
quickInfo: [
  { icon: '🕐', title: 'Часы работы', value: '10:00-22:00' },
  { icon: '🚗', title: 'Парковка', value: 'Бесплатная' }
]

// Пляжи
quickInfo: [
  { icon: '🌅', title: 'Лучшее время', value: 'Ноябрь-Апрель' },
  { icon: '💰', title: 'Вход', value: 'Бесплатный' }
]

// Храмы
quickInfo: [
  { icon: '🕐', title: 'Часы работы', value: '07:00-17:00' },
  { icon: '👔', title: 'Дресс-код', value: 'Закрытые плечи' }
]

// Рестораны
quickInfo: [
  { icon: '🕐', title: 'Часы работы', value: '12:00-23:00' },
  { icon: '💰', title: 'Средний чек', value: '₿ 500-1000' }
]
```

**Features (2 блока):**
```javascript
// Торговые центры
features: [
  { title: 'Магазины', icon: '🛍️', items: [...] },
  { title: 'Развлечения', icon: '🎪', items: [...] }
]

// Пляжи
features: [
  { title: 'Инфраструктура', icon: '🏖️', items: [...] },
  { title: 'Активности', icon: '🏄', items: [...] }
]

// Храмы
features: [
  { title: 'История', icon: '📜', items: [...] },
  { title: 'Архитектура', icon: '🏛️', items: [...] }
]

// Рестораны
features: [
  { title: 'Кухня', icon: '🍽️', items: [...] },
  { title: 'Фирменные блюда', icon: '⭐', items: [...] }
]
```

**Must-See:**
```javascript
// Торговые центры
mustSee: {
  icon: '🐠',
  title: 'Aquaria Phuket',
  description: 'Крупнейший океанариум...'
}

// Пляжи
mustSee: {
  icon: '🌅',
  title: 'Закат на Патонге',
  description: 'Невероятные закаты...'
}

// Храмы
mustSee: {
  icon: '🙏',
  title: 'Пагода с реликвиями',
  description: 'Главная святыня...'
}

// Рестораны
mustSee: {
  icon: '🍤',
  title: 'Tom Yum Goong',
  description: 'Легендарный тайский суп...'
}
```

**Amenities:**
```javascript
// Торговые центры
amenities: ['📶 Wi-Fi', '🅿️ Парковка', '🍽️ Фуд-корт', '🎬 Кино']

// Пляжи
amenities: ['☂️ Лежаки', '🚿 Душ', '🍹 Бары', '🏊 Спасатели']

// Храмы
amenities: ['🅿️ Парковка', '🚻 Туалеты', '📸 Фото OK', '🙏 Бесплатно']

// Рестораны
amenities: ['📶 Wi-Fi', '🅿️ Парковка', '🍷 Бар', '📞 Резервация']
```

### 3. Пошаговая адаптация:

**ШАГ 1: Скопируй структуру Central Phuket**
```bash
# Открой эталон
cat scripts/update-central-phuket-telegram-style.cjs

# Скопируй как новый файл
cp scripts/update-central-phuket-telegram-style.cjs \
   scripts/update-patong-beach-telegram-style.cjs
```

**ШАГ 2: Измени данные под категорию**
```javascript
// Было (Central Phuket - ТЦ)
const telegramStyleDescription = `
  <div class="bg-gradient-to-r from-blue-500 to-purple-600">
    <h1>🏢 Central Phuket</h1>
    ...
  </div>
`;

// Стало (Patong Beach - Пляж)
const telegramStyleDescription = `
  <div class="bg-gradient-to-r from-blue-400 to-cyan-500">
    <h1>🏖️ Patong Beach (Патонг)</h1>
    ...
  </div>
`;
```

**ШАГ 3: Адаптируй Quick Info**
```javascript
// Было
<div>Часы работы: 10:00-22:00</div>
<div>Парковка: Бесплатная</div>

// Стало
<div>Лучшее время: Ноябрь-Апрель</div>
<div>Вход: Бесплатный</div>
```

**ШАГ 4: Адаптируй Features**
```javascript
// Было
<h3>🛍️ Магазины</h3>
<h3>🎪 Развлечения</h3>

// Стало
<h3>🏖️ Инфраструктура</h3>
<h3>🏄 Активности</h3>
```

**ШАГ 5: Адаптируй Must-See**
```javascript
// Было
<h3>Aquaria Phuket</h3>
<p>Крупнейший океанариум...</p>

// Стало
<h3>Закат на Патонге</h3>
<p>Невероятные закаты...</p>
```

**ШАГ 6: Адаптируй Amenities**
```javascript
// Было
['📶 Wi-Fi', '🅿️ Парковка', '🍽️ Фуд-корт']

// Стало
['☂️ Лежаки', '🚿 Душ', '🍹 Бары']
```

### 4. Таблица адаптации (используй как шпаргалку):

| Категория | Hero Gradient | Icon | Quick Info 1 | Quick Info 2 | Feature 1 | Feature 2 |
|-----------|--------------|------|--------------|--------------|-----------|-----------|
| **ТЦ** | blue-purple | 🏢 | Часы работы | Парковка | Магазины | Развлечения |
| **Пляжи** | cyan-blue | 🏖️ | Лучшее время | Вход | Инфраструктура | Активности |
| **Храмы** | orange-red | 🛕 | Часы работы | Дресс-код | История | Архитектура |
| **Рестораны** | red-orange | 🍽️ | Часы работы | Средний чек | Кухня | Блюда |

### 5. Чеклист адаптации:

```markdown
- [ ] Скопировал структуру Central Phuket
- [ ] Изменил Hero градиент под категорию
- [ ] Изменил Hero иконку
- [ ] Адаптировал Quick Info (2 карточки)
- [ ] Адаптировал Features (2 блока)
- [ ] Адаптировал Must-See
- [ ] Адаптировал Amenities
- [ ] Оставил структуру HTML как есть
- [ ] Оставил Telegram WebApp дизайн
- [ ] Проверил в браузере - выглядит отлично
```

### 6. Пример полной адаптации:

**Файл: `scripts/update-patong-beach-telegram-style.cjs`**

```javascript
const https = require('https');

// ... константы Shopify ...

const telegramStyleDescription = `
<div class="space-y-6">
  <!-- Hero - АДАПТИРОВАНО -->
  <div class="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">🏖️ Patong Beach (Патонг)</h1>
    <p class="text-blue-100 text-lg">Самый популярный пляж Пхукета</p>
    <div class="flex items-center gap-4 mt-4">
      <div><span class="text-yellow-300">⭐</span> 4.3</div>
      <div><span class="text-green-300">💰</span> $$</div>
      <div><span class="text-blue-300">📍</span> Патонг</div>
    </div>
  </div>

  <!-- Quick Info - АДАПТИРОВАНО -->
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🌅</span>
        <span class="font-semibold">Лучшее время</span>
      </div>
      <p class="text-sm">Ноябрь - Апрель</p>
    </div>
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">💰</span>
        <span class="font-semibold">Вход</span>
      </div>
      <p class="text-sm">Бесплатный</p>
    </div>
  </div>

  <!-- Features - АДАПТИРОВАНО -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
      <h3 class="text-lg font-bold mb-3">🏖️ Инфраструктура</h3>
      <p class="text-sm mb-3">Все для комфорта</p>
      <div class="space-y-2">
        <div><span>☂️</span> Лежаки и зонтики</div>
        <div><span>🚿</span> Душ и туалеты</div>
        <div><span>🍹</span> Пляжные бары</div>
      </div>
    </div>
    <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-5">
      <h3 class="text-lg font-bold mb-3">🏄 Активности</h3>
      <p class="text-sm mb-3">Развлечения</p>
      <div class="space-y-2">
        <div><span>🏊</span> Плавание</div>
        <div><span>🏄</span> Сёрфинг</div>
        <div><span>🚤</span> Водные виды спорта</div>
      </div>
    </div>
  </div>

  <!-- Must-See - АДАПТИРОВАНО -->
  <!-- Must-See Highlight - iOS 26 Premium Style -->
  <div class="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-200/50 shadow-sm">
    <div class="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/20"></div>
    <div class="relative">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
          <span class="text-white text-lg">⭐</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900">Обязательно посетите!</h3>
      </div>
      <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 space-y-2">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌅</span>
          <div>
            <p class="font-bold text-lg text-gray-900">Закат на Патонге</p>
            <p class="text-gray-600 text-sm leading-relaxed">Невероятные закаты 18:00-19:00</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Amenities - АДАПТИРОВАНО -->
  <div class="bg-white rounded-xl p-6 shadow-sm">
    <h3 class="text-lg font-bold mb-4">Удобства</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span>☂️</span> Лежаки
      </div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span>🚿</span> Душ
      </div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span>🍹</span> Бары
      </div>
      <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <span>🏊</span> Спасатели
      </div>
    </div>
  </div>

  <!-- Action Buttons - БЕЗ ИЗМЕНЕНИЙ -->
  <div class="space-y-4">
    <h3 class="text-lg font-bold">Планируете поездку?</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <a href="/phuket" class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-xl">🏝️</span>
          <span class="font-semibold">Туры</span>
        </div>
        <p class="text-sm">С гидом</p>
      </a>
      <!-- ... остальные кнопки без изменений ... -->
    </div>
  </div>

  <!-- Final CTA - АДАПТИРОВАНО -->
  <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 text-center">
    <p class="text-gray-600 italic">
      Patong Beach — самый оживлённый пляж Пхукета с развитой инфраструктурой...
    </p>
  </div>
</div>
`;

// ... функции обновления Shopify без изменений ...
```

**ГЛАВНОЕ:** Структура HTML остаётся КАК У Central Phuket! Меняется ТОЛЬКО контент!

---

## 🎯 ЧЕКЛИСТ ДЛЯ НОВОЙ КАТЕГОРИИ

### Перед началом:
- [ ] Изучил phuket-insider.com/ru/category/[категория]
- [ ] Определил лучшее место для эталона
- [ ] Собрал список всех мест (10-20 штук)
- [ ] Понял специфику категории

### Создание эталона:
- [ ] Собрал данные для эталонного места
- [ ] Создал скрипт update-[place]-telegram-style.cjs
- [ ] Применил к эталону
- [ ] Проверил в браузере
- [ ] Отшлифовал дизайн

### Сбор данных:
- [ ] Создал таблицу со всеми местами
- [ ] Собрал базовую информацию для всех
- [ ] Определил градиенты для всех
- [ ] Собрал уникальные особенности для всех

### Мастер-скрипт:
- [ ] Создал apply-telegram-style-to-all-[category].cjs
- [ ] Заполнил массив places[] всеми данными
- [ ] Адаптировал функцию generateTelegramStyleHTML()
- [ ] Протестировал на 1-2 местах

### Применение:
- [ ] Запустил мастер-скрипт
- [ ] Все места обновлены без ошибок
- [ ] Проверил каждое место в браузере
- [ ] Проверил страницу категории

### Финализация:
- [ ] Все выглядит единообразно
- [ ] Мобильная версия работает
- [ ] Сделал коммит в Git
- [ ] Задокументировал процесс

---

## 💡 СОВЕТЫ И ЛАЙФХАКИ

### 1. Экономия времени

**Используй AI для сбора данных:**
```
ChatGPT промпт:
"Собери информацию о пляже Патонг на Пхукете:
- Рейтинг из Google/TripAdvisor
- Часы работы
- Лучшее время для посещения
- Инфраструктура
- Активности
- Must-see достопримечательности"
```

### 2. Копирование структуры

**Не изобретай велосипед!**
- Используй структуру торговых центров
- Просто адаптируй Quick Info и Features
- Остальное оставь как есть

### 3. Градиенты

**Палитра готовых градиентов:**
```javascript
// Яркие (торговые центры, развлечения)
'from-blue-500 to-purple-600'
'from-orange-500 to-red-600'
'from-pink-500 to-purple-600'

// Морские (пляжи, водные активности)
'from-blue-400 to-cyan-500'
'from-teal-500 to-cyan-600'
'from-sky-400 to-blue-500'

// Природные (храмы, парки)
'from-orange-400 to-red-500'
'from-amber-500 to-orange-600'
'from-green-500 to-emerald-600'

// Еда (рестораны, фуд-корты)
'from-red-500 to-orange-500'
'from-orange-500 to-yellow-500'
'from-pink-500 to-red-500'
```

### 4. Проверка качества

**Быстрый чеклист:**
```bash
# 1. Все места обновлены?
node scripts/final-[category]-status.cjs

# 2. Все теги правильные?
node scripts/check-[category]-tags.cjs

# 3. Все в браузере работает?
npm run dev
# Открой каждое место и проверь
```

### 5. Шаблон для документации

**После завершения создай файл:**
`.shopify/[CATEGORY]_GUIDE.md`

```markdown
# Категория: [НАЗВАНИЕ]

## Статус: ✅ Готово

## Статистика:
- **Мест:** 7
- **Эталон:** Central Phuket
- **Время:** 4 часа
- **Дата:** 29.10.2025

## Особенности:
- Quick Info: Часы работы, Парковка
- Features: 2 блока (Магазины, Развлечения)
- Must-See: Уникально для каждого

## Скрипты:
- `scripts/apply-telegram-style-to-all-shopping.cjs` - мастер-скрипт
- `scripts/final-shopping-status.cjs` - отчет

## Проверка:
http://localhost:8080/category/shopping
```

---

## 🚨 ЧАСТЫЕ ОШИБКИ

### ❌ Ошибка 1: Одинаковые данные для всех

**Неправильно:**
```javascript
// Все места имеют одинаковые удобства
amenities: ['📶 Wi-Fi', '🅿️ Парковка', '🍽️ Фуд-корт']
```

**Правильно:**
```javascript
// Каждое место имеет свои удобства
// Central Phuket:
amenities: ['📶 Wi-Fi', '🅿️ Парковка', '🎬 Кино', '🐠 Аквариум']
// Patong Night Market:
amenities: ['🌙 Работает ночью', '🍜 Уличная еда', '🎁 Сувениры']
```

### ❌ Ошибка 2: Неправильное экранирование

**Неправильно:**
```javascript
descriptionHtml: html  // Кавычки не экранированы!
```

**Правильно:**
```javascript
descriptionHtml: "${html.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
```

### ❌ Ошибка 3: Забыл паузу между запросами

**Неправильно:**
```javascript
for (let place of places) {
  await updatePlace(place);  // Спамит API!
}
```

**Правильно:**
```javascript
for (let place of places) {
  await updatePlace(place);
  await new Promise(resolve => setTimeout(resolve, 1500));  // Пауза!
}
```

### ❌ Ошибка 4: Не проверил в браузере

**ВСЕГДА** проверяй результат в браузере после применения!

---

## 📊 ИТОГОВЫЕ МЕТРИКИ

### Успешная категория - это:

**Качество:**
- ✅ 100% мест с единым дизайном
- ✅ Уникальные данные для каждого
- ✅ Все ссылки работают
- ✅ Мобильная версия OK

**Скорость:**
- ⚡ 1 эталон: 1-2 часа
- ⚡ Сбор данных: 2-3 часа
- ⚡ Скрипт: 30 минут
- ⚡ Применение: 5 минут
- **ИТОГО: 4-6 часов**

**Результат:**
- 🎯 10-20 готовых мест
- 🎯 1 мастер-скрипт для будущих обновлений
- 🎯 Документация для других агентов

---

## 🎓 ЗАКЛЮЧЕНИЕ

**Следуя этому гайду, любой агент сможет:**
1. Создать новую категорию за 1 день
2. Применить единый дизайн ко всем местам
3. Быстро добавлять новые места
4. Легко обновлять данные

**Помни:**
- 📝 Эталон → Данные → Скрипт → Применение
- 🎨 Telegram WebApp Style = единообразие
- ⚡ Автоматизация = скорость
- ✅ Проверка = качество

**Категория "Торговые центры" - это ЭТАЛОН!**  
Используй её как референс для всех других категорий!

---

**Создано:** 29.10.2025  
**Автор:** AI Agent (на основе опыта с категорией "Торговые центры")  
**Версия:** 2.1 (+ Дизайн категории и адаптация шаблона)

---

## 🎯 КРАТКОЕ РЕЗЮМЕ ДЛЯ БЫСТРОГО СТАРТА

### Что делать когда получаешь задачу создать категорию:

**1. ПРОЧИТАЙ ЭТОТ ФАЙЛ ПОЛНОСТЬЮ!** (10-15 минут)

**2. ИЗУЧИ PHUKET INSIDER:**
```bash
# Открой категорию
https://phuket-insider.com/ru/category/[категория]/

# Создай список всех мест
data/[category]-places-list.md

# Определи лучшее место для эталона
```

**3. СОЗДАЙ TODO:**
```bash
# Используй шаблон из раздела "ШАГ 0.6"
# Отмечай выполненное по ходу работы
```

**4. СОЗДАЙ ЭТАЛОН:**
```bash
# 1 идеальная карточка для лучшего места
scripts/update-[place-handle]-telegram-style.cjs
```

**5. СОБЕРИ ДАННЫЕ:**
```bash
# Таблица Excel/Google Sheets для ВСЕХ мест
# Уникальные градиенты, особенности
```

**6. СОЗДАЙ МАСТЕР-СКРИПТ:**
```bash
# Скопируй структуру из
scripts/apply-telegram-style-to-all-shopping.cjs

# Адаптируй под категорию
# Заполни массив places[] данными всех мест
```

**7. ЗАПУСТИ:**
```bash
node scripts/apply-telegram-style-to-all-[category].cjs

# Проверь результат:
http://localhost:8080/category/[category]
```

**8. ПРОВЕРЬ В БРАУЗЕРЕ:**
```bash
# КАЖДОЕ место
# Страницу категории
# Мобильную версию
```

**9. КОММИТ:**
```bash
git add .
git commit -m "✅ Категория [название] готова"
git push
```

### ⏱️ Временные затраты:
- ШАГ 0: 30 мин (изучение)
- ШАГ 1: 1-2 часа (эталон)
- ШАГ 2: 2-3 часа (данные)
- ШАГ 3: 30 мин (скрипт)
- ШАГ 4: 5 мин (применение)
- ШАГ 5: 30 мин (проверка)

**ИТОГО: 5-7 часов на 10-20 мест!**

### 🚨 ТОП-3 ОШИБКИ (НЕ ДЕЛАЙ!):

1. ❌ **Не изучил Phuket Insider** → не понял специфику категории
2. ❌ **Не создал эталон сначала** → потом переделывать все
3. ❌ **Не проверил API (GraphQL vs REST)** → потеря времени

### ✅ ТОП-3 ПРАВИЛА (ДЕЛАЙ!):

1. ✅ **Читай ВЕСЬ файл** перед началом
2. ✅ **Создавай TODO** и отмечай прогресс
3. ✅ **Проверяй в браузере** после каждого изменения

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

### Файлы проекта:
```
.shopify/CATEGORY_MASTER_GUIDE.md         ← ТЫ ЗДЕСЬ (главный гайд)
.shopify/QUICK_START_CATEGORY.md          ← Краткая шпаргалка
.shopify/METAFIELDS_GUIDE.md              ← Работа с metafields
.shopify/PHOTO_WORKFLOW_GUIDE.md          ← Работа с фото
AGENTS.md                                  ← Главный файл проекта
```

### Эталоны:
```
scripts/apply-telegram-style-to-all-shopping.cjs    ← Мастер-скрипт для ТЦ
scripts/update-central-phuket-telegram-style.cjs    ← Эталонная карточка
http://localhost:8080/category/shopping             ← Готовая категория
http://localhost:8080/place/central-phuket-floresta ← Эталонное место
```

### Источники данных:
```
https://phuket-insider.com/ru/category/              ← Все категории
https://phuket-insider.com/ru/category/plyazhi/      ← Пляжи
https://phuket-insider.com/ru/category/khramy/       ← Храмы
https://phuket-insider.com/ru/category/restorany/    ← Рестораны
```

---

## 💬 ВОПРОСЫ И ОТВЕТЫ

**Q: Сколько времени займёт создание категории?**
A: 5-7 часов для 10-20 мест (с опытом можно 4 часа)

**Q: Нужно ли знать GraphQL?**
A: Нет! Скопируй структуру из `apply-telegram-style-to-all-shopping.cjs`

**Q: Как работать с фото?**
A: Читай `.shopify/PHOTO_WORKFLOW_GUIDE.md`

**Q: Что делать если скрипт не работает?**
A: Раздел "Работа с Shopify API" → "Отладка проблем"

**Q: Можно ли адаптировать под другие категории?**
A: Да! Главное адаптировать Quick Info и Features

**Q: Где взять данные для мест?**
A: Phuket Insider + Google Maps + TripAdvisor

**Q: Как добавить новое место в готовую категорию?**
A: Добавь в массив `places[]` в мастер-скрипте → запусти снова

**Q: Нужно ли создавать продукты в Shopify вручную?**
A: Нет! Скрипт обновляет существующие. Создание - отдельная задача.

---

## 🚨 КРИТИЧНО: НЕТ ДЕШЁВЫМ ЭМОДЗИ!

### ❌ **ОШИБКА #0: Дешёвые эмодзи вместо профессиональных иконок**

**ПОЧЕМУ ЭТО КРИТИЧНО:**
- 🏝️🚗💱 = дешёвый дизайн 2010 года
- Lucide React иконки = премиум iOS 26
- Jobs + Perplexity философия = минимализм + профессионализм
- Telegram Wallet = эталон дизайна

**❌ НЕ ДЕЛАЙ ТАК:**
```html
<!-- В HTML (Shopify descriptionHtml) -->
<span class="text-xl">🏝️</span>  <!-- ❌ ДЕШЁВО! -->
<span class="text-xl">🚗</span>  <!-- ❌ НЕ ПРЕМИУМ! -->
<span class="text-xl">💱</span>  <!-- ❌ КАК В 2010! -->
```

```javascript
// В React компонентах
<div>🏝️ Туры</div>  // ❌ ДЕШЁВО!
<div>🚗 Аренда авто</div>  // ❌ НЕ ПРЕМИУМ!
```

**✅ ДЕЛАЙ ТАК:**
```javascript
// В React компонентах
import { Ship, Car, DollarSign } from "lucide-react";

<div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
    <Ship className="w-5 h-5 text-[#007AFF]" />  // ✅ ПРЕМИУМ!
  </div>
  <div>Туры</div>
</div>
```

**✅ В HTML (Shopify):**
```javascript
// НЕ ДОБАВЛЯЙ блоки с эмодзи в descriptionHtml!
// Используй отдельные React компоненты!

// Пример: PlaceDetail.tsx рендерит блок "Наши сервисы"
// с премиум иконками - НЕ дублируй в HTML!
```

**ПРАВИЛО:**
1. ❌ Удали ВСЕ эмодзи из React компонентов
2. ❌ НЕ добавляй эмодзи в Shopify HTML (`descriptionHtml`)
3. ✅ Используй Lucide React иконки ВЕЗДЕ
4. ✅ Единый дизайн: Категория + Детальные страницы + Сервисы

**ПРИМЕР ИЗ КАТЕГОРИИ "ТОРГОВЫЕ ЦЕНТРЫ":**
- ✅ Категория `/category/shopping` - премиум иконки
- ✅ Детальные страницы `/place/*` - премиум иконки  
- ✅ Сервисы `/services/*` - премиум иконки
- ✅ НИКАКИХ эмодзи нигде!

**ЧТО УДАЛИЛИ ИЗ СКРИПТА:**
```javascript
// ❌ УДАЛЁН блок "Планируете поездку?" с эмодзи
// Причина: есть отдельный React компонент с премиум иконками

// Было:
<h3>Планируете поездку?</h3>
<div>
  <a href="/phuket">🏝️ Туры</a>  // ❌ ДЕШЁВО!
  <a href="/services/car-rental">🚗 Аренда</a>  // ❌ ДЕШЁВО!
</div>

// Стало:
// PlaceDetail.tsx рендерит блок "Наши сервисы" с Lucide React иконками
// ✅ ПРЕМИУМ!
```

---

## 🎨 НОВЫЙ ДИЗАЙН БЛОКА "ОБЯЗАТЕЛЬНО ПОСЕТИТЕ!" (iOS 26)

### ⚠️ КРИТИЧЕСКИ ВАЖНО!

**29 октября 2025:** Блок "Обязательно посетите!" обновлён с желто-оранжевого на **iOS 26 премиум стиль**!

### ❌ СТАРЫЙ ДИЗАЙН (НЕ ИСПОЛЬЗУЙ!):
```html
<!-- УСТАРЕВШИЙ - Желто-оранжевый градиент -->
<div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 text-white">
  <div class="flex items-center gap-3 mb-3">
    <span class="text-2xl">⭐</span>
    <h3 class="text-lg font-bold">Обязательно посетите!</h3>
  </div>
  <div class="flex items-center gap-2">
    <span class="text-2xl">🐠</span>
    <div>
      <p class="font-semibold">Aquaria Phuket</p>
      <p class="text-yellow-100 text-sm">Крупнейший океанариум...</p>
    </div>
  </div>
</div>
```

**ПРОБЛЕМЫ:**
- ❌ Дешёвый желто-оранжевый градиент
- ❌ Белый текст плохо читается
- ❌ Не соответствует iOS 26
- ❌ Нет glassmorphism эффекта

### ✅ НОВЫЙ ДИЗАЙН (ИСПОЛЬЗУЙ ВЕЗДЕ!):
```html
<!-- iOS 26 Premium Style -->
<div class="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-200/50 shadow-sm">
  <!-- Glassmorphism Background -->
  <div class="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/20"></div>
  
  <div class="relative">
    <!-- Header with Icon -->
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
        <span class="text-white text-lg">⭐</span>
      </div>
      <h3 class="text-xl font-bold text-gray-900">Обязательно посетите!</h3>
    </div>
    
    <!-- Content Card -->
    <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 space-y-2">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🐠</span>
        <div>
          <p class="font-bold text-lg text-gray-900">Aquaria Phuket</p>
          <p class="text-gray-600 text-sm leading-relaxed">Крупнейший океанариум на острове — более 25,000 морских обитателей</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

**ПРЕИМУЩЕСТВА:**
- ✅ Премиум iOS 26 стиль
- ✅ Голубой градиент (#007AFF семейство)
- ✅ Glassmorphism эффект (`backdrop-blur-sm`)
- ✅ Читаемый тёмный текст на светлом фоне
- ✅ Профессиональные тени и borders
- ✅ Многослойная структура (слои глубины)

### 🎨 АНАТОМИЯ НОВОГО ДИЗАЙНА:

**Слой 1: Внешний контейнер**
```html
<div class="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-200/50 shadow-sm">
```
- `from-blue-500/10 to-purple-500/10` - лёгкий голубо-фиолетовый градиент (10% opacity)
- `rounded-2xl` - большие скруглённые углы (16px)
- `border-blue-200/50` - полупрозрачная граница

**Слой 2: Glassmorphism фон**
```html
<div class="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/20"></div>
```
- `from-white/40 via-transparent to-white/20` - "жидкое стекло" эффект
- Создаёт глубину и премиум вид

**Слой 3: Заголовок с иконкой**
```html
<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
  <span class="text-white text-lg">⭐</span>
</div>
<h3 class="text-xl font-bold text-gray-900">Обязательно посетите!</h3>
```
- Квадратная иконка 40x40px с градиентом
- Жирный заголовок `text-xl font-bold`
- Тёмный текст `text-gray-900` для читаемости

**Слой 4: Контент карточка**
```html
<div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 space-y-2">
```
- `bg-white/70` - полупрозрачный белый фон
- `backdrop-blur-sm` - размытие фона (glassmorphism)
- Контрастирует с внешним контейнером

### 📐 КЛЮЧЕВЫЕ ПАРАМЕТРЫ:

**Цвета:**
- Градиент фона: `from-blue-500/10 to-purple-500/10` (10% opacity)
- Граница: `border-blue-200/50` (50% opacity)
- Иконка: `from-blue-500 to-blue-600` (100% opacity)
- Контент фон: `bg-white/70` (70% opacity)
- Текст заголовка: `text-gray-900` (почти чёрный)
- Текст описания: `text-gray-600` (средне-серый)

**Размеры:**
- Padding внешний: `p-6` (24px)
- Padding контент: `p-4` (16px)
- Иконка: `w-10 h-10` (40x40px)
- Border radius внешний: `rounded-2xl` (16px)
- Border radius внутренний: `rounded-xl` (12px)

**Эффекты:**
- Shadow: `shadow-sm` (мягкая тень)
- Blur: `backdrop-blur-sm` (4px blur)
- Overflow: `overflow-hidden` (обрезать выступающие элементы)

### 🔄 КАК ОБНОВИТЬ СУЩЕСТВУЮЩИЕ КАТЕГОРИИ:

**Если у тебя уже есть категория с СТАРЫМ дизайном:**

1. **Открой мастер-скрипт:**
```bash
# Например для пляжей:
scripts/apply-telegram-style-to-all-beaches.cjs
```

2. **Найди блок Must-See:**
```javascript
// Найди строки с "from-yellow-400 to-orange-500"
```

3. **Замени ПОЛНОСТЬЮ на новый дизайн:**
```javascript
// Скопируй весь код из раздела "✅ НОВЫЙ ДИЗАЙН" выше
```

4. **Запусти скрипт:**
```bash
node scripts/apply-telegram-style-to-all-beaches.cjs
```

5. **Проверь результат:**
```bash
# Открой любое место категории
http://localhost:8080/place/[handle]
```

### ✅ ЧЕКЛИСТ ОБНОВЛЕНИЯ:

```markdown
- [ ] Нашёл мастер-скрипт категории
- [ ] Нашёл блок Must-See (ищи "yellow-400")
- [ ] Заменил на новый iOS 26 дизайн
- [ ] Сохранил файл
- [ ] Запустил скрипт
- [ ] Проверил в браузере
- [ ] Все места обновлены правильно
```

### 🎯 РЕЗУЛЬТАТ:

**До обновления:**
- Дешёвый желто-оранжевый блок
- Похож на старый дизайн 2010 года

**После обновления:**
- Премиум iOS 26 стиль
- Glassmorphism "жидкое стекло"
- Профессиональный и дорогой вид
- Соответствует Jobs + Perplexity философии

---

## 🎉 ЗАКЛЮЧЕНИЕ

**Ты готов создать категорию за 1 день!**

**Помни 3 вещи:**
1. 📖 **Phuket Insider** - источник данных
2. 🎨 **Telegram WebApp Style** - единый дизайн
3. ⚡ **Мастер-скрипт** - автоматизация

**Эта категория будет:**
- ✨ Красивой (iOS 26 дизайн)
- ⚡ Быстрой (< 2 сек загрузка)
- 💰 Конверсионной (туры, авто, валюта)
- 📱 Адаптивной (мобайл-first)
- 🔍 SEO-оптимизированной (органический трафик)

**Категория "Торговые центры" - твой ЭТАЛОН!**  
Используй её как референс для всех других категорий!

🚀 **Удачи в создании новых категорий!**  
💎 **Помни: каждая категория = ближе к $200M exit!**
