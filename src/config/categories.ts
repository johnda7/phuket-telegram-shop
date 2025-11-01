/**
 * 🗂️ ЦЕНТРАЛИЗОВАННЫЙ КОНФИГ ВСЕХ КАТЕГОРИЙ
 * 
 * Философия:
 * - Perplexity AI: Минимализм и скорость
 * - Steve Jobs: Каждый пиксель имеет значение
 * - iOS 26: Нативный дизайн
 * - Telegram Wallet: Компактность и профессионализм
 * 
 * Использование:
 * import { getCategoryConfig, CATEGORIES } from '@/config/categories';
 * const config = getCategoryConfig('shopping');
 */

import { 
  ShoppingBag, 
  Waves, 
  Church, 
  Mountain, 
  UtensilsCrossed,
  Moon,
  Sparkles,
  TreePalm,
  Building2,
  ShoppingCart,
  Droplets,
  MapPin as MapPinIcon,
  Ship,
  Eye,
  Camera,
  Heart,
  Zap,
  Tent,
  Fish,
  Bike,
  PartyPopper,
  Calendar,
  Coffee,
  Home,
  Flame,
  LucideIcon
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// ТИПЫ
// ═══════════════════════════════════════════════════════════════

export interface CategoryConfig {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  heroImage: string;
  icon: LucideIcon;
  iconColor: string;
  breadcrumbs: Array<{ label: string; path?: string }>;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  filters: {
    showDistricts: boolean;
    showRating: boolean;
    showPriceLevel: boolean;
    showOpenNow: boolean;
  };
  priority: 'high' | 'medium' | 'low';
  estimatedPlaces: number;
}

// ═══════════════════════════════════════════════════════════════
// ВСЕ 25 КАТЕГОРИЙ (обновлено 2025-11-01: добавлены massage, sauna, coffee)
// ═══════════════════════════════════════════════════════════════

export const CATEGORIES: Record<string, CategoryConfig> = {
  // ═══════════════════════════════════════════════════════════════
  // TIER 1: HIGH PRIORITY (начинать с этих!)
  // ═══════════════════════════════════════════════════════════════
  
  beaches: {
    id: 'beaches',
    title: 'Пляжи Пхукета',
    titleEn: 'Beaches',
    description: 'Лучшие пляжи Пхукета — от популярных Патонга и Карона до скрытых Paradise Beach и Freedom Beach. Белый песок, прозрачная вода и развитая инфраструктура.',
    heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&h=400&fit=crop',
    icon: Waves,
    iconColor: '#00B4D8',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Пляжи Пхукета' }
    ],
    seoTitle: 'Пляжи Пхукета - Лучшие пляжи для отдыха | PhuketDa',
    seoDescription: 'Полный гид по пляжам Пхукета: Патонг, Карон, Ката, Freedom Beach. Фото, описания, как добраться, инфраструктура.',
    seoKeywords: ['пляжи пхукета', 'лучшие пляжи', 'патонг', 'карон', 'ката', 'freedom beach'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: false,
      showOpenNow: false
    },
    priority: 'high',
    estimatedPlaces: 18
  },

  temples: {
    id: 'temples',
    title: 'Храмы Пхукета',
    titleEn: 'Temples',
    description: 'Буддийские храмы Пхукета — культурное наследие острова. Ват Чалонг, Большой Будда, Ват Пра Тонг. История, архитектура и духовность.',
    heroImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1600&h=400&fit=crop',
    icon: Church,
    iconColor: '#FF9500',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Храмы Пхукета' }
    ],
    seoTitle: 'Храмы Пхукета - Буддийские святыни острова | PhuketDa',
    seoDescription: 'Главные храмы Пхукета: Ват Чалонг, Большой Будда, Ват Пра Тонг. История, время работы, дресс-код, как добраться.',
    seoKeywords: ['храмы пхукета', 'ват чалонг', 'большой будда', 'буддийские храмы', 'святыни пхукета'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: false,
      showOpenNow: false
    },
    priority: 'high',
    estimatedPlaces: 12
  },

  viewpoints: {
    id: 'viewpoints',
    title: 'Смотровые площадки Пхукета',
    titleEn: 'Viewpoints',
    description: 'Лучшие смотровые площадки Пхукета с панорамными видами. Промтеп Кейп, Karon Viewpoint, Windmill Viewpoint. Идеально для фото и закатов.',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=400&fit=crop',
    icon: Mountain,
    iconColor: '#34C759',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Смотровые площадки' }
    ],
    seoTitle: 'Смотровые площадки Пхукета - Лучшие виды острова | PhuketDa',
    seoDescription: 'Топ смотровых площадок Пхукета: Промтеп Кейп, Karon Viewpoint, Windmill. Панорамные виды, закаты, как добраться.',
    seoKeywords: ['смотровые площадки пхукета', 'промтеп кейп', 'karon viewpoint', 'виды пхукета', 'закаты'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: false,
      showOpenNow: false
    },
    priority: 'high',
    estimatedPlaces: 11
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2: MEDIUM PRIORITY
  // ═══════════════════════════════════════════════════════════════

  restaurants: {
    id: 'restaurants',
    title: 'Рестораны Пхукета',
    titleEn: 'Restaurants',
    description: 'Лучшие рестораны Пхукета — тайская кухня, морепродукты, европейская кухня. От уличной еды до Michelin-starred заведений.',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=400&fit=crop',
    icon: UtensilsCrossed,
    iconColor: '#FF3B30',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Рестораны' }
    ],
    seoTitle: 'Рестораны Пхукета - Где поесть на острове | PhuketDa',
    seoDescription: 'Гид по ресторанам Пхукета: тайская кухня, морепродукты, vegan. Цены, меню, отзывы, бронирование.',
    seoKeywords: ['рестораны пхукета', 'тайская кухня', 'морепродукты', 'где поесть', 'кафе пхукета'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'medium',
    estimatedPlaces: 25
  },

  nightlife: {
    id: 'nightlife',
    title: 'Ночная жизнь Пхукета',
    titleEn: 'Nightlife',
    description: 'Ночная жизнь Пхукета — клубы, бары, шоу. Bangla Road, Illuzion, Tiger. Лучшие места для вечеринок и развлечений.',
    heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&h=400&fit=crop',
    icon: Moon,
    iconColor: '#AF52DE',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Ночная жизнь' }
    ],
    seoTitle: 'Ночная жизнь Пхукета - Клубы, бары, шоу | PhuketDa',
    seoDescription: 'Гид по ночной жизни Пхукета: Bangla Road, лучшие клубы, бары, шоу. Цены, дресс-код, безопасность.',
    seoKeywords: ['ночная жизнь пхукета', 'bangla road', 'клубы пхукета', 'бары', 'шоу'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'medium',
    estimatedPlaces: 18
  },

  spa: {
    id: 'spa',
    title: 'СПА и массаж на Пхукете',
    titleEn: 'SPA & Massage',
    description: 'Лучшие СПА-салоны и массажные центры Пхукета. Традиционный тайский массаж, SPA-процедуры, wellness-центры.',
    heroImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&h=400&fit=crop',
    icon: Sparkles,
    iconColor: '#FF2D55',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'СПА и массаж' }
    ],
    seoTitle: 'СПА и массаж на Пхукете - Лучшие салоны | PhuketDa',
    seoDescription: 'Гид по СПА Пхукета: тайский массаж, SPA-процедуры, wellness. Цены, отзывы, бронирование.',
    seoKeywords: ['спа пхукет', 'массаж пхукет', 'тайский массаж', 'спа салоны', 'wellness'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'medium',
    estimatedPlaces: 17
  },

  elephants: {
    id: 'elephants',
    title: 'Парки слонов на Пхукете',
    titleEn: 'Elephant Parks',
    description: 'Этичные парки слонов на Пхукете. Наблюдение, кормление, купание со слонами. Забота о животных и экотуризм.',
    heroImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1600&h=400&fit=crop',
    icon: TreePalm,
    iconColor: '#8E8E93',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Парки слонов' }
    ],
    seoTitle: 'Парки слонов на Пхукете - Этичный туризм | PhuketDa',
    seoDescription: 'Лучшие парки слонов Пхукета: кормление, купание, наблюдение. Этичные условия, цены, как добраться.',
    seoKeywords: ['парки слонов пхукет', 'слоны пхукет', 'этичный туризм', 'экскурсии со слонами'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: false
    },
    priority: 'medium',
    estimatedPlaces: 8
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3: LOW PRIORITY (но важны для полноты!)
  // ═══════════════════════════════════════════════════════════════

  shopping: {
    id: 'shopping',
    title: 'Торговые центры Пхукета',
    titleEn: 'Shopping Centers',
    description: 'Современные торговые центры Пхукета с мировыми брендами, ресторанами и развлечениями. Central, Jungceylon, Premium Outlet.',
    heroImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&h=400&fit=crop',
    icon: ShoppingBag,
    iconColor: '#007AFF',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Торговые центры' }
    ],
    seoTitle: 'Торговые центры Пхукета - Шопинг на острове | PhuketDa',
    seoDescription: 'Гид по торговым центрам Пхукета: Central, Jungceylon, Premium Outlet. Бренды, рестораны, развлечения.',
    seoKeywords: ['торговые центры пхукета', 'шопинг пхукет', 'central phuket', 'jungceylon', 'магазины'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'low',
    estimatedPlaces: 7
  },

  aquaparks: {
    id: 'aquaparks',
    title: 'Аквапарки на Пхукете',
    titleEn: 'Water Parks',
    description: 'Аквапарки Пхукета — атмосфера праздника и веселья для всей семьи! От спокойных бассейнов до экстремальных горок.',
    heroImage: 'https://images.unsplash.com/photo-1561459152-301c6c7e1ef8?w=1600&h=400&fit=crop',
    icon: Droplets,
    iconColor: '#00B4D8',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Аквапарки' }
    ],
    seoTitle: 'Аквапарки Пхукета - Водные развлечения | PhuketDa',
    seoDescription: 'Лучшие аквапарки Пхукета: Andamanda, Splash Jungle. Горки, бассейны, цены, daypass.',
    seoKeywords: ['аквапарки пхукета', 'andamanda', 'splash jungle', 'водные парки', 'развлечения'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: false
    },
    priority: 'low',
    estimatedPlaces: 10
  },

  museums: {
    id: 'museums',
    title: 'Музеи Пхукета',
    titleEn: 'Museums',
    description: 'Музеи Пхукета — история, культура, искусство. Thai Hua Museum, Phuket Mining Museum. Познавательный досуг.',
    heroImage: 'https://images.unsplash.com/photo-1566127444979-b3d2b64d6c40?w=1600&h=400&fit=crop',
    icon: Building2,
    iconColor: '#8E8E93',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Музеи' }
    ],
    seoTitle: 'Музеи Пхукета - Культура и история острова | PhuketDa',
    seoDescription: 'Гид по музеям Пхукета: Thai Hua, Mining Museum, Trick Eye. Экспозиции, цены, время работы.',
    seoKeywords: ['музеи пхукета', 'thai hua museum', 'история пхукета', 'культура', 'достопримечательности'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: false,
      showOpenNow: true
    },
    priority: 'low',
    estimatedPlaces: 6
  },

  nightmarkets: {
    id: 'nightmarkets',
    title: 'Ночные рынки Пхукета',
    titleEn: 'Night Markets',
    description: 'Ночные рынки Пхукета — аутентичная атмосфера, уличная еда, сувениры. Weekend Market, Chillva, Indy Market.',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&h=400&fit=crop',
    icon: ShoppingCart,
    iconColor: '#FF9500',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Ночные рынки' }
    ],
    seoTitle: 'Ночные рынки Пхукета - Еда и шопинг | PhuketDa',
    seoDescription: 'Гид по ночным рынкам Пхукета: Weekend Market, Chillva, Indy. Уличная еда, сувениры, время работы.',
    seoKeywords: ['ночные рынки пхукета', 'weekend market', 'chillva', 'уличная еда', 'сувениры'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: false,
      showOpenNow: true
    },
    priority: 'low',
    estimatedPlaces: 10
  },

  waterfalls: {
    id: 'waterfalls',
    title: 'Водопады Пхукета',
    titleEn: 'Waterfalls',
    description: 'Водопады Пхукета — природная красота острова. Катху, Банг Пэ, Тон Сай. Треккинг, купание, пикники.',
    heroImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1600&h=400&fit=crop',
    icon: Droplets,
    iconColor: '#00B4D8',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Водопады' }
    ],
    seoTitle: 'Водопады Пхукета - Природные красоты острова | PhuketDa',
    seoDescription: 'Лучшие водопады Пхукета: Катху, Банг Пэ, Тон Сай. Треккинг, купание, как добраться.',
    seoKeywords: ['водопады пхукета', 'катху водопад', 'банг пэ', 'природа пхукета', 'треккинг'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: false,
      showOpenNow: false
    },
    priority: 'low',
    estimatedPlaces: 7
  },

  districts: {
    id: 'districts',
    title: 'Районы Пхукета',
    titleEn: 'Districts',
    description: 'Районы Пхукета — где жить и что посетить. Патонг, Карон, Ката, Old Town, Bang Tao. Плюсы, минусы, инфраструктура.',
    heroImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1600&h=400&fit=crop',
    icon: MapPinIcon,
    iconColor: '#FF3B30',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Районы Пхукета' }
    ],
    seoTitle: 'Районы Пхукета - Где жить и отдыхать | PhuketDa',
    seoDescription: 'Полный гид по районам Пхукета: Патонг, Карон, Ката, Old Town. Плюсы, минусы, цены, инфраструктура.',
    seoKeywords: ['районы пхукета', 'где жить', 'патонг', 'карон', 'ката', 'old town'],
    filters: {
      showDistricts: false,
      showRating: true,
      showPriceLevel: false,
      showOpenNow: false
    },
    priority: 'low',
    estimatedPlaces: 11
  },

  // ═══════════════════════════════════════════════════════════════
  // ДОПОЛНИТЕЛЬНЫЕ КАТЕГОРИИ ИЗ PHUKET INSIDER
  // ═══════════════════════════════════════════════════════════════

  excursions: {
    id: 'excursions',
    title: 'Экскурсии на Пхукете',
    titleEn: 'Excursions',
    description: 'Морские экскурсии на Пхукете — Пхи-Пхи, Джеймс Бонд, Симиланы. Лучшие туры по островам Андаманского моря.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb2d83?w=1600&h=400&fit=crop',
    icon: Ship,
    iconColor: '#007AFF',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Экскурсии' }
    ],
    seoTitle: 'Экскурсии на Пхукете - Морские туры по островам | PhuketDa',
    seoDescription: 'Лучшие экскурсии Пхукета: Пхи-Пхи, Джеймс Бонд, Симиланы. Цены, программы, бронирование.',
    seoKeywords: ['экскурсии пхукет', 'пхи-пхи', 'джеймс бонд', 'симиланы', 'морские туры'],
    filters: {
      showDistricts: false,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: false
    },
    priority: 'high',
    estimatedPlaces: 15
  },

  attractions: {
    id: 'attractions',
    title: 'Достопримечательности Пхукета',
    titleEn: 'Attractions',
    description: 'Главные достопримечательности Пхукета — Большой Будда, Промтеп Кейп, Старый город. Культурные и исторические места.',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=400&fit=crop',
    icon: Eye,
    iconColor: '#34C759',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Достопримечательности' }
    ],
    seoTitle: 'Достопримечательности Пхукета - Что посмотреть | PhuketDa',
    seoDescription: 'Главные достопримечательности Пхукета: Большой Будда, Промтеп Кейп, Старый город. Фото, описания, как добраться.',
    seoKeywords: ['достопримечательности пхукет', 'большой будда', 'промтеп кейп', 'старый город', 'что посмотреть'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: false,
      showOpenNow: false
    },
    priority: 'high',
    estimatedPlaces: 20
  },

  amusement: {
    id: 'amusement',
    title: 'Парки развлечений',
    titleEn: 'Amusement Parks',
    description: 'Парки развлечений Пхукета — Splash Jungle, Andamanda, FantaSea. Аттракционы, шоу, развлечения для всей семьи.',
    heroImage: 'https://images.unsplash.com/photo-1566127444979-b3d2b64d6c40?w=1600&h=400&fit=crop',
    icon: Tent,
    iconColor: '#FF9500',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Что посетить?', path: '/categories' },
      { label: 'Парки развлечений' }
    ],
    seoTitle: 'Парки развлечений Пхукета - Аттракционы и шоу | PhuketDa',
    seoDescription: 'Лучшие парки развлечений Пхукета: Splash Jungle, Andamanda, FantaSea. Цены, программы, как добраться.',
    seoKeywords: ['парки развлечений пхукет', 'splash jungle', 'andamanda', 'fantasea', 'аттракционы'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'medium',
    estimatedPlaces: 8
  },

  diving: {
    id: 'diving',
    title: 'Дайвинг на Пхукете',
    titleEn: 'Diving',
    description: 'Дайвинг на Пхукете — Симиланы, Рача, Корал. Лучшие дайв-сайты Андаманского моря. Сертификация PADI.',
    heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&h=400&fit=crop',
    icon: Fish,
    iconColor: '#00B4D8',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Отдых и развлечения', path: '/categories' },
      { label: 'Дайвинг' }
    ],
    seoTitle: 'Дайвинг на Пхукете - Лучшие дайв-сайты | PhuketDa',
    seoDescription: 'Дайвинг Пхукета: Симиланы, Рача, Корал. Сертификация PADI, цены, сезоны, дайв-центры.',
    seoKeywords: ['дайвинг пхукет', 'симиланы дайвинг', 'рача дайвинг', 'padi', 'дайв-сайты'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: false
    },
    priority: 'medium',
    estimatedPlaces: 12
  },

  fishing: {
    id: 'fishing',
    title: 'Рыбалка на Пхукете',
    titleEn: 'Fishing',
    description: 'Морская рыбалка на Пхукете — тунец, марлин, барракуда. Аренда катеров, рыболовные туры, трофеи.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb2d83?w=1600&h=400&fit=crop',
    icon: Fish,
    iconColor: '#34C759',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Отдых и развлечения', path: '/categories' },
      { label: 'Рыбалка' }
    ],
    seoTitle: 'Рыбалка на Пхукете - Морская рыбалка | PhuketDa',
    seoDescription: 'Рыбалка Пхукета: тунец, марлин, барракуда. Аренда катеров, цены, сезоны, трофеи.',
    seoKeywords: ['рыбалка пхукет', 'морская рыбалка', 'тунец', 'марлин', 'аренда катеров'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: false
    },
    priority: 'low',
    estimatedPlaces: 6
  },

  yachts: {
    id: 'yachts',
    title: 'Аренда яхт на Пхукете',
    titleEn: 'Yacht Rental',
    description: 'Аренда яхт на Пхукете — романтические круизы, корпоративы, свадьбы. От катеров до роскошных яхт.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb2d83?w=1600&h=400&fit=crop',
    icon: Ship,
    iconColor: '#AF52DE',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Отдых и развлечения', path: '/categories' },
      { label: 'Аренда яхт' }
    ],
    seoTitle: 'Аренда яхт на Пхукете - Романтические круизы | PhuketDa',
    seoDescription: 'Аренда яхт Пхукета: катера, яхты, круизы. Цены, программы, бронирование, свадьбы на яхте.',
    seoKeywords: ['аренда яхт пхукет', 'круизы пхукет', 'свадьба на яхте', 'катера', 'романтические туры'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: false
    },
    priority: 'low',
    estimatedPlaces: 8
  },

  zoos: {
    id: 'zoos',
    title: 'Зоопарки на Пхукете',
    titleEn: 'Zoos',
    description: 'Зоопарки и контактные зоопарки Пхукета — тигры, слоны, обезьяны. Семейный отдых с детьми.',
    heroImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1600&h=400&fit=crop',
    icon: Heart,
    iconColor: '#FF2D55',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Отдых и развлечения', path: '/categories' },
      { label: 'Зоопарки' }
    ],
    seoTitle: 'Зоопарки Пхукета - Контактные зоопарки | PhuketDa',
    seoDescription: 'Зоопарки Пхукета: тигры, слоны, обезьяны. Контактные зоопарки, цены, программы для детей.',
    seoKeywords: ['зоопарки пхукет', 'контактные зоопарки', 'тигры пхукет', 'семейный отдых', 'дети'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'low',
    estimatedPlaces: 5
  },

  clubs: {
    id: 'clubs',
    title: 'Клубы на Пхукете',
    titleEn: 'Clubs',
    description: 'Лучшие клубы Пхукета — Illuzion, Tiger, Seduction. Ночная жизнь, вечеринки, шоу-программы.',
    heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&h=400&fit=crop',
    icon: PartyPopper,
    iconColor: '#AF52DE',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Ночная жизнь', path: '/categories' },
      { label: 'Клубы' }
    ],
    seoTitle: 'Клубы Пхукета - Ночная жизнь и вечеринки | PhuketDa',
    seoDescription: 'Лучшие клубы Пхукета: Illuzion, Tiger, Seduction. Цены, программы, дресс-код, VIP-столы.',
    seoKeywords: ['клубы пхукет', 'illuzion', 'tiger', 'ночная жизнь', 'вечеринки'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'medium',
    estimatedPlaces: 12
  },

  bars: {
    id: 'bars',
    title: 'Бары на Пхукете',
    titleEn: 'Bars',
    description: 'Лучшие бары Пхукета — Sky Bar, Beach Bar, Rooftop. Коктейли, закаты, атмосфера.',
    heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&h=400&fit=crop',
    icon: Coffee,
    iconColor: '#FF9500',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Ночная жизнь', path: '/categories' },
      { label: 'Бары' }
    ],
    seoTitle: 'Бары Пхукета - Коктейли и закаты | PhuketDa',
    seoDescription: 'Лучшие бары Пхукета: Sky Bar, Beach Bar, Rooftop. Коктейли, закаты, цены, атмосфера.',
    seoKeywords: ['бары пхукет', 'sky bar', 'beach bar', 'коктейли', 'закаты'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'medium',
    estimatedPlaces: 15
  },

  events: {
    id: 'events',
    title: 'Афиша событий',
    titleEn: 'Events',
    description: 'События на Пхукете — фестивали, концерты, выставки. Афиша мероприятий, билеты, расписание.',
    heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&h=400&fit=crop',
    icon: Calendar,
    iconColor: '#FF3B30',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Полезное', path: '/categories' },
      { label: 'Афиша событий' }
    ],
    seoTitle: 'События на Пхукете - Афиша мероприятий | PhuketDa',
    seoDescription: 'Афиша событий Пхукета: фестивали, концерты, выставки. Билеты, расписание, как попасть.',
    seoKeywords: ['события пхукет', 'фестивали', 'концерты', 'афиша', 'билеты'],
    filters: {
      showDistricts: true,
      showRating: false,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'low',
    estimatedPlaces: 20
  },

  // ═══════════════════════════════════════════════════════════════
  // ДОПОЛНИТЕЛЬНЫЕ КАТЕГОРИИ ИЗ PHUKET-INSIDER (добавлено 2025-11-01)
  // ═══════════════════════════════════════════════════════════════

  massage: {
    id: 'massage',
    title: 'Массажные салоны Пхукета',
    titleEn: 'Massage Salons',
    description: 'Массажные салоны Пхукета по районам — тайский массаж, масляный массаж, рефлексотерапия. От уличных салонов до премиум-центров.',
    heroImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&h=400&fit=crop',
    icon: Heart,
    iconColor: '#FF2D55',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Массажи и СПА', path: '/categories' },
      { label: 'Массажные салоны' }
    ],
    seoTitle: 'Массажные салоны Пхукета - Тайский массаж по районам | PhuketDa',
    seoDescription: 'Лучшие массажные салоны Пхукета: Патонг, Карон, Ката. Тайский массаж, масляный, рефлексотерапия. Цены, отзывы, бронирование.',
    seoKeywords: ['массажные салоны пхукет', 'тайский массаж', 'массаж по районам', 'релаксация', 'wellness'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'medium',
    estimatedPlaces: 25
  },

  sauna: {
    id: 'sauna',
    title: 'Бани и сауны Пхукета',
    titleEn: 'Saunas',
    description: 'Бани и сауны на Пхукете — традиционные тайские бани, финские сауны, турецкие бани. Релаксация и оздоровление.',
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&h=400&fit=crop',
    icon: Flame,
    iconColor: '#FF9500',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Массажи и СПА', path: '/categories' },
      { label: 'Бани и сауны' }
    ],
    seoTitle: 'Бани и сауны Пхукета - Релаксация и оздоровление | PhuketDa',
    seoDescription: 'Бани и сауны Пхукета: финские сауны, турецкие бани, традиционные бани. Цены, программы, время работы.',
    seoKeywords: ['бани пхукет', 'сауны пхукет', 'финская сауна', 'турецкая баня', 'релаксация'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'low',
    estimatedPlaces: 8
  },

  coffee: {
    id: 'coffee',
    title: 'Кофейни Пхукета',
    titleEn: 'Coffee Shops',
    description: 'Лучшие кофейни Пхукета — от уютных местных кафе до сетевых кофеен. Качественный кофе, атмосфера, Wi-Fi, работа удаленно.',
    heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4c7c98?w=1600&h=400&fit=crop',
    icon: Coffee,
    iconColor: '#8E8E93',
    breadcrumbs: [
      { label: 'Главная', path: '/' },
      { label: 'Кафе и рестораны', path: '/categories' },
      { label: 'Кофейни' }
    ],
    seoTitle: 'Кофейни Пхукета - Лучший кофе на острове | PhuketDa',
    seoDescription: 'Лучшие кофейни Пхукета: местные кафе, сетевые кофейни. Качественный кофе, Wi-Fi, работа удаленно, цены.',
    seoKeywords: ['кофейни пхукет', 'кафе пхукет', 'кофе пхукет', 'работа удаленно', 'wifi кафе'],
    filters: {
      showDistricts: true,
      showRating: true,
      showPriceLevel: true,
      showOpenNow: true
    },
    priority: 'medium',
    estimatedPlaces: 18
  }
};

