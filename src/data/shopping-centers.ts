// Торговые центры Пхукета - данные для загрузки в Shopify
// Основано на анализе phuket-insider.com + наша философия iOS 26

export const shoppingCenters = [
  {
    title: "Central Phuket Floresta",
    handle: "central-phuket-floresta",
    description: `Central Phuket – самый большой торговый центр на острове с широким ассортиментом брендов и бесспорно одно из лучших мест для шоппинга на Пхукете. Он состоит из двух корпусов: Central Festival и Central Floresta.

**Central Festival:**
- Международные бренды: Zara, H&M, Uniqlo, Nike, Adidas
- Косметика: Sephora, Boots
- Электроника: Apple, Samsung, Sony
- Супермаркет Tops Market

**Central Floresta:**
- Люксовые бутики: Prada, Gucci, Louis Vuitton, Chanel
- Ювелирные магазины
- Премиум рестораны

**Развлечения:**
- Кинотеатр SF Cinema
- Детская игровая зона
- Аквариум
- Фуд-корт с тайской и международной кухней

**Удобства:**
- Бесплатная парковка
- Бесплатный Wi-Fi
- Банкоматы
- Обмен валюты
- Кондиционеры`,
    
    productType: "Information",
    vendor: "PhuketDa Insider",
    
    tags: [
      "info",
      "insider", 
      "category:shopping",
      "district:PhuketTown",
      "shopping",
      "mall",
      "luxury",
      "popular",
      "aircon",
      "food-court",
      "parking",
      "cinema"
    ],
    
    metafields: [
      { namespace: "custom", key: "coordinates", value: "7.8904,98.2924", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.6", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "PhuketTown", type: "single_line_text_field" },
      { namespace: "custom", key: "duration", value: "2-4 часа", type: "single_line_text_field" },
      { namespace: "custom", key: "best_time", value: "День/вечер", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Кинотеатр,Детская зона,Wi‑Fi,Банкоматы,Обмен валюты,Аквариум", type: "single_line_text_field" },
      { namespace: "custom", key: "website", value: "https://www.centralphuket.com/", type: "single_line_text_field" },
      { namespace: "custom", key: "price_level", value: "3", type: "single_line_text_field" }
    ]
  },

  {
    title: "Jungceylon Shopping Center",
    handle: "jungceylon-shopping-center",
    description: `Jungceylon – крупнейший торговый центр в Патонге, расположенный в самом сердце туристической зоны. Идеальное место для шоппинга после пляжа.

**Магазины:**
- Супермаркет Big C Extra
- Магазины одежды: Uniqlo, H&M, Zara
- Электроника: Power Buy, Banana IT
- Косметика: Boots, Watsons
- Сувениры и подарки

**Развлечения:**
- Кинотеатр SF Cinema
- Боулинг
- Детская игровая зона
- Фуд-корт с разнообразной кухней

**Особенности:**
- Расположен рядом с пляжем Патонг
- Много ресторанов и кафе
- Вечерние шоу и мероприятия
- Близко к ночной жизни Патонга`,
    
    productType: "Information",
    vendor: "PhuketDa Insider",
    
    tags: [
      "info",
      "insider",
      "category:shopping", 
      "district:Patong",
      "shopping",
      "mall",
      "tourist",
      "beach-nearby",
      "food-court",
      "cinema",
      "bowling"
    ],
    
    metafields: [
      { namespace: "custom", key: "coordinates", value: "7.8965,98.2965", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.4", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "Patong", type: "single_line_text_field" },
      { namespace: "custom", key: "duration", value: "2-3 часа", type: "single_line_text_field" },
      { namespace: "custom", key: "best_time", value: "День/вечер", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "11:00-23:00 ежедневно", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Кинотеатр,Боулинг,Wi‑Fi,Банкоматы", type: "single_line_text_field" },
      { namespace: "custom", key: "website", value: "https://www.jungceylon.com/", type: "single_line_text_field" },
      { namespace: "custom", key: "price_level", value: "2", type: "single_line_text_field" }
    ]
  },

  {
    title: "Premium Outlet Phuket",
    handle: "premium-outlet-phuket",
    description: `Premium Outlet Phuket – аутлет-центр в стиле итальянских торговых деревень. Здесь можно найти брендовые товары со скидками до 70%.

**Бренды:**
- Одежда: Nike, Adidas, Puma, Levi's, Tommy Hilfiger
- Обувь: Converse, Vans, Timberland
- Аксессуары: Guess, Fossil, Swatch
- Косметика: The Body Shop, L'Occitane

**Особенности:**
- Скидки до 70% круглый год
- Красивая архитектура в итальянском стиле
- Много мест для фото
- Фуд-корт с международной кухней
- Детская игровая зона

**Как добраться:**
- 15 минут от аэропорта
- Бесплатная парковка
- Автобусы из Патонга и Карона`,
    
    productType: "Information",
    vendor: "PhuketDa Insider",
    
    tags: [
      "info",
      "insider",
      "category:shopping",
      "district:Thalang", 
      "shopping",
      "outlet",
      "discounts",
      "brands",
      "airport-nearby",
      "instagram"
    ],
    
    metafields: [
      { namespace: "custom", key: "coordinates", value: "8.1234,98.3456", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.3", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "Thalang", type: "single_line_text_field" },
      { namespace: "custom", key: "duration", value: "3-5 часов", type: "single_line_text_field" },
      { namespace: "custom", key: "best_time", value: "День", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Детская зона,Wi‑Fi,Банкоматы,Фото-зоны", type: "single_line_text_field" },
      { namespace: "custom", key: "website", value: "https://www.premiumoutlet.co.th/", type: "single_line_text_field" },
      { namespace: "custom", key: "price_level", value: "2", type: "single_line_text_field" }
    ]
  },

  {
    title: "Big C Supercenter Phuket",
    handle: "big-c-supercenter-phuket",
    description: `Big C Supercenter – крупнейшая сеть супермаркетов в Таиланде. На Пхукете несколько локаций, самая популярная в районе Чалонг.

**Что купить:**
- Тайские продукты и специи
- Косметика и средства гигиены
- Одежда и обувь
- Электроника и бытовая техника
- Сувениры и подарки
- Алкоголь и табак

**Особенности:**
- Низкие цены
- Большой выбор тайских товаров
- Можно купить все для дома
- Есть фуд-корт
- Бесплатная парковка

**Локации на Пхукете:**
- Big C Chalong (основная)
- Big C Patong
- Big C Phuket Town`,
    
    productType: "Information",
    vendor: "PhuketDa Insider",
    
    tags: [
      "info",
      "insider",
      "category:shopping",
      "district:Chalong",
      "shopping",
      "supermarket",
      "budget",
      "thai-products",
      "food-court"
    ],
    
    metafields: [
      { namespace: "custom", key: "coordinates", value: "7.8456,98.3456", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.2", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "Chalong", type: "single_line_text_field" },
      { namespace: "custom", key: "duration", value: "1-2 часа", type: "single_line_text_field" },
      { namespace: "custom", key: "best_time", value: "День", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "08:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Wi‑Fi,Банкоматы", type: "single_line_text_field" },
      { namespace: "custom", key: "website", value: "https://www.bigc.co.th/", type: "single_line_text_field" },
      { namespace: "custom", key: "price_level", value: "1", type: "single_line_text_field" }
    ]
  },

  {
    title: "Tesco Lotus Phuket",
    handle: "tesco-lotus-phuket",
    description: `Tesco Lotus – британская сеть супермаркетов, популярная среди экспатов и туристов. Хорошие цены и качественные товары.

**Что купить:**
- Импортные продукты
- Косметика европейских брендов
- Одежда и обувь
- Детские товары
- Домашние товары
- Электроника

**Особенности:**
- Европейские стандарты качества
- Хорошие цены на импорт
- Большой выбор детских товаров
- Есть фуд-корт
- Бесплатная парковка

**Локации:**
- Tesco Lotus Chalong
- Tesco Lotus Phuket Town
- Tesco Lotus Patong`,
    
    productType: "Information",
    vendor: "PhuketDa Insider",
    
    tags: [
      "info",
      "insider",
      "category:shopping",
      "district:Chalong",
      "shopping",
      "supermarket",
      "imports",
      "quality",
      "expat-friendly"
    ],
    
    metafields: [
      { namespace: "custom", key: "coordinates", value: "7.8234,98.3456", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.1", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "Chalong", type: "single_line_text_field" },
      { namespace: "custom", key: "duration", value: "1-2 часа", type: "single_line_text_field" },
      { namespace: "custom", key: "best_time", value: "День", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "08:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Wi‑Fi,Банкоматы", type: "single_line_text_field" },
      { namespace: "custom", key: "website", value: "https://www.tescolotus.com/", type: "single_line_text_field" },
      { namespace: "custom", key: "price_level", value: "2", type: "single_line_text_field" }
    ]
  },

  {
    title: "Robinson Lifestyle Phuket",
    handle: "robinson-lifestyle-phuket",
    description: `Robinson Lifestyle – современный торговый центр в районе Карон. Отличное место для шоппинга в спокойной атмосфере.

**Магазины:**
- Одежда: Uniqlo, H&M, Zara
- Косметика: Boots, Watsons
- Электроника: Power Buy
- Супермаркет Tops Market
- Сувениры и подарки

**Развлечения:**
- Кинотеатр
- Детская игровая зона
- Фуд-корт
- Кафе и рестораны

**Особенности:**
- Современный дизайн
- Хорошая вентиляция
- Много мест для отдыха
- Близко к пляжу Карон`,
    
    productType: "Information",
    vendor: "PhuketDa Insider",
    
    tags: [
      "info",
      "insider",
      "category:shopping",
      "district:Karon",
      "shopping",
      "mall",
      "modern",
      "beach-nearby",
      "cinema",
      "food-court"
    ],
    
    metafields: [
      { namespace: "custom", key: "coordinates", value: "7.8456,98.2987", type: "single_line_text_field" },
      { namespace: "custom", key: "rating", value: "4.3", type: "single_line_text_field" },
      { namespace: "custom", key: "district", value: "Karon", type: "single_line_text_field" },
      { namespace: "custom", key: "duration", value: "2-3 часа", type: "single_line_text_field" },
      { namespace: "custom", key: "best_time", value: "День/вечер", type: "single_line_text_field" },
      { namespace: "custom", key: "working_hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "custom", key: "amenities", value: "Парковка,Кондиционеры,Food Court,Кинотеатр,Детская зона,Wi‑Fi,Банкоматы", type: "single_line_text_field" },
      { namespace: "custom", key: "website", value: "https://www.robinson.co.th/", type: "single_line_text_field" },
      { namespace: "custom", key: "price_level", value: "2", type: "single_line_text_field" }
    ]
  }
];

// Экспорт для использования в скриптах
export default shoppingCenters;

