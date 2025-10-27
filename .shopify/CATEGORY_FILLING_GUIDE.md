# 📚 ПОЛНОЕ РУКОВОДСТВО ПО ЗАПОЛНЕНИЮ КАТЕГОРИЙ

> **⚠️ КРИТИЧЕСКИ ВАЖНО!** Это руководство создано на основе успешного опыта заполнения категории "Торговые центры". Следуйте ему ТОЧНО для других категорий!

---

## 🎯 ОБЗОР ПРОЦЕССА

### Что мы делаем:
1. **Создаем fallback данные** для всех мест в категории
2. **Обновляем компоненты** для использования fallback данных
3. **Создаем премиум описания** с правильным HTML форматированием
4. **Загружаем placeholder фотографии** для быстрого заполнения
5. **Обновляем metafields** в Shopify для корректного отображения

### Почему fallback данные?
- **Storefront API не возвращает metafields** (ограничение Shopify)
- **Admin API работает**, но требует отдельного запроса
- **Fallback данные** обеспечивают стабильную работу сайта

---

## 📁 СТРУКТУРА ФАЙЛОВ

### 1. Fallback данные
```
src/data/placeMetafields.ts  ← Основной файл с данными всех мест
```

### 2. Компоненты
```
src/pages/PlaceDetail.tsx    ← Детальная страница места
src/components/PlaceCard.tsx ← Карточка места в списке
```

### 3. Скрипты для Shopify
```
scripts/get-[category]-ids.cjs           ← Получить ID продуктов
scripts/update-[category]-descriptions.cjs ← Обновить описания
scripts/upload-[category]-photos.cjs     ← Загрузить фотографии
scripts/check-[category]-metafields.cjs  ← Проверить metafields
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

**Обязательные поля:**
- `rating` - рейтинг от 1 до 5 (например, 4.6)
- `coordinates` - GPS координаты в формате "lat,lng"
- `district` - район на английском (например, "Patong")
- `workingHours` - часы работы на русском
- `priceLevel` - уровень цен от 1 до 3 ($, $$, $$$)

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

### ШАГ 3: Создание премиум описаний

#### 3.1 Структура премиум описания:

```html
<!-- Главный заголовок с эмодзи -->
<h1>🏢 Central Phuket (Централ Пхукет) — Крупнейший ТРЦ Пхукета</h1>

<!-- Краткое описание с конверсией -->
<p>Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.</p>

<!-- Конверсионный блок -->
<p><strong>🎯 Хотите посетить Central Phuket?</strong> 
<a href="/phuket">Забронируйте тур с гидом</a> или 
<a href="/services/car-rental">арендуйте авто</a> для самостоятельной поездки!</p>

<!-- Основные разделы с подзаголовками -->
<h2>🛍️ CENTRAL FESTIVAL — Масс-маркет</h2>
<h3>👔 Масс-маркет бренды</h3>
<p>Zara, H&M, Uniqlo, Nike, Apple реселлер, Sephora — все популярные бренды в одном месте</p>

<!-- Must-see блоки -->
<h2>🎪 Развлечения и достопримечательности</h2>
<div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-lg mb-4">
  <strong>Must-see!</strong>
</div>
<h3>🐠 Aquaria Phuket</h3>
<p><strong>Крупнейший океанариум на острове</strong> — более 25,000 морских обитателей, туннель с акулами, интерактивные зоны</p>

<!-- Удобства с иконками -->
<h2>✨ Удобства и сервисы</h2>
<div class="grid grid-cols-2 gap-4">
  <div class="flex items-center gap-2">
    <span class="text-2xl">📶</span>
    <span>Бесплатный Wi-Fi по всей территории</span>
  </div>
</div>

<!-- Финальный конверсионный блок -->
<h2>🎯 Планируете поездку в Central Phuket?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>
</div>