// ═══════════════════════════════════════════════════════════════
// HELPER ФУНКЦИИ
// ═══════════════════════════════════════════════════════════════

/**
 * Получить конфиг категории по ID
 */
export function getCategoryConfig(categoryId: string): CategoryConfig {
  const config = CATEGORIES[categoryId];
  if (!config) {
    console.warn(`Category "${categoryId}" not found, using default (shopping)`);
    return CATEGORIES.shopping;
  }
  return config;
}

/**
 * Получить все категории
 */
export function getAllCategories(): CategoryConfig[] {
  return Object.values(CATEGORIES);
}

/**
 * Получить категории по приоритету
 */
export function getCategoriesByPriority(priority: 'high' | 'medium' | 'low'): CategoryConfig[] {
  return getAllCategories().filter(cat => cat.priority === priority);
}

/**
 * Получить общее количество мест (estimated)
 */
export function getTotalEstimatedPlaces(): number {
  return getAllCategories().reduce((sum, cat) => sum + cat.estimatedPlaces, 0);
}

/**
 * Получить имя категории на русском для URL
 */
export function getCategoryNameInRussian(categoryId: string): string {
  const config = getCategoryConfig(categoryId);
  return config.title;
}

/**
 * Проверить существует ли категория
 */
export function categoryExists(categoryId: string): boolean {
  return categoryId in CATEGORIES;
}

