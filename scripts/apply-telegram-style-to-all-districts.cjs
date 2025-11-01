const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

/**
 * 🎨 ГЕНЕРАТОР ОПИСАНИЙ РАЙОНОВ ПХУКЕТА
 * 
 * Источник: phuket-insider.com/ru/region/[district]/
 * Этот скрипт создаёт уникальное описание для каждого района
 */

// Координаты центров районов (примерные, можно уточнить)
const districtCoordinates = {
  Patong: '7.8804,98.2923',
  Karon: '7.8400,98.2966',
  Kata: '7.8180,98.2988',
  Bangtao: '7.9833,98.2778',
  Rawai: '7.7800,98.3167',
  Surin: '7.9667,98.2800',
  Kamala: '7.9333,98.2700',
  Chalong: '7.8467,98.3400',
  Panwa: '7.8000,98.4000',
  NaiHarn: '7.7667,98.3100',
  PhuketTown: '7.8808,98.3923',
  Kathu: '7.9200,98.3200',
  Cherngtalay: '7.9833,98.2778',
  Naiyang: '8.0833,98.2833',
  Thalang: '8.0333,98.3667'
};

// Данные для каждого района (на основе phuket-insider.com)
const districts = [
  {
    handle: 'patong-district',
    title: '📍 Патонг — Центр ночной жизни Пхукета',
    subtitle: 'Самый оживленный туристический район',
    rating: '4.5',
    coordinates: districtCoordinates.Patong,
    heroGradient: 'from-red-500 to-orange-600',
    heroIcon: '🌃',
    description: 'Патонг – самый оживленный туристический район Пхукета. Его заслуженно считают центром ночной жизни на острове. Отдых на Патонге точно понравится людям, которые любят ночную жизнь. Здесь находятся знаменитая тусовочная улица Бангла-Роуд и огромное количество кафе и ресторанов, баров и клубов.',
    pros: [
      { icon: '🌃', text: 'Знаменитая ночная жизнь (Bangla Road)' },
      { icon: '🛍️', text: 'Два крупных торговых центра' },
      { icon: '🏖️', text: 'Длинный пляж (2.85 км)' },
      { icon: '🍽️', text: 'Множество ресторанов и кафе' },
      { icon: '🏨', text: 'Разнообразное жилье (от бюджетных до роскошных отелей)' }
    ],
    cons: [
      { icon: '🔊', text: 'Шумно до поздней ночи' },
      { icon: '👥', text: 'Много туристов' },
      { icon: '💰', text: 'Выше цены чем в других районах' }
    ],
    infrastructure: [
      { icon: '🏨', text: 'Отели всех категорий' },
      { icon: '🛍️', text: 'Jungceylon, Patong Plaza' },
      { icon: '🏥', text: 'Больницы и клиники' },
      { icon: '🏧', text: 'Банкоматы на каждом шагу' },
      { icon: '🍽️', text: 'Рестораны, кафе, бары' },
      { icon: '🚗', text: 'Такси, тук-туки, аренда авто' }
    ],
    nearby: [
      { text: 'Пляж Патонг' },
      { text: 'Пляж Freedom Beach' },
      { text: 'Пляж Paradise Beach' },
      { text: 'Пляж Tri Trang' }
    ],
    bestFor: 'Туристы, любящие ночную жизнь, тусовки, шопинг',
    finalCta: 'Патонг – идеальный выбор для тех, кто ищет активный отдых, ночную жизнь и всё под рукой. Район отлично подходит для первого знакомства с Пхукетом.'
  },
  {
    handle: 'karon-district',
    title: '📍 Карон — Идеально для семей с детьми',
    subtitle: 'Спокойный, но нескучный район',
    rating: '4.6',
    coordinates: districtCoordinates.Karon,
    heroGradient: 'from-blue-500 to-cyan-600',
    heroIcon: '👨‍👩‍👧‍👦',
    description: 'Карон – это относительно спокойный, но при этом нескучный район, который идеально подходит для отдыха семей с детьми. Здесь хорошо развита инфраструктура, есть много кафе (включая русские) и массажных салонов. Карон также хорошо подойдет для активного отдыха: здесь есть разнообразные водные развлечения.',
    pros: [
      { icon: '🏖️', text: 'Просторанный пляж с "поющим" песком' },
      { icon: '👨‍👩‍👧‍👦', text: 'Идеально для семей с детьми' },
      { icon: '🏨', text: 'Спокойные отели и роскошные виллы' },
      { icon: '🍽️', text: 'Много ресторанов (включая русские)' },
      { icon: '💆', text: 'Массажные салоны' }
    ],
    cons: [
      { icon: '🌊', text: 'Море может быть неспокойным в сезон дождей' },
      { icon: '🚗', text: 'Дальше от аэропорта чем Патонг' }
    ],
    infrastructure: [
      { icon: '🏨', text: 'Отели от бюджетных до роскошных' },
      { icon: '🍽️', text: 'Рестораны тайской, европейской, русской кухни' },
      { icon: '💆', text: 'Множество массажных салонов' },
      { icon: '🏥', text: 'Медицинские клиники' },
      { icon: '🚗', text: 'Удобная транспортная доступность' },
      { icon: '🏪', text: 'Магазины и супермаркеты' }
    ],
    nearby: [
      { text: 'Пляж Карон' },
      { text: 'Пляж Ката' },
      { text: 'Карон парк' },
      { text: 'Храм Ват Карон' }
    ],
    bestFor: 'Семьи с детьми, любители спокойного отдыха, активные путешественники',
    finalCta: 'Карон – приятный район с множеством мест для прогулок, который позволяет сочетать размеренный и активный отдых. Идеально для тех, кто хочет быть рядом с пляжем, но вдали от шума.'
  },
  {
    handle: 'kata-district',
    title: '📍 Ката — Серферский рай',
    subtitle: 'Лучшие волны для серфинга',
    rating: '4.5',
    coordinates: districtCoordinates.Kata,
    heroGradient: 'from-cyan-500 to-blue-600',
    heroIcon: '🏄',
    description: 'Ката – популярный район на юго-западе Пхукета, известный своими отличными условиями для серфинга. Здесь два пляжа – Ката и Ката Ной, разделенные скалистым мысом. Район отлично подходит для активного отдыха и любителей водных видов спорта.',
    pros: [
      { icon: '🏄', text: 'Лучшие условия для серфинга на Пхукете' },
      { icon: '🏖️', text: 'Два красивых пляжа (Ката и Ката Ной)' },
      { icon: '🌊', text: 'Отличные волны в сезон' },
      { icon: '🍽️', text: 'Кафе и рестораны с видом на море' },
      { icon: '🏨', text: 'Отели от бюджетных до премиум' }
    ],
    cons: [
      { icon: '🌊', text: 'Сильные волны не подходят для маленьких детей' },
      { icon: '🚗', text: 'Узкие дороги, может быть сложно парковаться' }
    ],
    infrastructure: [
      { icon: '🏄', text: 'Школы серфинга и прокат досок' },
      { icon: '🍽️', text: 'Рестораны и кафе' },
      { icon: '🏨', text: 'Отели и виллы' },
      { icon: '💆', text: 'СПА и массаж' },
      { icon: '🏪', text: 'Магазины' },
      { icon: '🚗', text: 'Аренда авто и байков' }
    ],
    nearby: [
      { text: 'Пляж Ката' },
      { text: 'Пляж Ката Ной' },
      { text: 'Карон (5 минут езды)' },
      { text: 'Karon Viewpoint' }
    ],
    bestFor: 'Серферы, любители активного отдыха, молодежь',
    finalCta: 'Ката – рай для серферов и любителей водных видов спорта. Район предлагает отличные пляжи, хорошую инфраструктуру и незабываемые закаты.'
  },
  {
    handle: 'bangtao-district',
    title: '📍 Банг Тао — Премиум отдых',
    subtitle: 'Роскошные курорты и виллы',
    rating: '4.7',
    coordinates: districtCoordinates.Bangtao,
    heroGradient: 'from-purple-500 to-pink-600',
    heroIcon: '👑',
    description: 'Банг Тао – один из самых премиальных районов Пхукета, известный своими роскошными курортами, виллами и длинным пляжем. Здесь расположены одни из лучших отелей острова, включая 5-звездочные курорты. Район идеален для тех, кто ищет спокойный и комфортный отдых.',
    pros: [
      { icon: '👑', text: 'Роскошные 5-звездочные курорты' },
      { icon: '🏖️', text: 'Длинный пляж (8 км)' },
      { icon: '🏡', text: 'Премиум виллы и резиденции' },
      { icon: '🍽️', text: 'Рестораны высокого уровня' },
      { icon: '💆', text: 'Элитные СПА-центры' }
    ],
    cons: [
      { icon: '💰', text: 'Высокие цены' },
      { icon: '🚗', text: 'Нужна аренда авто для перемещений' },
      { icon: '🍽️', text: 'Ограниченный выбор бюджетных ресторанов' }
    ],
    infrastructure: [
      { icon: '🏨', text: 'Лучшие курорты Пхукета' },
      { icon: '🏌️', text: 'Гольф-клубы' },
      { icon: '🍽️', text: 'Рестораны fine dining' },
      { icon: '💆', text: 'Премиум СПА' },
      { icon: '🛍️', text: 'Бутики и люксовые магазины' },
      { icon: '🚁', text: 'Вертолетные площадки' }
    ],
    nearby: [
      { text: 'Пляж Банг Тао' },
      { text: 'Лагуна Пхукет' },
      { text: 'Surin Beach' },
      { text: 'Crystal Lake' }
    ],
    bestFor: 'Премиум туристы, любители роскоши, спокойного отдыха',
    finalCta: 'Банг Тао – выбор тех, кто ценит комфорт, роскошь и спокойствие. Здесь вы найдете лучшие курорты острова и незабываемый отдых.'
  },
  {
    handle: 'rawai-district',
    title: '📍 Раваи — Спокойствие и уют',
    subtitle: 'Жилой район на юге Пхукета',
    rating: '4.4',
    coordinates: districtCoordinates.Rawai,
    heroGradient: 'from-green-500 to-emerald-600',
    heroIcon: '🏡',
    description: 'Раваи – спокойный жилой район на южной оконечности Пхукета. Здесь застроены жилые дома и виллы, с меньшим количеством отелей по сравнению с другими районами. Район отлично подходит для длительного проживания и тех, кто ищет спокойный отдых вдали от туристической суеты.',
    pros: [
      { icon: '🏡', text: 'Жилой район, спокойная атмосфера' },
      { icon: '💰', text: 'Более доступные цены на жилье' },
      { icon: '🦐', text: 'Свежие морепродукты на рынке' },
      { icon: '⛵', text: 'Яхт-клубы и пристани' },
      { icon: '🌊', text: 'Близость к островам для экскурсий' }
    ],
    cons: [
      { icon: '🏖️', text: 'Пляж Раваи каменистый, не для купания' },
      { icon: '🚗', text: 'Нужна аренда транспорта' },
      { icon: '🍽️', text: 'Меньше ресторанов чем в Патонге' }
    ],
    infrastructure: [
      { icon: '🏡', text: 'Виллы и дома для аренды' },
      { icon: '🦐', text: 'Рыбный рынок Раваи' },
      { icon: '⛵', text: 'Яхт-клубы и экскурсии на острова' },
      { icon: '🍽️', text: 'Рестораны с морепродуктами' },
      { icon: '🏪', text: 'Магазины и супермаркеты' },
      { icon: '💆', text: 'Массажные салоны' }
    ],
    nearby: [
      { text: 'Пляж Раваи (рыбный рынок)' },
      { text: 'Пляж Януи' },
      { text: 'Пляж Най Харн' },
      { text: 'Промтеп Кейп (закаты)' }
    ],
    bestFor: 'Длительное проживание, любители спокойного отдыха, яхтсмены',
    finalCta: 'Раваи – идеальный выбор для тех, кто хочет жить как местный, вдали от туристической суеты, но рядом с морем и красивой природой.'
  },
  {
    handle: 'phuket-town-district',
    title: '📍 Пхукет Таун — Исторический центр',
    subtitle: 'Культура и история острова',
    rating: '4.6',
    coordinates: districtCoordinates.PhuketTown,
    heroGradient: 'from-amber-500 to-orange-600',
    heroIcon: '🏛️',
    description: 'Пхукет Таун – исторический центр острова, известный своей уникальной архитектурой в стиле сино-португальских колониальных домов. Здесь вы не найдете пляжей, но зато окунетесь в культуру, историю и местную жизнь. Район отлично подходит для любителей архитектуры, культуры и гастрономии.',
    pros: [
      { icon: '🏛️', text: 'Уникальная колониальная архитектура' },
      { icon: '🍽️', text: 'Лучшие рестораны тайской кухни' },
      { icon: '🛍️', text: 'Уникальные магазины и сувениры' },
      { icon: '💰', text: 'Доступные цены' },
      { icon: '🎨', text: 'Галереи и культурные центры' }
    ],
    cons: [
      { icon: '🏖️', text: 'Нет пляжей' },
      { icon: '🚗', text: 'Нужна аренда авто до пляжей (30-40 мин)' },
      { icon: '🌙', text: 'Меньше ночной жизни чем в Патонге' }
    ],
    infrastructure: [
      { icon: '🏛️', text: 'Музеи и культурные центры' },
      { icon: '🛍️', text: 'Уникальные магазины и рынки' },
      { icon: '🍽️', text: 'Рестораны тайской кухни' },
      { icon: '🏨', text: 'Бутик-отели' },
      { icon: '🏧', text: 'Банкоматы и банки' },
      { icon: '🚗', text: 'Удобная транспортная доступность' }
    ],
    nearby: [
      { text: 'Old Town (исторический центр)' },
      { text: 'Храм Ват Чалонг' },
      { text: 'Большой Будда' },
      { text: 'Weekend Market' }
    ],
    bestFor: 'Любители культуры, истории, гастрономии, бюджетные путешественники',
    finalCta: 'Пхукет Таун – уникальное место, где можно почувствовать настоящий Пхукет, его историю и культуру. Идеально для тех, кто хочет увидеть не только пляжи.'
  },
  {
    handle: 'surin-district',
    title: '📍 Сурин — Премиум пляж',
    subtitle: 'Элитный район с лучшим пляжем',
    rating: '4.8',
    coordinates: districtCoordinates.Surin,
    heroGradient: 'from-blue-500 to-indigo-600',
    heroIcon: '💎',
    description: 'Сурин – премиальный район на западном побережье Пхукета, известный своим роскошным пляжем и элитными курортами. Здесь расположены одни из самых дорогих отелей и вилл острова.',
    pros: [
      { icon: '🏖️', text: 'Один из лучших пляжей Пхукета' },
      { icon: '👑', text: 'Элитные курорты и виллы' },
      { icon: '🍽️', text: 'Рестораны fine dining' },
      { icon: '💆', text: 'Премиум СПА-центры' },
      { icon: '🌅', text: 'Незабываемые закаты' }
    ],
    cons: [
      { icon: '💰', text: 'Очень высокие цены' },
      { icon: '🚗', text: 'Нужна аренда авто' },
      { icon: '🍽️', text: 'Ограниченный выбор бюджетных ресторанов' }
    ],
    infrastructure: [
      { icon: '🏨', text: 'Премиум курорты' },
      { icon: '🏌️', text: 'Гольф-клубы' },
      { icon: '🍽️', text: 'Рестораны высокого уровня' },
      { icon: '💆', text: 'Элитные СПА' },
      { icon: '🛍️', text: 'Бутики' },
      { icon: '🚁', text: 'Вертолетные площадки' }
    ],
    nearby: [
      { text: 'Пляж Сурин' },
      { text: 'Банг Тао (5 минут)' },
      { text: 'Гольф-клубы' },
      { text: 'Лагуна Пхукет' }
    ],
    bestFor: 'Премиум туристы, любители роскоши, спокойного отдыха',
    finalCta: 'Сурин – выбор тех, кто ищет лучший пляж Пхукета и не экономит на комфорте. Элитный отдых в самом красивом районе острова.'
  },
  {
    handle: 'kamala-district',
    title: '📍 Камала — Спокойный семейный район',
    subtitle: 'Тихий пляж между Патонгом и Сурином',
    rating: '4.5',
    coordinates: districtCoordinates.Kamala,
    heroGradient: 'from-teal-500 to-cyan-600',
    heroIcon: '👨‍👩‍👧‍👦',
    description: 'Камала – спокойный район между Патонгом и Сурином, идеально подходящий для семейного отдыха. Здесь есть хороший пляж, развитая инфраструктура, но при этом меньше туристов чем в Патонге.',
    pros: [
      { icon: '🏖️', text: 'Хороший пляж для семей' },
      { icon: '👨‍👩‍👧‍👦', text: 'Идеально для семей с детьми' },
      { icon: '💰', text: 'Доступные цены на жилье' },
      { icon: '🍽️', text: 'Рестораны на любой вкус' },
      { icon: '🚗', text: 'Близко к Патонгу (10 минут)' }
    ],
    cons: [
      { icon: '🌊', text: 'Море может быть неспокойным' },
      { icon: '🚗', text: 'Нужна аренда авто для перемещений' }
    ],
    infrastructure: [
      { icon: '🏨', text: 'Отели среднего класса' },
      { icon: '🍽️', text: 'Рестораны и кафе' },
      { icon: '🏪', text: 'Магазины и супермаркеты' },
      { icon: '💆', text: 'Массажные салоны' },
      { icon: '🏥', text: 'Медицинские клиники' },
      { icon: '🚗', text: 'Аренда авто и байков' }
    ],
    nearby: [
      { text: 'Пляж Камала' },
      { text: 'Патонг (10 минут)' },
      { text: 'Сурин (5 минут)' },
      { text: 'Phuket FantaSea (шоу)' }
    ],
    bestFor: 'Семьи с детьми, любители спокойного отдыха, бюджетные путешественники',
    finalCta: 'Камала – золотая середина между активным Патонгом и премиум Сурином. Спокойный отдых с хорошей инфраструктурой по доступным ценам.'
  },
  {
    handle: 'chalong-district',
    title: '📍 Чалонг — Ворота к островам',
    subtitle: 'Стартовая точка для экскурсий',
    rating: '4.4',
    coordinates: districtCoordinates.Chalong,
    heroGradient: 'from-emerald-500 to-teal-600',
    heroIcon: '⛵',
    description: 'Чалонг – район на восточном побережье Пхукета, известный как главная отправная точка для экскурсий на острова (Пхи-Пхи, Краби). Здесь расположены пристани и множество туристических агентств.',
    pros: [
      { icon: '⛵', text: 'Главная отправная точка для экскурсий' },
      { icon: '🏛️', text: 'Храм Ват Чалонг (самый большой)' },
      { icon: '💰', text: 'Доступные цены на жилье' },
      { icon: '🍽️', text: 'Рестораны с морепродуктами' },
      { icon: '🚗', text: 'Удобная транспортная доступность' }
    ],
    cons: [
      { icon: '🏖️', text: 'Нет хороших пляжей для купания' },
      { icon: '🌊', text: 'Восточное побережье (меньше волн)' },
      { icon: '🚗', text: 'Дальше от популярных пляжей' }
    ],
    infrastructure: [
      { icon: '⛵', text: 'Пристани и яхт-клубы' },
      { icon: '🏛️', text: 'Храм Ват Чалонг' },
      { icon: '🍽️', text: 'Рестораны с морепродуктами' },
      { icon: '🏪', text: 'Магазины и супермаркеты' },
      { icon: '💆', text: 'Массажные салоны' },
      { icon: '🚗', text: 'Транспортная доступность' }
    ],
    nearby: [
      { text: 'Храм Ват Чалонг' },
      { text: 'Большой Будда' },
      { text: 'Пристани для экскурсий' },
      { text: 'Карон (15 минут)' }
    ],
    bestFor: 'Активные путешественники, любители экскурсий, бюджетные туристы',
    finalCta: 'Чалонг – идеальный выбор для тех, кто планирует много экскурсий. Удобное расположение, доступные цены и близость к главным достопримечательностям.'
  },
  {
    handle: 'panwa-district',
    title: '📍 Панва — Уединенный полуостров',
    subtitle: 'Тихий уголок для спокойного отдыха',
    rating: '4.3',
    coordinates: districtCoordinates.Panwa,
    heroGradient: 'from-slate-500 to-gray-600',
    heroIcon: '🌴',
    description: 'Панва – уединенный полуостров на востоке Пхукета, известный своими виллами, отелями и спокойной атмосферой. Здесь меньше туристов, но есть хорошая инфраструктура.',
    pros: [
      { icon: '🌴', text: 'Уединенная атмосфера' },
      { icon: '🏡', text: 'Виллы и частные резиденции' },
      { icon: '💰', text: 'Доступные цены на виллы' },
      { icon: '🌅', text: 'Красивые виды на залив' },
      { icon: '🚗', text: 'Тихо и спокойно' }
    ],
    cons: [
      { icon: '🏖️', text: 'Нет популярных пляжей' },
      { icon: '🚗', text: 'Нужна аренда авто' },
      { icon: '🍽️', text: 'Меньше ресторанов' }
    ],
    infrastructure: [
      { icon: '🏡', text: 'Виллы для аренды' },
      { icon: '🏨', text: 'Отели среднего класса' },
      { icon: '🍽️', text: 'Рестораны и кафе' },
      { icon: '🏪', text: 'Магазины' },
      { icon: '💆', text: 'Массажные салоны' },
      { icon: '🚗', text: 'Аренда авто' }
    ],
    nearby: [
      { text: 'Пляж Панва' },
      { text: 'Пхукет Таун (20 минут)' },
      { text: 'Острова для экскурсий' },
      { text: 'Рыбный рынок' }
    ],
    bestFor: 'Любители уединения, длительного проживания, спокойного отдыха',
    finalCta: 'Панва – для тех, кто хочет уединения и спокойствия. Идеально для длительного проживания вдали от туристической суеты.'
  },
  {
    handle: 'nai-harn-district',
    title: '📍 Най Харн — Лучший пляж для серфинга',
    subtitle: 'Серферский рай на юге',
    rating: '4.6',
    coordinates: districtCoordinates.NaiHarn,
    heroGradient: 'from-blue-500 to-cyan-600',
    heroIcon: '🏄',
    description: 'Най Харн – район на юге Пхукета, известный одним из лучших пляжей для серфинга. Здесь красивая природа, хорошие волны и спокойная атмосфера.',
    pros: [
      { icon: '🏄', text: 'Лучший пляж для серфинга на юге' },
      { icon: '🌊', text: 'Отличные волны в сезон' },
      { icon: '🌴', text: 'Красивая природа и окрестности' },
      { icon: '💰', text: 'Доступные цены' },
      { icon: '🏖️', text: 'Чистый и просторный пляж' }
    ],
    cons: [
      { icon: '🌊', text: 'Сильные волны не для всех' },
      { icon: '🚗', text: 'Дальше от основных достопримечательностей' },
      { icon: '🍽️', text: 'Меньше выбор ресторанов' }
    ],
    infrastructure: [
      { icon: '🏄', text: 'Школы серфинга' },
      { icon: '🏨', text: 'Отели среднего класса' },
      { icon: '🍽️', text: 'Рестораны и кафе' },
      { icon: '🏪', text: 'Магазины' },
      { icon: '💆', text: 'Массажные салоны' },
      { icon: '🚗', text: 'Аренда авто и байков' }
    ],
    nearby: [
      { text: 'Пляж Най Харн' },
      { text: 'Пляж Януи' },
      { text: 'Промтеп Кейп (закаты)' },
      { text: 'Раваи (10 минут)' }
    ],
    bestFor: 'Серферы, любители активного отдыха, спокойного отдыха на природе',
    finalCta: 'Най Харн – рай для серферов и любителей красивой природы. Один из лучших пляжей Пхукета для активного отдыха.'
  },
  {
    handle: 'kathu-district',
    title: '📍 Кату — В центре событий',
    subtitle: 'Между Патонгом и аэропортом',
    rating: '4.4',
    coordinates: districtCoordinates.Kathu,
    heroGradient: 'from-orange-500 to-red-600',
    heroIcon: '🎯',
    description: 'Кату – район в центре Пхукета, расположенный между Патонгом и аэропортом. Удобное расположение делает его популярным для тех, кто хочет быть рядом со всем.',
    pros: [
      { icon: '📍', text: 'Центральное расположение' },
      { icon: '🚗', text: 'Близко к аэропорту и Патонгу' },
      { icon: '💰', text: 'Доступные цены' },
      { icon: '🍽️', text: 'Много ресторанов' },
      { icon: '🏨', text: 'Отели всех категорий' }
    ],
    cons: [
      { icon: '🏖️', text: 'Нет прямого доступа к пляжу' },
      { icon: '🚗', text: 'Нужна аренда авто до пляжей' },
      { icon: '🌙', text: 'Меньше ночной жизни' }
    ],
    infrastructure: [
      { icon: '🏨', text: 'Отели от бюджетных до премиум' },
      { icon: '🍽️', text: 'Рестораны и кафе' },
      { icon: '🏪', text: 'Магазины и супермаркеты' },
      { icon: '🏥', text: 'Медицинские клиники' },
      { icon: '🚗', text: 'Удобная транспортная доступность' },
      { icon: '💆', text: 'Массажные салоны' }
    ],
    nearby: [
      { text: 'Патонг (10 минут)' },
      { text: 'Аэропорт (20 минут)' },
      { text: 'Big C Supercenter' },
      { text: 'Тигровый парк' }
    ],
    bestFor: 'Туристы, ищущие центральное расположение, бюджетные путешественники',
    finalCta: 'Кату – идеальный выбор для тех, кто хочет быть в центре событий. Удобное расположение по доступным ценам.'
  },
  {
    handle: 'cherngtalay-district',
    title: '📍 Чернгталай — Роскошь у лагуны',
    subtitle: 'Премиум район рядом с Банг Тао',
    rating: '4.7',
    coordinates: districtCoordinates.Cherngtalay,
    heroGradient: 'from-purple-500 to-pink-600',
    heroIcon: '🏰',
    description: 'Чернгталай – премиальный район рядом с Банг Тао и Лагуной Пхукет. Здесь расположены роскошные виллы, элитные курорты и одни из лучших гольф-полей острова.',
    pros: [
      { icon: '👑', text: 'Роскошные виллы и курорты' },
      { icon: '🏌️', text: 'Лучшие гольф-поля Пхукета' },
      { icon: '🏖️', text: 'Близко к пляжу Банг Тао' },
      { icon: '🍽️', text: 'Рестораны высокого уровня' },
      { icon: '💆', text: 'Элитные СПА-центры' }
    ],
    cons: [
      { icon: '💰', text: 'Очень высокие цены' },
      { icon: '🚗', text: 'Нужна аренда авто' },
      { icon: '🍽️', text: 'Ограниченный бюджетный выбор' }
    ],
    infrastructure: [
      { icon: '🏌️', text: 'Гольф-клубы (Лагуна)' },
      { icon: '🏨', text: 'Премиум курорты' },
      { icon: '🏡', text: 'Роскошные виллы' },
      { icon: '🍽️', text: 'Fine dining рестораны' },
      { icon: '💆', text: 'Элитные СПА' },
      { icon: '🛍️', text: 'Бутики' }
    ],
    nearby: [
      { text: 'Лагуна Пхукет' },
      { text: 'Пляж Банг Тао' },
      { text: 'Гольф-клубы' },
      { text: 'Surin Beach (5 минут)' }
    ],
    bestFor: 'Премиум туристы, гольфисты, любители роскоши',
    finalCta: 'Чернгталай – рай для любителей гольфа и роскоши. Премиальный отдых в одном из самых красивых районов Пхукета.'
  },
  {
    handle: 'naiyang-district',
    title: '📍 Найянг — У аэропорта',
    subtitle: 'Удобное расположение рядом с аэропортом',
    rating: '4.3',
    coordinates: districtCoordinates.Naiyang,
    heroGradient: 'from-indigo-500 to-purple-600',
    heroIcon: '✈️',
    description: 'Найянг – район рядом с аэропортом Пхукета, известный своим национальным парком и пляжем. Идеально для тех, кто хочет быть рядом с аэропортом и избежать пробок.',
    pros: [
      { icon: '✈️', text: 'Близко к аэропорту (5 минут)' },
      { icon: '🌴', text: 'Национальный парк Сиринат' },
      { icon: '🏖️', text: 'Хороший пляж' },
      { icon: '💰', text: 'Доступные цены' },
      { icon: '🚗', text: 'Избегаете пробок до аэропорта' }
    ],
    cons: [
      { icon: '🏖️', text: 'Пляж дальше от основных достопримечательностей' },
      { icon: '🚗', text: 'Дальше от Патонга (30-40 минут)' },
      { icon: '🍽️', text: 'Меньше выбор ресторанов' }
    ],
    infrastructure: [
      { icon: '🏨', text: 'Отели рядом с аэропортом' },
      { icon: '🌴', text: 'Национальный парк Сиринат' },
      { icon: '🍽️', text: 'Рестораны и кафе' },
      { icon: '🏪', text: 'Магазины' },
      { icon: '🚗', text: 'Удобная транспортная доступность' },
      { icon: '💆', text: 'Массажные салоны' }
    ],
    nearby: [
      { text: 'Пляж Найянг' },
      { text: 'Аэропорт Пхукет (5 минут)' },
      { text: 'Национальный парк Сиринат' },
      { text: 'Сурин (20 минут)' }
    ],
    bestFor: 'Туристы с ранними/поздними рейсами, любители природы, бюджетные путешественники',
    finalCta: 'Найянг – идеальный выбор для тех, кто хочет быть рядом с аэропортом и избежать пробок. Хороший пляж и доступные цены.'
  },
  {
    handle: 'thalang-district',
    title: '📍 Тхаланг — Исторический центр',
    subtitle: 'Старинный район на севере',
    rating: '4.2',
    coordinates: districtCoordinates.Thalang,
    heroGradient: 'from-amber-500 to-yellow-600',
    heroIcon: '🏛️',
    description: 'Тхаланг – исторический район на севере Пхукета, известный своими достопримечательностями и близостью к аэропорту. Здесь меньше туристов, но есть интересные места.',
    pros: [
      { icon: '🏛️', text: 'Исторические достопримечательности' },
      { icon: '✈️', text: 'Близко к аэропорту' },
      { icon: '💰', text: 'Доступные цены' },
      { icon: '🌴', text: 'Красивая природа' },
      { icon: '🚗', text: 'Удобная транспортная доступность' }
    ],
    cons: [
      { icon: '🏖️', text: 'Дальше от популярных пляжей' },
      { icon: '🚗', text: 'Нужна аренда авто' },
      { icon: '🍽️', text: 'Меньше выбор ресторанов' }
    ],
    infrastructure: [
      { icon: '🏛️', text: 'Исторические достопримечательности' },
      { icon: '🏨', text: 'Отели среднего класса' },
      { icon: '🍽️', text: 'Рестораны и кафе' },
      { icon: '🏪', text: 'Магазины' },
      { icon: '🚗', text: 'Транспортная доступность' },
      { icon: '💆', text: 'Массажные салоны' }
    ],
    nearby: [
      { text: 'Памятник героям Тхаланга' },
      { text: 'Аэропорт Пхукет (15 минут)' },
      { text: 'Национальный парк' },
      { text: 'Банг Тао (20 минут)' }
    ],
    bestFor: 'Любители истории, бюджетные путешественники, длительное проживание',
    finalCta: 'Тхаланг – для тех, кто интересуется историей и хочет избежать туристической суеты. Доступные цены и близость к аэропорту.'
  }
];

