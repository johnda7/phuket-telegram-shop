# Руководство AI Агента по работе с Shopify CMS
## Для Claude Sonnet 4.5 и других AI ассистентов

---

## 🎯 ОБЩАЯ КОНЦЕПЦИЯ ПРОЕКТА

**PhuketDA** - это платформа с двумя типами контента:
1. **Экскурсии (Tours)** - продаваемые продукты с ценами
2. **Полезная информация (Places)** - бесплатный контент (пляжи, храмы, рестораны и т.д.)

Весь контент хранится в **Shopify CMS** и загружается через **Storefront API**.

---

## 📋 ДВА ТИПА КОНТЕНТА В SHOPIFY

### 1. Экскурсии (Tours)
```graphql
productType: "Экскурсии"
price: "3500.00" // реальная цена
tags: ["tour", "islands", "popular", "2-days"]
```

**Особенности:**
- Продаются через корзину
- Имеют реальные цены
- Страница детального просмотра: `/product/{handle}`
- Кнопка "Добавить в корзину"

### 2. Места/Информация (Places)
```graphql
productType: "place"
price: "0.00" // всегда 0
tags: ["place", "category:beaches", "district:Kathu", "popular"]
```

**Особенности:**
- Бесплатный информационный контент
- Не продаются
- Страница детального просмотра: `/place/{handle}`
- Кнопка "Подробнее" (без корзины)

---

## 🏗️ АРХИТЕКТУРА ДАННЫХ SHOPIFY

### Структура продукта Place (на примере пляжа)

```javascript
{
  id: "gid://shopify/Product/...",
  title: "Bang Tao Beach",
  description: "Один из самых больших и красивых пляжей...",
  handle: "bang-tao-beach",
  
  productType: "place",
  
  tags: [
    "place",           // Обязательный маркер
    "category:beaches", // Категория
    "district:Cherngtalay", // Район
    "popular",         // Опциональные теги
    "family",
    "photo"
  ],
  
  priceRange: {
    minVariantPrice: {
      amount: "0.00",
      currencyCode: "THB"
    }
  },
  
  images: [{
    url: "https://cdn.shopify.com/...",
    altText: "Bang Tao Beach"
  }],
  
  metafields: [
    {
      key: "coordinates",
      value: "7.9936,98.2964"
    },
    {
      key: "rating",
      value: "4.7"
    },
    {
      key: "duration",
      value: "Целый день"
    },
    {
      key: "amenities",
      value: "Лежаки,Зонтики,Кафе,Туалеты,Душ"
    },
    {
      key: "best_time",
      value: "Ноябрь-Апрель"
    },
    {
      key: "how_to_get",
      value: "15 минут от аэропорта на такси"
    },
    {
      key: "working_hours",
      value: "Круглосуточно"
    }
  ]
}
```

---

## 🏷️ СИСТЕМА ТЕГОВ

### Обязательные теги:
- `place` - для информационного контента
- `tour` - для экскурсий
- `category:{name}` - категория места

### Категории мест (category:):
```
beaches       - Пляжи
temples       - Храмы
viewpoints    - Смотровые площадки
restaurants   - Рестораны
spa           - СПА и массаж
elephants     - Парки слонов
museums       - Музеи
nightmarkets  - Ночные рынки
shopping      - Торговые центры
attractions   - Достопримечательности
aquaparks     - Аквапарки
```

### Районы (district:):
```
Kathu, Patong, Cherngtalay, Thalang, Chalong, Rawai, Karon, Kamala
```

### Опциональные теги:
```
popular       - Популярное место
family        - Для семей с детьми
romantic      - Романтичное
photo         - Инстаграмное место
free          - Бесплатно
paid          - Платный вход
beach-clean   - Чистый пляж
beach-quiet   - Тихий пляж
```

---

## 📝 METAFIELDS (ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ)

### Обязательные metafields для Places:

