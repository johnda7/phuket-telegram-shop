# 🤖 ПОЛНАЯ АВТОМАТИЗАЦИЯ: От Google до Shopify

> **Цель:** Полностью автоматизировать процесс создания образцовых карточек мест для ВСЕХ категорий

---

## 📋 ОГЛАВЛЕНИЕ

1. [Философия автоматизации](#философия-автоматизации)
2. [Полный процесс (5 шагов)](#полный-процесс-5-шагов)
3. [Скрипты и их назначение](#скрипты-и-их-назначение)
4. [Как найти реальные фото](#как-найти-реальные-фото)
5. [Как генерировать SEO-описание](#как-генерировать-seo-описание)
6. [Как загрузить в Shopify](#как-загрузить-в-shopify)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Философия автоматизации

**ГЛАВНОЕ ПРАВИЛО:** Агент НЕ должен тратить время на рутину!

```
❌ ПЛОХО: Искать фото вручную, копировать описания, вручную загружать
✅ ХОРОШО: Запустить 1 скрипт → получить готовую карточку
```

**Почему это важно?**
- У нас будет 100+ мест (торговые центры, пляжи, храмы, рестораны...)
- Каждое место = 10 фото + SEO-описание + метаданные
- Вручную = 2 часа на место = 200 часов работы!
- Автоматизация = 5 минут на место = 8 часов работы!

**ROI автоматизации: 25x экономия времени!**

---

## 🚀 Полный процесс (5 шагов)

### Шаг 1: Подготовка

```bash
# 1. Убедись что продукт существует в Shopify
node scripts/check-product.cjs "central-phuket-floresta"

# 2. Создай папку для фото (если нужно)
mkdir -p src/assets/central-phuket-floresta
```

### Шаг 2: Поиск РЕАЛЬНЫХ фото

```bash
# Автоматический поиск через Google/Yandex/Unsplash
node scripts/find-real-photos-google.cjs "Central Festival Phuket" 10
```

**Что происходит:**
1. Пытается Google Images (через SerpAPI)
2. Если не работает → Yandex Images
3. Если не работает → Unsplash API
4. Финальный fallback → предопределенные качественные URL

**Результат:** JSON файл с 10 URL фото

### Шаг 3: Скачивание фото локально

```bash
# Скачать все фото из JSON в src/assets/
node scripts/download-photos.cjs "central-phuket-floresta"
```

**Результат:** 10 файлов в `src/assets/central-phuket-floresta/`

### Шаг 4: Загрузка в Shopify

```bash
# Загрузить ВСЕ фото из папки в Shopify
node scripts/upload-photos-to-shopify.cjs "central-phuket-floresta"
```

**ВАЖНО:** Shopify trial accounts:
- ❌ НЕ РАБОТАЮТ внешние URL (Unsplash, Picsum, etc.)
- ✅ РАБОТАЮТ локальные файлы через base64

**Как это работает:**
1. Читает файлы из `src/assets/central-phuket-floresta/`
2. Конвертирует в base64
3. Загружает через REST API (`POST /admin/api/2025-07/products/{id}/images.json`)
4. Задержка 1.5 сек между загрузками (rate limit)

### Шаг 5: Генерация и обновление описания

```bash
# ChatGPT генерирует SEO-текст и обновляет Shopify
node scripts/update-description-chatgpt.cjs "central-phuket-floresta"
```

**Что происходит:**
1. Берет название места
2. Отправляет промпт в ChatGPT API:
   ```
   Напиши SEO-оптимизированное описание для:
   Central Festival Phuket
   
   Формат: HTML (h2, h3, ul, li, p)
   Длина: 1500+ символов
   Стиль: Как статья в блоге, не как реклама
   Структура:
   - Вводный параграф (что это, почему важно)
   - Секция "Что посмотреть" (3-5 пунктов)
   - Секция "Удобства" (список)
   - Секция "Как добраться" (адрес, время, транспорт)
   - Секция "Время работы"
   ```
3. Получает HTML
4. Обновляет `descriptionHtml` в Shopify

**Результат:** Полное SEO-описание в Shopify

---

## 🎬 ГЛАВНЫЙ СКРИПТ: Всё в одном!

```bash
# 🔥 ПОЛНАЯ АВТОМАТИЗАЦИЯ - 1 КОМАНДА!
node scripts/auto-enhance-place.cjs "Central Festival Phuket" "central-phuket-floresta"
```

**Что делает:**
1. ✅ Ищет продукт в Shopify
2. ✅ Ищет 10 реальных фото (Google/Yandex/Unsplash)
3. ✅ Скачивает их локально
4. ✅ Загружает в Shopify (REST API + base64)
5. ✅ Генерирует SEO-описание (ChatGPT)
6. ✅ Обновляет продукт в Shopify

**Результат:** Полностью готовая карточка за 5 минут!

---

## 📸 Как найти реальные фото

### СТРАТЕГИЯ 1: Google Images (SerpAPI)

```javascript
// Нужен API key: https://serpapi.com
const SERPAPI_KEY = process.env.SERPAPI_API_KEY;

async function searchGoogleImages(query, numPhotos) {
  const url = `https://serpapi.com/search.json?engine=google_images&q=${query}&num=${numPhotos}&api_key=${SERPAPI_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.images_results.map(img => ({
    url: img.original,
    thumbnail: img.thumbnail,
    title: img.title,
    alt: `${query} - ${img.title}`
  }));
}
```

**Pros:**
- ✅ Реальные фото места
- ✅ Высокое качество
- ✅ Много вариантов

**Cons:**
- ❌ Платный (но есть free tier: 100 запросов/месяц)
- ❌ Нужна регистрация

### СТРАТЕГИЯ 2: Yandex Images API

```javascript
// TODO: Реализовать
// Аналогично SerpAPI, но для Яндекса
```

**Pros:**
- ✅ Русскоязычные запросы
- ✅ Другие результаты (дополнение к Google)

**Cons:**
- ❌ Сложнее API
- ❌ Платный

### СТРАТЕГИЯ 3: Unsplash API (Fallback)

```javascript
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function searchUnsplash(query, numPhotos) {
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=${numPhotos}&client_id=${UNSPLASH_ACCESS_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results.map(img => ({
    url: img.urls.regular,
    thumbnail: img.urls.thumb,
    title: img.description || img.alt_description,
    photographer: img.user.name
  }));
}
```

**Pros:**
- ✅ Бесплатный (5000 запросов/час!)
- ✅ Очень высокое качество
- ✅ Легальные фото (Creative Commons)

**Cons:**
- ❌ Не всегда есть нужное место
- ❌ Общие фото, не конкретно этого места

### ФИНАЛЬНЫЙ FALLBACK: Статичные URL

```javascript
const FALLBACK_URLS = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
  'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200',
  // ... еще 8 качественных фото торговых центров
];
```

**Когда использовать:** Когда ВСЕ API недоступны

---

## 📝 Как генерировать SEO-описание

### ChatGPT API (Основной способ)

```javascript
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateDescription(placeName, category) {
  const prompt = `
Напиши SEO-оптимизированное описание для места: ${placeName}

Категория: ${category}

ТРЕБОВАНИЯ:
1. Формат: HTML (используй h2, h3, ul, li, p)
2. Длина: 1500-2000 символов
3. Стиль: Как статья в блоге, не реклама
4. Структура:
   - Вводный параграф (2-3 предложения)
   - <h3>Что посмотреть</h3> + список (3-5 пунктов)
   - <h3>Удобства</h3> + список
   - <h3>Как добраться</h3> + параграф (адрес, транспорт)
   - <h3>Время работы</h3> + параграф

ТОНАЛЬНОСТЬ:
- Дружелюбный, но информативный
- Без превосходных степеней ("самый лучший", "невероятный")
- Конкретные факты, а не эмоции
- Как будто советует друг, который там был

ПРИМЕР НАЧАЛА:
"Central Festival Phuket — крупнейший торговый центр на Пхукете. 
Два крыла — Floresta и Festival — соединены крытым переходом..."
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Ты - опытный travel writer и SEO-специалист.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
```

**Результат:** HTML текст готовый для `descriptionHtml`

### Альтернатива: Парсинг с phuket-insider.com

```javascript
// Если ChatGPT недоступен или нужно MVP
const insiderUrl = `https://phuket-insider.com/ru/places/${placeHandle}`;
const html = await fetch(insiderUrl).then(r => r.text());

// Извлечь описание из HTML
const descriptionMatch = html.match(/<div class="content">(.*?)<\/div>/s);
const description = descriptionMatch ? descriptionMatch[1] : '';
```

**Pros:**
- ✅ Бесплатно
- ✅ Уже есть качественный контент
- ✅ Не нужен API key

**Cons:**
- ❌ Нужно адаптировать под наш формат
- ❌ Не все места есть на Insider

---

## 📤 Как загрузить в Shopify

### ВАЖНО! Shopify Trial Account Limitations

**❌ НЕ РАБОТАЕТ:**
```javascript
// GraphQL productCreateMedia с внешним URL
mutation {
  productCreateMedia(productId: "...", media: [{
    originalSource: "https://images.unsplash.com/...",
    mediaContentType: IMAGE
  }]) { ... }
}
// Ошибка: "The file is not supported on trial accounts"
```

**✅ РАБОТАЕТ:**
```javascript
// REST API с base64 локального файла
const fileBuffer = fs.readFileSync('src/assets/photo.jpg');
const base64 = fileBuffer.toString('base64');

fetch(`https://STORE.myshopify.com/admin/api/2025-07/products/{id}/images.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
  },
  body: JSON.stringify({
    image: {
      attachment: base64,
      filename: 'photo.jpg',
      alt: 'Alt text'
    }
  })
});
```

### Полный код загрузки

```javascript
async function uploadImageToShopify(filePath, filename, alt, productGid) {
  // 1. Читаем файл
  const fileBuffer = fs.readFileSync(filePath);
  const base64Image = fileBuffer.toString('base64');
  
  // 2. Извлекаем ID продукта из GID
  const productId = productGid.split('/').pop();
  
  // 3. Готовим данные
  const imageData = JSON.stringify({
    image: {
      attachment: base64Image,
      filename: filename,
      alt: alt
    }
  });

  // 4. Отправляем в Shopify
  const response = await fetch(
    `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/products/${productId}/images.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(imageData)
      },
      body: imageData
    }
  );

  if (response.status === 200 || response.status === 201) {
    const data = await response.json();
    console.log(`✅ Загружено! ID: ${data.image.id}`);
    return data.image;
  } else {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
}
```

### Rate Limits

**Shopify REST API Limits:**
- Standard: 2 requests/second
- Plus: 4 requests/second

**Как избежать блокировки:**
```javascript
for (let i = 0; i < photos.length; i++) {
  await uploadImageToShopify(photos[i]);
  
  // Задержка между загрузками
  if (i < photos.length - 1) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 сек
  }
}
```

---

## 🛠️ Скрипты и их назначение

### 1. `find-real-photos-google.cjs`

**Что делает:** Находит реальные фото места

**Вход:** Название места
**Выход:** JSON массив с URL фото

```bash
node scripts/find-real-photos-google.cjs "Central Festival Phuket" 10
```

### 2. `download-photos.cjs`

**Что делает:** Скачивает фото локально

**Вход:** JSON с URL
**Выход:** Файлы в `src/assets/{handle}/`

```bash
node scripts/download-photos.cjs "central-phuket-floresta"
```

### 3. `upload-photos-to-shopify.cjs`

**Что делает:** Загружает локальные фото в Shopify

**Вход:** Handle продукта
**Выход:** Фото в Shopify

```bash
node scripts/upload-photos-to-shopify.cjs "central-phuket-floresta"
```

### 4. `update-description-chatgpt.cjs`

**Что делает:** Генерирует описание через ChatGPT и обновляет Shopify

**Вход:** Handle продукта
**Выход:** Обновленное описание в Shopify

```bash
node scripts/update-description-chatgpt.cjs "central-phuket-floresta"
```

### 5. `auto-enhance-place.cjs` (ГЛАВНЫЙ!)

**Что делает:** Выполняет ВСЕ шаги за 1 запуск

**Вход:** Название места + handle
**Выход:** Полностью готовая карточка

```bash
node scripts/auto-enhance-place.cjs "Central Festival Phuket" "central-phuket-floresta"
```

---

## 🐛 Troubleshooting

### Проблема 1: "The file is not supported on trial accounts"

**Причина:** Пытаешься загрузить внешний URL

**Решение:**
1. Скачай фото локально
2. Загрузи через REST API + base64

```bash
# Сначала скачай
node scripts/download-photos.cjs "handle"