function generateDistrictHTML(district) {
  const prosHTML = district.pros.map(p => `
    <div class="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
      <span class="text-xl flex-shrink-0">${p.icon}</span>
      <span class="text-sm text-gray-700">${p.text}</span>
    </div>
  `).join('');

  const consHTML = district.cons.map(c => `
    <div class="flex items-start gap-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
      <span class="text-xl flex-shrink-0">${c.icon}</span>
      <span class="text-sm text-gray-700">${c.text}</span>
    </div>
  `).join('');

  const infrastructureHTML = district.infrastructure.map(i => `
    <div class="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200">
      <span class="text-lg">${i.icon}</span>
      <span class="text-xs text-gray-600">${i.text}</span>
    </div>
  `).join('');

  const nearbyHTML = district.nearby.map(n => `
    <li class="flex items-center gap-2 text-sm text-gray-700">
      <span class="text-blue-500">•</span>
      <span>${n.text}</span>
    </li>
  `).join('');

  return `
<div class="space-y-6">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r ${district.heroGradient} rounded-2xl p-6 text-white">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-4xl">${district.heroIcon}</span>
      <div>
        <h1 class="text-2xl font-bold">${district.title}</h1>
        <p class="text-blue-100 text-lg">${district.subtitle}</p>
      </div>
    </div>
    <div class="flex items-center gap-4 mt-4 text-sm">
      <div class="flex items-center gap-1">
        <span class="text-yellow-300">⭐</span>
        <span class="font-semibold">${district.rating}</span>
      </div>
    </div>
  </div>

  <!-- Quick Info -->
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">📍</span>
        <span class="font-semibold text-gray-900">Район</span>
      </div>
      <p class="text-gray-600 text-sm">${district.title.replace('📍 ', '').split(' — ')[0]}</p>
    </div>
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🎯</span>
        <span class="font-semibold text-gray-900">Подходит для</span>
      </div>
      <p class="text-gray-600 text-sm">${district.bestFor}</p>
    </div>
  </div>

  <!-- Main Description -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h2 class="text-xl font-bold text-gray-900 mb-4">О районе</h2>
    <p class="text-gray-600 leading-relaxed">
      ${district.description}
    </p>
  </div>

  <!-- Pros and Cons -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 class="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
        <span>✅</span>
        <span>Плюсы</span>
      </h3>
      <div class="space-y-2">
        ${prosHTML}
      </div>
    </div>
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 class="text-lg font-bold text-orange-700 mb-3 flex items-center gap-2">
        <span>⚠️</span>
        <span>Минусы</span>
      </h3>
      <div class="space-y-2">
        ${consHTML}
      </div>
    </div>
  </div>

  <!-- Infrastructure -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Инфраструктура</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      ${infrastructureHTML}
    </div>
  </div>

  <!-- Nearby Places -->
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Что рядом</h3>
    <ul class="space-y-2">
      ${nearbyHTML}
    </ul>
  </div>

  <!-- Final CTA -->
  <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 text-center">
    <p class="text-gray-600 italic leading-relaxed">
      ${district.finalCta}
    </p>
  </div>
</div>
  `;
}