| Key | Type | Описание | Пример |
|-----|------|----------|--------|
| `coordinates` | string | GPS координаты | "7.9936,98.2964" |
| `rating` | string | Рейтинг 0-5 | "4.7" |
| `district` | string | Район | "Cherngtalay" |

### Дополнительные metafields:

| Key | Type | Описание |
|-----|------|----------|
| `duration` | string | Рекомендуемое время посещения |
| `amenities` | string | Удобства (через запятую) |
| `best_time` | string | Лучшее время для посещения |
| `how_to_get` | string | Как добраться |
| `working_hours` | string | Часы работы |
| `price_range` | string | Ценовой диапазон |
| `phone` | string | Контактный телефон |
| `website` | string | Официальный сайт |
| `features` | string | Особенности (через запятую) |

---

## 🔄 КАК ЗАГРУЖАТЬ КОНТЕНТ ИЗ SHOPIFY

### Frontend Query (Storefront API)

```javascript
const FETCH_PLACES_QUERY = `
  query GetPlaces($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(
            identifiers: [
              { namespace: "custom", key: "coordinates" }
              { namespace: "custom", key: "rating" }
              { namespace: "custom", key: "district" }
              { namespace: "custom", key: "duration" }
              { namespace: "custom", key: "amenities" }
            ]
          ) {
            key
            value
          }
        }
      }
    }
  }
`;

// Использование
const data = await storefrontApiRequest(FETCH_PLACES_QUERY, {
  first: 50,
  query: "product_type:place tag:category:beaches"
});
```

### Фильтрация по категориям:

```javascript
// Все пляжи
query: "product_type:place tag:category:beaches"

// Популярные храмы
query: "product_type:place tag:category:temples tag:popular"

// Места в районе Патонг
query: "product_type:place tag:district:Patong"
```

---

## ✅ КАК СОЗДАВАТЬ НОВЫЙ РАЗДЕЛ (ПОШАГОВО)

### Пример: Создание раздела "Пляжи"

#### ШАГ 1: Добавить категорию в Shopify

Используй **Shopify Admin API** или добавь вручную через админку:

```javascript
// Создание продукта "Place" для пляжа
const productData = {
  title: "Patong Beach",
  description: "Самый известный и оживленный пляж Пхукета с развитой инфраструктурой...",
  handle: "patong-beach",
  productType: "place",
  tags: ["place", "category:beaches", "district:Patong", "popular", "family"],
  
  variants: [{
    price: "0.00",
    inventoryPolicy: "continue"
  }],
  
  images: [{
    src: "https://example.com/patong-beach.jpg",
    alt: "Patong Beach"
  }],
  
  metafields: [
    {
      namespace: "custom",
      key: "coordinates",
      value: "7.8965,98.2965",
      type: "single_line_text_field"
    },
    {
      namespace: "custom",
      key: "rating",
      value: "4.5",
      type: "single_line_text_field"
    },
    {
      namespace: "custom",
      key: "district",
      value: "Patong",
      type: "single_line_text_field"
    },
    {
      namespace: "custom",
      key: "duration",
      value: "Полдня",
      type: "single_line_text_field"
    },
    {
      namespace: "custom",
      key: "amenities",
      value: "Лежаки,Зонтики,Кафе,Туалеты,Душ,Водные виды спорта",
      type: "single_line_text_field"
    },
    {
      namespace: "custom",
      key: "best_time",
      value: "Ноябрь-Апрель (сухой сезон)",
      type: "single_line_text_field"
    }
  ]
};
```

#### ШАГ 2: Создать страницу категории

Файл: `src/pages/CategoryPage.tsx`

```typescript
// Загружаем места по категории
const { categoryId } = useParams();

const loadPlaces = async () => {
  const data = await storefrontApiRequest(FETCH_PLACES_QUERY, {
    first: 50,
    query: `product_type:place tag:category:${categoryId}`
  });
  
  const places = data.data.products.edges;
  setPlaces(places);
};
```

