// Данные храмов для загрузки в Shopify
// Каждый храм = Shopify Product с productType: "place"

export const templesData = [
  {
    title: "Большой Будда Пхукета (Big Buddha Phuket)",
    handle: "big-buddha-phuket",
    description: `Большой Будда - главная достопримечательность и символ Пхукета. 45-метровая статуя сидящего Будды из белого бирманского мрамора на вершине холма Наккерд (высота 400 метров).

🙏 О храме:
Строительство началось в 2004 году на пожертвования. Статуя видна из многих точек острова - Чалонга, Карона, Раваи. Комплекс включает большую статую, колокольни, смотровую площадку 360° и небольшой храм.

⛰️ Расположение:
На вершине холма Наккерд между Чалонгом и Ката. Крутая серпантинная дорога 6 км. Потрясающие виды на остров с высоты 400м.

🎯 Что делать:
• Поклониться Будде и загадать желание
• Купить колокольчик (100-500 бат) и повесить с желанием
• Сфотографироваться на фоне статуи
• Насладиться панорамным видом 360°
• Посетить небольшой храм у подножия
• Покормить слонов у входа (опционально)
• Посмотреть закат над Андаманским морем

👔 Дресс-код:
ОБЯЗАТЕЛЬНО! Плечи и колени должны быть закрыты. На входе дают бесплатные накидки если нужно. Разуваться не нужно (только внутри маленького храма).

🕐 Время работы:
6:00 - 19:00 ежедневно
Лучшее время: рано утром (меньше жары) или вечером на закат

💰 Вход:
Бесплатно! Но приветствуются пожертвования (20-100 бат). Парковка бесплатная.

⚠️ Важно:
• Не фотографируйтесь спиной к Будде - неуважительно
• Не показывайте на статую пальцем
• Женщинам нельзя прикасаться к монахам
• Дорога крутая - на байке будьте аккуратны
• Берите воду - наверху жарко и душно
• Ветрено на вершине - берите легкую куртку`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "temple",
      "category:temples",
      "district:Chalong",
      "must-see",
      "popular",
      "free",
      "view",
      "sunset",
      "photo",
      "instagram",
      "cultural",
      "price-level:1",
      "related-place:wat-chalong",
      "related-place:karon-viewpoint",
      "related-tour:dostoprimechatelnosti-phuketa"
    ],
    
    metafields: [
      {
        namespace: "place_info",
        key: "coordinates",
        value: '{"lat": 7.8092, "lng": 98.3081}',
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
        value: "15234",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "duration",
        value: "1-2 часа",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Рано утром (7:00-9:00) или на закате (17:00-18:30)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "opening_hours",
        value: "6:00 - 19:00 ежедневно",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "entrance_fee",
        value: "Бесплатно (пожертвования приветствуются)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "dress_code",
        value: "Плечи и колени закрыты (накидки выдают бесплатно)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "height",
        value: "45",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "altitude",
        value: "400",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["Парковка","Туалеты","Сувенирный магазин","Кафе","Накидки напрокат","Смотровая площадка","Колокольни"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["Самая известная достопримечательность Пхукета","Приезжайте рано утром - меньше жары и туристов","Закат с Big Buddha - один из лучших на острове","Купите колокольчик и загадайте желание","Дорога крутая 6км - проверьте тормоза на байке","Не забудьте воду - жарко","360° вид на весь остров","Статуя видна из Чалонга, Карона, Раваи","Фотографируйтесь ЛИЦОМ к Будде, не спиной"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "cultural_significance",
        value: "Главный религиозный символ Пхукета. Место силы и паломничества буддистов.",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/BigBuddhaPhuket",
        type: "url"
      }
    ]
  },

  {
    title: "Ват Чалонг (Wat Chalong)",
    handle: "wat-chalong",
    description: `Ват Чалонг - самый большой, самый важный и самый посещаемый буддийский храм на Пхукете. Красивая архитектура, пагода с реликвией Будды и музей восковых фигур монахов.

🙏 О храме:
Построен в начале 19 века. Посвящен двум почитаемым монахам - Луанг По Чем и Луанг По Чуанг, которые помогли подавить восстание китайских рабочников в 1876 году. Главный храм тайцев на Пхукете.

🏛️ Что посмотреть:
• Главный храм (Ubosot) - золотая статуя Будды
• Пагода (Chedi) - 60 метров, реликвия Будды внутри
• Музей восковых фигур почитаемых монахов
• Старый храм с фресками
• Сад с статуями
• Колокольни и барабаны

🎯 Что делать:
• Зажечь ароматические палочки (20 бат)
• Подняться на пагоду - внутри фрески и реликвия
• Попросить благословения у монахов
• Повязать цветную ленточку на дереве желаний
• Купить амулеты и обереги
• Покормить черепах в пруду

👔 Дресс-код:
Плечи и колени закрыты. Не строго как в Big Buddha, но желательно. Разуваться перед входом в храм.

🕐 Время работы:
7:00 - 17:00 ежедневно
Лучшее время: утро (8:00-10:00) когда мало людей

💰 Вход:
Бесплатно. Пожертвования приветствуются.
Ароматические палочки: 20-100 бат
Амулеты: 50-500 бат

🎆 Фестиваль:
Во время Вегетарианского фестиваля (октябрь) здесь самые яркие процессии и ритуалы. Сотни петард и фейерверков!`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "temple",
      "category:temples",
      "district:Chalong",
      "must-see",
      "cultural",
      "architecture",
      "free",
      "popular",
      "photo",
      "history",
      "price-level:1",
      "related-place:big-buddha-phuket",
      "related-tour:dostoprimechatelnosti-phuketa"
    ],
    
    metafields: [
      {
        namespace: "place_info",
        key: "coordinates",
        value: '{"lat": 7.8921, "lng": 98.3456}',
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
        value: "9876",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "duration",
        value: "1-1.5 часа",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Утро (8:00-10:00) - меньше туристов и жары",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "opening_hours",
        value: "7:00 - 17:00 ежедневно",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "entrance_fee",
        value: "Бесплатно",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "built_year",
        value: "1837",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["Парковка","Туалеты","Сувенирный магазин","Кафе","Музей","Пагода","Сад","Пруд с черепахами"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["Самый важный храм Пхукета","Обязательно поднимитесь на пагоду - там реликвия Будды","Купите ароматические палочки (20 бат) и зажгите","Не фотографируйте внутри главного храма","Разувайтесь перед входом","Повяжите ленточку на дереве желаний","Во время Вегетарианского фестиваля - тысячи людей","Много китайских туристов - приезжайте утром","Покормите черепах в пруду"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "cultural_significance",
        value: "Главный буддийский храм Пхукета. Место паломничества тайцев со всего острова.",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/WatChalong",
        type: "url"
      }
    ]
  },

  {
    title: "Храм Пхра Тонг (Wat Phra Thong)",
    handle: "wat-phra-thong",
    description: `Ват Пхра Тонг - древний храм с загадочной легендой о золотой статуе Будды, наполовину погруженной в землю. Попытки выкопать статую заканчивались несчастьями.

🙏 Легенда:
В 1785 году мальчик привязал буйвола к торчащей из земли "палке". Ночью у мальчика поднялась температура. Отец откопал "палку" и обнаружил золотую статую Будды. Попытки выкопать ее полностью приводили к болезням и смертям. Решили оставить наполовину в земле.

🏛️ О храме:
Построен вокруг легендарной статуи. Из земли торчит только верхняя часть Будды (высота около 1.5 метров). Местные верят что это очень мощное место силы.

🎯 Что делать:
• Поклониться золотому Будде
• Приклеить золотые листочки на статую (продаются на входе)
• Загадать желание
• Посмотреть древние фрески
• Купить амулеты
• Покормить рыб в пруду

👔 Дресс-код:
Плечи и колени закрыты. Разуваться перед входом в храм.

🕐 Время работы:
8:00 - 17:00 ежедневно
Лучшее время: утро

💰 Вход:
Бесплатно. Пожертвования приветствуются.
Золотые листочки: 20 бат

⚠️ Особенность:
Очень мало туристов! Это место в основном для местных тайцев. Аутентичная атмосфера без толп.`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "temple",
      "category:temples",
      "district:Thalang",
      "cultural",
      "legend",
      "ancient",
      "authentic",
      "free",
      "quiet",
      "local",
      "spiritual",
      "price-level:1",
      "related-place:heroines-monument"
    ],
    
    metafields: [
      {
        namespace: "place_info",
        key: "coordinates",
        value: '{"lat": 8.0234, "lng": 98.3567}',
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
        value: "1234",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "duration",
        value: "30-45 минут",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Утро (9:00-11:00)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "opening_hours",
        value: "8:00 - 17:00 ежедневно",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "built_year",
        value: "1785",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["Парковка","Туалеты","Пруд с рыбами","Сувениры"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["Легенда о Будде наполовину в земле - очень интересная","Мало туристов - спокойная атмосфера","Купите золотые листочки (20 бат) и приклейте на Будду","Место силы для местных тайцев","Можно совместить с Heroines Monument (5 минут)","Не пытайтесь выкопать статую 😄","Аутентичный храм без толп туристов"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "cultural_significance",
        value: "Священное место с древней легендой. Попытки выкопать статую заканчивались несчастьями.",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/WatPhraThong",
        type: "url"
      }
    ]
  },

  {
    title: "Храм Пхра Нанг Санг (Wat Phra Nang Sang)",
    handle: "wat-phra-nang-sang",
    description: `Ват Пхра Нанг Санг - один из старейших храмов Пхукета с уникальной архитектурой в португальско-китайском стиле. Находится в старом городе Пхукет Таун.

🏛️ О храме:
Построен более 200 лет назад. Смешение тайского, китайского и португальского стилей. Красивый храм с цветными орнаментами, резными дверями и древними фресками.

🎯 Что посмотреть:
• Главный зал с золотым Буддой
• Древние фрески на стенах
• Резные деревянные двери
• Китайские драконы на крыше
• Колокольня
• Маленький музей

👔 Дресс-код:
Плечи и колени закрыты. Разуваться перед входом.

🕐 Время работы:
8:00 - 18:00 ежедневно
Лучшее время: утро или вечер

💰 Вход:
Бесплатно

📍 Как добраться:
В центре старого города Пхукет Таун. Можно совместить с прогулкой по Old Town и посещением кафе.`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "temple",
      "category:temples",
      "district:Phuket Town",
      "old-town",
      "architecture",
      "cultural",
      "ancient",
      "free",
      "photo",
      "history",
      "price-level:1",
      "related-place:old-phuket-town",
      "related-place:thai-hua-museum"
    ],
    
    metafields: [
      {
        namespace: "place_info",
        key: "coordinates",
        value: '{"lat": 7.8867, "lng": 98.3889}',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "rating",
        value: "4.4",
        type: "number_decimal"
      },
      {
        namespace: "place_info",
        key: "reviews_count",
        value: "567",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "duration",
        value: "20-30 минут",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Утро или вечер (совместить с Old Town)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "opening_hours",
        value: "8:00 - 18:00 ежедневно",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "built_year",
        value: "~1800",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["Парковка рядом","Туалеты","Музей"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["Один из старейших храмов Пхукета","Уникальная архитектура - смесь стилей","В центре Old Town - легко дойти пешком","Совместите с прогулкой по старому городу","Мало туристов - спокойно","Красивые фрески внутри","После храма - кофе в Gallery Cafe"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/WatPhraNangSang",
        type: "url"
      }
    ]
  },

  {
    title: "Храм Суван Кхири Кет (Wat Suwan Khiri Khet)",
    handle: "wat-suwan-khiri-khet",
    description: `Ват Суван Кхири Кет - живописный храм с видом на море на мысе Promthep. Менее известен чем Big Buddha, но не менее красив. Золотая пагода и панорамные виды.

🏛️ О храме:
Небольшой храм на холме рядом с Promthep Cape. Золотая пагода видна с моря. Красивый сад, тишина и покой. Любимое место местных монахов для медитации.

🎯 Что делать:
• Поклониться Будде в главном зале
• Подняться к золотой пагоде
• Насладиться видом на море
• Посмотреть закат (близко к Promthep)
• Покормить рыб в пруду
• Медитировать в тишине

👔 Дресс-код:
Плечи и колени закрыты. Разуваться перед входом.

🕐 Время работы:
8:00 - 17:00 ежедневно
Лучшее время: утро или на закат

💰 Вход:
Бесплатно

📍 Расположение:
На холме над Rawai Beach, рядом с Promthep Cape. Совместите посещение храма с закатом на Промтепе.`,
    
    productType: "place",
    vendor: "PhuketDA",
    
    tags: [
      "place",
      "temple",
      "category:temples",
      "district:Rawai",
      "view",
      "sunset",
      "quiet",
      "meditation",
      "free",
      "photo",
      "hidden-gem",
      "price-level:1",
      "related-place:promthep-cape",
      "related-place:rawai-beach"
    ],
    
    metafields: [
      {
        namespace: "place_info",
        key: "coordinates",
        value: '{"lat": 7.7589, "lng": 98.3123}',
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
        value: "432",
        type: "number_integer"
      },
      {
        namespace: "place_info",
        key: "duration",
        value: "30 минут",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "best_time",
        value: "Вечер на закате (совместить с Promthep)",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "opening_hours",
        value: "8:00 - 17:00 ежедневно",
        type: "single_line_text_field"
      },
      {
        namespace: "place_info",
        key: "amenities",
        value: '["Парковка","Сад","Пруд","Смотровая площадка"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "tips",
        value: '["Скрытая жемчужина - мало туристов","Золотая пагода с видом на море","Идеально для медитации","Совместите с закатом на Promthep Cape","Тихое спокойное место","Красивый сад","После заката на Promthep зайдите сюда"]',
        type: "json"
      },
      {
        namespace: "place_info",
        key: "map_url",
        value: "https://maps.app.goo.gl/WatSuwanKhiriKhet",
        type: "url"
      }
    ]
  }
];

export default templesData;