async function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_STORE,
      path: '/admin/api/2025-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function createDistrict(district, index, total) {
  try {
    console.log(`\n📝 [${index + 1}/${total}] ${district.title}`);
    
    const html = generateDistrictHTML(district);
    
    // Экранирование для GraphQL
    const escapedHtml = html
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
    
    const mutation = `
      mutation {
        productCreate(input: {
          title: "${district.title}",
          handle: "${district.handle}",
          productType: "Information",
          tags: ["info", "insider", "category:districts", "district:${district.handle.split('-')[0]}"],
          descriptionHtml: "${escapedHtml}"
        }) {
          product {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const result = await makeGraphQLRequest(mutation);
    
    if (result.errors) {
      console.error('❌ GraphQL ошибки:', JSON.stringify(result.errors, null, 2));
      return false;
    }
    
    if (result.data?.productCreate?.userErrors?.length > 0) {
      console.error('❌ Ошибки создания:', JSON.stringify(result.data.productCreate.userErrors, null, 2));
      return false;
    }
    
    const productId = result.data?.productCreate?.product?.id;
    
    if (!productId) {
      console.error('❌ Продукт не создан. Ответ:', JSON.stringify(result.data, null, 2));
      return false;
    }
    
    console.log(`✅ Создан: ${productId}`);
    
    // Получаем первый вариант продукта для обновления цены
    const getVariantsQuery = `
      query {
        product(id: "${productId}") {
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `;
    
    const variantsResult = await makeGraphQLRequest(getVariantsQuery);
    const variantId = variantsResult.data?.product?.variants?.edges?.[0]?.node?.id;
    
    if (variantId) {
      const variantUpdateMutation = `
        mutation {
          productVariantUpdate(input: {
            id: "${variantId}",
            price: "0.00"
          }) {
            productVariant {
              id
              price
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      
      await makeGraphQLRequest(variantUpdateMutation);
      console.log('✅ Цена варианта установлена: 0.00');
    }
    
    // Добавляем metafields
    const metafieldMutation = `
      mutation {
        metafieldsSet(metafields: [
          {
            ownerId: "${productId}",
            namespace: "place_info",
            key: "coordinates",
            value: "${district.coordinates}",
            type: "single_line_text_field"
          },
          {
            ownerId: "${productId}",
            namespace: "place_info",
            key: "rating",
            value: "${district.rating}",
            type: "single_line_text_field"
          },
          {
            ownerId: "${productId}",
            namespace: "place_info",
            key: "district",
            value: "${district.handle.split('-')[0]}",
            type: "single_line_text_field"
          }
        ]) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
      }
    `;
    
    const metafieldResult = await makeGraphQLRequest(metafieldMutation);
    
    if (metafieldResult.data?.metafieldsSet?.userErrors?.length > 0) {
      console.warn('⚠️ Ошибки metafields:', metafieldResult.data.metafieldsSet.userErrors);
    } else {
      console.log('✅ Metafields добавлены');
    }
    
    // Публикуем продукт через publishablePublish (правильный способ!)
    // Используем стандартный ID Online Store публикации
    const publishMutation = `
      mutation {
        publishablePublish(
          id: "${productId}", 
          input: {
            publicationId: "gid://shopify/Publication/online-store"
          }
        ) {
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const publishResult = await makeGraphQLRequest(publishMutation);
    
    if (publishResult.data?.publishablePublish?.userErrors?.length > 0) {
      console.warn('⚠️ Ошибки публикации:', publishResult.data.publishablePublish.userErrors);
    } else {
      console.log('✅ Продукт опубликован');
    }
    
    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
    
  } catch (error) {
    console.error(`❌ Ошибка: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 СОЗДАНИЕ КАТЕГОРИИ "РАЙОНЫ ПХУКЕТА"');
  console.log('='.repeat(60));
  
  let successCount = 0;
  
  for (let i = 0; i < districts.length; i++) {
    const success = await createDistrict(districts[i], i, districts.length);
    if (success) successCount++;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Успешно создано: ${successCount}/${districts.length}`);
  console.log(`🔗 Проверьте: http://localhost:8080/category/districts`);
}

main().catch(console.error);

