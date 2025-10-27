# 📸 РУКОВОДСТВО ПО РАБОТЕ С ФОТОГРАФИЯМИ

> **⚠️ ВАЖНО!** Это руководство основано на успешном опыте загрузки фотографий для категории "Торговые центры". Следуйте ему для всех категорий!

---

## 🎯 СТРАТЕГИЯ РАБОТЫ С ФОТОГРАФИЯМИ

### Проблема:
- **Trial аккаунт Shopify** не позволяет загружать внешние URL
- **Storefront API** не возвращает metafields корректно
- **Нужно быстро заполнить** все категории качественными изображениями

### Решение:
1. **Placeholder изображения** для быстрого заполнения
2. **Реальные фотографии** загружаются позже
3. **Автоматизация** процесса загрузки

---

## 📁 СТРУКТУРА ФОТОГРАФИЙ

### Организация по категориям:
```
photos/
├── shopping/           ← Торговые центры
│   ├── central-1.jpg
│   ├── central-2.jpg
│   └── central-3.jpg
├── beaches/            ← Пляжи
│   ├── patong-1.jpg
│   ├── patong-2.jpg
│   └── patong-3.jpg
├── temples/            ← Храмы
│   ├── wat-chalong-1.jpg
│   ├── wat-chalong-2.jpg
│   └── wat-chalong-3.jpg
└── restaurants/        ← Рестораны
    ├── blue-elephant-1.jpg
    ├── blue-elephant-2.jpg
    └── blue-elephant-3.jpg
```

### Именование файлов:
```
[place-handle]-[number].jpg
```

**Примеры:**
- `central-phuket-floresta-1.jpg`
- `patong-beach-1.jpg`
- `wat-chalong-1.jpg`
- `blue-elephant-1.jpg`

---

## 🔧 ПОШАГОВОЕ РУКОВОДСТВО

### ШАГ 1: Создание placeholder изображений

#### 1.1 Создайте скрипт для генерации placeholder:

```javascript
// scripts/create-[category]-placeholders.cjs
const fs = require('fs');
const path = require('path');

const category = process.argv[2]; // shopping, beaches, temples, restaurants
const places = [
  { handle: 'central-phuket-floresta', name: 'Central Phuket' },
  { handle: 'jungceylon-shopping-center', name: 'Jungceylon' },
  // ... остальные места
];

const PHOTOS_DIR = path.join(__dirname, `../photos/${category}`);

// Создаем папку если не существует
if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

const colors = ['#2E8B57', '#4682B4', '#CD853F', '#8B4513', '#708090', '#696969'];

function createSvgPlaceholder(text, color, width = 1200, height = 800) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <text x="50%" y="50%" font-family="Segoe UI, sans-serif" font-size="60" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;
}

async function createPlaceholders() {
  console.log(`🎨 Создаем placeholder изображения для категории: ${category}`);
  
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    console.log(`📷 [${i + 1}/${places.length}] ${place.name}`);
    
    // Создаем 3 изображения для каждого места
    for (let j = 1; j <= 3; j++) {
      const filename = `${place.handle}-${j}.svg`;
      const filepath = path.join(PHOTOS_DIR, filename);
      const color = colors[j - 1];
      const text = `${place.name} - Фото ${j}`;
      
      try {
        const svgContent = createSvgPlaceholder(text, color);
        fs.writeFileSync(filepath, svgContent.trim());
        console.log(`   ✅ Создано: ${filename}`);
      } catch (error) {
        console.error(`   ❌ Ошибка:`, error.message);
      }
    }
    console.log('');
  }
  
  console.log('🎉 Placeholder изображения созданы!');
}

createPlaceholders().catch(console.error);
```

#### 1.2 Запустите скрипт:

```bash
node scripts/create-shopping-placeholders.cjs
node scripts/create-beaches-placeholders.cjs
node scripts/create-temples-placeholders.cjs
node scripts/create-restaurants-placeholders.cjs
```

### ШАГ 2: Загрузка placeholder в Shopify

