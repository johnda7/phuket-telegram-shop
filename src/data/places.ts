// Централизованное хранилище всех мест на Пхукете
// Связано с турами Shopify и категориями для AI-помощника

export interface Place {
  id: string;
  handle: string;
  title: string;
  titleEn?: string;
  description: string;
  category: PlaceCategory;
  subcategory?: string;
  district?: string;
  coordinates?: { lat: number; lng: number };
  rating?: number;
  reviewsCount?: number;
  priceLevel?: 1 | 2 | 3 | 4; // 1-4 бата
  duration?: string;
  bestTime?: string;
  images: string[];
  tags: string[];
  relatedTours?: string[]; // handles туров из Shopify
  relatedPlaces?: string[]; // handles связанных мест
  amenities?: string[];
  tips?: string[];
  mapUrl?: string;
  contact?: {
    phone?: string;
    website?: string;
    instagram?: string;
  };
}

export type PlaceCategory = 
  | 'beaches'
  | 'attractions'
  | 'elephants'
  | 'aquaparks'
  | 'amusement'
  | 'viewpoints'
  | 'temples'
  | 'museums'
  | 'nightmarkets'
  | 'walking'
  | 'shopping'
  | 'spa'
  | 'massage'
  | 'sauna'
  | 'restaurants'
  | 'coffee'
  | 'fishing'
  | 'diving'
  | 'yacht'
  | 'zoos'
  | 'gaming'
  | 'biking'
  | 'parties';

