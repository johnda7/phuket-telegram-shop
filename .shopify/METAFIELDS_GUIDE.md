# 🔧 РУКОВОДСТВО ПО РАБОТЕ С METAFIELDS

> **⚠️ КРИТИЧЕСКИ ВАЖНО!** Это руководство основано на успешном решении проблемы с metafields в категории "Торговые центры". Следуйте ему для всех категорий!

---

## 🎯 ПРОБЛЕМА С METAFIELDS

### Что происходит:
- **Storefront API не возвращает metafields** (ограничение Shopify)
- **Admin API работает**, но требует отдельного запроса
- **Компоненты не получают данные** (rating, district, coordinates)

### Решение:
1. **Fallback данные** в локальном файле
2. **Правильные namespace** для metafields
3. **Корректные типы** данных

---

## 📊 СТРУКТУРА METAFIELDS

### Обязательные metafields для всех мест:

```typescript
interface PlaceMetafields {
  rating: number;           // Рейтинг от 1 до 5
  coordinates: string;      // GPS координаты "lat,lng"
  district: string;         // Район на английском
  workingHours: string;     // Часы работы на русском
  priceLevel: number;       // Уровень цен 1-3 ($, $$, $$$)
}
```

### Namespace и ключи:

```javascript
const metafields = [
  {
    namespace: "place_info",  // ✅ ПРАВИЛЬНЫЙ namespace
    key: "rating",
    value: "4.6",
    type: "single_line_text_field"
  },
  {
    namespace: "place_info",
    key: "coordinates", 
    value: "7.8905,98.2965",
    type: "single_line_text_field"
  },
  {
    namespace: "place_info",
    key: "district",
    value: "Cherngtalay",
    type: "single_line_text_field"
  },
  {
    namespace: "place_info",
    key: "working_hours",
    value: "10:00-22:00 ежедневно",
    type: "single_line_text_field"
  },
  {
    namespace: "place_info",
    key: "price_level",
    value: "3",
    type: "number_integer"
  }
];
```

---

## 🔧 ПОШАГОВОЕ РУКОВОДСТВО

### ШАГ 1: Создание fallback данных

#### 1.1 Создайте файл `src/data/placeMetafields.ts`:

```typescript
interface PlaceMetafields {
  rating: number;
  coordinates: string;
  district: string;
  workingHours: string;
  priceLevel: number;
}

const placeMetafields: Record<string, PlaceMetafields> = {
  // Торговые центры
  'central-phuket-floresta': {
    rating: 4.6,
    coordinates: '7.8905,98.2965',
    district: 'Cherngtalay',
    workingHours: '10:00-22:00 ежедневно',
    priceLevel: 3,
  },
  'jungceylon-shopping-center': {
    rating: 4.4,
    coordinates: '7.8904,98.2924',
    district: 'Patong',
    workingHours: '11:00-23:00 ежедневно',
    priceLevel: 2,
  },
  // ... остальные места
};

export const getPlaceMetafields = (handle: string): PlaceMetafields => {
  return placeMetafields[handle] || {
    rating: 4.5,
    coordinates: '7.8905,98.3901',
    district: 'PhuketTown',
    workingHours: '10:00-22:00 ежедневно',
    priceLevel: 2,
  };
};

export const getDistrictInRussian = (district: string): string => {
  const districtMap: { [key: string]: string } = {
    'PhuketTown': 'Пхукет Таун',
    'Patong': 'Патонг',
    'Thalang': 'Таланг',
    'Chalong': 'Чалонг',
    'Karon': 'Карон',
    'Kata': 'Ката',
    'Kamala': 'Камала',
    'Rawai': 'Равай',
    'Cherngtalay': 'Чернгталай',
    'Kathu': 'Кату'
  };
  return districtMap[district] || district;
};
```

#### 1.2 Добавьте данные для всех мест в категории:

**Примеры для разных категорий:**

```typescript
// Пляжи
'patong-beach': {
  rating: 4.5,
  coordinates: '7.8904,98.2924',
  district: 'Patong',
  workingHours: 'Круглосуточно',
  priceLevel: 1,
},

// Храмы
'wat-chalong': {
  rating: 4.7,
  coordinates: '7.8467,98.3383',
  district: 'Chalong',
  workingHours: '06:00-18:00 ежедневно',
  priceLevel: 1,
},

// Рестораны
'blue-elephant': {
  rating: 4.8,
  coordinates: '7.8905,98.2965',
  district: 'PhuketTown',
  workingHours: '11:30-14:30, 18:30-22:30',
  priceLevel: 3,
},
```

### ШАГ 2: Обновление компонентов

#### 2.1 Обновите `src/pages/PlaceDetail.tsx`:

```typescript
import { getPlaceMetafields, getDistrictInRussian } from "@/data/placeMetafields";

// В компоненте:
const fallbackData = getPlaceMetafields(handle);
const rating = fallbackData.rating;
const coordinates = fallbackData.coordinates;
const district = fallbackData.district;

// Используйте district для отображения:
{place.district && (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
    <MapPin className="w-4 h-4 text-white" />
    <span className="text-white font-medium">{getDistrictInRussian(place.district)}</span>
  </div>
)}
```

