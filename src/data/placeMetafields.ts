// ⚠️ TEMPORARY FALLBACK - Удалить когда Shopify Storefront API стабильно работает!
// 
// Fallback данные для metafields торговых центров
// Используется когда Storefront API не может получить metafields
//
// 🎯 ЦЕЛЬ: Минимизировать и убрать, как только все metafields загружены в Shopify
// 💎 ФИЛОСОФИЯ: Сайт должен быть 100% динамическим, это - временное решение

export interface PlaceMetafields {
  rating: number;
  district: string;
  coordinates: string;
  workingHours: string;
  priceLevel: number;
}

export const placeMetafieldsData: Record<string, PlaceMetafields> = {
  // Central Phuket
  'central-phuket-floresta': {
    rating: 4.6,
    district: 'Cherngtalay',
    coordinates: '7.8905,98.2965',
    workingHours: '10:00-22:00',
    priceLevel: 3
  },
  
  // Jungceylon Shopping Center
  'jungceylon-shopping-center': {
    rating: 4.6,
    district: 'Patong',
    coordinates: '7.8904,98.2924',
    workingHours: '11:00-23:00',
    priceLevel: 2
  },
  
  // Robinson Lifestyle Phuket
  'robinson-lifestyle-phuket': {
    rating: 4.4,
    district: 'PhuketTown',
    coordinates: '7.8805,98.3805',
    workingHours: '10:00-22:00',
    priceLevel: 2
  },
  
  // Premium Outlet Phuket
  'premium-outlet-phuket': {
    rating: 4.3,
    district: 'Cherngtalay',
    coordinates: '7.8950,98.3000',
    workingHours: '10:00-21:00',
    priceLevel: 2
  },
  
  // Big C Supercenter Phuket
  'big-c-supercenter-phuket': {
    rating: 4.2,
    district: 'PhuketTown',
    coordinates: '7.8750,98.3750',
    workingHours: '08:00-22:00',
    priceLevel: 1
  },
  
  // Tesco Lotus Phuket
  'tesco-lotus-phuket': {
    rating: 4.1,
    district: 'PhuketTown',
    coordinates: '7.8700,98.3700',
    workingHours: '08:00-22:00',
    priceLevel: 1
  },
  
  // Central Festival Phuket (новое название)
  'central-phuket': {
    rating: 4.6,
    district: 'Cherngtalay',
    coordinates: '7.8905,98.2965',
    workingHours: '10:00-22:00',
    priceLevel: 3
  },
  
  // TOURS - Туры
  'phi-phi-2-days-1-night': { 
    rating: 4.8, 
    district: 'Phuket', 
    coordinates: '7.8905,98.2965', 
    workingHours: '2 дня / 1 ночь', 
    priceLevel: 3 
  },
  
  // VIEWPOINTS - Смотровые площадки
  'promthep-cape': { rating: 4.8, district: 'Rawai', coordinates: '7.7625,98.3056', workingHours: '24/7', priceLevel: 0 },
  'karon-viewpoint': { rating: 4.7, district: 'Karon', coordinates: '7.8333,98.3000', workingHours: '24/7', priceLevel: 0 },
  'windmill-viewpoint': { rating: 4.6, district: 'Rawai', coordinates: '7.7591,98.3125', workingHours: '24/7', priceLevel: 0 },
  'black-rock-viewpoint': { rating: 4.5, district: 'Thalang', coordinates: '7.9856,98.2789', workingHours: '24/7', priceLevel: 0 },
  'khao-rang': { rating: 4.5, district: 'PhuketTown', coordinates: '7.8856,98.3845', workingHours: '05:00-21:00', priceLevel: 0 },
  'laem-singh-viewpoint': { rating: 4.4, district: 'Kamala', coordinates: '7.9456,98.2723', workingHours: '24/7', priceLevel: 0 },
  'kata-noi-viewpoint': { rating: 4.5, district: 'Kata', coordinates: '7.8178,98.2989', workingHours: '24/7', priceLevel: 0 },
  'khao-khad-views-tower': { rating: 4.4, district: 'Chalong', coordinates: '7.8289,98.3678', workingHours: '08:00-18:00', priceLevel: 0 },
  'monkey-hill': { rating: 4.3, district: 'PhuketTown', coordinates: '7.8923,98.3756', workingHours: '24/7', priceLevel: 0 },
  'samet-nangshe-viewpoint': { rating: 4.9, district: 'Phangnga', coordinates: '8.2712,98.4389', workingHours: '24/7', priceLevel: 1 },
  'ao-por-viewpoint': { rating: 4.6, district: 'Thalang', coordinates: '8.0145,98.4234', workingHours: '24/7', priceLevel: 0 },
  'big-buddha-secret-viewpoint': { rating: 4.7, district: 'Chalong', coordinates: '7.8412,98.3089', workingHours: '08:00-18:00', priceLevel: 0 },
  
  // Районы Пхукета
  'patong-district': { rating: 4.5, district: 'Patong', coordinates: '7.8804,98.2923', workingHours: '24/7', priceLevel: 0 },
  'karon-district': { rating: 4.6, district: 'Karon', coordinates: '7.8400,98.2966', workingHours: '24/7', priceLevel: 0 },
  'kata-district': { rating: 4.6, district: 'Kata', coordinates: '7.8180,98.2988', workingHours: '24/7', priceLevel: 0 },
  'bangtao-district': { rating: 4.7, district: 'Cherngtalay', coordinates: '7.9833,98.2778', workingHours: '24/7', priceLevel: 0 },
  'rawai-district': { rating: 4.5, district: 'Rawai', coordinates: '7.7800,98.3167', workingHours: '24/7', priceLevel: 0 },
  'phuket-town-district': { rating: 4.6, district: 'PhuketTown', coordinates: '7.8808,98.3923', workingHours: '24/7', priceLevel: 0 }
};

// Функция для получения metafields по handle
export function getPlaceMetafields(handle: string): PlaceMetafields {
  return placeMetafieldsData[handle] || {
    rating: 4.5,
    district: 'PhuketTown',
    coordinates: '7.8905,98.3901',
    workingHours: '10:00-22:00',
    priceLevel: 2
  };
}

// Функция для перевода районов на русский
export function getDistrictInRussian(district: string): string {
  const districtMap: { [key: string]: string } = {
    'PhuketTown': 'Пхукет Таун',
    'Patong': 'Патонг',
    'Thalang': 'Таланг',
    'Chalong': 'Чалонг',
    'Karon': 'Карон',
    'Kata': 'Ката',
    'Kamala': 'Камала',
    'Rawai': 'Равай',
    'Cherngtalay': 'Чернгталай',
    'Kathu': 'Кату'
  };
  return districtMap[district] || district;
}

// Export alias для обратной совместимости
export { placeMetafieldsData as placeMetafields };

export default placeMetafieldsData;
