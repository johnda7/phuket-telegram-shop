# 🚀 МАСТЕР-ПЛАН: ГЛОБАЛЬНОЕ ОБНОВЛЕНИЕ САЙТА

> **Дата:** 29 октября 2025
> 
> **Цель:** Сделать фундамент ИДЕАЛЬНЫМ перед массовой миграцией из Phuket Insider
> 
> **Подход:** Perplexity AI + Steve Jobs + iOS 26 + Telegram Wallet

---

## 📊 EXECUTIVE SUMMARY

**ТЕКУЩИЙ СТАТУС:** 🟡 6/10

**ЦЕЛЬ:** 🟢 10/10 - ИДЕАЛЬНЫЙ ФУНДАМЕНТ

**TIMELINE:** 5-7 дней до начала массовой миграции

**PRIORITY:** 🔥 КРИТИЧНО - без этого масштабирование невозможно!

---

## 🎯 3 ФАЗЫ ОБНОВЛЕНИЯ

```
ФАЗА 1: КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ (1-2 дня)
├── Динамические фильтры
├── Единый Design System
└── Telegram Wallet стиль везде

ФАЗА 2: PERFORMANCE + SEO (2-3 дня)
├── Web Vitals tracking
├── Lazy loading
├── Structured Data
└── Open Graph

ФАЗА 3: UX + ДОКУМЕНТАЦИЯ (2 дня)
├── Share кнопки
├── Счётчики
└── Обновление документации

═══════════════════════════════
ИТОГО: 5-7 ДНЕЙ → ✅ ГОТОВО!
```

---

## 🔥 ФАЗА 1: КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ

### 📋 TASK 1.1: ДИНАМИЧЕСКИЕ ФИЛЬТРЫ

**File:** `src/pages/CategoryPageDynamic.tsx`

**Проблема:**
```typescript
// ❌ ХАРДКОД - не масштабируется!
<button onClick={() => setSelectedDistrict("Patong")}>Патонг</button>
<button onClick={() => setSelectedDistrict("Karon")}>Карон</button>
<button onClick={() => setSelectedDistrict("Chalong")}>Чалонг</button>
// Для аквапарков нужны ДРУГИЕ районы!
```

**Решение:**
```typescript
// ✅ ДИНАМИКА - работает для ВСЕХ категорий!
const districts = useMemo(() => {
  const districtSet = new Set<string>();
  products.forEach(product => {
    const districtTag = product.node.tags.find(tag => tag.startsWith('district:'));
    if (districtTag) {
      districtSet.add(districtTag.replace('district:', ''));
    }
  });
  return ['all', ...Array.from(districtSet).sort()];
}, [products]);

// Перевод на русский
const districtTranslations: Record<string, string> = {
  'all': 'Все районы',
  'Patong': 'Патонг',
  'Karon': 'Карон',
  'Kata': 'Ката',
  'Kathu': 'Кату',
  'Thalang': 'Тхаланг',
  'Chalong': 'Чалонг',
  'Rawai': 'Равай',
  'Cherngtalay': 'Чернгталай',
  'PhuketTown': 'Пхукет Таун'
};

// Рендер
{districts.map(district => (
  <button
    key={district}
    onClick={() => setSelectedDistrict(district)}
    className={selectedDistrict === district ? "active" : ""}
  >
    {districtTranslations[district] || district}
  </button>
))}
```

**Время:** 2 часа  
**Impact:** HIGH (без этого масштабирование невозможно!)  
**Status:** 🔴 BLOCKER

---

### 📋 TASK 1.2: ДИНАМИЧЕСКАЯ СТАТИСТИКА

**File:** `src/pages/CategoryPageDynamic.tsx`

**Проблема:**
```typescript
// ❌ ХАРДКОД
<span>от 4.2 до 4.7</span>
```

