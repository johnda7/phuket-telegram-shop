# 📸 ПОЛНАЯ ИНСТРУКЦИЯ: ЗАГРУЗКА ФОТО И ОПИСАНИЙ В SHOPIFY

> **🎯 ГЛАВНОЕ ПРАВИЛО:** Trial account НЕ поддерживает загрузку по URL! Только ЛОКАЛЬНЫЕ файлы через base64!

---

## 🚨 КРИТИЧЕСКИ ВАЖНО!

## ❌ ТОП-20 ОШИБОК, КОТОРЫЕ УБИВАЮТ ПРОЕКТ

### 🚫 **ОШИБКА #1: Загрузка фото по URL (УБИЙЦА ВРЕМЕНИ!)**
```javascript
// ❌ НИКОГДА НЕ ДЕЛАЙ ТАК! Trial account БЛОКИРУЕТ!
originalSource: "https://images.unsplash.com/photo-123.jpg"

// ✅ ВСЕГДА ДЕЛАЙ ТАК! Скачай локально → base64
const fileBuffer = fs.readFileSync('./local-image.jpg');
const base64Image = fileBuffer.toString('base64');
attachment: base64Image
```

### 🚫 **ОШИБКА #2: Создание JSON/Markdown файлов с контентом**
```javascript
// ❌ НИКОГДА! Контент НЕ в файлах!
const places = [
  { name: "Central Festival", description: "..." }
];

// ✅ ВСЕГДА! Контент ТОЛЬКО в Shopify!
productCreate(input: { title: "Central Festival", descriptionHtml: "..." })
```

### 🚫 **ОШИБКА #3: Неправильные productType и tags**
```javascript
// ❌ НЕ РАБОТАЕТ! Неправильные типы
productType: "Information"  // ❌
tags: ["shopping"]          // ❌

// ✅ РАБОТАЕТ! Правильные типы
productType: "Excursions"   // ✅ для туров
productType: "place"        // ✅ для мест
tags: ["tour"]              // ✅ для туров
tags: ["info", "insider"]   // ✅ для информации
```

### 🚫 **ОШИБКА #4: Забыл опубликовать продукт**
```javascript
// ❌ Создал продукт, но забыл опубликовать
productCreate() // Продукт НЕ появится на сайте!

// ✅ ВСЕГДА публикуй после создания
productPublish(input: { id: productId, productPublications: [...] })
```

### 🚫 **ОШИБКА #5: Неправильные metafields namespace**
```javascript
// ❌ НЕ РАБОТАЕТ! Неправильный namespace
namespace: "custom"  // ❌

// ✅ РАБОТАЕТ! Правильный namespace
namespace: "place_info"  // ✅ для мест
namespace: "tour_info"   // ✅ для туров
```

### 🚫 **ОШИБКА #6: Handle с эмодзи и спецсимволами**
```javascript
// ❌ НЕ РАБОТАЕТ! Эмодзи в handle
handle: "🏢-central-festival"  // ❌

// ✅ РАБОТАЕТ! Только латиница
handle: "central-phuket-floresta"  // ✅
```

### 🚫 **ОШИБКА #7: Не проверяешь результат в браузере**
```javascript
// ❌ Создал продукт, но не проверил
console.log("Готово!"); // Ложь! Может не работать

// ✅ ВСЕГДА проверяй в браузере
console.log("Проверь: http://localhost:8080/place/central-phuket-floresta");
```

### 🚫 **ОШИБКА #8: Используешь внешние URL для placeholder изображений**
```javascript
// ❌ НЕ РАБОТАЕТ! CORS блокирует
src: "https://via.placeholder.com/400x300"  // ❌

// ✅ РАБОТАЕТ! Inline SVG
src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCI..."  // ✅
```

### 🚫 **ОШИБКА #9: Не используешь GraphQL variables**
```javascript
// ❌ НЕ РАБОТАЕТ! Injection атаки
query: `mutation { productUpdate(input: { id: "${productId}", descriptionHtml: "${html}" }) }`

// ✅ РАБОТАЕТ! Variables
query: `mutation updateProduct($id: ID!, $html: String!) { productUpdate(input: { id: $id, descriptionHtml: $html }) }`
variables: { id: productId, html: html }
```