<!-- Эмоциональное заключение -->
<p><em>Central Phuket — это не просто торговый центр, это целый мир развлечений, шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, романтических прогулок и покупок на любой бюджет.</em></p>
```

#### 3.2 Создайте скрипт для обновления описаний:

```javascript
// scripts/update-[category]-descriptions.cjs
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

// Данные для обновления
const placesData = {
  'central-phuket-floresta': {
    title: 'Central Phuket (Централ Пхукет)',
    descriptionHtml: `<!-- Ваше премиум описание здесь -->`
  },
  // ... остальные места
};

async function updatePlaceDescription(handle, data) {
  // 1. Получить ID продукта
  const productId = await getProductId(handle);
  
  // 2. Обновить описание
  const mutation = `
    mutation {
      productUpdate(input: {
        id: "${productId}",
        title: "${data.title}",
        descriptionHtml: "${data.descriptionHtml.replace(/"/g, '\\"')}"
      }) {
        product { id title }
        userErrors { field message }
      }
    }
  `;
  
  // 3. Выполнить запрос
  await makeGraphQLRequest(mutation);
}
```

### ШАГ 4: Загрузка фотографий

#### 4.1 Создайте placeholder изображения:

```javascript
// scripts/create-[category]-photos.cjs
const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = path.join(__dirname, `../photos/${category}`);

const placeholderPhotos = [
  { filename: 'place-exterior.svg', text: 'Place Name - Фасад', color: '#2E8B57' },
  { filename: 'place-interior.svg', text: 'Place Name - Интерьер', color: '#4682B4' },
  { filename: 'place-activity.svg', text: 'Place Name - Активности', color: '#CD853F' },
];

function createSvgPlaceholder(text, color, width = 1200, height = 800) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <text x="50%" y="50%" font-family="Segoe UI, sans-serif" font-size="60" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;
}
```

#### 4.2 Загрузите фотографии в Shopify:

```javascript
// scripts/upload-[category]-photos.cjs
const https = require('https');

async function uploadImageToShopify(base64Image, filename, alt, productId) {
  const imageData = JSON.stringify({
    image: {
      attachment: base64Image,
      filename: filename,
      alt: alt
    }
  });

  const options = {
    hostname: SHOPIFY_STORE,
    path: `/admin/api/2025-07/products/${productId}/images.json`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      'Content-Length': Buffer.byteLength(imageData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(JSON.parse(data).image);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(imageData);
    req.end();
  });
}
```

### ШАГ 5: Обновление metafields в Shopify

#### 5.1 Создайте скрипт для обновления metafields:

```javascript
// scripts/update-[category]-metafields.cjs
const mutation = `
  mutation {
    productUpdate(input: {
      id: "${productId}",
      metafields: [
        {
          namespace: "place_info",
          key: "rating",
          value: "${rating}",
          type: "single_line_text_field"
        },
        {
          namespace: "place_info", 
          key: "coordinates",
          value: "${coordinates}",
          type: "single_line_text_field"
        },
        {
          namespace: "place_info",
          key: "district", 
          value: "${district}",
          type: "single_line_text_field"
        },
        {
          namespace: "place_info",
          key: "working_hours",
          value: "${workingHours}",
          type: "single_line_text_field"
        },
        {
          namespace: "place_info",
          key: "price_level",
          value: "${priceLevel}",
          type: "number_integer"
        }
      ]
    }) {
      product { id }
      userErrors { field message }
    }
  }
`;
```

---

## 🚨 КРИТИЧЕСКИЕ ОШИБКИ, КОТОРЫХ НУЖНО ИЗБЕГАТЬ

### ❌ ОШИБКА #1: Неправильные namespace для metafields
```javascript
// ❌ НЕ РАБОТАЕТ!
namespace: "custom"

// ✅ РАБОТАЕТ!
namespace: "place_info"
```

### ❌ ОШИБКА #2: Экранирование кавычек в HTML
```javascript
// ❌ НЕ РАБОТАЕТ!
descriptionHtml: "<p>Он сказал "Привет"</p>"

