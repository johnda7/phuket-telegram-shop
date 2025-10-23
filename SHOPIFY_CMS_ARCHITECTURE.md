# Архитектура хранения в Shopify CMS

## Концепция

Все данные хранятся в Shopify как Products двух типов:
1. **Туры** - продаются, имеют цену, варианты (взрослый/детский)
2. **Места** - информационные карточки, не продаются (price = 0)

## Структура Shopify Product

### Для мест (Places):

```javascript
{
  title: "Заповедник слонов Phuket Elephant Sanctuary",
  handle: "phuket-elephant-sanctuary",
  productType: "place", // ИЛИ "tour" для туров
  description: "Полное описание места...",
  
  // Теги для категоризации и связей
  tags: [
    "place",              // Тип: место (не тур)
    "category:elephants", // Категория
    "district:Kathu",     // Район
    "price-level:3",      // Уровень цен 1-4
    "family",             // Подходит для семей
    "photo",              // Хорошо для фото
    "ethical",            // Этичное
    "related-tour:avatar-plus-hangdong", // Связь с туром
    "related-place:elephant-retirement-park" // Связь с местом
  ],
  
  // Метафилды (custom fields) для доп. информации
  metafields: [
    {
      namespace: "place_info",
      key: "coordinates",
      value: '{"lat": 7.9519, "lng": 98.3381}',
      type: "json"
    },
    {
      namespace: "place_info", 
      key: "rating",
      value: "4.9",
      type: "number_decimal"
    },
    {
      namespace: "place_info",
      key: "reviews_count", 
      value: "3245",
      type: "number_integer"
    },
    {
      namespace: "place_info",
      key: "duration",
      value: "Полдня (3-4 часа)",
      type: "single_line_text_field"
    },
    {
      namespace: "place_info",
      key: "best_time",
      value: "Утро 9:00-13:00",
      type: "single_line_text_field"
    },
    {
      namespace: "place_info",
      key: "amenities",
      value: '["Трансфер", "Обед", "Гид", "Страховка"]',
      type: "json"
    },
    {
      namespace: "place_info",
      key: "tips",
      value: '["Бронируйте заранее", "Наденьте удобную обувь"]',
      type: "json"
    },
    {
      namespace: "place_info",
      key: "contact_phone",
      value: "+66 76 123 456",
      type: "single_line_text_field"
    },
    {
      namespace: "place_info",
      key: "contact_website",
      value: "https://example.com",
      type: "url"
    },
    {
      namespace: "place_info",
      key: "contact_instagram",
      value: "@example",
      type: "single_line_text_field"
    },
    {
      namespace: "place_info",
      key: "map_url",
      value: "https://maps.app.goo.gl/example",
      type: "url"
    }
  ],
  
  // Изображения
  images: [
    { url: "https://cdn.shopify.com/...", altText: "Слоны в заповеднике" },
    { url: "https://cdn.shopify.com/...", altText: "Купание слонов" }
  ],
  
  // Цена = 0 для мест (не продаются)
  variants: [
    {
      title: "Default",
      price: "0.00",
      availableForSale: false // Места не продаются
    }
  ]
}
```

### Для туров (Tours):

```javascript
{
  title: "Достопримечательности Пхукета",
  handle: "dostoprimechatelnosti-phuketa",
  productType: "tour",
  description: "Обзорная экскурсия...",
  
  tags: [
    "tour",              // Тип: тур
    "category:tours",    // Категория
    "excursion",         // Экскурсия
    "includes:big-buddha",    // Включает место
    "includes:wat-chalong",   // Включает место
    "includes:old-town",      // Включает место
    "related-place:big-buddha", // Связь с местами
    "related-place:wat-chalong"
  ],
  
  // Цена реальная
  variants: [
    {
      title: "Взрослый",
      price: "1500.00",
      availableForSale: true
    },
    {
      title: "Детский (4-12 лет)",
      price: "750.00",
      availableForSale: true
    }
  ]
}
```

## Система тегов

### Обязательные теги:

- `place` - это место (не продается)
- `tour` - это тур (продается)
- `category:{название}` - категория (elephants, viewpoints, spa, etc.)
- `district:{район}` - географический район

### Опциональные теги:

