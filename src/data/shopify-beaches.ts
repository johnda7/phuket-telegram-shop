// Данные пляжей для загрузки в Shopify
// Каждый пляж = Shopify Product с productType: "place"

export const beachesData = [
  {
    title: "Пляж Патонг (Patong Beach)",
    handle: "patong-beach",
    description: `Патонг - самый популярный и оживленный пляж Пхукета длиной 3 км. Это центр ночной жизни острова с сотнями баров, ресторанов, клубов и массажных салонов.

🏖️ О пляже:
Широкий песчаный пляж с пологим входом в воду. Развитая инфраструктура - лежаки, зонты, водные развлечения. Вдоль всего пляжа идет променад с пальмами.

🌊 Море:
Чистое, но могут быть волны. В высокий сезон (ноябрь-апрель) спокойное. В низкий сезон (май-октябрь) волны и красные флаги.

🎯 Чем заняться:
• Водные виды спорта: парасейлинг, гидроциклы, банан
• Серфинг в сезон дождей
• Массаж на пляже (300-500 бат)
• Sunset cocktails в beach clubs
• Шопинг на Bangla Road
• Ночные клубы Illuzion, Tiger

👨‍👩‍👧‍👦 Для кого:
Для молодежи, тусовщиков, любителей активного отдыха. НЕ для спокойного семейного отдыха.

💰 Цены:
Лежак + зонт: 200 бат/день
Массаж: 300-500 бат/час
Еда: 150-300 бат
Пиво: 80-150 бат`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "beach",
      "category:beaches",
      "district:Patong",
      "popular",
      "nightlife",
      "watersports",
      "party",
      "instagram",
      "price-level:3",
      "related-place:bangla-road",
      "related-place:patong-promenade",
      "related-tour:phi-phi-2-days-1-night"
    ],
    
    metafields: [
      {
        namespace: "place_info",
        key: "coordinates",
        value: '{"lat": 7.8967, "lng": 98.2987}',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "rating",
        value: "4.2",
        type: "number_decimal"
      },
      {
        namespace: "place_info",
        key: "reviews_count",
        value: "15234",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "duration",
        value: "Целый день",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Ноябрь-апрель (спокойное море)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "beach_length",
        value: "3000",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["Лежаки","Зонты","Душевые","Туалеты","Кафе","Рестораны","Массаж","Водные виды спорта","Парковка","WiFi"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["Приходите рано утром чтобы занять лежаки","Торгуйтесь с массажистками - скидка до 30%","Не купайтесь при красном флаге","Берегите вещи - воровство","Вечером идите на Bangla Road","Избегайте jet ski rental - scam"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "water_activities",
        value: '["Парасейлинг (1500 бат)","Jet ski (1000 бат/30 мин)","Banana boat (500 бат)","Серфинг (аренда доски 300 бат)","Снорклинг"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/PatongBeach",
        type: "url"
      }
    ],
    
    images: [
      { altText: "Патонг Бич - вид с высоты" },
      { altText: "Пляж Патонг закат" },
      { altText: "Водные развлечения на Патонге" },
      { altText: "Променад Патонг" }
    ]
  },

  {
    title: "Пляж Карон (Karon Beach)",
    handle: "karon-beach",
    description: `Карон - второй по величине пляж Пхукета (3.5 км), спокойнее и семейнее чем Патонг. Широкий пляж с белым "поющим" песком и чистым морем.

🏖️ О пляже:
Один из самых чистых пляжей на западном побережье. Широкая полоса мелкого белого песка, который "поет" под ногами. Пологий вход в воду.

🌊 Море:
Прозрачное, бирюзовое. Может быть волнение - хорошо для серфинга. В высокий сезон спокойное для купания. Глубина нарастает плавно.

🎯 Чем заняться:
• Серфинг (аренда доски 300 бат/час)
• Спокойный пляжный отдых
• Прогулки по длинному пляжу
• Sunset на Karon Viewpoint (5 минут на байке)
• Массаж на пляже
• Кафе и рестораны через дорогу

👨‍👩‍👧‍👦 Для кого:
Идеально для семей с детьми, спокойного отдыха, серферов. Меньше тусовок чем на Патонге.

💰 Цены:
Лежак + зонт: 200 бат/день
Массаж: 250-400 бат/час
Еда: 100-250 бат
Более доступные цены чем на Патонге`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "beach",
      "category:beaches",
      "district:Karon",
      "family",
      "kids",
      "surfing",
      "clean",
      "long-beach",
      "price-level:2",
      "related-place:karon-viewpoint",
      "related-place:kata-beach"
    ],
    
    metafields: [
      {
        namespace: "place_info",
        key: "coordinates",
        value: '{"lat": 7.8389, "lng": 98.2967}',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "rating",
        value: "4.5",
        type: "number_decimal"
      },
      {
        namespace: "place_info",
        key: "reviews_count",
        value: "8934",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "beach_length",
        value: "3500",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Ноябрь-апрель (спокойное море), Май-октябрь (волны для серфинга)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["Лежаки","Зонты","Душевые","Туалеты","Кафе через дорогу","Массаж","Парковка","Спасатели"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["Песок «поет» под ногами - уникальная особенность","Лучший серф в сезон дождей","Через дорогу много дешевых кафе","5 минут на байке до Karon Viewpoint","Меньше людей чем на Патонге","Хороший пляж для бега по утрам"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/KaronBeach",
        type: "url"
      }
    ]
  },

  {
    title: "Пляж Ката (Kata Beach)",
    handle: "kata-beach",
    description: `Ката - уютный семейный пляж длиной 1.5 км с мягким белым песком и чистейшей водой. Один из лучших пляжей для купания с детьми.

🏖️ О пляже:
Защищенная бухта с двумя пляжами - Ката Яй (большой) и Ката Ной (маленький). Мелкий белый песок, пальмы, спокойная атмосфера.

🌊 Море:
Чистейшая бирюзовая вода. В высокий сезон идеально спокойное для детей. Пологий заход, мелко у берега.

🎯 Чем заняться:
• Купание с детьми (безопасно и мелко)
• Снорклинг у южной скалы
• Surf lessons в Kata Beach Surf School
• Sunset на Kata Rocks
• Прогулка к Kata Noi
• Beach clubs: Kata Rocks, Mom Tri's

👨‍👩‍👧‍👦 Для кого:
Идеально для семей с маленькими детьми. Спокойная атмосфера, безопасное море, хорошие рестораны.

💰 Цены:
Лежак + зонт: 200 бат
Массаж: 300 бат/час  
Еда: 150-300 бат
Средний уровень цен`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "beach",
      "category:beaches",
      "district:Kata",
      "family",
      "kids",
      "snorkeling",
      "surfing",
      "clean",
      "romantic",
      "price-level:2",
      "related-place:kata-noi-beach",
      "related-place:karon-viewpoint"
    ],
    
    metafields: [
      {
        namespace: "place_info",
        key: "coordinates",
        value: '{"lat": 7.8167, "lng": 98.2989}',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "rating",
        value: "4.6",
        type: "number_decimal"
      },
      {
        namespace: "place_info",
        key: "reviews_count",
        value: "12456",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "beach_length",
        value: "1500",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Ноябрь-март (штиль, идеально для детей)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["Лежаки","Зонты","Душевые","Туалеты","Детские площадки","Кафе","Рестораны","Массаж","Спасатели","Аренда снаряжения"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["Лучший пляж для детей на Пхукете","Приходите до 10:00 за лучшими лежаками","Снорклинг у южных скал - много рыб","Kata Rocks - шикарный beach club с бассейном","Surf lessons 1500 бат/2 часа","Обед в Mom Tri Kitchen - вид на море"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/KataBeach",
        type: "url"
      }
    ]
  },

  {
    title: "Пляж Най Харн (Nai Harn Beach)",
    handle: "nai-harn-beach",
    description: `Най Харн - один из самых красивых и фотогеничных пляжей Пхукета. Живописная бухта с белоснежным песком, окруженная зелеными холмами.

🏖️ О пляже:
Уединенная бухта на юге острова. Белый мягкий песок, прозрачная вода, пальмы. Менее многолюдно чем на западном побережье.

🌊 Море:
Кристально чистое, бирюзовое. В высокий сезон спокойное. Могут быть сильные волны в низкий сезон - опасно для купания.

🎯 Чем заняться:
• Фотосессии (один из самых красивых пляжей)
• Sunset на озере Nai Harn
• Обед в The Nai Harn hotel (360° bar)
• Прогулка к Windmill Viewpoint
• Каякинг вдоль берега
• Снорклинг

👨‍👩‍👧‍👦 Для кого:
Для романтиков, фотографов, любителей спокойного отдыха. Не для тусовок.

💰 Цены:
Лежак + зонт: 200 бат
Массаж: 300 бат/час
Еда: 200-400 бат
Дороже чем на севере`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "beach",
      "category:beaches",
      "district:Rawai",
      "romantic",
      "photo",
      "instagram",
      "clean",
      "beautiful",
      "sunset",
      "price-level:3",
      "related-place:windmill-viewpoint",
      "related-place:promthep-cape",
      "related-place:360-bar-nai-harn"
    ],
    
    metafields: [
      {
        namespace: "place_info",
        key: "coordinates",
        value: '{"lat": 7.7733, "lng": 98.3028}',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "rating",
        value: "4.7",
        type: "number_decimal"
      },
      {
        namespace: "place_info",
        key: "reviews_count",
        value: "9876",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "beach_length",
        value: "700",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Ноябрь-апрель (спокойное море и ясное небо)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["Лежаки","Зонты","Душевые","Туалеты","Кафе","Парковка","Озеро для прогулок","Детская площадка"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["Самый красивый пляж для фото","Sunset лучше смотреть на озере сзади пляжа","360° bar в The Nai Harn - коктейли на закате","Windmill Viewpoint в 5 минутах","Опасно купаться в низкий сезон - сильные волны","Мало еды на пляже - берите с собой"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/NaiHarnBeach",
        type: "url"
      }
    ]
  },

  {
    title: "Пляж Банг Тао (Bang Tao Beach)",
    handle: "bang-tao-beach",
    description: `Банг Тао - самый длинный пляж Пхукета (8 км) на западном побережье. Роскошные отели, пляжные клубы и спокойная атмосфера.

🏖️ О пляже:
8 километров белого песка от Laguna до Surin Beach. Широкий пляж с пологим входом. Зона Laguna - 5-звездочные отели. Центр - местная деревня. Юг - пляжные клубы.

🌊 Море:
Чистое, спокойное в высокий сезон. Может быть волнение в низкий сезон. Мелко у берега - хорошо для детей.

🎯 Чем заняться:
• Пляжные клубы: Catch, Xana, Dream
• Водные виды спорта
• Прогулки по длинному пляжу
• Гольф в Laguna Golf Club
• Обед в Villa Mahabhirom
• Spa в Banyan Tree

👨‍👩‍👧‍👦 Для кого:
Для семей, любителей luxury отдыха, beach clubs. Спокойнее чем Патонг, но с хорошей инфраструктурой.

💰 Цены:
Лежаки: 200-500 бат (в клубах дороже)
Beach club: 500-2000 бат минимум
Массаж: 400-800 бат
Еда: 200-600 бат
Высокие цены`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "beach",
      "category:beaches",
      "district:Thalang",
      "luxury",
      "family",
      "beach-clubs",
      "long-beach",
      "watersports",
      "price-level:4",
      "related-place:catch-beach-club",
      "related-place:surin-beach"
    ],
    
    metafields: [
      {
        namespace: "place_info",
        key: "coordinates",
        value: '{"lat": 8.0167, "lng": 98.2856}',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "rating",
        value: "4.5",
        type: "number_decimal"
      },
      {
        namespace: "place_info",
        key: "reviews_count",
        value: "6543",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "beach_length",
        value: "8000",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Ноябрь-апрель (для купания), круглый год (для beach clubs)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["Luxury отели","Beach clubs","Лежаки","Зонты","Рестораны","Массаж","Водные виды спорта","Гольф","Спа","Парковка"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["Самый длинный пляж на Пхукете - 8 км","Catch Beach Club - лучший для sunset party","Центральная часть более местная и дешевая","Laguna area - только для гостей отелей","Прогулка от начала до конца - 2 часа","Банг Тао менее многолюдный чем Патонг"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/BangTaoBeach",
        type: "url"
      }
    ]
  }
];

export default beachesData;
