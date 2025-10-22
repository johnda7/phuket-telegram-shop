# 🔄 МИГРАЦИЯ PHUKET-GO → PHUKETDA

> **Анализ существующего проекта и план переноса в Shopify CMS**

---

## 📊 АНАЛИЗ СУЩЕСТВУЮЩЕГО ПРОЕКТА

### 🏗️ Репозиторий: island-travel-echo-clone

**GitHub:** https://github.com/johnda7/island-travel-echo-clone

**Технологии:**
- React + TypeScript
- Vite
- Модульная структура туров
- Supabase CMS (частично)
- iOS 26 Design System

---

## 📦 ЧТО УЖЕ ЕСТЬ

### ✅ Готовые туры (13+ туров):

**Островные туры:**
1. **Пхи-Пхи 2 дня/1 ночь** (`phi-phi-2days`)
2. **4 жемчужины Андаманского моря** (`pearls-andaman-sea`)
3. **11 островов Стандарт** (`eleven-islands-standard`)
4. **11 островов Мега** (`eleven-islands-mega`)
5. **Рача + Коралловый** (`racha-coral-rawai`)
6. **Пхи-Пхи Sunrise** (`phi-phi-sunrise`)
7. **Симиланские острова** (несколько вариантов)

**Материковые туры:**
8. **Остров Джеймса Бонда** (`james-bond-island`)
9. **Пхангнга + Стеклянный мост** (`phang-nga-skywalk`)
10. **Достопримечательности Пхукета** (`dostoprimechatelnosti-phuketa`)
11. **Као Лак сафари** (`kao-lak-safari`)

**Приключения:**
12. **Рафтинг + СПА + ATV** (`rafting-spa-atv`)
13. **Рафтинг + СПА 1 день** (`rafting-spa-1day`)
14. **Чео Лан + Самет Нангше** (`cheow-lan-lake`)
15. **Аватар + Хангдонг** (`avatar-plus-hangdong`)

---

## 🗂️ СТРУКТУРА ДАННЫХ ТУРА

### Текущая структура (React):

```typescript
// src/data/tours/phi-phi-2days/static.ts
export const phiPhi2DaysTourData: TourData = {
  id: 'phi-phi-2days',
  title: 'Пхи-Пхи 2 дня/1 ночь',
  subtitle: 'Незабываемое путешествие на райские острова',
  route: '/tours/phi-phi-2days-1-night',
  
  gallery: [
    image1,
    image2,
    // ... 15+ фото
  ],
  
  priceAdult: 4800,
  priceChild: 3800,
  currency: '฿',
  
  duration: '2 дня / 1 ночь',
  groupSize: 'До 20 человек',
  
  schedule: [
    {
      day: 1,
      title: 'День 1: Отправление на Пхи-Пхи',
      activities: [
        'Трансфер из отеля',
        'Переезд на пирс',
        'Отправление на острова'
      ]
    }
  ],
  
  included: [
    'Трансфер из отеля и обратно',
    'Проживание в отеле на Пхи-Пхи',
    'Завтрак + обед + ужин'
  ],
  
  notIncluded: [
    'Национальный парк 400฿',
    'Маски и ласты 100฿'
  ]
}
```

### Целевая структура (Shopify):

```json
{
  "title": "🏝️ Пхи-Пхи 2 дня/1 ночь",
  "handle": "phi-phi-2-days-1-night",
  "productType": "Excursions",
  "tags": ["tour", "islands", "2-days", "phi-phi", "snorkeling", "popular"],
  
  "description": "HTML контент со всей информацией",
  
  "variants": [
    {
      "title": "Взрослый",
      "price": "4800",
      "sku": "PHI-PHI-2D-ADULT"
    },
    {
      "title": "Детский (4-11 лет)",
      "price": "3800",
      "sku": "PHI-PHI-2D-CHILD"
    }
  ],
  
  "images": [
    {
      "src": "https://cdn.shopify.com/.../phi-phi-1.jpg",
      "alt": "Пхи-Пхи острова"
    }
  ],
  
  "metafields": {
    "duration": "2 дня / 1 ночь",
    "group_size": "До 20 человек",
    "schedule_json": "[{day:1,...}]",
    "included": "...",
    "not_included": "..."
  }
}
```

---

## 🔄 ПЛАН МИГРАЦИИ

### Фаза 1: Подготовка (1 день)

**1. Создать скрипт парсинга:**
```python
# scripts/parse-tours.py
import json
import re

def parse_tour_data(tour_folder):
    """
    Читает static.ts файл тура
    Извлекает все данные
    Конвертирует в Shopify формат
    """
    pass
```

**2. Создать маппинг полей:**
```json
{
  "id": "handle",
  "title": "title",
  "subtitle": "description (часть)",
  "priceAdult": "variants[0].price",
  "priceChild": "variants[1].price",
  "gallery": "images",
  "schedule": "metafields.schedule_json",
  "included": "metafields.included",
  "notIncluded": "metafields.not_included"
}
```

---

### Фаза 2: Загрузка изображений (2 дня)

**Что нужно сделать:**

1. **Скачать все изображения из репозитория**
   - `src/assets/phi-phi-2days/*.jpg`
   - `src/assets/pearls-andaman-sea/*.jpg`
   - И т.д. для всех 15+ туров

2. **Загрузить в Shopify Media Library**
   ```python
   for tour in tours:
       for image in tour.images:
           shopify.upload_image(image)
   ```

3. **Получить CDN URL для каждого изображения**

---

### Фаза 3: Создание туров в Shopify (3 дня)

**Автоматический скрипт:**