// База данных всех мест
export const placesDatabase: Place[] = [
  // СЛОНЫ
  {
    id: 'elephant-1',
    handle: 'phuket-elephant-sanctuary',
    title: 'Заповедник слонов Phuket Elephant Sanctuary',
    titleEn: 'Phuket Elephant Sanctuary',
    description: 'Этичный заповедник для спасенных слонов, где можно наблюдать за ними в естественной среде, кормить и купать их. Без катания на слонах - только наблюдение и взаимодействие в комфортной для животных обстановке.',
    category: 'elephants',
    district: 'Kathu',
    rating: 4.9,
    reviewsCount: 3245,
    priceLevel: 3,
    duration: 'Полдня (3-4 часа)',
    bestTime: 'Утро 9:00-13:00',
    images: ['/placeholder.svg'],
    tags: ['этичное', 'слоны', 'природа', 'семейное', 'фото'],
    relatedTours: ['avatar-plus-hangdong'], // Тур в котором есть слоны
    amenities: ['Трансфер', 'Обед', 'Гид', 'Страховка'],
    tips: [
      'Бронируйте заранее - места быстро заканчиваются',
      'Наденьте удобную обувь и одежду, которую не жалко испачкать',
      'Возьмите купальник для купания со слонами',
      'Фотоаппарат и камеру упакуйте в водонепроницаемый чехол'
    ],
    contact: {
      website: 'https://phuketelephantsanctuary.org',
      instagram: '@phuketelephantsanctuary'
    },
    coordinates: { lat: 7.9519, lng: 98.3381 }
  },
  
  {
    id: 'elephant-2',
    handle: 'elephant-retirement-park',
    title: 'Elephant Retirement Park Phuket',
    titleEn: 'Elephant Retirement Park',
    description: 'Дом для пожилых слонов, спасенных из туристической индустрии. Можно кормить бананами, гулять рядом со слонами и купаться с ними в грязевых ваннах и озере.',
    category: 'elephants',
    district: 'Kathu',
    rating: 4.8,
    reviewsCount: 2156,
    priceLevel: 3,
    duration: '3-4 часа',
    bestTime: 'Утро или день',
    images: ['/placeholder.svg'],
    tags: ['этичное', 'слоны', 'купание', 'спасенные'],
    relatedPlaces: ['phuket-elephant-sanctuary'],
    amenities: ['Трансфер', 'Обед', 'Гид'],
    tips: [
      'Парк работает только с группами до 10 человек',
      'Минимальный возраст - 6 лет',
      'Приезжайте в удобной обуви для ходьбы по грязи'
    ],
    coordinates: { lat: 7.9456, lng: 98.3312 }
  },

  // АКВАПАРКИ
  {
    id: 'aqua-1',
    handle: 'splash-jungle',
    title: 'Splash Jungle Waterpark',
    titleEn: 'Splash Jungle Waterpark',
    description: 'Крупнейший аквапарк Пхукета с 13 горками различной сложности, ленивой рекой длиной 335м, волновым бассейном и специальной детской зоной Aqua Play.',
    category: 'aquaparks',
    district: 'Thalang',
    rating: 4.5,
    reviewsCount: 4521,
    priceLevel: 2,
    duration: 'Весь день',
    bestTime: 'Будни (меньше людей)',
    images: ['/placeholder.svg'],
    tags: ['аквапарк', 'семейное', 'горки', 'дети', 'бассейн'],
    relatedPlaces: ['andamanda'],
    amenities: ['Шкафчики', 'Еда', 'Душевые', 'Лежаки'],
    tips: [
      'Купите билеты онлайн - дешевле на 20%',
      'Приезжайте к открытию в 10:00 чтобы занять лежаки',
      'Арендуйте шкафчик для ценностей',
      'Еду можно принести свою (официально запрещено, но не проверяют)'
    ],
    mapUrl: 'https://maps.app.goo.gl/SplashJungle',
    contact: {
      phone: '+66 76 372 111',
      website: 'https://splashjunglewaterpark.com'
    },
    coordinates: { lat: 8.0589, lng: 98.3167 }
  },

  {
    id: 'aqua-2',
    handle: 'andamanda',
    title: 'Andamanda Phuket',
    titleEn: 'Andamanda Phuket',
    description: 'Новейший тематический аквапарк 2021 года с уникальным дизайном в стиле тайской мифологии. 21 аттракцион, включая экстремальные горки Naga Racer и Lost City Wave Pool.',
    category: 'aquaparks',
    district: 'Kathu',
    rating: 4.6,
    reviewsCount: 1847,
    priceLevel: 3,
    duration: 'Весь день',
    bestTime: 'Любое',
    images: ['/placeholder.svg'],
    tags: ['аквапарк', 'новый', 'тематический', 'экстрим'],
    relatedPlaces: ['splash-jungle'],
    amenities: ['Шкафчики', 'Рестораны', 'Магазины', 'VIP-кабинки'],
    tips: [
      'Самый новый и современный аквапарк на Пхукете',
      'Есть VIP-зоны с отдельными кабинками',
      'Рекомендуется Fast Pass для популярных горок'
    ],
    coordinates: { lat: 7.9245, lng: 98.3456 }
  },

  // СМОТРОВЫЕ ПЛОЩАДКИ
  {
    id: 'view-1',
    handle: 'karon-viewpoint',
    title: 'Карон Вьюпойнт (Три пляжа)',
    titleEn: 'Karon Viewpoint',
    description: 'Самая знаменитая смотровая площадка Пхукета с панорамным видом на три пляжа: Ката Ной, Ката и Карон. Идеальное место для фотографий, особенно на закате.',
    category: 'viewpoints',
    district: 'Karon',
    rating: 4.8,
    reviewsCount: 8934,
    priceLevel: 1,
    duration: '30 минут - 1 час',
    bestTime: 'Закат 18:00-19:00',
    images: ['/placeholder.svg'],
    tags: ['вид', 'фото', 'закат', 'бесплатно', 'популярное'],
    relatedTours: ['dostoprimechatelnosti-phuketa'],
    relatedPlaces: ['promthep-cape', 'windmill-viewpoint'],
    amenities: ['Парковка', 'Кафе', 'Туалет'],
    tips: [
      'Приезжайте за 30 минут до заката',
      'Много людей вечером - приезжайте утром для спокойных фото',
      'Дорога узкая и извилистая - будьте аккуратны на байке',
      'Берите воду - жарко и душно'
    ],
    mapUrl: 'https://maps.app.goo.gl/KaronView',
    coordinates: { lat: 7.8289, lng: 98.3023 }
  },

  {
    id: 'view-2',
    handle: 'promthep-cape',
    title: 'Мыс Промтеп (Promthep Cape)',
    titleEn: 'Promthep Cape',
    description: 'Самая южная точка Пхукета - культовое место для наблюдения за закатом. Маяк, статуя слона, сувенирный рынок и панорамная площадка с видом 360°.',
    category: 'viewpoints',
    district: 'Rawai',
    rating: 4.7,
    reviewsCount: 12456,
    priceLevel: 1,
    duration: '1 час',
    bestTime: 'Закат',
    images: ['/placeholder.svg'],
    tags: ['закат', 'маяк', 'вид', 'популярное', 'фото'],
    relatedTours: ['dostoprimechatelnosti-phuketa'],
    relatedPlaces: ['karon-viewpoint', 'windmill-viewpoint'],
    amenities: ['Парковка', 'Сувениры', 'Кафе'],
    tips: [
      'Самое популярное место заката - много людей',
      'Парковка забивается - приезжайте за час',
      'Красивый вид на острова и яхты',
      'После заката быстро темнеет - уезжайте аккуратно'
    ],
    mapUrl: 'https://maps.app.goo.gl/PromthepCape',
    coordinates: { lat: 7.7556, lng: 98.3056 }
  },

  // ХРАМЫ
  {
    id: 'temple-1',
    handle: 'big-buddha',
    title: 'Большой Будда (Big Buddha)',
    titleEn: 'Big Buddha Phuket',
    description: '45-метровая статуя сидящего Будды из белого бирманского мрамора на вершине холма Наккерд высотой 400м. Видна из многих точек острова. Панорамный вид 360° на Пхукет.',
    category: 'temples',
    district: 'Chalong',
    rating: 4.7,
    reviewsCount: 15234,
    priceLevel: 1,
    duration: '1-2 часа',
    bestTime: 'Утро или вечер (меньше жары)',
    images: ['/placeholder.svg'],
    tags: ['храм', 'будда', 'вид', 'бесплатно', 'must-see'],
    relatedTours: ['dostoprimechatelnosti-phuketa'],
    relatedPlaces: ['wat-chalong', 'karon-viewpoint'],
    amenities: ['Парковка', 'Туалет', 'Сувениры', 'Кафе'],
    tips: [
      'Бесплатный вход, но донаты приветствуются',
      'Дресс-код: плечи и колени закрыты',
      'Дорога крутая - на байке аккуратно',
      'Лучший вид на закате, но много людей',
      'Можно купить колокольчик и загадать желание'
    ],
    mapUrl: 'https://maps.app.goo.gl/BigBuddha',
    coordinates: { lat: 7.8092, lng: 98.3081 }
  },

  {
    id: 'temple-2',
    handle: 'wat-chalong',
    title: 'Ват Чалонг (Wat Chalong)',
    titleEn: 'Wat Chalong Temple',
    description: 'Самый большой и важный буддийский храм Пхукета. Красивая архитектура, пагода с реликвией Будды, музей восковых фигур монахов и сад.',
    category: 'temples',
    district: 'Chalong',
    rating: 4.6,
    reviewsCount: 9876,
    priceLevel: 1,
    duration: '1-1.5 часа',
    bestTime: 'Утро',
    images: ['/placeholder.svg'],
    tags: ['храм', 'культура', 'история', 'архитектура'],
    relatedTours: ['dostoprimechatelnosti-phuketa'],
    relatedPlaces: ['big-buddha'],
    amenities: ['Парковка', 'Туалет', 'Сувениры'],
    tips: [
      'Бесплатный вход',
      'Дресс-код: закрытые плечи и колени',
      'Можно зажечь ароматические палочки',
      'Поднимитесь на пагоду - там реликвия Будды',
      'Не фотографируйте спиной к Будде'
    ],
    mapUrl: 'https://maps.app.goo.gl/WatChalong',
    coordinates: { lat: 7.8921, lng: 98.3456 }
  },

  // НОЧНЫЕ РЫНКИ
  {
    id: 'market-1',
    handle: 'phuket-walking-street',
    title: 'Воскресный рынок Пхукет Таун (Lard Yai)',
    titleEn: 'Phuket Town Walking Street',
    description: 'Аутентичный воскресный рынок на улице Thalang Road в старом городе. Уличная еда, сувениры, винтажная одежда, живая музыка и уличные артисты.',
    category: 'nightmarkets',
    district: 'Phuket Town',
    rating: 4.6,
    reviewsCount: 5678,
    priceLevel: 1,
    duration: '2-3 часа',
    bestTime: 'Воскресенье 16:00-22:00',
    images: ['/placeholder.svg'],
    tags: ['рынок', 'еда', 'сувениры', 'воскресенье', 'местное'],
    relatedPlaces: ['chillva-market', 'old-phuket-town'],
    amenities: ['Еда', 'Туалеты', 'Банкоматы'],
    tips: [
      'Работает только по воскресеньям!',
      'Приходите голодными - много вкусной еды',
      'Торгуйтесь на сувенирах',
      'Берите наличные - не везде принимают карты',
      'Лучшее время 17:00-20:00'
    ],
    mapUrl: 'https://maps.app.goo.gl/WalkingStreet',
    coordinates: { lat: 7.8804, lng: 98.3923 }
  },

  {
    id: 'market-2',
    handle: 'chillva-market',
    title: 'Чиллва Маркет (Chillva Market)',
    titleEn: 'Chillva Market',
    description: 'Хипстерский ночной рынок с винтажной одеждой, стрит-артом, живой музыкой, творческими кафе и барами. Молодежная атмосфера.',
    category: 'nightmarkets',
    district: 'Phuket Town',
    rating: 4.5,
    reviewsCount: 3456,
    priceLevel: 1,
    duration: '2 часа',
    bestTime: 'Вечер 17:00-23:00',
    images: ['/placeholder.svg'],
    tags: ['рынок', 'хипстерский', 'музыка', 'молодежь', 'винтаж'],
    relatedPlaces: ['phuket-walking-street'],
    amenities: ['Бары', 'Кафе', 'Музыка'],
    tips: [
      'Работает вечерами со среды по воскресенье',
      'Много баров с крафтовым пивом',
      'Винтажная одежда по хорошим ценам',
      'Живая музыка каждый вечер'
    ],
    coordinates: { lat: 7.8789, lng: 98.3867 }
  },

  {
    id: 'market-3',
    handle: 'malin-plaza',
    title: 'Ночной рынок Малин Плаза (Malin Plaza)',
    titleEn: 'Malin Plaza Night Market',
    description: 'Популярный ночной рынок морепродуктов в Патонге. Свежие креветки, кальмары, крабы, лобстеры. Готовят при вас на гриле. Также сувениры и одежда.',
    category: 'nightmarkets',
    district: 'Patong',
    rating: 4.3,
    reviewsCount: 4123,
    priceLevel: 2,
    duration: '1-2 часа',
    bestTime: 'Вечер 18:00-23:00',
    images: ['/placeholder.svg'],
    tags: ['рынок', 'морепродукты', 'еда', 'патонг', 'ежедневно'],
    relatedPlaces: ['patong-promenade'],
    amenities: ['Еда', 'Сувениры'],
    tips: [
      'Работает каждый день',
      'Торгуйтесь - цены завышены для туристов',
      'Проверяйте вес морепродуктов',
      'Лучше покупать на соседних улицах - дешевле'
    ],
    mapUrl: 'https://maps.app.goo.gl/MalinPlaza',
    coordinates: { lat: 7.8967, lng: 98.2987 }
  }
];

// Функции для работы с данными
export const getPlaceByHandle = (handle: string): Place | undefined => {
  return placesDatabase.find(place => place.handle === handle);
};

export const getPlacesByCategory = (category: PlaceCategory): Place[] => {
  return placesDatabase.filter(place => place.category === category);
};

export const getRelatedPlaces = (placeHandle: string, limit: number = 3): Place[] => {
  const place = getPlaceByHandle(placeHandle);
  if (!place) return [];
  
  // Сначала пробуем найти связанные места
  if (place.relatedPlaces && place.relatedPlaces.length > 0) {
    return place.relatedPlaces
      .map(handle => getPlaceByHandle(handle))
      .filter((p): p is Place => p !== undefined)
      .slice(0, limit);
  }
  
  // Если нет связанных, возвращаем из той же категории
  return getPlacesByCategory(place.category)
    .filter(p => p.handle !== placeHandle)
    .slice(0, limit);
};

export const searchPlaces = (query: string): Place[] => {
  const lowerQuery = query.toLowerCase();
  return placesDatabase.filter(place => 
    place.title.toLowerCase().includes(lowerQuery) ||
    place.description.toLowerCase().includes(lowerQuery) ||
    place.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