**Решение:**
```typescript
// ✅ ДИНАМИКА
const { minRating, maxRating } = useMemo(() => {
  const ratings = products
    .map(p => parseFloat(p.node.metafields?.find(m => m.key === 'rating')?.value || '0'))
    .filter(r => r > 0);
  
  if (ratings.length === 0) return { minRating: 0, maxRating: 0 };
  
  return {
    minRating: Math.min(...ratings),
    maxRating: Math.max(...ratings)
  };
}, [products]);

<span>
  {minRating > 0 ? `от ${minRating.toFixed(1)} до ${maxRating.toFixed(1)}` : 'Нет рейтингов'}
</span>
```

**Время:** 1 час  
**Impact:** MEDIUM  
**Status:** 🟡 ВАЖНО

---

### 📋 TASK 1.3: ЕДИНЫЙ DESIGN SYSTEM

**New File:** `src/styles/design-system.ts`

**Создать:**
```typescript
export const DesignSystem = {
  // Цвета (ТОЛЬКО #007AFF для интерактива!)
  colors: {
    primary: '#007AFF',     // iOS Blue
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    }
  },
  
  // Spacing (8px базовая сетка)
  spacing: {
    xs: '0.5rem',  // 8px
    sm: '0.75rem', // 12px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    '2xl': '3rem', // 48px
  },
  
  // Border Radius (iOS 26 style)
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  
  // Shadows (мягкие тени)
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.08)',
    elevated: '0 8px 30px rgba(0,0,0,0.12)',
    none: 'none',
  },
  
  // Typography
  typography: {
    h1: 'text-2xl font-bold leading-tight',
    h2: 'text-xl font-semibold leading-tight',
    h3: 'text-lg font-semibold leading-snug',
    body: 'text-base leading-relaxed',
    caption: 'text-sm text-gray-500 leading-normal',
    tiny: 'text-xs text-gray-400',
  },
  
  // Components (готовые стили)
  components: {
    button: {
      primary: 'bg-[#007AFF] text-white h-11 px-6 rounded-xl font-semibold hover:bg-[#0051D5] active:bg-[#003D99] transition-colors',
      secondary: 'bg-gray-100 text-gray-900 h-11 px-6 rounded-xl font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors',
      ghost: 'text-[#007AFF] h-11 px-6 rounded-xl font-semibold hover:bg-blue-50 active:bg-blue-100 transition-colors',
    },
    
    card: {
      default: 'bg-white rounded-2xl p-4 shadow-card border border-gray-100',
      glass: 'bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-card border border-gray-100',
      elevated: 'bg-white rounded-2xl p-6 shadow-elevated border border-gray-100',
    },
    
    input: {
      default: 'h-11 px-4 rounded-xl border border-gray-200 focus:border-[#007AFF] focus:ring-2 focus:ring-blue-50 transition-colors',
    },
    
    badge: {
      default: 'px-2 py-1 rounded-lg text-xs font-medium',
      primary: 'bg-blue-50 text-[#007AFF]',
      success: 'bg-green-50 text-green-600',
      warning: 'bg-orange-50 text-orange-600',
      danger: 'bg-red-50 text-red-600',
    },
  },
  
  // Touch Targets (минимум 44px!)
  touchTarget: {
    min: '44px',  // iOS HIG minimum
  },
};

// Helper функции
export const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};
```

**Использование:**
```typescript
import { DesignSystem, cn } from '@/styles/design-system';

// Кнопка
<button className={DesignSystem.components.button.primary}>
  Забронировать
</button>

// Карточка
<div className={DesignSystem.components.card.glass}>
  Content
</div>

// С динамическими классами
<div className={cn(
  DesignSystem.components.card.default,
  isActive && 'border-[#007AFF]'
)}>
  Content
</div>
```

**Время:** 3 часа  
**Impact:** HIGH (consistency across всего сайта)  
**Status:** 🔴 BLOCKER

---

### 📋 TASK 1.4: TELEGRAM WALLET СТИЛЬ ВЕЗДЕ

**Files:**
- `src/pages/Index.tsx`
- `src/pages/Phuket.tsx`
- `src/pages/Categories.tsx`
- `src/components/BottomNav.tsx`