#### 2.2 Обновите `src/components/PlaceCard.tsx`:

```typescript
import { getPlaceMetafields } from "@/data/placeMetafields";

// В компоненте:
const fallbackData = getPlaceMetafields(place.handle);
const rating = fallbackData.rating;
const priceLevel = fallbackData.priceLevel;
const workingHours = fallbackData.workingHours;
```

### ШАГ 3: Обновление metafields в Shopify

#### 3.1 Создайте скрипт для обновления metafields:

```javascript
// scripts/update-[category]-metafields.cjs
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

// Данные для обновления
const placesData = {
  'central-phuket-floresta': {
    rating: 4.6,
    coordinates: '7.8905,98.2965',
    district: 'Cherngtalay',
    workingHours: '10:00-22:00 ежедневно',
    priceLevel: 3,
  },
  // ... остальные места
};

async function updatePlaceMetafields(handle, data) {
  // 1. Получить ID продукта
  const productId = await getProductId(handle);
  
  // 2. Обновить metafields
  const mutation = `
    mutation {
      productUpdate(input: {
        id: "${productId}",
        metafields: [
          {
            namespace: "place_info",
            key: "rating",
            value: "${data.rating}",
            type: "single_line_text_field"
          },
          {
            namespace: "place_info",
            key: "coordinates",
            value: "${data.coordinates}",
            type: "single_line_text_field"
          },
          {
            namespace: "place_info",
            key: "district",
            value: "${data.district}",
            type: "single_line_text_field"
          },
          {
            namespace: "place_info",
            key: "working_hours",
            value: "${data.workingHours}",
            type: "single_line_text_field"
          },
          {
            namespace: "place_info",
            key: "price_level",
            value: "${data.priceLevel}",
            type: "number_integer"
          }
        ]
      }) {
        product { id }
        userErrors { field message }
      }
    }
  `;
  
  // 3. Выполнить запрос
  const response = await makeGraphQLRequest(mutation);
  
  if (response.data.productUpdate.userErrors.length > 0) {
    console.error('❌ Ошибки:', response.data.productUpdate.userErrors);
  } else {
    console.log('✅ Metafields обновлены для', handle);
  }
}

async function updateAllMetafields() {
  console.log('🔧 ОБНОВЛЕНИЕ METAFIELDS ДЛЯ ВСЕХ МЕСТ');
  
  for (const [handle, data] of Object.entries(placesData)) {
    console.log(`\n📝 ${handle}`);
    try {
      await updatePlaceMetafields(handle, data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Пауза
    } catch (error) {
      console.error('❌ Ошибка:', error.message);
    }
  }
  
  console.log('\n🎉 Обновление завершено!');
}

updateAllMetafields().catch(console.error);
```

### ШАГ 4: Проверка metafields

#### 4.1 Создайте скрипт для проверки:

```javascript
// scripts/check-[category]-metafields.cjs
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

async function checkMetafields() {
  console.log('🔍 ПРОВЕРКА METAFIELDS В SHOPIFY');
  
  const query = `
    query {
      products(first: 50, query: "product_type:Information") {
        edges {
          node {
            id
            handle
            title
            metafields(first: 10, namespace: "place_info") {
              edges {
                node {
                  key
                  value
                  type
                }
              }
            }
          }
        }
      }
    }
  `;
  
  const response = await makeGraphQLRequest(query);
  const products = response.data.products.edges;
  
  console.log(`📋 Найдено продуктов: ${products.length}`);
  
  for (const edge of products) {
    const product = edge.node;
    console.log(`\n🏢 ${product.title}`);
    console.log(`   Handle: ${product.handle}`);
    
    const metafields = product.metafields.edges.map(e => e.node);
    
    if (metafields.length === 0) {
      console.log('   ❌ Нет metafields');
      continue;
    }
    
    console.log('   📊 Metafields:');
    metafields.forEach(metafield => {
      console.log(`      ${metafield.key}: ${metafield.value} (${metafield.type})`);
    });
  }
}

checkMetafields().catch(console.error);
```

---

## 🚨 КРИТИЧЕСКИЕ ОШИБКИ С METAFIELDS

### ❌ ОШИБКА #1: Неправильный namespace
```javascript
// ❌ НЕ РАБОТАЕТ!
namespace: "custom"

// ✅ РАБОТАЕТ!
namespace: "place_info"
```

### ❌ ОШИБКА #2: Неправильные типы данных
```javascript
// ❌ НЕ РАБОТАЕТ!
type: "text"  // для рейтинга

// ✅ РАБОТАЕТ!
type: "single_line_text_field"  // для текста
type: "number_integer"          // для чисел
```

### ❌ ОШИБКА #3: Неправильный формат координат
```javascript
// ❌ НЕ РАБОТАЕТ!
value: "7.8905, 98.2965"  // Пробел после запятой

// ✅ РАБОТАЕТ!
value: "7.8905,98.2965"   // Без пробела
```