- `price-level:{1-4}` - уровень цен
- `family` - подходит для семей
- `kids` - для детей
- `romantic` - романтичное
- `instagram` - инстаграмное
- `photo` - для фото
- `free` - бесплатное
- `popular` - популярное
- `new` - новое
- `ethical` - этичное (для слонов)
- `beach` - на пляже
- `view` - с видом
- `sunset` - для заката

### Теги для связей:

- `related-tour:{handle}` - связь с туром
- `related-place:{handle}` - связь с местом
- `includes:{handle}` - тур включает это место

## GraphQL запросы

### Получить все места определенной категории:

```graphql
query GetPlacesByCategory($category: String!) {
  products(first: 50, query: "tag:place AND tag:category:$category") {
    edges {
      node {
        id
        title
        handle
        description
        productType
        tags
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        metafields(first: 20) {
          edges {
            node {
              namespace
              key
              value
              type
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price {
                amount
              }
            }
          }
        }
      }
    }
  }
}
```

### Получить место по handle с метафилдами:

```graphql
query GetPlaceByHandle($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
    description
    tags
    images(first: 20) {
      edges {
        node {
          url
          altText
        }
      }
    }
    metafields(identifiers: [
      {namespace: "place_info", key: "coordinates"},
      {namespace: "place_info", key: "rating"},
      {namespace: "place_info", key: "reviews_count"},
      {namespace: "place_info", key: "duration"},
      {namespace: "place_info", key: "best_time"},
      {namespace: "place_info", key: "amenities"},
      {namespace: "place_info", key: "tips"},
      {namespace: "place_info", key: "contact_phone"},
      {namespace: "place_info", key: "contact_website"},
      {namespace: "place_info", key: "contact_instagram"},
      {namespace: "place_info", key: "map_url"}
    ]) {
      namespace
      key
      value
      type
    }
  }
}
```

### Найти связанные туры:

```graphql
query GetRelatedTours($placeHandle: String!) {
  products(first: 10, query: "tag:tour AND tag:includes:$placeHandle") {
    edges {
      node {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  }
}
```

## Создание места через Shopify Admin API

Скрипт для массового импорта мест:

```javascript
// scripts/upload-place-to-shopify.js
const CREATE_PRODUCT_MUTATION = `
  mutation createProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function createPlace(placeData) {
  const input = {
    title: placeData.title,
    handle: placeData.handle,
    productType: "place",
    description: placeData.description,
    
    tags: [
      "place",
      `category:${placeData.category}`,
      placeData.district ? `district:${placeData.district}` : null,
      placeData.priceLevel ? `price-level:${placeData.priceLevel}` : null,
      ...placeData.tags,
      ...placeData.relatedTours?.map(h => `related-tour:${h}`) || [],
      ...placeData.relatedPlaces?.map(h => `related-place:${h}`) || []
    ].filter(Boolean),
    
    variants: [{
      price: "0.00",
      inventoryPolicy: "CONTINUE"
    }],
    
    metafields: [
      placeData.coordinates && {
        namespace: "place_info",
        key: "coordinates",
        value: JSON.stringify(placeData.coordinates),
        type: "json"
      },
      placeData.rating && {
        namespace: "place_info",
        key: "rating",
        value: placeData.rating.toString(),
        type: "number_decimal"
      },
      placeData.reviewsCount && {
        namespace: "place_info",
        key: "reviews_count",
        value: placeData.reviewsCount.toString(),
        type: "number_integer"
      },
      placeData.duration && {
        namespace: "place_info",
        key: "duration",
        value: placeData.duration,
        type: "single_line_text_field"
      },
      placeData.bestTime && {
        namespace: "place_info",
        key: "best_time",
        value: placeData.bestTime,
        type: "single_line_text_field"
      },
      placeData.amenities && {
        namespace: "place_info",
        key: "amenities",
        value: JSON.stringify(placeData.amenities),
        type: "json"
      },
      placeData.tips && {
        namespace: "place_info",
        key: "tips",
        value: JSON.stringify(placeData.tips),
        type: "json"
      },
      placeData.contact?.phone && {
        namespace: "place_info",
        key: "contact_phone",
        value: placeData.contact.phone,
        type: "single_line_text_field"
      },
      placeData.contact?.website && {
        namespace: "place_info",
        key: "contact_website",
        value: placeData.contact.website,
        type: "url"
      },
      placeData.contact?.instagram && {
        namespace: "place_info",
        key: "contact_instagram",
        value: placeData.contact.instagram,
        type: "single_line_text_field"
      },
      placeData.mapUrl && {
        namespace: "place_info",
        key: "map_url",
        value: placeData.mapUrl,
        type: "url"
      }
    ].filter(Boolean)
  };
  
  // Upload images separately using media upload
  // Then link to product
  
  const response = await shopifyAdminRequest(CREATE_PRODUCT_MUTATION, { input });
  return response.data.productCreate;
}
```

## Frontend интеграция

### Парсинг метафилдов:

```typescript
interface ParsedPlace {
  id: string;
  title: string;
  handle: string;
  description: string;
  category: string;
  district?: string;
  images: string[];
  tags: string[];
  