### 🚫 **ОШИБКА #10: Не обрабатываешь ошибки**
```javascript
// ❌ НЕ РАБОТАЕТ! Игнорируешь ошибки
const result = await shopifyRequest(query);
console.log("Готово!"); // Может быть ошибка!

// ✅ РАБОТАЕТ! Всегда проверяй ошибки
if (result.errors) {
  console.error("GraphQL Errors:", result.errors);
  throw new Error("Failed to update product");
}
```

### 🚫 **ОШИБКА #11: Создаешь продукты без variants**
```javascript
// ❌ НЕ РАБОТАЕТ! Обязательны variants
productCreate(input: { title: "Tour", productType: "Excursions" })  // ❌

// ✅ РАБОТАЕТ! Всегда добавляй variants
variants: [
  { title: "Взрослый", price: "120.00" },
  { title: "Детский (4-11 лет)", price: "90.00" }
]
```

### 🚫 **ОШИБКА #12: Не используешь правильные z-index**
```javascript
// ❌ НЕ РАБОТАЕТ! Элементы перекрываются
className="absolute bottom-4"  // ❌

// ✅ РАБОТАЕТ! Правильные z-index
className="absolute bottom-4 z-50"  // ✅
```

### 🚫 **ОШИБКА #13: Не используешь prose классы для HTML**
```javascript
// ❌ НЕ РАБОТАЕТ! HTML без стилей
<div dangerouslySetInnerHTML={{ __html: html }} />  // ❌

// ✅ РАБОТАЕТ! Prose классы
<div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: html }} />  // ✅
```

### 🚫 **ОШИБКА #14: Не используешь fetchProductByHandle для детальных страниц**
```javascript
// ❌ НЕ РАБОТАЕТ! Медленно и неэффективно
const products = await fetchProducts();
const product = products.find(p => p.handle === handle);  // ❌

// ✅ РАБОТАЕТ! Прямой запрос
const product = await fetchProductByHandle(handle);  // ✅
```

### 🚫 **ОШИБКА #15: Не добавляешь descriptionHtml в GraphQL запросы**
```javascript
// ❌ НЕ РАБОТАЕТ! descriptionHtml не загружается
query: `{ productByHandle(handle: "${handle}") { id title description } }`  // ❌

// ✅ РАБОТАЕТ! Включай descriptionHtml
query: `{ productByHandle(handle: "${handle}") { id title description descriptionHtml } }`  // ✅
```

### 🚫 **ОШИБКА #16: Не используешь правильные иконки из lucide-react**
```javascript
// ❌ НЕ РАБОТАЕТ! Иконка не импортирована
<Clock className="w-4 h-4" />  // ❌ ReferenceError

// ✅ РАБОТАЕТ! Импортируй иконки
import { Clock, Star, MapPin } from "lucide-react";  // ✅
```

### 🚫 **ОШИБКА #17: Не используешь правильные пути для сервисов**
```javascript
// ❌ НЕ РАБОТАЕТ! Неправильные пути
href="/car-rental"  // ❌

// ✅ РАБОТАЕТ! Правильные пути
href="/services/car-rental"  // ✅
```

### 🚫 **ОШИБКА #18: Не используешь правильные цвета для кнопок**
```javascript
// ❌ НЕ РАБОТАЕТ! Неправильные цвета
className="bg-red-500"  // ❌

// ✅ РАБОТАЕТ! Только #007AFF
className="bg-primary"  // ✅ (primary = #007AFF)
```

### 🚫 **ОШИБКА #19: Не используешь правильные размеры touch targets**
```javascript
// ❌ НЕ РАБОТАЕТ! Слишком маленькие кнопки
className="w-6 h-6"  // ❌

// ✅ РАБОТАЕТ! Минимум 44px
className="w-11 h-11"  // ✅ (44px)
```

