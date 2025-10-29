/**
 * 🛠️ КОНФИГ ВСЕХ СЕРВИСОВ
 * 
 * 4 сервиса (ВСЕГДА показывать все 4!):
 * 1. Туры на Пхукете
 * 2. Аренда авто
 * 3. Обмен валюты
 * 4. Недвижимость (покупка и аренда)
 */

import { Ship, Car, DollarSign, Home, LucideIcon } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// ТИПЫ
// ═══════════════════════════════════════════════════════════════

export interface ServiceConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  path: string;
  telegram: string;
  features: string[];
  revenue: {
    current?: string;
    projected: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// ВСЕ 4 СЕРВИСА
// ═══════════════════════════════════════════════════════════════

export const SERVICES: Record<string, ServiceConfig> = {
  tours: {
    id: 'tours',
    title: 'Туры на Пхукете',
    subtitle: 'Экскурсии с гидом',
    description: 'Лучшие туры и экскурсии на Пхукете. От островных туров до культурных программ. Профессиональные гиды, комфортный транспорт.',
    icon: Ship,
    iconColor: 'text-[#007AFF]',
    bgColor: 'bg-blue-50',
    path: '/phuket',
    telegram: 'https://t.me/PhuketDAtravel',
    features: [
      'Островные туры (Пхи-Пхи, Джеймс Бонд, 4 Pearls)',
      'Культурные экскурсии (храмы, музеи)',
      'Приключения (рафтинг, ATV, zipline)',
      'Гастрономические туры'
    ],
    revenue: {
      projected: '$100K+/year'
    }
  },

  'car-rental': {
    id: 'car-rental',
    title: 'Аренда авто',
    subtitle: 'Надёжные автомобили',
    description: 'Аренда автомобилей и байков на Пхукете. Широкий выбор от эконом до премиум класса. Страховка, доставка, круглосуточная поддержка.',
    icon: Car,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    path: '/services/car-rental',
    telegram: 'https://t.me/RentaCarPhu',
    features: [
      'Автомобили (седаны, внедорожники, минивэны)',
      'Мотобайки (скутеры, мотоциклы)',
      'Полная страховка включена',
      'Доставка в отель бесплатно'
    ],
    revenue: {
      projected: '$15K/year'
    }
  },

  'currency-exchange': {
    id: 'currency-exchange',
    title: 'Обмен валюты',
    subtitle: 'Выгодный курс',
    description: 'Лучший курс обмена рублей на баты в Пхукете. Без комиссий и скрытых платежей. Быстро, безопасно, надёжно.',
    icon: DollarSign,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    path: '/services/currency-exchange',
    telegram: 'https://t.me/bereza_manager',
    features: [
      'Обмен рублей на баты',
      'Выгодный курс (лучше чем в банках)',
      'Без комиссий',
      'Безопасно и быстро'
    ],
    revenue: {
      current: '$14.4K/year',
      projected: '$20K/year'
    }
  },

  'real-estate': {
    id: 'real-estate',
    title: 'Недвижимость',
    subtitle: 'Покупка и аренда',
    description: 'Недвижимость на Пхукете - покупка и долгосрочная аренда. Виллы, кондо, квартиры. Юридическое сопровождение, помощь с визами.',
    icon: Home,
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    path: '/services/real-estate',
    telegram: 'https://t.me/PhuketDAexpert',
    features: [
      'Виллы и кондо для покупки',
      'Долгосрочная аренда (от 3 месяцев)',
      'Юридическое сопровождение',
      'Помощь с визами и документами'
    ],
    revenue: {
      projected: '$50K+/year'
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// HELPER ФУНКЦИИ
// ═══════════════════════════════════════════════════════════════

/**
 * Получить конфиг сервиса по ID
 */
export function getServiceConfig(serviceId: string): ServiceConfig {
  const config = SERVICES[serviceId];
  if (!config) {
    console.warn(`Service "${serviceId}" not found, using default (tours)`);
    return SERVICES.tours;
  }
  return config;
}

/**
 * Получить все сервисы
 */
export function getAllServices(): ServiceConfig[] {
  return Object.values(SERVICES);
}

/**
 * Получить общий projected revenue
 */
export function getTotalProjectedRevenue(): string {
  const revenues = getAllServices().map(s => {
    const match = s.revenue.projected.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });
  const total = revenues.reduce((sum, r) => sum + r, 0);
  return `$${total}K+/year`;
}

/**
 * Проверить существует ли сервис
 */
export function serviceExists(serviceId: string): boolean {
  return serviceId in SERVICES;
}

