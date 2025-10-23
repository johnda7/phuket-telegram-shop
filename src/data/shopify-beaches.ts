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
    title: "🏝️ Пляж Банг Тао (Bang Tao Beach) - Самый длинный на Пхукете",
    handle: "bang-tao-beach",
    description: `Банг Тао - это не просто пляж, это целая 8-километровая полоса роскоши на западном побережье Пхукета! От 5-звездочных отелов Laguna до модных beach clubs - здесь каждый найдёт свой уголок рая.

🏖️ О пляже:

Представьте: 8 километров белоснежного песка, пальмы и лазурное море! Банг Тао - самый длинный пляж на острове, который делится на 3 зоны:

• **Северная часть (Laguna)** - территория luxury отелей: Banyan Tree, Angsana, Dusit Thani. Идеально ухоженный пляж, но вход только для гостей
• **Центральная часть** - местная деревня с аутентичными ресторанчиками и доступными ценами. Настоящий Таиланд!
• **Южная часть** - тусовочная зона с легендарными beach clubs: Catch, Xana Beach Club, Dream Beach Club

Пляж широкий (до 50 метров!), песок мягкий и чистый, вход в воду пологий - идеально для детей. Малолюдно даже в высокий сезон - всегда найдёте своё место под солнцем.

🌊 Море и купание:

Андаманское море здесь невероятно красивого бирюзового цвета! В высокий сезон (ноябрь-апрель) вода спокойная, прозрачная, температура +28°C - рай для купания. Мелко у берега на протяжении 10-15 метров - дети резвятся как дома.

В низкий сезон (май-октябрь) могут быть волны и красные флаги - но для сёрферов это время подарок! Волны до 1.5 метров привлекают riders со всего мира.

🎯 Чем заняться - топ-активности:

**Beach Clubs (must visit!):**
• 🎉 **Catch Beach Club** - #1 на Пхукете! Sunset parties с DJ, бассейн infinity, средиземноморская кухня. Минимум 1,000 бат, но оно того стоит
• 🍹 **Xana Beach Club** - бохо-шик атмосфера, Greek tapas, лаунж-музыка. Для романтиков
• 🌴 **Dream Beach Club** - семейный, с детской зоной и тайской кухней. Более доступные цены

**Водные виды спорта:**
• Кайтсёрфинг (лучшая школа - Kiteboarding Asia, от 3,500 бат/урок)
• SUP-boarding (аренда 500 бат/час)
• Катамаран (1,500 бат/час)
• Водные лыжи (2,000 бат)
• Снорклинг (лодка + снаряжение 800 бат)

**Wellness & Relax:**
• Banyan Tree Spa - лучший spa на острове (4,000 бат за 2 часа)
• Beachside массаж - 400-600 бат/час
• Йога на закате - Yogi's Boutique Hotel проводит бесплатные классы
• Медитация на рассвете - приходите в 6:00, море как зеркало

**Рестораны:**
• Villa Mahabhirom - fine dining на берегу (800-1,200 бат за блюдо)
• Tatonka - немецкая кухня (!), стейки огонь (400-800 бат)
• On The Rock - морепродукты BBQ у воды (300-600 бат)
• Local village - аутентичные тайские кафе (80-150 бат за блюдо)

**Гольф:**
Laguna Golf Club - 18 лунок championship course. Green fee от 4,500 бат

**Активный отдых:**
• Прогулка по всему пляжу - 2 часа, сожжёте 500 калорий и увидите все 3 зоны
• Велопрогулка по Laguna area - аренда велика 200 бат/день
• Фотосессия на закате - наймите фотографа 2,000 бат за 1 час, фото будут 🔥

👨‍👩‍👧‍👦 Для кого этот пляж:

✅ **Идеально подходит:**
- Семьи с детьми (мелко, спокойно, чисто)
- Luxury travelers (5-звездочные отели, spa, golf)
- Любители beach clubs и sunset parties
- Романтические пары (закаты невероятные!)
- Те, кто ищет спокойствие (в 10 раз менее многолюдно чем Патонг)
- Кайтсёрферы и SUP-boarders

❌ **Не подойдёт:**
- Любителям ночной жизни (Bangla Road в 20 минутах)
- Бэкпекерам с малым бюджетом (цены выше среднего)
- Тем, кто хочет ходить пешком везде (пляж огромный, нужен транспорт)

💰 Цены (2025):

**Пляжные услуги:**
- Лежак + зонт: 200-500 бат/день (в beach clubs включено в минимум)
- Beach club минимум: 500-2,000 бат на человека
- Массаж на пляже: 400-600 бат/час (Thai massage), 800 бат (oil massage)
- Фруктовый шейк: 80-120 бат
- Кокос: 60-80 бат

**Еда:**
- Местные кафе: 80-200 бат за блюдо
- Beachfront рестораны: 300-800 бат
- Beach clubs: 400-1,200 бат за блюдо
- Морепродукты BBQ: 400-600 бат/кг

**Аренда:**
- Мотобайк: 250-300 бат/день
- Машина: 1,200-1,800 бат/день
- Велосипед: 150-200 бат/день

💡 Инсайдерские советы:

1. **Секретное место**: Центральная часть пляжа (возле местной деревни) - никаких толп, аутентично, цены в 2 раза ниже
2. **Лучшее время для фото**: 17:30-18:30 (golden hour + закат над beach clubs)
3. **Бесплатный вход в Laguna**: Арендуйте велосипед и заезжайте через дорожки между отелями - никто не остановит
4. **Catch Beach Club hack**: Приходите в 17:00, занимайте места у бассейна БЕЗ минимума, заказывайте коктейль (350 бат) и наслаждайтесь sunset party!
5. **Местный секрет**: Suwan Drink - маленькая лавка в деревне, лучшие фреши на пляже за 40 бат (!)
6. **Парковка**: Бесплатная парковка возле деревни (центр пляжа), в beach clubs - 100 бат
7. **Когда избежать толп**: Будние дни до 10:00 - пляж пустой, море как зеркало
8. **Сёрфинг**: Май-октябрь, лучшие волны с 13:00 до 17:00
9. **Фотосессия свадебная**: Многие пары выбирают Bang Tao для свадебных фото - длинный пустой пляж, закат, пальмы. Магия!
10. **Как добраться дёшево**: Местный сонгтео (синий) от Патонга 50 бат, от Пхукет Тауна 60 бат

🚗 Как добраться:

- **Из Патонга**: 20 минут (12 км), такси 400-500 бат, Grab 300-350 бат
- **Из аэропорта**: 30 минут (25 км), такси 800-900 бат, Grab 600-700 бат
- **Из Пхукет Тауна**: 25 минут (20 км), такси 600-700 бат
- **На сонгтео**: Синий маршрут, 30-60 бат (но нужно ловить на дороге)
- **Своим транспортом**: Лучший вариант - арендуйте мотобайк или машину

🌟 Фишки пляжа:

- ⭐ **Самый длинный пляж Пхукета** - 8 км (!)
- 🏆 **#1 пляж для beach clubs** - Catch, Xana, Dream
- 👶 **Идеально для детей** - мелко, спокойно, чисто
- 🌅 **Лучшие закаты** - пальмы, beach clubs, музыка
- 🏨 **Laguna Phuket** - 8 отелей 5* на одной территории
- 🎯 **3 в 1**: Luxury zone + местная деревня + party zone
- 📸 **Instagram heaven** - каждый метр - открытка!

**ИТОГ**: Bang Tao - это когда хочется роскоши Бали, спокойствия Мальдив и тусовок Ибицы - всё в одном месте! Мой личный топ-3 пляж на Пхукете. Приезжайте и влюбитесь! 💙`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "beach",
      "category:beaches",
      "district:Thalang",
      "popular",
      "luxury",
      "family",
      "beach-clubs",
      "long-beach",
      "watersports",
      "quiet",
      "instagram",
      "sunset",
      "restaurants",
      "spa",
      "price-level:4",
      "related-place:catch-beach-club",
      "related-place:surin-beach",
      "related-tour:sunset-cruise"
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
        value: "4.7",
        type: "number_decimal"
      },
      {
        namespace: "place_info",
        key: "reviews_count",
        value: "12847",
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
        key: "duration",
        value: "Целый день (минимум 4-5 часов)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Ноябрь-апрель для купания, май-октябрь для сёрфинга, круглый год для beach clubs. Закаты 18:00-18:30 (golden hour)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["5-звездочные отели Laguna","Beach clubs (Catch, Xana, Dream)","Лежаки и зонты","Рестораны и бары","Массаж на пляже","Водные виды спорта","Гольф клуб","Спа мирового класса","Бесплатная парковка","Wi-Fi в клубах","Душевые и туалеты","Детская инфраструктура","Магазины и сувениры","Велопрокат","SUP и каяк аренда"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["🏆 Самый длинный пляж Пхукета - 8 км белоснежного песка","🎉 Catch Beach Club - приходи в 17:00 без минимума, заказывай коктейль за 350 бат и наслаждайся sunset party","💰 Центральная часть (местная деревня) - цены в 2 раза ниже, аутентично, без толп","🚴 Бесплатный вход в Laguna - арендуй велосипед и заезжай через дорожки между отелями","📸 Golden hour 17:30-18:30 - лучшее время для фото и закатов","🍹 Suwan Drink в деревне - лучшие фреши на пляже за 40 бат","🏄 Сёрфинг май-октябрь с 13:00 до 17:00 - волны до 1.5м","👶 Мелко у берега 10-15 метров - идеально для детей","🅿️ Бесплатная парковка в центре пляжа возле деревни","⏰ Будние дни до 10:00 - пляж пустой, море как зеркало"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/BangTaoBeach",
        type: "url"
      },
      {
        namespace: "place_info",
        key: "highlights",
        value: '["Самый длинный пляж (8 км)","#1 для beach clubs","Laguna Phuket - 8 отелей 5*","Идеально для детей","Лучшие закаты","Кайтсёрфинг школа","Banyan Tree Spa","Villa Mahabhirom ресторан","Малолюдный даже в сезон","3 зоны: luxury + local + party"]',
        type: "json"
      }
    ]
  }
];

export default beachesData;