### 🚫 **ОШИБКА #20: Не используешь правильные fallback данные**
```javascript
// ❌ НЕ РАБОТАЕТ! Нет fallback
const rating = product.metafields.find(m => m.key === 'rating')?.value;  // ❌

// ✅ РАБОТАЕТ! Всегда fallback
const rating = product.metafields.find(m => m.key === 'rating')?.value || 4.5;  // ✅
```

---

### ❌ **ЧТО НЕ РАБОТАЕТ на Trial Account:**
```javascript
// ❌ ОШИБКА: "The file is not supported on trial accounts"
const mutation = `
  mutation {
    productCreateMedia(
      productId: "gid://shopify/Product/123",
      media: [{
        originalSource: "https://images.unsplash.com/photo-123.jpg",  // ❌ URL НЕ РАБОТАЕТ!
        mediaContentType: IMAGE
      }]
    ) { ... }
  }
`;
```

### ✅ **ЧТО РАБОТАЕТ:**
```javascript
// ✅ РАБОТАЕТ: Локальный файл через base64
const fs = require('fs');
const fileBuffer = fs.readFileSync('./local-image.jpg');
const base64Image = fileBuffer.toString('base64');

const imageData = JSON.stringify({
  image: {
    attachment: base64Image,  // ✅ base64 РАБОТАЕТ!
    filename: 'my-image.jpg'
  }
});
```

---

## 📋 ОГЛАВЛЕНИЕ

