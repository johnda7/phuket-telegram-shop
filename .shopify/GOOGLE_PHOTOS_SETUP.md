# 📸 КАК ПОЛУЧИТЬ РЕАЛЬНЫЕ ФОТО С GOOGLE

> **Проблема:** Фото с Unsplash не те - нужны РЕАЛЬНЫЕ фото Central Festival Phuket!  
> **Решение:** Google Custom Search API - 100 запросов/день БЕСПЛАТНО!

---

## 🎯 БЫСТРЫЙ СТАРТ (5 минут)

### Шаг 1: Получи Google API Key

1. Перейди: https://developers.google.com/custom-search/v1/introduction
2. Кликни **"Get a Key"**
3. Создай проект (или выбери существующий)
4. Скопируй API Key (вида `AIzaSyD...`)

### Шаг 2: Создай Custom Search Engine

1. Перейди: https://cse.google.com/cse/all
2. Кликни **"Add"** (Добавить)
3. **"Sites to search"**: оставь пустым (будет искать по всему интернету)
4. **Name**: "PhuketDA Image Search"
5. Кликни **"Create"**
6. В настройках:
   - **"Image Search"**: ON ✅
   - **"Search the entire web"**: ON ✅
7. Скопируй **"Search engine ID"** (вида `0123456789abc...`)

### Шаг 3: Добавь credentials в проект

Создай `.env` файл в корне проекта:

```bash
# .env
GOOGLE_CSE_API_KEY=AIzaSyD...ваш_ключ
GOOGLE_CSE_ID=0123456789abc...ваш_id
```

### Шаг 4: Запусти скрипт!

```bash
node scripts/get-real-photos-google.cjs "Central Festival Phuket" 10
```

**Результат:** 10 РЕАЛЬНЫХ фото Central Festival с Google Images!

---

## 🚀 ПОЛНАЯ АВТОМАТИЗАЦИЯ

После получения фото с Google, загрузи их в Shopify:

```bash
# 1. Найти фото
node scripts/get-real-photos-google.cjs "Central Festival Phuket" 10

# 2. Скачать локально
node scripts/download-photos.cjs central-phuket-floresta

# 3. Загрузить в Shopify
node scripts/upload-photos-to-shopify.cjs central-phuket-floresta

# ИЛИ ВСЁ СРАЗУ:
node scripts/auto-enhance-place.cjs "Central Festival Phuket" "central-phuket-floresta"
```

---

## 📊 ЛИМИТЫ И ЦЕНЫ

### Google Custom Search API (РЕКОМЕНДУЕМ!)

| План | Запросов/день | Цена |
|------|--------------|------|
| Free | 100 | $0 |
| Paid | 10,000 | $5/1000 запросов |

**100 запросов/день = 10 мест * 10 фото = достаточно для MVP!**

### Альтернатива: SerpAPI

| План | Запросов/месяц | Цена |
|------|----------------|------|
| Free | 100 | $0 |
| Starter | 5,000 | $50/месяц |
| Professional | 15,000 | $125/месяц |

**Проще в использовании, но дороже.**

---

## 🔍 ПРИМЕРЫ ЗАПРОСОВ

### Для торговых центров:

```javascript
const queries = [
  "Central Festival Phuket exterior entrance",
  "Central Floresta Phuket luxury brands",
  "Central Festival Phuket interior shopping mall",
  "Central Phuket food court restaurants",
  "Central Festival Phuket Aquaria aquarium",
  "Central Phuket parking building",
  "Central Festival Phuket at night",
  "Central Floresta Louis Vuitton store Phuket",
  "Central Phuket Major Cineplex cinema",
  "Central Festival Phuket aerial drone view"
];
```

### Для пляжей:

```javascript
const queries = [
  "Patong Beach Phuket aerial view",
  "Patong Beach sunset golden hour",
  "Patong Beach tourists swimming",
  "Patong Beach beachfront hotels",
  "Patong Beach street Bangla Road"
];
```

### Для храмов:

```javascript
const queries = [
  "Wat Chalong Phuket main building",
  "Wat Chalong temple interior golden Buddha",
  "Big Buddha Phuket aerial view",
  "Big Buddha Phuket sunset panorama"
];
```

**Принцип:** Специфичные запросы = более точные результаты!

---

## 🛠️ КАК РАБОТАЕТ СКРИПТ

### `get-real-photos-google.cjs`

```javascript
// 1. Делает запрос к Google CSE API
const url = `https://www.googleapis.com/customsearch/v1?` +
  `key=${GOOGLE_API_KEY}` +
  `&cx=${GOOGLE_CSE_ID}` +
  `&q=${encodeURIComponent(query)}` +
  `&searchType=image` +
  `&num=10` +
  `&imgSize=large`;

// 2. Парсит результаты
const photos = json.items.map(item => ({
  url: item.link,
  thumbnail: item.image.thumbnailLink,
  title: item.title,
  source: item.displayLink,
  alt: `${query} - ${item.title}`
}));