**Чеклист для КАЖДОЙ страницы:**
```
[ ] Все иконки = Lucide React (НЕ эмодзи!)
[ ] Все интерактивные элементы = #007AFF
[ ] Все карточки в Telegram Wallet стиле (white/glass + shadow)
[ ] Все кнопки используют DesignSystem.components.button
[ ] Touch targets >= 44px
[ ] Glassmorphism для важных блоков
[ ] Компактный layout (нет лишнего whitespace)
[ ] "Наши сервисы" (4 блока) везде
```

**Время:** 4 часа  
**Impact:** HIGH (brand consistency)  
**Status:** 🔴 BLOCKER

---

## ⚡ ФАЗА 2: PERFORMANCE + SEO

### 📋 TASK 2.1: WEB VITALS TRACKING

**New File:** `src/lib/webVitals.ts`

```typescript
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  onCLS((metric) => {
    console.log('CLS:', metric.value);
    // TODO: отправлять в analytics
  });
  
  onFID((metric) => {
    console.log('FID:', metric.value);
  });
  
  onLCP((metric) => {
    console.log('LCP:', metric.value);
  });
  
  onFCP((metric) => {
    console.log('FCP:', metric.value);
  });
  
  onTTFB((metric) => {
    console.log('TTFB:', metric.value);
  });
}
```

**В `src/main.tsx`:**
```typescript
import { reportWebVitals } from './lib/webVitals';

// After render
reportWebVitals();
```

**Время:** 2 часа  
**Impact:** HIGH (metrics = improvement)  
**Status:** 🟡 ВАЖНО

---

### 📋 TASK 2.2: LAZY LOADING ИЗОБРАЖЕНИЙ

**В ВСЕХ компонентах:**
```typescript
// ❌ БЫЛО:
<img src={url} alt={alt} />

// ✅ СТАЛО:
<img 
  src={url} 
  alt={alt} 
  loading="lazy" 
  decoding="async"
  className="w-full h-full object-cover"
/>
```

**Время:** 2 часа  
**Impact:** MEDIUM (speed)  
**Status:** 🟡 ВАЖНО

---

### 📋 TASK 2.3: STRUCTURED DATA (schema.org)

**New File:** `src/lib/structuredData.ts`

```typescript
export function generatePlaceSchema(place: any) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": place.title,
    "description": place.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": place.district,
      "addressRegion": "Phuket",
      "addressCountry": "TH"
    },
    "aggregateRating": place.rating ? {
      "@type": "AggregateRating",
      "ratingValue": place.rating,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "geo": place.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": place.coordinates.split(',')[0],
      "longitude": place.coordinates.split(',')[1]
    } : undefined,
    "image": place.image,
    "url": window.location.href
  };
}

export function generateTourSchema(tour: any) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.description,
    "provider": {
      "@type": "Organization",
      "name": "PhuketDa"
    },
    "offers": {
      "@type": "Offer",
      "price": tour.price,
      "priceCurrency": "THB",
      "availability": "https://schema.org/InStock"
    },
    "duration": tour.duration,
    "url": window.location.href
  };
}
```

**Использование в PlaceDetail.tsx:**
```tsx
import { generatePlaceSchema } from '@/lib/structuredData';

<Helmet>
  <script type="application/ld+json">
    {JSON.stringify(generatePlaceSchema(place))}
  </script>
</Helmet>
```

**Время:** 4 часа  
**Impact:** HIGH (SEO)  
**Status:** 🟡 ВАЖНО

---

### 📋 TASK 2.4: OPEN GRAPH + TWITTER CARDS

**В PlaceDetail.tsx, ProductDetail.tsx:**
```tsx
<Helmet>
  {/* Primary Meta Tags */}
  <title>{place.title} | PhuketDa</title>
  <meta name="title" content={place.title} />
  <meta name="description" content={place.description} />
  
  {/* Open Graph / Facebook */}
  <meta property="og:type" content="website" />
  <meta property="og:url" content={window.location.href} />
  <meta property="og:title" content={place.title} />
  <meta property="og:description" content={place.description} />
  <meta property="og:image" content={place.image} />
  
  {/* Twitter */}
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={window.location.href} />
  <meta property="twitter:title" content={place.title} />
  <meta property="twitter:description" content={place.description} />
  <meta property="twitter:image" content={place.image} />
</Helmet>
```