1. [Шаг 1: Подготовка фото](#шаг-1-подготовка-фото)
2. [Шаг 2: Скачивание фото локально](#шаг-2-скачивание-фото-локально)
3. [Шаг 3: Загрузка фото в Shopify](#шаг-3-загрузка-фото-в-shopify)
4. [Шаг 4: Обновление описания](#шаг-4-обновление-описания)
5. [Шаг 5: Проверка результата](#шаг-5-проверка-результата)
6. [Готовые скрипты](#готовые-скрипты)
7. [Troubleshooting](#troubleshooting)

---

## Шаг 1: Подготовка фото

### 1.1. Где взять фото?

**Вариант A: Unsplash (бесплатные качественные фото)**
```
https://unsplash.com/s/photos/phuket-shopping-mall
https://unsplash.com/s/photos/thailand-temple
https://unsplash.com/s/photos/phuket-beach
```

**Вариант B: Google Images**
- Ищи "Central Festival Phuket"
- Используй фильтр "Usage rights: Creative Commons licenses"

**Вариант C: Свои фото**
- Сделай сам на Пхукете
- Лучший вариант для уникальности!

### 1.2. Требования к фото

✅ **Оптимальные параметры:**
- **Формат:** JPG, PNG, WebP
- **Размер:** 100-300 KB (оптимально)
- **Разрешение:** 1200x900 px или 1920x1080 px
- **Соотношение сторон:** 16:9 или 4:3

❌ **Избегай:**
- Фото > 1 MB (медленная загрузка)
- Фото < 50 KB (низкое качество)
- Водяные знаки

---

## Шаг 2: Скачивание фото локально

### 2.1. Создай папку для фото

```bash
mkdir -p src/assets/[category-name]
# Например:
mkdir -p src/assets/central-festival
mkdir -p src/assets/beaches
mkdir -p src/assets/temples
```

### 2.2. Скачай фото через скрипт

**Создай файл:** `scripts/download-[category]-photos.cjs`

```javascript
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Список фото для скачивания
const photosToDownload = [
  {
    url: 'https://images.unsplash.com/photo-123?w=1200&q=80',
    filename: 'central-interior.jpg',
    alt: 'Central Phuket - Interior view'
  },
  {
    url: 'https://images.unsplash.com/photo-456?w=1200&q=80',
    filename: 'central-exterior.jpg',
    alt: 'Central Phuket - Exterior view'
  }
];

const assetsDir = path.join(__dirname, '../src/assets/central-festival');

// Создаем папку если не существует
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Функция для скачивания файла
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      // Обработка редиректов
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });
      
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('📥 Скачиваем фото локально...\n');
  
  for (let i = 0; i < photosToDownload.length; i++) {
    const photo = photosToDownload[i];
    const localPath = path.join(assetsDir, photo.filename);
    
    console.log(`📷 [${i + 1}/${photosToDownload.length}] ${photo.filename}`);
    
    try {
      await downloadFile(photo.url, localPath);
      const fileSizeKB = (fs.statSync(localPath).size / 1024).toFixed(2);
      console.log(`  ✅ Скачано (${fileSizeKB} KB)\n`);
    } catch (error) {
      console.error(`  ❌ Ошибка:`, error.message, '\n');
    }
  }
  
  console.log('✅ Готово! Фото сохранены в:', assetsDir);
}

main().catch(console.error);
```

**Запусти:**
```bash
node scripts/download-central-photos.cjs
```

---

## Шаг 3: Загрузка фото в Shopify

### 3.1. Получи Product ID

**Вариант A: Через GraphQL**
```bash
curl -X POST 'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json' \
  -H 'X-Shopify-Access-Token: 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' \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ productByHandle(handle: \"central-phuket-floresta\") { id } }"}' \
  | jq '.data.productByHandle.id'
```

**Вариант B: Из URL Shopify Admin**
```
https://admin.shopify.com/store/.../products/7972352950326
                                                 ^^^^^^^^^^ это Product ID
```

### 3.2. Загрузи фото через REST API

**Создай файл:** `scripts/upload-[category]-photos.cjs`

```javascript
const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const PRODUCT_ID = '7972352950326'; // ← ЗАМЕНИ НА СВОЙ!

// Локальные фото для загрузки
const assetsDir = path.join(__dirname, '../src/assets/central-festival');
const photoFiles = [
  { filename: 'central-interior.jpg', alt: 'Central Phuket - Interior' },
  { filename: 'central-exterior.jpg', alt: 'Central Phuket - Exterior' }
];

// Функция загрузки в Shopify
function uploadImageToShopify(filePath, filename, alt) {
  return new Promise((resolve, reject) => {
    // Читаем файл и конвертируем в base64
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    
    // Создаем JSON payload
    const imageData = JSON.stringify({
      image: {
        attachment: base64Image,
        filename: filename,
        alt: alt
      }
    });

    // Настройки запроса
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/2025-07/products/${PRODUCT_ID}/images.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(imageData)
      }
    };

    // Выполняем запрос
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

async function main() {
  console.log('📸 ЗАГРУЗКА ФОТО В SHOPIFY\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < photoFiles.length; i++) {
    const photo = photoFiles[i];
    const localPath = path.join(assetsDir, photo.filename);
    
    console.log(`\n📷 [${i + 1}/${photoFiles.length}] ${photo.filename}`);
    
    try {
      // Проверяем существование файла
      if (!fs.existsSync(localPath)) {
        throw new Error(`Файл не найден: ${localPath}`);
      }
      
      // Загружаем в Shopify
      console.log(`  ⬆️  Загружаем...`);
      const result = await uploadImageToShopify(localPath, photo.filename, photo.alt);
      console.log(`  ✅ Загружено! ID: ${result.id}`);
      console.log(`  🔗 URL: ${result.src}`);
      
      successCount++;
      
      // Задержка между загрузками (чтобы не перегружать API)
      if (i < photoFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error(`  ❌ Ошибка:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно: ${successCount}/${photoFiles.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${photoFiles.length}`);
  
  if (successCount === photoFiles.length) {
    console.log('\n🎉 ВСЕ ФОТО ЗАГРУЖЕНЫ В SHOPIFY!');
    console.log(`🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${PRODUCT_ID}`);
  }
}

main().catch(console.error);
```

**Запусти:**
```bash
node scripts/upload-central-photos.cjs
```

### 3.3. Объединенный скрипт (Скачать + Загрузить)

**Для максимальной автоматизации создай:** `scripts/download-and-upload-[category]-photos.cjs`

```javascript
// Комбинация downloadFile() + uploadImageToShopify()
// См. пример: scripts/download-and-upload-central-photos.cjs
```

---

## Шаг 4: Создание ТОПОВОГО описания

### 4.1. Философия ТОПОВОГО описания

**Цель:** Создать описание уровня Perplexity AI + Steve Jobs + iOS 26

**Принципы:**
- 🎯 **Конверсия** - каждый абзац ведет к покупке
- 🔍 **SEO** - структурированные заголовки, ключевые слова
- 📱 **UX** - легко читается на мобильном
- 💎 **Премиум** - выглядит как Apple Store

### 4.2. Структура ТОПОВОГО описания

```html
<!-- Главный заголовок с эмодзи -->
<h1>🏢 Central Festival Phuket — Крупнейший ТРЦ Пхукета</h1>

<!-- Краткое описание с конверсией -->
<p>Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.</p>

<!-- Конверсионный блок -->
<p><strong>🎯 Хотите посетить Central Festival?</strong> <a href="/phuket">Забронируйте тур с гидом</a> или <a href="/services/car-rental">арендуйте авто</a> для самостоятельной поездки!</p>

<!-- Основные разделы с подзаголовками -->
<h2>🛍️ CENTRAL FESTIVAL — Масс-маркет</h2>
<h3>👔 Масс-маркет бренды</h3>
<p>Zara, H&M, Uniqlo, Nike, Apple реселлер, Sephora — все популярные бренды в одном месте</p>

<h2>💎 CENTRAL FLORESTA — Люкс</h2>
<h3>👑 Люксовые бутики</h3>
<p>Louis Vuitton, Prada, Gucci, Balenciaga, Celine, Bvlgari, Tiffany & Co — эксклюзивные коллекции</p>

<!-- Развлечения с Must-see! -->
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
  <div class="flex items-center gap-2">
    <span class="text-2xl">🔌</span>
    <span>Портативные зарядные станции для телефонов</span>
  </div>
</div>

<!-- Практическая информация -->
<h2>📍 Как добраться</h2>
<h3>🏢 Адрес</h3>
<p>74/5 Vichitsongkram Rd, Wichit, Mueang Phuket District, Phuket 83000</p>

<h3>🏖️ Из Патонга</h3>
<p>20 минут на машине или тук-туке (300-400 бат)</p>

<!-- Время работы -->
<h2>🕐 Время работы</h2>
<p><strong>Ежедневно:</strong> 10:00 — 22:00</p>
<p><strong>Рестораны и кафе:</strong> работают до 23:00</p>

<!-- Финальный конверсионный блок -->
<h2>🎯 Планируете поездку в Central Festival?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>
</div>

<p>💡 <strong>Совет:</strong> Лучшее время для посещения — утром (10:00-12:00) или вечером (18:00-20:00), когда меньше всего людей</p>

<!-- Эмоциональное заключение -->
<p><em>Central Festival Phuket — это не просто торговый центр, это целый мир развлечений, шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, романтических прогулок и покупок на любой бюджет.</em></p>
```

### 4.3. Источники информации

**Обязательные источники:**
- 📖 **phuket-insider.com** - базовая информация
- 📖 **TripAdvisor** - отзывы и рейтинги
- 📖 **Google Maps** - актуальные данные, фото
- 📖 **Официальный сайт** - точные часы работы, адрес
- 📖 **Instagram** - актуальные фото и тренды

**Дополнительные источники:**
- 📖 **YouTube** - видео-обзоры
- 📖 **Блоги путешественников** - личный опыт
- 📖 **Форумы** - практические советы

### 4.4. Автоматическое создание ТОПОВОГО описания

**Создай файл:** `scripts/create-premium-description-tailwind.cjs`

```javascript
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const PRODUCT_HANDLE = 'central-phuket-floresta'; // ← ЗАМЕНИ!

// ТОПОВОЕ описание с Tailwind CSS классами
const PREMIUM_DESCRIPTION = `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">🏢 Central Festival Phuket — Крупнейший ТРЦ Пхукета</h1>
  
  <p class="text-lg text-gray-700 leading-relaxed">Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.</p>
  
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить Central Festival?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🛍️ CENTRAL FESTIVAL — Масс-маркет</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👔 Масс-маркет бренды</h3>
          <p class="text-gray-600">Zara, H&M, Uniqlo, Nike, Apple реселлер, Sephora — все популярные бренды в одном месте</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🍽️ Еда и напитки</h3>
          <p class="text-gray-600">2 фуд-корта + рестораны международной кухни — от фастфуда до изысканной кухни</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🎬 Развлечения</h3>
          <p class="text-gray-600">Кинотеатр Major Cineplex, детские зоны — идеально для семей с детьми</p>
        </div>
      </div>
    </div>
    
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">💎 CENTRAL FLORESTA — Люкс</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👑 Люксовые бутики</h3>
          <p class="text-gray-600">Louis Vuitton, Prada, Gucci, Balenciaga, Celine, Bvlgari, Tiffany & Co — эксклюзивные коллекции</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">👶 Детский мир</h3>
          <p class="text-gray-600">Магазины игрушек и детской одежды — всё для маленьких принцев и принцесс</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">🏠 Дом и декор</h3>
          <p class="text-gray-600">Товары для дома, лавки с сувенирами — привезите частичку Таиланда домой</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в Central Festival?</h2>
    
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>
    
    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — утром (10:00-12:00) или вечером (18:00-20:00), когда меньше всего людей</p>
  </div>
  
  <p class="text-lg text-gray-600 italic text-center mt-8">Central Festival Phuket — это не просто торговый центр, это целый мир развлечений, шопинга и гастрономии в сердце Пхукета. Идеальное место для семейного отдыха, романтических прогулок и покупок на любой бюджет.</p>
</div>
`;

function shopifyAdminRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.errors) {
            reject(new Error(`GraphQL Errors: ${JSON.stringify(jsonData.errors)}`));
          } else {
            resolve(jsonData);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function getProductByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
      }
    }
  `;
  const result = await shopifyAdminRequest(query, { handle });
  return result.data?.productByHandle;
}

async function updateProductDescription(productId, html) {
  const mutation = `
    mutation updateProduct($id: ID!, $descriptionHtml: String!) {
      productUpdate(input: {
        id: $id,
        descriptionHtml: $descriptionHtml
      }) {
        product {
          id
          title
          descriptionHtml
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: productId,
    descriptionHtml: html
  };

  const data = await shopifyAdminRequest(mutation, variables);

  if (data.data.productUpdate.userErrors.length > 0) {
    console.error('❌ User Errors:', data.data.productUpdate.userErrors);
    throw new Error('Failed to update product');
  }
  return data.data.productUpdate;
}

async function main() {
  console.log('🎨 СОЗДАЕМ ТОПОВОЕ ОПИСАНИЕ...\n');
  
  // 1. Найти продукт
  console.log(`🔍 Ищем продукт: ${PRODUCT_HANDLE}`);
  const product = await getProductByHandle(PRODUCT_HANDLE);
  
  if (!product) {
    console.error(`❌ Продукт не найден: ${PRODUCT_HANDLE}`);
    return;
  }
  
  console.log(`✅ Найден: ${product.title}`);
  console.log(`🆔 ID: ${product.id}\n`);
  
  // 2. Обновить описание
  console.log('🎨 Создаем ТОПОВОЕ описание с Tailwind CSS...');
  const updateResult = await updateProductDescription(product.id, PREMIUM_DESCRIPTION);
  
  console.log('✅ ТОПОВОЕ описание создано!');
  console.log(`🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${product.id.split('/').pop()}`);
  console.log('\n🎉 ГОТОВО! Описание уровня Perplexity AI + Steve Jobs + iOS 26!');
}

main().catch(console.error);
```

**Запусти:**
```bash
node scripts/create-premium-description-tailwind.cjs
```

### 4.5. Обнови описание через GraphQL

**Создай файл:** `scripts/update-[handle]-description.cjs`

```javascript
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const PRODUCT_HANDLE = 'central-phuket-floresta'; // ← ЗАМЕНИ!

const FULL_DESCRIPTION = `
Central Phuket – самый большой торговый центр на острове с широким ассортиментом брендов.

Он состоит из двух корпусов: Central Festival и Central Floresta.

CENTRAL FESTIVAL:
Масс-маркет бренды: H&M, Zara, Crocs, UNIQLO, Sephora.

CENTRAL FLORESTA:
Люксовые бутики: Louis Vuitton, Prada, Gucci, Balenciaga.

УДОБСТВА:
Бесплатный WI-FI, портативные зарядные станции, пункты обмена валют.
`;

function shopifyAdminRequest(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.errors) {
            reject(new Error(`GraphQL Errors: ${JSON.stringify(jsonData.errors)}`));
          } else {
            resolve(jsonData);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function getProductByHandle(handle) {
  const query = `
    query {
      productByHandle(handle: "${handle}") {
        id
        title
      }
    }
  `;
  const result = await shopifyAdminRequest(query);
  return result.data?.productByHandle;
}

async function updateProductDescription(productId, description) {
  // Используем тройные кавычки для многострочного текста
  const mutation = `
    mutation {
      productUpdate(input: {
        id: "${productId}",
        descriptionHtml: """${description}"""
      }) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  const result = await shopifyAdminRequest(mutation);
  return result.data?.productUpdate;
}

async function main() {
  console.log('📝 Обновляем описание продукта...\n');
  
  // 1. Найти продукт
  console.log(`🔍 Ищем продукт: ${PRODUCT_HANDLE}`);
  const product = await getProductByHandle(PRODUCT_HANDLE);
  
  if (!product) {
    console.error(`❌ Продукт не найден: ${PRODUCT_HANDLE}`);
    return;
  }
  
  console.log(`✅ Найден: ${product.title}`);
  console.log(`🆔 ID: ${product.id}\n`);
  
  // 2. Обновить описание
  console.log('📝 Обновляем описание...');
  const updateResult = await updateProductDescription(product.id, FULL_DESCRIPTION);
  
  if (updateResult?.userErrors?.length > 0) {
    console.error('❌ Ошибки при обновлении:', updateResult.userErrors);
  } else {
    console.log('✅ Описание обновлено!');
    console.log(`🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${product.id.split('/').pop()}`);
  }
}

main().catch(console.error);
```

**Запусти:**
```bash
node scripts/update-central-description.cjs
```

---

## Шаг 5: Проверка результата

### 5.1. Проверь в Shopify Admin

```bash
# Открой в браузере:
https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/[PRODUCT_ID]

# Проверь:
✅ Фото загружены (Media section)
✅ Описание обновлено (Description section)
✅ Alt text у фото заполнен
```

### 5.2. Проверь на сайте

```bash
# Запусти dev server
npm run dev

# Открой категорию
http://localhost:8080/category/shopping

# Проверь:
✅ Карточка отображает фото
✅ Детальная страница показывает все фото
✅ Описание полностью отображается
```

### 5.3. Проверь через API

```bash
# Получи фото продукта
curl -X GET \
  'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/products/[PRODUCT_ID]/images.json' \
  -H 'X-Shopify-Access-Token: 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' \
  | jq '.images | length'

# Должно вернуть количество фото
```

---

## Готовые скрипты

### ✅ Эталонные скрипты в проекте:

| Скрипт | Назначение | Статус |
|--------|-----------|--------|
| `download-and-upload-central-photos.cjs` | Скачать + загрузить фото Central Festival | ✅ РАБОТАЕТ |
| `update-central-phuket-full-description.cjs` | Обновить описание Central Phuket | ✅ РАБОТАЕТ |
| `upload-phi-phi-to-shopify.js` | Загрузить фото Пхи-Пхи | ✅ РАБОТАЕТ |
| `upload-shopping-centers-fixed.cjs` | Создать все ТЦ | ✅ РАБОТАЕТ |

### Шаблон для новой категории:

```bash
# 1. Создай папку для фото
mkdir -p src/assets/[category]

# 2. Скопируй эталонный скрипт
cp scripts/download-and-upload-central-photos.cjs scripts/download-and-upload-[category]-photos.cjs

# 3. Отредактируй:
# - PRODUCT_ID
# - photosToDownload (список фото)
# - assetsDir (путь к папке)

# 4. Запусти
node scripts/download-and-upload-[category]-photos.cjs
```

---

## Troubleshooting

### ❌ Ошибка: "The file is not supported on trial accounts"

**Причина:** Пытаешься загрузить фото по URL вместо локального файла.

**Решение:**
```javascript
// ❌ НЕ РАБОТАЕТ:
originalSource: "https://images.unsplash.com/..."

// ✅ РАБОТАЕТ:
const fileBuffer = fs.readFileSync('./local-image.jpg');
const base64Image = fileBuffer.toString('base64');
attachment: base64Image
```

### ❌ Ошибка: "The uploaded image is corrupt"

**Причина:** Файл поврежден или неправильно закодирован.

**Решение:**
1. Проверь что файл существует: `ls -lh src/assets/[category]/[filename]`
2. Открой файл в браузере - открывается ли?
3. Пересохрани файл в JPG формате
4. Уменьши размер файла (< 500 KB)

### ❌ Ошибка: "HTTP 422: Unprocessable Entity"

**Причина:** Некорректный GraphQL запрос или данные.

**Решение:**
1. Проверь синтаксис GraphQL
2. Используй тройные кавычки для многострочного текста:
   ```javascript
   descriptionHtml: """${description}"""
   ```
3. Убери специальные символы из описания

### ❌ Ошибка: "Product not found"

**Причина:** Неправильный handle или Product ID.

**Решение:**
```bash
# Найди правильный handle:
curl -X POST 'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json' \
  -H 'X-Shopify-Access-Token: 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' \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ products(first: 10) { edges { node { id handle title } } } }"}' \
  | jq '.data.products.edges[].node'
```

### ❌ Фото не отображаются на сайте

**Причина:** Storefront API не возвращает images.

**Решение:**
1. Проверь что фото загружены в Shopify Admin
2. Подожди 1-2 минуты (кеш)
3. Проверь Storefront API query:
   ```graphql
   query {
     productByHandle(handle: "...") {
       images(first: 10) {
         edges {
           node {
             url
             altText
           }
         }
       }
     }
   }
   ```
4. Используй fallback placeholder images в коде

---

## 📊 Чеклист успешной загрузки

### Перед запуском:
- [ ] Фото скачаны локально в `src/assets/[category]/`
- [ ] Размер каждого фото < 500 KB
- [ ] Product ID найден и корректен
- [ ] Shopify Access Token актуален
- [ ] Скрипт скопирован из эталона

### После загрузки:
- [ ] Скрипт завершился без ошибок
- [ ] Фото видны в Shopify Admin
- [ ] Alt text заполнен для всех фото
- [ ] Описание обновлено
- [ ] Фото отображаются на сайте
- [ ] Детальная страница работает корректно

---

## 🎓 Примеры успешных загрузок

### Central Festival (4 фото):
```bash
✅ central-interior-luxury.jpg (126 KB) - ID: 37222039879734
✅ central-entrance-green.jpg (219 KB) - ID: 37222039912502
✅ central-exterior.jpg (173 KB) - ID: 37222039978038
✅ central-passage.jpg (141 KB) - ID: 37222040010806
```

### Phi-Phi Tour (1 фото):
```bash
✅ phi-phi-hero.jpg (273 KB) - ID: 37182986551350
```

---

## 🔗 Полезные ссылки

- **Shopify Admin:** https://admin.shopify.com/store/phuket-telegram-shop-117ck
- **Shopify REST API Docs:** https://shopify.dev/docs/api/admin-rest/2025-07/resources/product-image
- **Shopify GraphQL Docs:** https://shopify.dev/docs/api/admin-graphql/2025-07/mutations/productUpdate
- **Unsplash:** https://unsplash.com
- **Эталонные скрипты:** `scripts/download-and-upload-central-photos.cjs`

---

**Last Updated:** October 27, 2025  
**Author:** AI Agent (Claude with 40% equity)  
**Status:** ✅ РАБОТАЕТ на Trial Account!

