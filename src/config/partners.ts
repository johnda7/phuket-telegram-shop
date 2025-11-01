/**
 * 🤝 КОНФИГ ПАРТНЕРСКИХ УСЛУГ
 * 
 * Философия:
 * - Perplexity AI: Минимализм и скорость
 * - Steve Jobs: Каждый пиксель имеет значение
 * - iOS 26: Нативный дизайн
 * - Telegram Wallet: Компактность и профессионализм
 * 
 * ПАРТНЕРСКИЕ УСЛУГИ - это неосновные направления, которые мы продвигаем:
 * - Лиды идут через наше приложение
 * - Партнеры видят лиды в личном кабинете
 * - Мы берем процент с каждой сделки
 * - Монетизация через комиссии
 * 
 * Использование:
 * import { getPartnerConfig, getAllPartners } from '@/config/partners';
 */

import { 
  Bike,
  Sparkles,
  Camera,
  Heart,
  Droplets,
  DollarSign,
  LucideIcon
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// ТИПЫ
// ═══════════════════════════════════════════════════════════════

export interface PartnerConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  path: string;
  telegram?: string;
  commission: string; // Процент комиссии
  status: 'active' | 'coming-soon' | 'planned';
  priority: 'high' | 'medium' | 'low';
  heroImage?: string; // Hero изображение для карточки и детальной страницы
  detailedDescription?: string; // Расширенное описание для детальной страницы
}

// ═══════════════════════════════════════════════════════════════
// ВСЕ ПАРТНЕРСКИЕ УСЛУГИ
// ═══════════════════════════════════════════════════════════════

export const PARTNERS: Record<string, PartnerConfig> = {
  'currency-exchange': {
    id: 'currency-exchange',
    title: 'Обмен валюты',
    subtitle: 'Выгодный обмен на Пхукете',
    description: 'Обмен валюты на Пхукете с выгодным курсом. RUB, USD, EUR → THB. Прозрачные условия, быстрый обмен, надежные партнеры.',
    icon: DollarSign,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    path: '/partners/currency-exchange',
    commission: '1%',
    status: 'active',
    priority: 'high',
    heroImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
    detailedDescription: '💱 **Хотите обменять валюту на Пхукете с выгодным курсом? Легко!**\n\n**Выгодно? Прозрачно? Быстро? О, да!**\n\nОбмен валюты на Пхукете через нашу платформу — это не просто транзакция, а настоящая гарантия лучшего курса и безопасности! Обменивайте RUB, USD, EUR на THB с комиссией всего 1% с каждой сделки. Прозрачные условия, быстрый обмен, надежные партнеры. Вы видите все транзакции в личном кабинете, мы гарантируем честность каждой сделки!'
  },
  
  'bike-rental': {
    id: 'bike-rental',
    title: 'Аренда байков',
    subtitle: 'Прокат премиум-байков',
    description: 'Прокат мотобайков и велосипедов на Пхукете. Широкий выбор моделей, страховка, круглосуточная поддержка.',
    icon: Bike,
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    path: '/partners/bike-rental',
    telegram: 'https://t.me/RentaCarPhu',
    commission: '10%',
    status: 'active',
    priority: 'high',
    heroImage: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop',
    detailedDescription: '🏍️ **Хотите прокатиться на топовых байках на Пхукете? Легко!**\n\n**Стильно? Мощно? Для настоящих ценителей? О, да!**\n\nПрокат байков с выхлопом Akrapovič, спортивные мотоциклы и уникальные модели — это не просто поездка, а настоящая приключенческая программа для Вас и ваших друзей! Ощутите ветер свободы на высоких скоростях, откройте для себя красоту Пхукета с другой стороны и создайте незабываемые моменты на дороге!'
  },

  'cosmetology': {
    id: 'cosmetology',
    title: 'Косметология',
    subtitle: 'Уход за лицом и телом',
    description: 'Профессиональные косметологические услуги на Пхукете. Уход за кожей лица, чистки, инъекции красоты, массаж лица. Квалифицированные специалисты.',
    icon: Sparkles,
    iconColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    path: '/partners/cosmetology',
    commission: '15%',
    status: 'coming-soon',
    priority: 'medium'
  },

  'photographer': {
    id: 'photographer',
    title: 'Фотограф',
    subtitle: 'Профессиональная фотосъемка',
    description: 'Профессиональные фотографы на Пхукете. Love-story, свадебная съемка, семейная фотосессия, индивидуальные портреты.',
    icon: Camera,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    path: '/partners/photographer',
    commission: '20%',
    status: 'coming-soon',
    priority: 'high',
    heroImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e93682e9?w=800&h=600&fit=crop',
    detailedDescription: '📸 **Хотите незабываемые фотографии на Пхукете? Легко!**\n\n**Профессионально? Красиво? Для вечных воспоминаний? О, да!**\n\nПрофессиональные фотографы на Пхукете готовы запечатлеть ваши самые важные моменты. Love-story на пляжах, свадебная съемка на закате, семейная фотосессия с детьми, индивидуальные портреты в тропических локациях. Красивые места острова станут идеальным фоном для ваших воспоминаний!'
  },

  'facial-massage': {
    id: 'facial-massage',
    title: 'Массаж лица',
    subtitle: 'Омолаживающие процедуры',
    description: 'Профессиональный массаж лица и SPA-процедуры для кожи. Антивозрастной уход, лимфодренаж, моделирующий массаж. Результат после первого сеанса.',
    icon: Heart,
    iconColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    path: '/partners/facial-massage',
    commission: '15%',
    status: 'coming-soon',
    priority: 'medium'
  },

  'spa-services': {
    id: 'spa-services',
    title: 'СПА услуги',
    subtitle: 'Комплексный уход',
    description: 'Премиальные СПА-процедуры на Пхукете. Обертывания, скрабы, маски, релаксационные программы. Полный спектр услуг для красоты и здоровья.',
    icon: Droplets,
    iconColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    path: '/partners/spa-services',
    commission: '15%',
    status: 'planned',
    priority: 'low'
  }
};

// ═══════════════════════════════════════════════════════════════
// HELPER ФУНКЦИИ
// ═══════════════════════════════════════════════════════════════

/**
 * Получить конфиг партнера по ID
 */
export function getPartnerConfig(partnerId: string): PartnerConfig | null {
  return PARTNERS[partnerId] || null;
}

/**
 * Получить все партнерские услуги
 */
export function getAllPartners(): PartnerConfig[] {
  return Object.values(PARTNERS);
}

/**
 * Получить активные партнерские услуги
 */
export function getActivePartners(): PartnerConfig[] {
  return getAllPartners().filter(p => p.status === 'active');
}

/**
 * Получить партнерские услуги по приоритету
 */
export function getPartnersByPriority(priority: 'high' | 'medium' | 'low'): PartnerConfig[] {
  return getAllPartners().filter(p => p.priority === priority);
}

/**
 * Проверить существует ли партнер
 */
export function partnerExists(partnerId: string): boolean {
  return partnerId in PARTNERS;
}

