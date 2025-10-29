// Компонент с нативными ссылками на наши сервисы
// Для конверсии посетителей в клиентов!

import { Home, RefreshCw, Car, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface NativeServiceLinksProps {
  context?: 'shopping' | 'beach' | 'temple' | 'default';
  className?: string;
}

export const NativeServiceLinks = ({ context = 'default', className = '' }: NativeServiceLinksProps) => {
  
  // Контекстные сообщения в зависимости от категории
  const getContextMessage = () => {
    switch (context) {
      case 'shopping':
        return {
          title: "🛍️ Шоппинг на Пхукете - это только начало!",
          subtitle: "Откройте для себя весь остров с нашими сервисами"
        };
      case 'beach':
        return {
          title: "🏖️ Пляж - это только начало отдыха!",
          subtitle: "Сделайте ваш отпуск незабываемым"
        };
      case 'temple':
        return {
          title: "🛕 Культура Пхукета - это только часть приключения!",
          subtitle: "Исследуйте остров с нами"
        };
      default:
        return {
          title: "🏝️ Откройте весь Пхукет!",
          subtitle: "Полный спектр услуг для вашего отдыха"
        };
    }
  };

  const message = getContextMessage();

  const services = [
    {
      id: 'tours',
      icon: MapPin,
      emoji: '🎟️',
      title: 'Экскурсии и туры',
      description: 'От островов до джунглей',
      link: '/phuket',
      gradient: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      external: false
    },
    {
      id: 'car-rental',
      icon: Car,
      emoji: '🚗',
      title: 'Аренда автомобилей',
      description: '100+ авто в наличии',
      link: 'https://t.me/RentaCarPhu',
      gradient: 'from-orange-500 to-red-500',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      external: true
    },
    {
      id: 'currency',
      icon: RefreshCw,
      emoji: '💱',
      title: 'Обмен валюты',
      description: 'Березa - лучший курс',
      link: 'https://t.me/bereza_manager',
      gradient: 'from-green-500 to-emerald-500',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      external: true
    },
    {
      id: 'real-estate',
      icon: Home,
      emoji: '🏠',
      title: 'Недвижимость',
      description: 'Аренда и продажа',
      link: 'https://t.me/PhuketDAexpert',
      gradient: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      external: true
    },
  ];

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-white rounded-[28px] shadow-[0_20px_70px_-15px_rgba(0,0,0,0.15)] p-8 md:p-10 border-2 border-gray-100 ${className}`}>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
          {message.title}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {message.subtitle}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((service) => {
          if (service.external) {
            return (
              <a
                key={service.id}
                href={service.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
              <div className={`
                ${service.bgColor} 
                rounded-2xl p-6 
                border-2 border-gray-200/50
                hover:border-gray-300
                transition-all duration-300 
                hover:scale-105 
                hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)]
                hover:-translate-y-1
                cursor-pointer
                h-full
                flex flex-col
              `}>
                {/* Icon with gradient background */}
                <div className="mb-4">
                  <div className={`
                    w-14 h-14 rounded-2xl 
                    bg-gradient-to-br ${service.gradient}
                    flex items-center justify-center
                    shadow-lg
                    group-hover:scale-110
                    transition-transform duration-300
                  `}>
                    <span className="text-3xl">{service.emoji}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium mb-4 flex-1">
                  {service.description}
                </p>

                {/* CTA */}
                <div className={`
                  inline-flex items-center gap-2 
                  text-sm font-bold ${service.iconColor}
                  group-hover:gap-3
                  transition-all duration-300
                `}>
                  <span>{service.external ? 'Открыть' : 'Смотреть'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </a>
            );
          } else {
            return (
              <Link
                key={service.id}
                to={service.link}
                className="group block"
              >
                <div className={`
                  ${service.bgColor} 
                  rounded-2xl p-6 
                  border-2 border-gray-200/50
                  hover:border-gray-300
                  transition-all duration-300 
                  hover:scale-105 
                  hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)]
                  hover:-translate-y-1
                  cursor-pointer
                  h-full
                  flex flex-col
                `}>
                  {/* Icon with gradient background */}
                  <div className="mb-4">
                    <div className={`
                      w-14 h-14 rounded-2xl 
                      bg-gradient-to-br ${service.gradient}
                      flex items-center justify-center
                      shadow-lg
                      group-hover:scale-110
                      transition-transform duration-300
                    `}>
                      <span className="text-3xl">{service.emoji}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mb-4 flex-1">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <div className={`
                    inline-flex items-center gap-2 
                    text-sm font-bold ${service.iconColor}
                    group-hover:gap-3
                    transition-all duration-300
                  `}>
                    <span>{service.external ? 'Открыть' : 'Смотреть'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            );
          }
        })}
      </div>

      {/* Footer CTA */}
      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500 mb-4">
          💬 Есть вопросы? Наш AI-бот готов помочь 24/7
        </p>
        <a
          href="https://t.me/PHUKETDABOT"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0088cc] to-[#00a0e9] text-white font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(0,136,204,0.4)] hover:shadow-[0_14px_40px_rgba(0,136,204,0.6)] hover:scale-105 transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
          <span>Написать в Telegram</span>
        </a>
      </div>
    </div>
  );
};