  // Из метафилдов
  coordinates?: { lat: number; lng: number };
  rating?: number;
  reviewsCount?: number;
  priceLevel?: number;
  duration?: string;
  bestTime?: string;
  amenities?: string[];
  tips?: string[];
  contact?: {
    phone?: string;
    website?: string;
    instagram?: string;
  };
  mapUrl?: string;
  
  // Связи из тегов
  relatedTours: string[];
  relatedPlaces: string[];
}

function parseShopifyPlace(product: ShopifyProduct): ParsedPlace {
  const metafields = product.metafields?.edges || [];
  
  const getMetafield = (key: string) => {
    const field = metafields.find(m => 
      m.node.namespace === 'place_info' && m.node.key === key
    );
    return field?.node.value;
  };
  
  const parseJSON = (value: string | undefined) => {
    try {
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  };
  
  // Парсим категорию из тегов
  const categoryTag = product.tags.find(t => t.startsWith('category:'));
  const category = categoryTag?.replace('category:', '') || '';
  
  // Парсим район
  const districtTag = product.tags.find(t => t.startsWith('district:'));
  const district = districtTag?.replace('district:', '');
  
  // Парсим price level
  const priceLevelTag = product.tags.find(t => t.startsWith('price-level:'));
  const priceLevel = priceLevelTag ? parseInt(priceLevelTag.replace('price-level:', '')) : undefined;
  
  // Связанные туры и места
  const relatedTours = product.tags
    .filter(t => t.startsWith('related-tour:'))
    .map(t => t.replace('related-tour:', ''));
    
  const relatedPlaces = product.tags
    .filter(t => t.startsWith('related-place:'))
    .map(t => t.replace('related-place:', ''));
  
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    category,
    district,
    images: product.images.edges.map(e => e.node.url),
    tags: product.tags.filter(t => 
      !t.startsWith('category:') && 
      !t.startsWith('district:') &&
      !t.startsWith('price-level:') &&
      !t.startsWith('related-')
    ),
    
    coordinates: parseJSON(getMetafield('coordinates')),
    rating: parseFloat(getMetafield('rating') || '0'),
    reviewsCount: parseInt(getMetafield('reviews_count') || '0'),
    priceLevel,
    duration: getMetafield('duration'),
    bestTime: getMetafield('best_time'),
    amenities: parseJSON(getMetafield('amenities')),
    tips: parseJSON(getMetafield('tips')),
    contact: {
      phone: getMetafield('contact_phone'),
      website: getMetafield('contact_website'),
      instagram: getMetafield('contact_instagram')
    },
    mapUrl: getMetafield('map_url'),
    
    relatedTours,
    relatedPlaces
  };
}
```

## Преимущества подхода

1. **Единая CMS** - все в Shopify, легко управлять
2. **Масштабируемость** - легко добавлять новые места
3. **Динамичность** - обновления в реальном времени
4. **SEO** - Shopify handles, descriptions
5. **Изображения** - CDN Shopify для быстрой загрузки
6. **Связи** - через теги, гибко и просто
7. **Метрики** - можно отслеживать просмотры
8. **API** - готовый GraphQL API

## Миграция данных

1. Взять данные из `places.ts`
2. Для каждого места создать Shopify Product через Admin API
3. Загрузить изображения
4. Установить метафилды
5. Добавить теги
6. Обновить frontend для работы с Shopify
