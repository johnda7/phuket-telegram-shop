// Fallback данные для metafields торговых центров
// Используется когда Storefront API не может получить metafields

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
  }
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

export default placeMetafieldsData;
