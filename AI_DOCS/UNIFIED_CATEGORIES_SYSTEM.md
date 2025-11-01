# 🗂️ ЕДИНАЯ ЦЕНТРАЛИЗОВАННАЯ СИСТЕМА КАТЕГОРИЙ

> **Дата создания:** November 1, 2025  
> **Версия:** 1.0  
> **Статус:** ✅ РАБОТАЕТ

---

## 🎯 КОНЦЕПЦИЯ

**ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ:** Все категории (26 штук) централизованы в `src/config/categories.ts`

**АВТОМАТИЧЕСКАЯ ИНТЕГРАЦИЯ:** Все страницы автоматически используют `getAllCategories()` - добавление новой категории = автоматическое появление везде!

---

## 📊 АРХИТЕКТУРА

```
┌─────────────────────────────────────────────────────────────┐
│  src/config/categories.ts  (ЕДИНЫЙ ИСТОЧНИК)              │
│  ───────────────────────────────────────────────────────  │
│  export const CATEGORIES: Record<string, CategoryConfig>  │
│  export function getAllCategories()                        │
│  export function getCategoryConfig(id: string)             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ getAllCategories()
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Categories   │    │   Map.tsx    │    │ CategoryPage │
│   .tsx       │    │              │    │ Dynamic.tsx  │
│              │    │              │    │              │
│ ✅ Все 26   │    │ ✅ Все 26    │    │ ✅ Карта +   │
│ категорий    │    │ в скролле +  │    │ категория    │
│              │    │ меню "Еще"   │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## ✅ ГДЕ ИСПОЛЬЗУЕТСЯ

### 1. **Map.tsx** (Карта путешественника)
- **Горизонтальный скролл:** Все 26 категорий
- **Выпадающее меню "Еще":** Все 26 категорий
- **Источник:** `getAllCategories()` → автоматически все категории

**Код:**
```typescript
const allCategories = useMemo(() => {
  return [
    { id: "all", label: "Все места", emoji: "🗺️" },
    ...getAllCategories().map((cat: CategoryConfig) => ({
      id: cat.id,
      label: cat.title.replace('Пхукета', '').trim(),
      emoji: categoryEmojiMap[cat.id] || '📍'
    }))
  ];
}, []);
```

### 2. **Categories.tsx** (Страница всех категорий)
- **Grid карточек:** Все 26 категорий
- **Сортировка:** По приоритету (high → medium → low)
- **Источник:** `getAllCategories()` → автоматически все категории

**Код:**
```typescript
const allCategories = useMemo(() => {
  return getAllCategories().map((cat: CategoryConfig) => ({
    id: cat.id,
    label: cat.title.replace('Пхукета', '').trim(),
    icon: cat.icon,
    path: `/category/${cat.id}`,
    color: getColorFromIconColor(cat.iconColor),
    priority: cat.priority
  }));
}, []);
```

### 3. **CategoryPageDynamic.tsx** (Динамическая страница категории)
- **Фильтры районов:** Автоматически из тегов продуктов
- **Встроенная карта:** Все места категории на карте (как у phuket-insider.com)
- **Источник:** `getCategoryConfig(categoryId)` → конфиг конкретной категории

**Фичи:**
- ✅ Встроенная мини-карта (400px высота)
- ✅ Фильтр по районам работает на карте
- ✅ Ссылка "Открыть в полном режиме" → `/map?category=${categoryId}`
- ✅ Автоматическое извлечение координат из Shopify + fallback

---

## 🗺️ ИНТЕГРАЦИЯ КАРТЫ

### На странице Map.tsx:
- ✅ Полноэкранная карта
- ✅ Фильтры категорий (горизонтальный скролл + меню "Еще")
- ✅ Все 26 категорий доступны

### На странице CategoryPageDynamic.tsx:
- ✅ Встроенная мини-карта (400px)
- ✅ Показывает только места текущей категории
- ✅ Фильтр по районам работает на карте
- ✅ Клик на маркер → переход на `/place/${handle}`
- ✅ Ссылка на полную карту → `/map?category=${categoryId}`

**Преимущество над phuket-insider.com:**
- ❌ У них: только статическая карта Google Maps (не интерактивная)
- ✅ У нас: интерактивная Leaflet карта с маркерами из Shopify!

---

## 📝 ДОБАВЛЕНИЕ НОВОЙ КАТЕГОРИИ

### Шаг 1: Добавить в `src/config/categories.ts`
```typescript
export const CATEGORIES: Record<string, CategoryConfig> = {
  // ... существующие категории ...
  
  newCategory: {
    id: 'newCategory',
    title: 'Новая категория Пхукета',
    // ... все поля CategoryConfig
  }
};
```

### Шаг 2: Автоматически появляется везде!
- ✅ `/categories` - в списке категорий
- ✅ `/map` - в скролле и меню "Еще"
- ✅ `/category/newCategory` - работает автоматически
- ✅ Карта на странице категории - автоматически

**НИКАКИХ ДРУГИХ ИЗМЕНЕНИЙ НЕ НУЖНО!** 🎉

---

## 🔄 СИНХРОНИЗАЦИЯ

### Все страницы используют:
1. **getAllCategories()** - для списков всех категорий
2. **getCategoryConfig(id)** - для конфига конкретной категории
3. **categoryExists(id)** - для проверки существования

### Маппинг эмодзи (централизованный):
```typescript
const categoryEmojiMap: Record<string, string> = {
  beaches: '🏖️', temples: '🛕', viewpoints: '⛰️',
  restaurants: '🍽️', nightlife: '🌙', spa: '💆', elephants: '🐘',
  shopping: '🛍️', aquaparks: '💦', museums: '🏛️', nightmarkets: '🌃',
  waterfalls: '💧', districts: '📍', excursions: '🚤', attractions: '🎯',
  amusement: '🎪', diving: '🤿', fishing: '🎣', yachts: '⛵',
  zoos: '🦁', clubs: '🎉', bars: '🍻', events: '📅',
  massage: '💆‍♀️', sauna: '🧖', coffee: '☕'
};
```

---

## 🎨 ДИЗАЙН СИСТЕМА

### Единый стиль фильтров (как в Map.tsx и CategoryPageDynamic.tsx):
```typescript
className={cn(
  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex-shrink-0",
  selected
    ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20"
    : "bg-white/90 text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-200/60"
)}
style={{
  backdropFilter: selected ? 'none' : 'blur(20px)',
  WebkitBackdropFilter: selected ? 'none' : 'blur(20px)',
}}
```

---

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ

### ✅ Реализовано:
- [x] Все 26 категорий в `/categories`
- [x] Все 26 категорий в `/map` (скролл + меню "Еще")
- [x] Встроенная карта на страницах категорий
- [x] Единый источник данных (`getAllCategories()`)
- [x] Единый дизайн фильтров

### 🔄 В процессе:
- [ ] Централизовать маппинг эмодзи (сейчас дублируется)
- [ ] Добавить эмодзи в `CategoryConfig` (сейчас только иконка Lucide)

### 📋 Планируется:
- [ ] Кластеризация маркеров на карте (для большого количества мест)
- [ ] Поиск по категориям на карте
- [ ] Сохранение выбранной категории в URL (для шаринга)

---

## 🚀 ПРЕИМУЩЕСТВА

### vs phuket-insider.com:
1. ✅ **Единый источник данных** - добавил категорию → автоматически везде
2. ✅ **Интерактивная карта** - у них статическая Google Maps, у нас Leaflet с маркерами
3. ✅ **Telegram WebApp** - оптимизировано для мобильных устройств
4. ✅ **Динамические фильтры** - районы генерируются из данных, не хардкод

### vs старый подход (хардкод):
- ❌ **Было:** Каждая страница имела свой список категорий
- ✅ **Стало:** Один конфиг → все страницы обновляются автоматически

---

## 📖 ИСПОЛЬЗОВАНИЕ

### Для разработчика:
```typescript
import { getAllCategories, getCategoryConfig } from '@/config/categories';

// Получить все категории
const allCats = getAllCategories(); // 26 категорий

// Получить конфиг категории
const config = getCategoryConfig('shopping');

// Проверить существование
if (categoryExists('beaches')) {
  // ...
}
```

### Для добавления новой категории:
1. Открыть `src/config/categories.ts`
2. Добавить в `CATEGORIES` новый объект
3. **ВСЁ!** Автоматически появится везде

---

## 🎯 ПРИНЦИПЫ

1. **DRY (Don't Repeat Yourself)** - категории в одном месте
2. **Single Source of Truth** - только `categories.ts`
3. **Automation** - добавление = автоматическое появление везде
4. **Type Safety** - TypeScript типизация везде
5. **Perplexity Minimalism** - меньше кода = меньше багов

---

**Last Updated:** November 1, 2025  
**Maintained by:** AI Agents Team