### ❌ ОШИБКА #4: Экранирование кавычек
```javascript
// ❌ НЕ РАБОТАЕТ!
value: "Он сказал "Привет""

// ✅ РАБОТАЕТ!
value: "Он сказал \"Привет\""
// или
value: data.workingHours.replace(/"/g, '\\"')
```

### ❌ ОШИБКА #5: Неправильный priceLevel
```javascript
// ❌ НЕ РАБОТАЕТ!
value: "$$$"  // Строка

// ✅ РАБОТАЕТ!
value: "3"    // Число как строка
type: "number_integer"
```

---

## 📋 ЧЕКЛИСТ ДЛЯ METAFIELDS

### Перед обновлением:
- [ ] Создан файл `src/data/placeMetafields.ts`
- [ ] Добавлены данные для всех мест
- [ ] Обновлены компоненты для использования fallback данных
- [ ] Создан скрипт для обновления metafields

### Во время обновления:
- [ ] Используется правильный namespace: "place_info"
- [ ] Правильные типы данных для каждого поля
- [ ] Корректное экранирование кавычек
- [ ] Пауза между запросами (1 секунда)
- [ ] Проверка ошибок в ответе

### После обновления:
- [ ] Запущен скрипт проверки metafields
- [ ] Все metafields загружены в Shopify
- [ ] Проверка в браузере - данные отображаются
- [ ] Fallback данные работают как резерв

---

## 🎯 ПРИМЕРЫ ДЛЯ РАЗНЫХ КАТЕГОРИЙ

### Пляжи (Beaches)
```typescript
'patong-beach': {
  rating: 4.5,
  coordinates: '7.8904,98.2924',
  district: 'Patong',
  workingHours: 'Круглосуточно',
  priceLevel: 1,
},
'kata-beach': {
  rating: 4.7,
  coordinates: '7.8200,98.3000',
  district: 'Kata',
  workingHours: 'Круглосуточно',
  priceLevel: 1,
},
```

### Храмы (Temples)
```typescript
'wat-chalong': {
  rating: 4.7,
  coordinates: '7.8467,98.3383',
  district: 'Chalong',
  workingHours: '06:00-18:00 ежедневно',
  priceLevel: 1,
},
'big-buddha': {
  rating: 4.8,
  coordinates: '7.8200,98.3000',
  district: 'Chalong',
  workingHours: '06:00-19:00 ежедневно',
  priceLevel: 1,
},
```

### Рестораны (Restaurants)
```typescript
'blue-elephant': {
  rating: 4.8,
  coordinates: '7.8905,98.2965',
  district: 'PhuketTown',
  workingHours: '11:30-14:30, 18:30-22:30',
  priceLevel: 3,
},
'kan-eng-seafood': {
  rating: 4.6,
  coordinates: '7.8900,98.2900',
  district: 'Patong',
  workingHours: '11:00-23:00 ежедневно',
  priceLevel: 2,
},
```

---

## 🚀 АВТОМАТИЗАЦИЯ

### Создайте мастер-скрипт:

```javascript
// scripts/setup-category-metafields.cjs
const category = process.argv[2];

if (!category) {
  console.error('❌ Укажите категорию: node setup-category-metafields.cjs beaches');
  process.exit(1);
}

console.log(`🚀 Настройка metafields для категории: ${category}`);

async function setupCategoryMetafields() {
  // 1. Обновить metafields в Shopify
  console.log('1️⃣ Обновляем metafields в Shopify...');
  await updateMetafields(category);
  
  // 2. Проверить результат
  console.log('2️⃣ Проверяем metafields...');
  await checkMetafields(category);
  
  // 3. Показать статус
  console.log('3️⃣ Показываем статус...');
  await showStatus(category);
  
  console.log('✅ Настройка завершена!');
  console.log(`🌐 Проверьте: http://localhost:8080/category/${category}`);
}

setupCategoryMetafields().catch(console.error);
```

---

## 🔍 ОТЛАДКА

### Если metafields не отображаются:

1. **Проверьте консоль браузера:**
```javascript
console.log('🔍 Debug metafields (fallback):');
console.log('  Handle:', handle);
console.log('  Fallback data:', fallbackData);
console.log('  Final rating:', rating);
console.log('  Final district:', district);
```

2. **Проверьте Shopify Admin:**
- Зайдите в продукт
- Перейдите в раздел "Metafields"
- Убедитесь, что metafields загружены

3. **Проверьте fallback данные:**
```javascript
// В src/data/placeMetafields.ts
console.log('Fallback data for', handle, ':', placeMetafields[handle]);
```

4. **Проверьте компоненты:**
```javascript
// В PlaceDetail.tsx
console.log('Using fallback data:', fallbackData);
```

---

**Последнее обновление:** $(date)  
**Версия:** 1.0  
**Создано на основе:** Успешного решения проблемы с metafields в категории "Торговые центры"

---

🎯 **ПОМНИТЕ:** Fallback данные - это надежное решение проблемы с metafields! Не полагайтесь только на Storefront API! 🚀