#### ШАГ 3: Добавить роут

В `src/App.tsx`:

```typescript
<Route path="/category/:categoryId" element={<CategoryPage />} />
```

#### ШАГ 4: Добавить в навигацию

В `src/pages/Categories.tsx`:

```typescript
{
  id: "beaches",
  label: "Пляжи",
  icon: Waves,
  description: "Лучшие пляжи Пхукета",
  path: "/category/beaches",
  color: "from-blue-500 to-cyan-500"
}
```

---

## 🎨 КАК УЛУЧШАТЬ КАРТОЧКИ МЕСТ

### Frontend компоненты:

**ProductCard.tsx** - карточка места в списке
- Показывает изображение, заголовок, описание
- Для Places: кнопка "Подробнее"
- Для Tours: кнопка "Добавить в корзину"

**PlaceDetail.tsx** - детальная страница места
- Полное описание
- Галерея изображений
- Карта с координатами
- Информация из metafields
- Связанные экскурсии

### Пример улучшения карточки пляжа:

```typescript
// В ProductCard.tsx
const amenities = product.metafields
  ?.find(m => m.key === 'amenities')
  ?.value.split(',') || [];

return (
  <Card>
    <img src={product.images.edges[0]?.node.url} />
    <CardContent>
      <h3>{product.title}</h3>
      <p>{truncate(product.description, 100)}</p>
      
      {/* Рейтинг */}
      <div className="flex items-center">
        <Star className="text-yellow-500" />
        <span>{rating}</span>
      </div>
      
      {/* Удобства */}
      <div className="flex flex-wrap gap-2">
        {amenities.map(amenity => (
          <Badge key={amenity}>{amenity}</Badge>
        ))}
      </div>
      
      {/* Кнопка */}
      <Link to={`/place/${product.handle}`}>
        <Button>Подробнее →</Button>
      </Link>
    </CardContent>
  </Card>
);
```

---

## 🔗 ПЕРЕЛИНКОВКА КОНТЕНТА

### 1. Связанные экскурсии

В Tours используй теги для связи:

```javascript
// Экскурсия на острова Пхи-Пхи включает Майя Бэй
tags: ["tour", "includes:maya-bay-beach", "islands"]

// На странице Maya Bay Beach показываем эту экскурсию
const relatedTours = await storefrontApiRequest(QUERY, {
  query: `product_type:tour tag:includes:${currentPlace.handle}`
});
```

### 2. Похожие места

```javascript
// Находим места той же категории
const similarPlaces = await storefrontApiRequest(QUERY, {
  query: `product_type:place tag:category:${category} -tag:${currentPlace.id}`
});
```

### 3. Места в том же районе

```javascript
const nearbyPlaces = await storefrontApiRequest(QUERY, {
  query: `product_type:place tag:district:${district}`
});
```

---

## ⚠️ ЧТО SHOPIFY МОЖЕТ И НЕ МОЖЕТ

### ✅ ЧТО МОЖЕТ SHOPIFY:

- Хранить неограниченное количество продуктов
- Использовать до 250 тегов на продукт
- Хранить до 50 изображений на продукт
- Использовать metafields для любой дополнительной информации
- Создавать сложные GraphQL запросы с фильтрацией
- Поддерживать мультиязычность через metafields

### ❌ ЧТО НЕ МОЖЕТ SHOPIFY:

- Прямые отношения между продуктами (используй теги)
- Вложенные категории (используй теги вида `category:parent:child`)
- Сортировка по custom полям без дополнительных тегов
- Real-time координаты на картах (нужна интеграция с Google Maps API)
- Комментарии и отзывы (нужна отдельная система)

---

## 🛠️ ТЕХНИЧЕСКИЙ СТЕК

### Frontend:
- **React** + **TypeScript**
- **Vite** - сборщик
- **Tailwind CSS** - стилизация
- **React Router** - навигация
- **Zustand** - state management (корзина)