**Время:** 2 часа  
**Impact:** MEDIUM (sharing)  
**Status:** 🟢 NICE TO HAVE

---

## ✨ ФАЗА 3: UX + ДОКУМЕНТАЦИЯ

### 📋 TASK 3.1: TELEGRAM NATIVE SHARE

**New Component:** `src/components/ShareButton.tsx`

```tsx
import { Share2 } from 'lucide-react';
import { DesignSystem } from '@/styles/design-system';

export function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = async () => {
    // Telegram WebApp native share
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url);
    } else if (navigator.share) {
      // Web Share API fallback
      await navigator.share({ title, url });
    } else {
      // Copy to clipboard fallback
      await navigator.clipboard.writeText(url);
      alert('Ссылка скопирована!');
    }
  };
  
  return (
    <button
      onClick={handleShare}
      className={DesignSystem.components.button.ghost}
    >
      <Share2 className="w-5 h-5 mr-2" />
      Поделиться
    </button>
  );
}
```

**Время:** 2 часа  
**Impact:** MEDIUM (viral)  
**Status:** 🟢 NICE TO HAVE

---

### 📋 TASK 3.2: СЧЁТЧИКИ В ФИЛЬТРАХ

**В CategoryPageDynamic.tsx:**
```typescript
const getDistrictCount = (district: string) => {
  if (district === 'all') return filteredProducts.length;
  return products.filter(p => 
    p.node.tags.some(t => t === `district:${district}`)
  ).length;
};

// Рендер
<button>
  {districtTranslations[district] || district}
  <span className="ml-1 text-xs text-gray-400">
    ({getDistrictCount(district)})
  </span>
</button>
```

**Время:** 1 час  
**Impact:** LOW (UX)  
**Status:** 🟢 NICE TO HAVE

---

### 📋 TASK 3.3: ОБНОВЛЕНИЕ ДОКУМЕНТАЦИИ

**Files:**
- `AGENTS.md`
- `.shopify/CATEGORY_MASTER_GUIDE.md`
- `DESIGN_SYSTEM.md` (новый)

**Что обновить:**

**1. AGENTS.md:**
```markdown
## 🚨 КРИТИЧЕСКИЕ ПРАВИЛА:

1. ❌ НИКАКИХ статических массивов в src/data/
2. ✅ ВСЁ через Shopify API (динамика)
3. ✅ 4 СЕРВИСА везде (Туры, Авто, Валюта, НЕДВИЖИМОСТЬ)
4. ✅ Design System (src/styles/design-system.ts)
5. ✅ Lucide React иконки (НЕ эмодзи!)
6. ✅ #007AFF для ВСЕХ интерактивных элементов
7. ✅ Telegram Wallet стиль ВЕЗДЕ
```

**2. CATEGORY_MASTER_GUIDE.md:**
```markdown
## 📋 ПРОЦЕСС СОЗДАНИЯ КАТЕГОРИИ:

1. Изучить Phuket Insider категорию
2. Создать config в CategoryPageDynamic.tsx
3. Проверить что динамические фильтры работают
4. Создать эталонную карточку (лучшее место)
5. Собрать данные для всех мест
6. Мастер-скрипт для массового заполнения
```

**3. DESIGN_SYSTEM.md (новый):**
```markdown
# 🎨 DESIGN SYSTEM - PhuketDa

## Философия:

- Perplexity AI минимализм
- Steve Jobs перфекционизм
- iOS 26 нативность
- Telegram Wallet стиль

## Использование:

import { DesignSystem } from '@/styles/design-system';

// ... примеры ...
```

**Время:** 4 часа  
**Impact:** HIGH (для будущих агентов)  
**Status:** 🟡 ВАЖНО

---

## 📊 TIMELINE & PRIORITIES

