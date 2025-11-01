/**
 * 📍 ЦЕНТРАЛИЗОВАННЫЙ КОНФИГ РАЙОНОВ ПХУКЕТА
 * 
 * Источник: phuket-insider.com/ru/
 * Популярные районы на главной странице:
 * Карон, Патонг, Банг Тао, Ката, Раваи, Сурин, Камала, Чалонг, Панва, Кату, Най Харн, Пхукет таун
 * 
 * Дополнительные: Чернгталай, Найянг (аэропорт)
 */

export interface DistrictConfig {
  id: string; // ID для фильтрации (используется в тегах: district:Patong)
  nameRu: string; // Русское название для отображения
  nameEn: string; // Английское название
  priority: 'high' | 'medium' | 'low'; // Приоритет отображения (high = всегда показывать)
}

export const DISTRICTS: Record<string, DistrictConfig> = {
  // HIGH PRIORITY - Популярные районы (показываем первыми)
  Patong: {
    id: 'Patong',
    nameRu: 'Патонг',
    nameEn: 'Patong',
    priority: 'high'
  },
  Karon: {
    id: 'Karon',
    nameRu: 'Карон',
    nameEn: 'Karon',
    priority: 'high'
  },
  Kata: {
    id: 'Kata',
    nameRu: 'Ката',
    nameEn: 'Kata',
    priority: 'high'
  },
  Bangtao: {
    id: 'Bangtao',
    nameRu: 'Банг Тао',
    nameEn: 'Bang Tao',
    priority: 'high'
  },
  Rawai: {
    id: 'Rawai',
    nameRu: 'Раваи',
    nameEn: 'Rawai',
    priority: 'high'
  },
  Surin: {
    id: 'Surin',
    nameRu: 'Сурин',
    nameEn: 'Surin',
    priority: 'high'
  },
  Kamala: {
    id: 'Kamala',
    nameRu: 'Камала',
    nameEn: 'Kamala',
    priority: 'high'
  },
  Chalong: {
    id: 'Chalong',
    nameRu: 'Чалонг',
    nameEn: 'Chalong',
    priority: 'high'
  },
  Panwa: {
    id: 'Panwa',
    nameRu: 'Панва',
    nameEn: 'Panwa',
    priority: 'high'
  },
  NaiHarn: {
    id: 'NaiHarn',
    nameRu: 'Най Харн',
    nameEn: 'Nai Harn',
    priority: 'high'
  },
  PhuketTown: {
    id: 'PhuketTown',
    nameRu: 'Пхукет Таун',
    nameEn: 'Phuket Town',
    priority: 'high'
  },
  Kathu: {
    id: 'Kathu',
    nameRu: 'Кату',
    nameEn: 'Kathu',
    priority: 'high'
  },

  // MEDIUM PRIORITY - Дополнительные районы
  Cherngtalay: {
    id: 'Cherngtalay',
    nameRu: 'Чернгталай',
    nameEn: 'Cherngtalay',
    priority: 'medium'
  },
  Naiyang: {
    id: 'Naiyang',
    nameRu: 'Найянг',
    nameEn: 'Naiyang',
    priority: 'medium'
  },
  Thalang: {
    id: 'Thalang',
    nameRu: 'Тхаланг',
    nameEn: 'Thalang',
    priority: 'medium'
  },
};

/**
 * Получить все районы, отсортированные по приоритету
 */
export function getAllDistricts(): DistrictConfig[] {
  const districts = Object.values(DISTRICTS);
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return districts.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Получить популярные районы (high priority)
 */
export function getPopularDistricts(): DistrictConfig[] {
  return getAllDistricts().filter(d => d.priority === 'high');
}

/**
 * Получить русское название района по ID
 */
export function getDistrictNameRu(districtId: string): string {
  return DISTRICTS[districtId]?.nameRu || districtId;
}

/**
 * Маппинг старых названий к новым (для обратной совместимости)
 */
export const DISTRICT_NAME_MAP: Record<string, string> = {
  'Bang Tao': 'Bangtao',
  'Bangtao': 'Bangtao',
  'Nai Harn': 'NaiHarn',
  'NaiHarn': 'NaiHarn',
  'Phuket Town': 'PhuketTown',
  'PhuketTown': 'PhuketTown',
};