### API:
- **Shopify Storefront API** (2025-07)
- GraphQL запросы
- Токен доступа хранится в переменных окружения

### Файловая структура:

```
src/
├── lib/
│   └── shopify.ts          # API клиент
├── pages/
│   ├── Index.tsx           # Главная
│   ├── Categories.tsx      # Список категорий
│   ├── CategoryPage.tsx    # Страница категории
│   ├── PlaceDetail.tsx     # Детали места
│   └── ProductDetail.tsx   # Детали экскурсии
├── components/
│   ├── ProductCard.tsx     # Карточка товара/места
│   └── AppLayout.tsx       # Общий layout
└── stores/
    └── cartStore.ts        # Корзина
```

---

## 📚 ПРИМЕРЫ ЗАДАЧ

### Задача 1: Добавить новую категорию "Водопады"

1. Создай продукты в Shopify с тегами:
   ```
   tags: ["place", "category:waterfalls", "district:Thalang", "nature", "photo"]
   ```

2. Добавь в Categories.tsx:
   ```typescript
   {
     id: "waterfalls",
     label: "Водопады",
     icon: Droplets,
     description: "Живописные водопады острова",
     path: "/category/waterfalls",
     color: "from-blue-400 to-cyan-400"
   }
   ```

3. CategoryPage.tsx автоматически загрузит контент

### Задача 2: Улучшить карточки пляжей - добавить погоду

1. Добавь metafield в Shopify:
   ```javascript
   {
     key: "current_weather",
     value: "Солнечно, +32°C",
     type: "single_line_text_field"
   }
   ```

2. Обнови ProductCard.tsx:
   ```typescript
   const weather = product.metafields?.find(m => m.key === 'current_weather')?.value;
   
   {weather && (
     <div className="flex items-center gap-1">
       <Sun className="w-4 h-4" />
       <span className="text-sm">{weather}</span>
     </div>
   )}
   ```

### Задача 3: Добавить фильтры по удобствам на пляжах

```typescript
const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

const filteredBeaches = places.filter(place => {
  const amenities = place.node.metafields
    ?.find(m => m.key === 'amenities')
    ?.value.split(',') || [];
  
  return selectedAmenities.every(selected => 
    amenities.includes(selected)
  );
});
```

---

## 🎯 BEST PRACTICES

### 1. **Всегда используй handle в латинице**
```
✅ "bang-tao-beach"
❌ "пляж-бангтао"
```

### 2. **Структурированные теги**
```
✅ "category:beaches", "district:Patong"
❌ "beaches", "patong beach"
```

### 3. **Детальные описания**
- Минимум 200 символов
- Включай практическую информацию
- Добавляй эмодзи для визуальности

### 4. **Качественные изображения**
- Минимум 1200x800px
- WebP формат для оптимизации
- Alt text на английском для SEO

### 5. **SEO оптимизация**
- Уникальные title и description
- Ключевые слова в тегах
- Структурированные данные через metafields

---

## 📞 ЧАСТЫЕ ВОПРОСЫ

**Q: Можно ли создать подкатегории?**
A: Используй теги вида `category:beaches:south` для фильтрации

**Q: Как связать место с экскурсией?**
A: Используй тег `includes:{place-handle}` в экскурсии

**Q: Где хранить координаты для карт?**
A: В metafield `coordinates` в формате "latitude,longitude"

**Q: Как добавить мультиязычность?**
A: Создай metafields вида `title_en`, `description_en` и т.д.

---

## 🚀 ДАЛЬНЕЙШЕЕ РАЗВИТИЕ

### Планируемые улучшения:
1. Интеграция с Google Maps API
2. Система отзывов через Supabase
3. Push-уведомления о новых местах
4. Персональные рекомендации на основе AI
5. Мультиязычная версия (EN, RU, TH)

---

**Версия документа:** 1.0  
**Дата:** 2025-10-23  
**Для вопросов:** Обращайся к команде разработки PhuketDA