### НЕДЕЛЯ 1 (Days 1-2): КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ

**Day 1:**
- [x] ✅ Аудит завершён
- [ ] 🔴 Динамические фильтры (2 hours)
- [ ] 🔴 Динамическая статистика (1 hour)
- [ ] 🔴 Design System создан (3 hours)

**Day 2:**
- [ ] 🔴 Telegram Wallet стиль везде (4 hours)
- [ ] 🟡 Проверка всех страниц (2 hours)

---

### НЕДЕЛЯ 1 (Days 3-5): PERFORMANCE + SEO

**Day 3:**
- [ ] 🟡 Web Vitals tracking (2 hours)
- [ ] 🟡 Lazy loading (2 hours)
- [ ] 🟡 Structured Data (4 hours)

**Day 4-5:**
- [ ] 🟢 Open Graph (2 hours)
- [ ] 🟢 Sitemap.xml (1 hour)
- [ ] 🟢 robots.txt (0.5 hour)

---

### НЕДЕЛЯ 2 (Days 6-7): UX + DOCS

**Day 6:**
- [ ] 🟢 Share buttons (2 hours)
- [ ] 🟢 Счётчики (1 hour)

**Day 7:**
- [ ] 🟡 Обновление документации (4 hours)
- [ ] ✅ Финальная проверка
- [ ] ✅ ✅ ГОТОВО К МИГРАЦИИ!

---

## ✅ DEFINITION OF DONE

**КРИТЕРИИ ГОТОВНОСТИ К МАССОВОЙ МИГРАЦИИ:**

### Технические:
- [ ] Динамические фильтры работают для ЛЮБОЙ категории
- [ ] Динамическая статистика работает
- [ ] Design System используется везде
- [ ] Performance < 2 сек (Lighthouse 90+)
- [ ] SEO: structured data + Open Graph

### Дизайн:
- [ ] ВСЕ страницы в Telegram Wallet стиле
- [ ] ВСЕ иконки = Lucide React
- [ ] ВСЕ интерактивные = #007AFF
- [ ] ВСЕ карточки в едином стиле
- [ ] Touch targets >= 44px

### Контент:
- [ ] 4 сервиса на КАЖДОЙ странице
- [ ] ДА БОТ виджет везде
- [ ] Breadcrumbs динамические
- [ ] "Наши сервисы" блок везде

### Документация:
- [ ] AGENTS.md обновлён
- [ ] CATEGORY_MASTER_GUIDE.md обновлён
- [ ] DESIGN_SYSTEM.md создан

---

## 🎯 SUCCESS METRICS

**ПОСЛЕ ВСЕХ ИСПРАВЛЕНИЙ:**

```
Performance:
✅ Lighthouse Score: 90+
✅ First Contentful Paint: < 1.2s
✅ Time to Interactive: < 2.5s
✅ Cumulative Layout Shift: < 0.1

SEO:
✅ Core Web Vitals: все Green
✅ Structured Data: валидный
✅ Mobile-Friendly: 100/100

Design:
✅ Telegram Wallet стиль: 100%
✅ Lucide иконки: 100%
✅ #007AFF: 100%
✅ Touch targets: >= 44px

Business:
✅ Фундамент готов к масштабированию
✅ Можно добавлять 100+ категорий без проблем
✅ Consistency across весь сайт
```

---

## 🚀 NEXT STEPS

**СРАЗУ ПОСЛЕ ГОТОВНОСТИ:**

1. ✅ Начать миграцию из Phuket Insider
2. ✅ Категория за категорией (10-20 мест каждая)
3. ✅ Использовать мастер-скрипты для скорости
4. ✅ Масштабироваться без технических проблем

**ПОМНИ:**

```
"Measure twice, cut once"

Сейчас мы measure (улучшаем фундамент)
Потом cut (массовая миграция)

Если сейчас не сделать правильно,
придётся переделывать 100+ категорий!
```

---

**СТАТУС:** 📋 ПЛАН ГОТОВ → НАЧИНАЕМ РЕАЛИЗАЦИЮ!

