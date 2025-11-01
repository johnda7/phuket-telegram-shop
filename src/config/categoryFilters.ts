/**
 * 🎯 КАТЕГОРИЯ-СПЕЦИФИЧЕСКИЕ ФИЛЬТРЫ
 * 
 * На основе анализа phuket-insider.com
 * Каждая категория имеет свои уникальные фильтры/подкатегории
 * 
 * Философия:
 * - Показываем только релевантные фильтры для выбранной категории
 * - Фильтры работают через теги в Shopify
 * - iOS 26 дизайн + Telegram Wallet компактность
 */

export interface CategoryFilter {
  id: string;
  label: string;
  icon?: string;
  tags: string[]; // Теги в Shopify для фильтрации
  description?: string;
}

// Категория → Массив фильтров
export const CATEGORY_FILTERS: Record<string, CategoryFilter[]> = {
  // 🍽️ РЕСТОРАНЫ - максимальное разнообразие фильтров (как у phuket-insider.com)
  restaurants: [
    { id: 'all', label: 'Все', tags: [] },
    { id: 'vidovye', label: 'Видовые', icon: '🏔️', tags: ['tag:vidovye', 'vidovye', 'view'], description: 'С видом на море/горы' },
    { id: 'instagramnye', label: 'Инстаграмные', icon: '📸', tags: ['tag:instagramnye', 'instagramnye', 'instagram', 'photo'], description: 'Для красивых фото' },
    { id: 'luchshie', label: 'Лучшие', icon: '⭐', tags: ['tag:luchshie', 'luchshie', 'best', 'top', 'recommended'], description: 'Топовые заведения' },
    { id: 'neobychnye', label: 'Необычные', icon: '🎭', tags: ['tag:neobychnye', 'neobychnye', 'unusual', 'unique'], description: 'С оригинальными решениями' },
    { id: 'romantichnye', label: 'Романтичные', icon: '💕', tags: ['tag:romantichnye', 'romantichnye', 'romantic'], description: 'Для особых моментов' },
    { id: 'burgernye', label: 'Бургерные', icon: '🍔', tags: ['tag:burgernye', 'burgernye', 'burger', 'burgers'], description: 'Бургеры и фастфуд' },
    { id: 'coffee', label: 'Кофейни', icon: '☕', tags: ['tag:kofejni', 'kofejni', 'coffee', 'cafe'], description: 'Кофе и завтраки' },
    { id: 'kids', label: 'С детской комнатой', icon: '👶', tags: ['tag:detskaya', 'detskaya', 'kids', 'family'], description: 'Для семей с детьми' },
    { id: 'zoo', label: 'С зоопарком', icon: '🦁', tags: ['tag:zoopark', 'zoopark', 'zoo', 'animals'], description: 'Контактный зоопарк' },
  ],
  
  // 🏖️ ПЛЯЖИ
  beaches: [
    { id: 'all', label: 'Все', tags: [] },
    { id: 'otkrytye', label: 'Открытые', icon: '🌊', tags: ['tag:otkrytye', 'otkrytye', 'open', 'public'], description: 'Доступные для всех' },
    { id: 'infrastructure', label: 'С инфраструктурой', icon: '🏪', tags: ['tag:infrastructure', 'infrastructure', 'amenities'], description: 'Рестораны, лежаки, туалеты' },
    { id: 'surfing', label: 'Для серфинга', icon: '🏄', tags: ['tag:surfing', 'surfing', 'waves'], description: 'С хорошими волнами' },
    { id: 'swimming', label: 'Для купания', icon: '🏊', tags: ['tag:swimming', 'swimming', 'calm'], description: 'Спокойное море' },
    { id: 'wild', label: 'Дикие', icon: '🌴', tags: ['tag:wild', 'wild', 'secluded'], description: 'Уединенные пляжи' },
  ],
  
  // 🛍️ ТОРГОВЫЕ ЦЕНТРЫ
  shopping: [
    { id: 'all', label: 'Все', tags: [] },
    { id: 'otkrytye', label: 'Открытые сейчас', icon: '🕐', tags: ['tag:open_now'], description: 'Работают сейчас' },
    { id: 'cinema', label: 'С кинотеатром', icon: '🎬', tags: ['tag:cinema', 'cinema'], description: 'Есть кинотеатр' },
    { id: 'aquarium', label: 'С аквариумом', icon: '🐠', tags: ['tag:aquarium', 'aquarium'], description: 'Есть океанариум' },
    { id: 'food', label: 'С фуд-кортом', icon: '🍽️', tags: ['tag:food_court', 'food_court'], description: 'Много ресторанов' },
  ],
  
  // 💆 МАССАЖИ И СПА
  spa: [
    { id: 'all', label: 'Все', tags: [] },
    { id: 'best', label: 'Лучшие СПА', icon: '⭐', tags: ['tag:best_spa', 'best_spa', 'luxury'], description: 'Премиум СПА' },
    { id: 'massage', label: 'Массажные салоны', icon: '💆', tags: ['tag:massage', 'massage'], description: 'Тайский массаж' },
    { id: 'sauna', label: 'Бани', icon: '🧖', tags: ['tag:sauna', 'sauna', 'bath'], description: 'Сауны и бани' },
  ],
  
  // 🎯 ОТДЫХ И РАЗВЛЕЧЕНИЯ
  attractions: [
    { id: 'all', label: 'Все', tags: [] },
    { id: 'excursions', label: 'Экскурсии', icon: '🚤', tags: ['tag:excursions', 'excursions'], description: 'Морские экскурсии' },
    { id: 'fishing', label: 'Рыбалка', icon: '🎣', tags: ['tag:fishing', 'fishing'], description: 'Морская рыбалка' },
    { id: 'diving', label: 'Дайвинг', icon: '🤿', tags: ['tag:diving', 'diving'], description: 'Дайвинг и снорклинг' },
    { id: 'yachts', label: 'Аренда яхт', icon: '⛵', tags: ['tag:yachts', 'yachts'], description: 'Яхты и катера' },
    { id: 'aquaparks', label: 'Аквапарки', icon: '💦', tags: ['tag:aquaparks', 'aquaparks'], description: 'Водные аттракционы' },
    { id: 'elephants', label: 'Слоны', icon: '🐘', tags: ['tag:elephants', 'elephants'], description: 'Парки со слонами' },
    { id: 'zoos', label: 'Зоопарки', icon: '🦁', tags: ['tag:zoos', 'zoos'], description: 'Зоопарки и зоосады' },
  ],
  
  // 🌙 НОЧНАЯ ЖИЗНЬ
  nightlife: [
    { id: 'all', label: 'Все', tags: [] },
    { id: 'bars', label: 'Бары', icon: '🍻', tags: ['tag:bary', 'bary', 'bars'], description: 'Бары и пабы' },
    { id: 'clubs', label: 'Клубы', icon: '🎉', tags: ['tag:kluby', 'kluby', 'clubs'], description: 'Ночные клубы' },
    { id: 'beach', label: 'Бич-клабы', icon: '🏖️', tags: ['tag:beach_club', 'beach_club'], description: 'Пляжные вечеринки' },
    { id: 'afterparty', label: 'Афтепати', icon: '🌅', tags: ['tag:afterparty', 'afterparty'], description: 'Афтепати' },
  ],
};