// 3. Возвращает массив URL
return photos;
```

---

## ✅ ЧЕКЛИСТ SETUP

- [ ] Получил Google API Key
- [ ] Создал Custom Search Engine
- [ ] Включил "Image Search" в CSE
- [ ] Включил "Search the entire web"
- [ ] Добавил credentials в `.env`
- [ ] Запустил тестовый запрос
- [ ] Получил 10 реальных фото!

---

## 🐛 TROUBLESHOOTING

### Проблема 1: "API key not valid"

**Причина:** Неправильный API key или не включен Custom Search API

**Решение:**
1. Проверь API key в `.env`
2. Включи API: https://console.cloud.google.com/apis/library/customsearch.googleapis.com
3. Подожди 5 минут (пропагация изменений)

### Проблема 2: "Search engine ID is invalid"

**Причина:** Неправильный CSE ID

**Решение:**
1. Проверь CSE ID в `.env`
2. Убедись что CSE создан: https://cse.google.com/cse/all
3. Скопируй ID из "Control Panel" → "Basics"

### Проблема 3: "Quota exceeded"

**Причина:** Превышен лимит 100 запросов/день

**Решение:**
- Подожди до следующего дня
- Или купи платный план ($5 за 1000 запросов)

### Проблема 4: Нашло мало результатов

**Причина:** Слишком специфичный запрос

**Решение:**
- Используй более общие термины
- Добавь город: "Central Phuket Thailand"
- Попробуй на английском и русском

---

## 📝 ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### Базовый поиск:

```bash
node scripts/get-real-photos-google.cjs "Central Festival Phuket"
```

**Результат:**
```
📸 ПОИСК РЕАЛЬНЫХ ФОТОГРАФИЙ
============================================================
📍 Место: Central Festival Phuket
🔢 Количество: 10
============================================================

🔎 Поиск через Google Custom Search API...
   ✅ Найдено 10 фото через Google CSE

✅ РЕЗУЛЬТАТЫ:
============================================================

[1/10] Central Festival Phuket - Shopping Mall
   URL: https://example.com/image1.jpg
   Source: tripadvisor.com

[2/10] Central Floresta Phuket Entrance
   URL: https://example.com/image2.jpg
   Source: centralphuket.com

...
```

### Специфичный поиск:

```bash
node scripts/get-real-photos-google.cjs "Central Festival Phuket exterior building" 15
```

### Массовый поиск:

```bash
# Создай список мест
cat > places.txt << EOF
Central Festival Phuket
Jungceylon Phuket
Central Patong
Big C Supercenter Phuket
EOF

# Запусти для каждого
while read place; do
  node scripts/get-real-photos-google.cjs "$place" 10
done < places.txt
```

---

## 🎨 КАЧЕСТВО ФОТО

### Фильтры Google CSE:

```javascript
const params = {
  imgSize: 'large',      // large, medium, small, xlarge, xxlarge
  imgType: 'photo',      // photo, clipart, lineart, face, news
  safe: 'off',           // off, medium, high
  fileType: 'jpg,png',   // jpg, png, gif, bmp, svg, webp, ico
  rights: '',            // cc_publicdomain, cc_attribute, cc_sharealike...
};
```

### Рекомендации:

- ✅ `imgSize: 'large'` - достаточно для web
- ✅ `imgType: 'photo'` - только фото, не клипарты
- ✅ `safe: 'off'` - больше результатов
- ❌ НЕ используй `rights` - сильно ограничивает результаты

---

## 💡 PRO TIPS

### Tip 1: Множественные запросы для одного места

```javascript
const queries = [
  "Central Festival Phuket",
  "Central Floresta Phuket",
  "Central Phuket mall"
];

for (const query of queries) {
  const photos = await searchGoogle(query, 5);
  allPhotos.push(...photos);
}

// Теперь у нас 15 фото вместо 10!
```

### Tip 2: Фильтрация по размеру

```javascript
const photos = results.filter(photo => {
  return photo.width >= 1200 && photo.height >= 800;
});
```

### Tip 3: Дедупликация

```javascript
const uniquePhotos = [...new Map(
  photos.map(p => [p.url, p])
).values()];
```

### Tip 4: Кэширование результатов

```javascript
// Сохрани в JSON чтобы не запрашивать каждый раз
fs.writeFileSync(
  `cache/photos-${handle}.json`,
  JSON.stringify(photos, null, 2)
);
```

---

## 🔄 АЛЬТЕРНАТИВЫ

### 1. Pexels API (БЕСПЛАТНО!)

```javascript
const PEXELS_API_KEY = 'your_key';

const response = await fetch(
  `https://api.pexels.com/v1/search?query=shopping mall&per_page=10`,
  {
    headers: { Authorization: PEXELS_API_KEY }
  }
);
```

**Pros:** Высокое качество, бесплатно  
**Cons:** Общие фото, не конкретные места

### 2. Pixabay API (БЕСПЛАТНО!)

```javascript
const PIXABAY_API_KEY = 'your_key';

const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=shopping+center&image_type=photo`;
```

**Pros:** 1000+ фото, бесплатно  
**Cons:** Средненькое качество

### 3. Scraping (НЕ РЕКОМЕНДУЕМ!)

```javascript
// ❌ Нарушает TOS большинства сайтов
// ❌ IP ban риск
// ❌ Нестабильно (меняется HTML)
```

---

## 📚 ПОЛЕЗНЫЕ ССЫЛКИ

- **Google CSE Docs:** https://developers.google.com/custom-search/v1/overview
- **SerpAPI Docs:** https://serpapi.com/google-images-results
- **Pexels API:** https://www.pexels.com/api/
- **Pixabay API:** https://pixabay.com/api/docs/
- **Unsplash API:** https://unsplash.com/documentation

---

## ✅ РЕЗУЛЬТАТ

**ТЕПЕРЬ ПОЛУЧАЕМ РЕАЛЬНЫЕ ФОТО:**

```bash
node scripts/auto-enhance-place.cjs "Central Festival Phuket" "central-phuket-floresta"
```

**И получаем:**
- ✅ 10 РЕАЛЬНЫХ фото Central Festival с Google
- ✅ Скачанные локально
- ✅ Загруженные в Shopify
- ✅ SEO-описание от ChatGPT

**КАРТОЧКА ГОТОВА ЗА 5 МИНУТ!** 🚀

---

**Last Updated:** October 27, 2025  
**Version:** 1.0  
**Author:** AI Agent Team