# Потом загрузи
node scripts/upload-photos-to-shopify.cjs "handle"
```

### Проблема 2: "Rate limit exceeded"

**Причина:** Слишком много запросов в секунду

**Решение:** Добавь задержку между запросами

```javascript
await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 сек
```

### Проблема 3: "Bad Request" при обновлении описания

**Причина:** HTML содержит некорректные символы

**Решение:** Используй triple-quote syntax в GraphQL

```graphql
mutation {
  productUpdate(input: {
    id: "...",
    descriptionHtml: """
      <h2>Заголовок</h2>
      <p>Текст с "кавычками" и спецсимволами</p>
    """
  }) { ... }
}
```

### Проблема 4: Фото не отображаются на сайте

**Причина:** Shopify еще обрабатывает изображения

**Решение:** Подожди 30 секунд и обнови страницу

### Проблема 5: ChatGPT API не работает

**Причина:** Нет API key или превышен лимит

**Решение:** Используй fallback - шаблон или парсинг Insider

```javascript
const description = generateTemplate(placeName, category);
// или
const description = await parseFromInsider(placeHandle);
```

---

## 🎯 Масштабирование на ВСЕ категории

### Шаг 1: Список всех мест

Создай `data/places-to-migrate.json`:

```json
{
  "shopping": [
    { "name": "Central Festival Phuket", "handle": "central-phuket-floresta" },
    { "name": "Jungceylon", "handle": "jungceylon" },
    { "name": "Central Patong", "handle": "central-patong" }
  ],
  "beaches": [
    { "name": "Patong Beach", "handle": "patong-beach" },
    { "name": "Kata Beach", "handle": "kata-beach" }
  ],
  "temples": [
    { "name": "Wat Chalong", "handle": "wat-chalong" },
    { "name": "Big Buddha", "handle": "big-buddha" }
  ]
}
```

### Шаг 2: Batch скрипт

```javascript
// scripts/batch-enhance-all.cjs
const places = require('../data/places-to-migrate.json');