// Универсальные фильтры (для всех категорий)
export const UNIVERSAL_FILTERS: CategoryFilter[] = [
  { id: 'all', label: 'Все', tags: [] },
  { id: 'open_now', label: 'Открытые сейчас', icon: '🕐', tags: ['tag:open_now'], description: 'Работают в данный момент' },
  { id: 'parking', label: 'С парковкой', icon: '🅿️', tags: ['tag:parking', 'parking'], description: 'Есть парковка' },
  { id: 'wifi', label: 'Wi-Fi', icon: '📶', tags: ['tag:wifi', 'wifi'], description: 'Бесплатный Wi-Fi' },
  { id: 'partner', label: 'Партнеры', icon: '🤝', tags: ['tag:partner'], description: 'Наши партнеры' },
];

/**
 * Получить фильтры для категории
 */
export function getFiltersForCategory(categoryId: string): CategoryFilter[] {
  // Если категория имеет свои фильтры - возвращаем их
  if (CATEGORY_FILTERS[categoryId]) {
    return CATEGORY_FILTERS[categoryId];
  }
  
  // Иначе возвращаем универсальные фильтры
  return UNIVERSAL_FILTERS;
}

/**
 * Проверить, есть ли у категории специфичные фильтры
 */
export function hasCategorySpecificFilters(categoryId: string): boolean {
  return !!CATEGORY_FILTERS[categoryId];
}