// ✅ РАБОТАЕТ!
descriptionHtml: "<p>Он сказал \"Привет\"</p>"
// или
descriptionHtml: descriptionHtml.replace(/"/g, '\\"')
```

### ❌ ОШИБКА #3: Неправильные типы metafields
```javascript
// ❌ НЕ РАБОТАЕТ!
type: "text"  // для рейтинга

// ✅ РАБОТАЕТ!
type: "single_line_text_field"  // для текста
type: "number_integer"          // для чисел
```

### ❌ ОШИБКА #4: Загрузка внешних изображений
```javascript
// ❌ НЕ РАБОТАЕТ! (Trial аккаунт)
originalSource: "https://images.unsplash.com/photo-123.jpg"

// ✅ РАБОТАЕТ!
attachment: base64Image  // Локальный файл через base64
```

### ❌ ОШИБКА #5: Неправильные productType и tags
```javascript
// ❌ НЕ РАБОТАЕТ!
productType: "Information"
tags: ["shopping"]

// ✅ РАБОТАЕТ!
productType: "Information"  // для информационных статей
tags: ["info", "insider", "shopping"]  // правильные теги
```

---

## 📋 ЧЕКЛИСТ ДЛЯ КАЖДОЙ КАТЕГОРИИ

### Перед началом работы:
- [ ] Создан файл `src/data/placeMetafields.ts` с данными всех мест
- [ ] Обновлены компоненты `PlaceDetail.tsx` и `PlaceCard.tsx`
- [ ] Созданы премиум описания для всех мест
- [ ] Подготовлены placeholder фотографии
- [ ] Созданы скрипты для обновления Shopify

### Во время работы:
- [ ] Проверяю каждый handle в fallback данных
- [ ] Тестирую каждое место в браузере
- [ ] Проверяю корректность metafields
- [ ] Убеждаюсь, что фотографии загружены
- [ ] Проверяю работу навигации и кнопок

### После завершения:
- [ ] Все места отображаются корректно
- [ ] Fallback данные работают
- [ ] Премиум описания загружены в Shopify
- [ ] Фотографии отображаются
- [ ] Навигация работает
- [ ] Дизайн соответствует iOS 26
- [ ] Коммит и пуш в GitHub

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

### Создайте мастер-скрипт для массового обновления:

```javascript
// scripts/mass-update-category.cjs
const category = process.argv[2]; // beaches, temples, restaurants

if (!category) {
  console.error('❌ Укажите категорию: node mass-update-category.cjs beaches');
  process.exit(1);
}

console.log(`🚀 Массовое обновление категории: ${category}`);

// 1. Обновить описания
await updateDescriptions(category);

// 2. Загрузить фотографии  
await uploadPhotos(category);

// 3. Обновить metafields
await updateMetafields(category);

// 4. Проверить результат
await checkResults(category);

console.log('✅ Категория обновлена!');
```

---

## 📞 ПОДДЕРЖКА

### Если что-то не работает:

1. **Проверьте консоль браузера** - там будут ошибки
2. **Проверьте fallback данные** - убедитесь, что handle правильный
3. **Проверьте Shopify Admin** - загружены ли описания и фотографии
4. **Проверьте metafields** - используйте скрипт проверки
5. **Проверьте компоненты** - правильно ли импортированы fallback данные

### Полезные команды:

```bash
# Проверить metafields
node scripts/check-[category]-metafields.cjs

# Обновить описания
node scripts/update-[category]-descriptions.cjs

# Загрузить фотографии
node scripts/upload-[category]-photos.cjs

# Проверить результат
npm run dev
# Откройте http://localhost:8080/category/[category]
```

---

**Последнее обновление:** $(date)  
**Версия:** 1.0  
**Создано на основе:** Успешного опыта с категорией "Торговые центры"

---

🎯 **ПОМНИТЕ:** Каждая категория должна быть такой же качественной, как "Торговые центры"! Следуйте этому руководству ТОЧНО, и у вас получится отличный результат! 🚀