async function enhanceAll() {
  for (const category in places) {
    for (const place of places[category]) {
      console.log(`\n🔥 Обрабатываем: ${place.name}...`);
      
      try {
        // Вызываем главный скрипт
        await autoEnhancePlace(place.name, place.handle);
        console.log(`✅ ${place.name} готов!`);
      } catch (error) {
        console.error(`❌ Ошибка для ${place.name}:`, error.message);
      }
      
      // Задержка между местами
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 сек
    }
  }
}

enhanceAll();
```

### Шаг 3: Запуск

```bash
# Обработает ВСЕ места автоматически!
node scripts/batch-enhance-all.cjs
```

**Результат:** Все 100+ мест готовы за пару часов!

---

## ✅ Чеклист: Готова ли карточка?

- [ ] **15 ФОТО** загружено в Shopify
- [ ] **Фото листаются** стрелками
- [ ] **Точки работают** (можно кликать)
- [ ] **SEO-описание** полное (1500+ символов)
- [ ] **Amenities на русском** (Wi-Fi, Парковка, Кино...)
- [ ] **"ДА БОТ" правильный** (синий градиент, робот, белая кнопка)
- [ ] **Все кнопки работают:**
  - [ ] "Написать в бот" → @phuket_da_bot
  - [ ] "Показать на карте" → Google Maps
  - [ ] "Поделиться" → Telegram Share
- [ ] **Карточки сервисов внизу** (Туры, Авто, Валюта, Недвижимость)
- [ ] **Mobile responsive** (красиво на телефоне)
- [ ] **iOS 26 дизайн** (glassmorphism, shadows, animations)

---

## 🚀 ИТОГО

**1 КОМАНДА = ГОТОВАЯ КАРТОЧКА:**

```bash
node scripts/auto-enhance-place.cjs "Место" "handle"
```

**Применить на ВСЕ места:**

```bash
node scripts/batch-enhance-all.cjs
```

**Теперь можем масштабировать на 100+ мест БЫСТРО!** 🦄

---

**Last Updated:** October 27, 2025  
**Version:** 1.0  
**Author:** AI Agent Team