```python
# scripts/migrate-to-shopify.py

import json
from shopify_api import create_product

# Парсим все туры
tours = parse_all_tours('src/data/tours/')

for tour in tours:
    # Конвертируем в Shopify формат
    shopify_product = {
        "title": tour['title'],
        "handle": transliterate(tour['id']),
        "productType": "Excursions",
        "tags": generate_tags(tour),
        "description": generate_html_description(tour),
        "variants": [
            {
                "title": "Взрослый",
                "price": tour['priceAdult'] / 40,  # ฿ → USD
                "sku": f"{tour['id'].upper()}-ADULT"
            },
            {
                "title": "Детский (4-11 лет)",
                "price": tour['priceChild'] / 40,
                "sku": f"{tour['id'].upper()}-CHILD"
            }
        ],
        "images": upload_images(tour['gallery']),
        "metafields": {
            "namespace": "tour_data",
            "key": "schedule",
            "value": json.dumps(tour['schedule']),
            "type": "json"
        }
    }
    
    # Создаём в Shopify
    result = create_product(shopify_product)
    print(f"✅ Создан: {result['title']}")
```

---

### Фаза 4: Проверка и тестирование (1 день)

**Чек-лист:**

- [ ] Все 15+ туров в Shopify
- [ ] Все изображения загружены
- [ ] Цены правильные (USD)
- [ ] Варианты (взрослый/детский)
- [ ] Теги проставлены
- [ ] Handle без эмодзи
- [ ] Описания полные
- [ ] Metafields с расписанием

---

## 📋 ДЕТАЛЬНЫЙ ПЛАН ПО ТУРАМ

### Приоритет 1 (Топ-5, запускаем первыми):

1. ✅ **Пхи-Пхи 2 дня/1 ночь** (уже есть!)
2. **4 жемчужины Андаманского моря**
3. **11 островов Мега**
4. **Остров Джеймса Бонда**
5. **Симиланские острова**

### Приоритет 2 (Добавляем через неделю):

6. **Достопримечательности Пхукета**
7. **Пхангнга + Стеклянный мост**
8. **Рафтинг + СПА + ATV**
9. **Чео Лан + Самет Нангше**
10. **Рача + Коралловый**

### Приоритет 3 (Остальные):

11-15. Остальные туры

---

## 🔧 ТЕХНИЧЕСКИЕ ДЕТАЛИ

### Конвертация цен:

```javascript
// ฿ (тайский бат) → USD
const THB_TO_USD = 40;

function convertPrice(priceInTHB) {
  return (priceInTHB / THB_TO_USD).toFixed(2);
}

// Пример:
// 4800 ฿ → $120 USD
// 3800 ฿ → $95 USD
```

### Генерация handle:

```javascript
function generateHandle(tourId) {
  // phi-phi-2days → phi-phi-2-days-1-night
  return tourId
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}
```

### Генерация тегов:

```javascript
function generateTags(tour) {
  const tags = ['tour'];
  
  // Категория
  if (tour.category === 'islands') tags.push('islands');
  if (tour.category === 'mainland') tags.push('mainland');
  
  // Длительность
  if (tour.duration.includes('2 дня')) tags.push('2-days');
  if (tour.duration.includes('1 день')) tags.push('1-day');
  
  // Активности
  if (tour.title.includes('Пхи-Пхи')) tags.push('phi-phi');
  if (tour.title.includes('Симилан')) tags.push('similan');
  if (tour.title.includes('снорклинг')) tags.push('snorkeling');
  if (tour.title.includes('рафтинг')) tags.push('rafting');
  
  // Популярность
  if (tour.popular) tags.push('popular');
  
  return tags;
}
```

---

## 📊 METAFIELDS СТРУКТУРА

### Для хранения дополнительной информации:

```json
{
  "metafields": [
    {
      "namespace": "tour_data",
      "key": "duration",
      "value": "2 дня / 1 ночь",
      "type": "single_line_text_field"
    },
    {
      "namespace": "tour_data",
      "key": "group_size",
      "value": "До 20 человек",
      "type": "single_line_text_field"
    },
    {
      "namespace": "tour_data",
      "key": "schedule",
      "value": "[{\"day\":1,\"title\":\"...\"}]",
      "type": "json"
    },
    {
      "namespace": "tour_data",
      "key": "included",
      "value": "Трансфер|Проживание|Питание",
      "type": "list.single_line_text_field"
    },
    {
      "namespace": "tour_data",
      "key": "not_included",
      "value": "Нац.парк 400฿|Маски 100฿",
      "type": "list.single_line_text_field"
    }
  ]
}
```

---

## 🎯 РЕЗУЛЬТАТ МИГРАЦИИ

### Что получим:

✅ **15+ туров в Shopify**
- Все данные сохранены
- Изображения загружены
- Цены в USD
- Варианты (взрослый/детский)
- SEO-friendly handles

✅ **Shopify как единый CMS**
- AI-агенты могут создавать новые туры
- Безопасное управление контентом
- Готовый Checkout
- Аналитика продаж

✅ **Совместимость с PhuketDa**
- Интеграция с Telegram WebApp
- AI-бот может читать данные
- Автоматическое создание контента

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ

### Что делаем дальше:

1. **Создаём скрипт миграции** (Python или Node.js)
2. **Тестируем на 1 туре** (Пхи-Пхи уже есть)
3. **Мигрируем Топ-5 туров** (приоритет 1)
4. **Проверяем на фронтенде** (отображение в PhuketDa)
5. **Мигрируем остальные туры** (приоритет 2-3)

---

**Created:** October 22, 2025  
**Status:** План готов к реализации ✅  
**Next:** Создание скрипта миграции

---

**Вопросы для обсуждения:**
1. Конвертировать цены в USD или оставить в THB?
2. Создавать metafields для расписания или HTML в description?
3. Загружать изображения вручную или автоматически?