#### 2.1 Создайте скрипт для загрузки:

```javascript
// scripts/upload-[category]-placeholders.cjs
const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

const category = process.argv[2];
const PHOTOS_DIR = path.join(__dirname, `../photos/${category}`);

// Получаем ID продуктов для категории
async function getProductIds() {
  const query = `
    query {
      products(first: 50, query: "product_type:Information AND tag:${category}") {
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
  
  const response = await makeGraphQLRequest(query);
  return response.data.products.edges.map(edge => ({
    id: edge.node.id,
    handle: edge.node.handle,
    title: edge.node.title
  }));
}

// Загружаем изображение в Shopify
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

async function uploadPlaceholders() {
  console.log(`📸 ЗАГРУЗКА PLACEHOLDER ИЗОБРАЖЕНИЙ ДЛЯ КАТЕГОРИИ: ${category}`);
  
  // Получаем ID продуктов
  const products = await getProductIds();
  console.log(`📋 Найдено продуктов: ${products.length}`);
  
  let totalUploaded = 0;
  let totalErrors = 0;
  
  for (const product of products) {
    console.log(`\n🏢 ${product.title}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   ID: ${product.id}`);
    
    // Ищем файлы для этого продукта
    const files = fs.readdirSync(PHOTOS_DIR)
      .filter(file => file.startsWith(product.handle) && file.endsWith('.svg'));
    
    console.log(`   📁 Найдено файлов: ${files.length}`);
    
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      const filepath = path.join(PHOTOS_DIR, filename);
      
      console.log(`   📷 [${i + 1}/${files.length}] ${filename}`);
      
      try {
        // Читаем SVG файл
        const svgContent = fs.readFileSync(filepath, 'utf8');
        const base64Image = Buffer.from(svgContent).toString('base64');
        
        // Загружаем в Shopify
        const result = await uploadImageToShopify(
          base64Image,
          filename.replace('.svg', '.jpg'), // Меняем расширение
          `${product.title} - Фото ${i + 1}`,
          product.id
        );
        
        console.log(`      ✅ Загружено! ID: ${result.id}`);
        totalUploaded++;
        
        // Пауза между загрузками
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`      ❌ Ошибка:`, error.message);
        totalErrors++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ ЗАГРУЗКИ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно загружено: ${totalUploaded}`);
  console.log(`❌ Ошибок: ${totalErrors}`);
  console.log(`📁 Категория: ${category}`);
  
  if (totalUploaded > 0) {
    console.log('\n🎉 PLACEHOLDER ИЗОБРАЖЕНИЯ ЗАГРУЖЕНЫ!');
    console.log(`🌐 Проверьте: http://localhost:8080/category/${category}`);
  }
}

uploadPlaceholders().catch(console.error);
```

#### 2.2 Запустите загрузку:

```bash
node scripts/upload-shopping-placeholders.cjs
node scripts/upload-beaches-placeholders.cjs
node scripts/upload-temples-placeholders.cjs
node scripts/upload-restaurants-placeholders.cjs
```

### ШАГ 3: Замена на реальные фотографии (позже)

#### 3.1 Создайте скрипт для поиска реальных фото:

```javascript
// scripts/find-real-photos-[category].cjs
const category = process.argv[2];
const places = [
  { handle: 'central-phuket-floresta', searchTerms: ['Central Phuket shopping center', 'Central Festival Phuket'] },
  { handle: 'patong-beach', searchTerms: ['Patong Beach Phuket', 'Patong Beach Thailand'] },
  // ... остальные места
];

console.log(`🔍 ПОИСК РЕАЛЬНЫХ ФОТОГРАФИЙ ДЛЯ КАТЕГОРИИ: ${category}`);

for (const place of places) {
  console.log(`\n📷 ${place.handle}`);
  console.log(`   Поисковые запросы:`);
  
  place.searchTerms.forEach((term, index) => {
    console.log(`   ${index + 1}. "${term}"`);
    console.log(`      Google Images: https://www.google.com/search?q=${encodeURIComponent(term)}&tbm=isch`);
    console.log(`      Unsplash: https://unsplash.com/s/photos/${encodeURIComponent(term)}`);
  });
  
  console.log(`   📝 Рекомендации:`);
  console.log(`   - Выберите 3-6 качественных фотографий`);
  console.log(`   - Размер: минимум 1200x800 пикселей`);
  console.log(`   - Формат: JPG или PNG`);
  console.log(`   - Сохраните как: ${place.handle}-1.jpg, ${place.handle}-2.jpg, и т.д.`);
  console.log(`   - Поместите в папку: photos/${category}/`);
}
```

#### 3.2 Создайте скрипт для загрузки реальных фото:

```javascript
// scripts/upload-real-photos-[category].cjs
const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

const category = process.argv[2];
const PHOTOS_DIR = path.join(__dirname, `../photos/${category}`);

async function uploadRealPhotos() {
  console.log(`📸 ЗАГРУЗКА РЕАЛЬНЫХ ФОТОГРАФИЙ ДЛЯ КАТЕГОРИИ: ${category}`);
  
  // Получаем ID продуктов
  const products = await getProductIds();
  
  let totalUploaded = 0;
  let totalErrors = 0;
  
  for (const product of products) {
    console.log(`\n🏢 ${product.title}`);
    
    // Ищем JPG файлы для этого продукта
    const files = fs.readdirSync(PHOTOS_DIR)
      .filter(file => file.startsWith(product.handle) && (file.endsWith('.jpg') || file.endsWith('.jpeg')));
    
    console.log(`   📁 Найдено JPG файлов: ${files.length}`);
    
    if (files.length === 0) {
      console.log(`   ⚠️  Нет реальных фотографий. Используйте placeholder.`);
      continue;
    }
    
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      const filepath = path.join(PHOTOS_DIR, filename);
      
      console.log(`   📷 [${i + 1}/${files.length}] ${filename}`);
      
      try {
        // Читаем JPG файл
        const fileBuffer = fs.readFileSync(filepath);
        const base64Image = fileBuffer.toString('base64');
        
        // Загружаем в Shopify
        const result = await uploadImageToShopify(
          base64Image,
          filename,
          `${product.title} - Фото ${i + 1}`,
          product.id
        );
        
        console.log(`      ✅ Загружено! ID: ${result.id}`);
        console.log(`      🔗 URL: ${result.src}`);
        totalUploaded++;
        
        // Пауза между загрузками
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (error) {
        console.error(`      ❌ Ошибка:`, error.message);
        totalErrors++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ ЗАГРУЗКИ РЕАЛЬНЫХ ФОТОГРАФИЙ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно загружено: ${totalUploaded}`);
  console.log(`❌ Ошибок: ${totalErrors}`);
  console.log(`📁 Категория: ${category}`);
}

uploadRealPhotos().catch(console.error);
```

---

## 🚨 КРИТИЧЕСКИЕ ОШИБКИ С ФОТОГРАФИЯМИ

### ❌ ОШИБКА #1: Загрузка внешних URL
```javascript
// ❌ НЕ РАБОТАЕТ! (Trial аккаунт)
originalSource: "https://images.unsplash.com/photo-123.jpg"

// ✅ РАБОТАЕТ!
attachment: base64Image  // Локальный файл через base64
```

### ❌ ОШИБКА #2: Неправильный MIME тип
```javascript
// ❌ НЕ РАБОТАЕТ!
Content-Type: "image/svg+xml"  // Для SVG

// ✅ РАБОТАЕТ!
Content-Type: "application/json"  // Всегда JSON для REST API
```

### ❌ ОШИБКА #3: Слишком большие файлы
```javascript
// ❌ НЕ РАБОТАЕТ!
const hugeImage = fs.readFileSync('huge-photo.jpg'); // 10MB

// ✅ РАБОТАЕТ!
// Оптимизируйте изображения до 1-2MB максимум
```

### ❌ ОШИБКА #4: Неправильное именование файлов
```javascript
// ❌ НЕ РАБОТАЕТ!
filename: "Central Phuket (1).jpg"  // Спецсимволы

// ✅ РАБОТАЕТ!
filename: "central-phuket-floresta-1.jpg"  // Только латиница и дефисы
```

### ❌ ОШИБКА #5: Отсутствие паузы между запросами
```javascript
// ❌ НЕ РАБОТАЕТ!
for (const photo of photos) {
  await uploadPhoto(photo); // Спамит API
}

// ✅ РАБОТАЕТ!
for (const photo of photos) {
  await uploadPhoto(photo);
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 сек пауза
}
```

---

## 📋 ЧЕКЛИСТ ДЛЯ ФОТОГРАФИЙ

### Перед загрузкой:
- [ ] Создана папка `photos/[category]/`
- [ ] Файлы названы правильно: `[handle]-[number].jpg`
- [ ] Изображения оптимизированы (1-2MB максимум)
- [ ] Формат: JPG или PNG (не SVG для реальных фото)
- [ ] Размер: минимум 1200x800 пикселей

### Во время загрузки:
- [ ] Используется REST API (не GraphQL для изображений)
- [ ] Правильный Content-Type: application/json
- [ ] Base64 кодирование изображений
- [ ] Пауза 1.5 секунды между загрузками
- [ ] Проверка статуса ответа (200 или 201)

### После загрузки:
- [ ] Проверка в Shopify Admin
- [ ] Проверка на сайте в браузере
- [ ] Все изображения отображаются
- [ ] Галерея работает корректно
- [ ] Навигация по фотографиям работает

---

## 🎯 РЕКОМЕНДАЦИИ ПО КАЧЕСТВУ

### Для placeholder изображений:
- **Размер:** 1200x800 пикселей
- **Формат:** SVG (легкий, масштабируемый)
- **Цвета:** Разные для каждого изображения
- **Текст:** Понятное описание места

### Для реальных фотографий:
- **Размер:** 1200x800 или больше
- **Формат:** JPG (оптимизированный)
- **Качество:** Высокое, но сжатое
- **Содержание:** Репрезентативные фото места
- **Количество:** 3-6 фотографий на место

### Источники реальных фотографий:
1. **Google Images** - поиск по названию места
2. **Unsplash** - качественные стоковые фото
3. **TripAdvisor** - фото от туристов
4. **Официальные сайты** - промо материалы
5. **Instagram** - актуальные фото с хештегами

---

## 🚀 АВТОМАТИЗАЦИЯ

### Создайте мастер-скрипт:

```javascript
// scripts/setup-category-photos.cjs
const category = process.argv[2];

if (!category) {
  console.error('❌ Укажите категорию: node setup-category-photos.cjs beaches');
  process.exit(1);
}

console.log(`🚀 Настройка фотографий для категории: ${category}`);

async function setupCategoryPhotos() {
  // 1. Создать placeholder изображения
  console.log('1️⃣ Создаем placeholder изображения...');
  await createPlaceholders(category);
  
  // 2. Загрузить placeholder в Shopify
  console.log('2️⃣ Загружаем placeholder в Shopify...');
  await uploadPlaceholders(category);
  
  // 3. Показать ссылки для поиска реальных фото
  console.log('3️⃣ Показываем ссылки для поиска реальных фото...');
  await showPhotoSearchLinks(category);
  
  console.log('✅ Настройка завершена!');
  console.log(`📁 Placeholder изображения: photos/${category}/`);
  console.log(`🌐 Проверьте: http://localhost:8080/category/${category}`);
}

setupCategoryPhotos().catch(console.error);
```

---

**Последнее обновление:** $(date)  
**Версия:** 1.0  
**Создано на основе:** Успешного опыта с категорией "Торговые центры"

---

🎯 **ПОМНИТЕ:** Placeholder изображения позволяют быстро заполнить все категории, а реальные фотографии можно добавить позже! Главное - не останавливаться на этом этапе! 🚀
