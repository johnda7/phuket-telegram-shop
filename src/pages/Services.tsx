import { useParams, Link } from "react-router-dom";
import { Car, DollarSign, Home, ArrowLeft, Ship } from "lucide-react";

const Services = () => {
  const { service } = useParams<{ service: string }>();
  
  const services: Record<string, { 
    title: string; 
    subtitle: string;
    description: string; 
    icon: any;
    color: string;
    bgColor: string;
    telegram: string;
  }> = {
    'car-rental': {
      title: 'Аренда автомобилей',
      subtitle: 'Надёжные автомобили',
      description: 'Широкий выбор авто для поездок по Пхукету. От эконом до премиум класса.',
      icon: Car,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      telegram: 'https://t.me/RentaCarPhu'
    },
    'currency-exchange': {
      title: 'Обмен валюты',
      subtitle: 'Выгодный курс',
      description: 'Лучший курс обмена рублей на баты. Без комиссий и скрытых платежей.',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      telegram: 'https://t.me/bereza_manager'
    },
    'real-estate': {
      title: 'Недвижимость',
      subtitle: 'Аренда и продажа',
      description: 'Виллы, кондо и квартиры на любой бюджет. Помощь с оформлением.',
      icon: Home,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      telegram: 'https://t.me/PhuketDAexpert'
    }
  };

  const current = services[service || ''] || services['car-rental'];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header - iOS 26 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <Link 
            to="/category/shopping" 
            className="inline-flex items-center gap-2 text-[#007AFF] hover:text-[#0051D5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Service Card - Telegram Wallet Style */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 mb-6">
          {/* Icon & Title */}
          <div className="p-6 text-center border-b border-gray-100">
            <div className={`w-16 h-16 rounded-2xl ${current.bgColor} flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`w-8 h-8 ${current.color}`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {current.title}
            </h1>
            <p className="text-sm text-gray-500">
              {current.subtitle}
            </p>
          </div>

          {/* Description */}
          <div className="p-6 border-b border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Status */}
          <div className="p-6 bg-blue-50/50">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚙️</div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Страница в разработке</p>
                <p className="text-sm text-gray-600">
                  Скоро появится полная информация и онлайн-бронирование
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA - Telegram */}
        <a
          href={current.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full p-4 bg-[#007AFF] rounded-2xl text-center hover:bg-[#0051D5] transition-colors shadow-[0_2px_8px_rgba(0,122,255,0.25)]"
        >
          <span className="text-white font-semibold">Написать в Telegram</span>
        </a>

        {/* Other Services */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Другие сервисы</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100">
            <Link
              to="/phuket"
              className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Ship className="w-5 h-5 text-[#007AFF]" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">Туры на Пхукете</div>
                  <div className="text-xs text-gray-500">Экскурсии с гидом</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {Object.entries(services)
              .filter(([key]) => key !== service)
              .map(([key, srv]) => {
                const SrvIcon = srv.icon;
                return (
                  <Link
                    key={key}
                    to={`/services/${key}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-xl ${srv.bgColor} flex items-center justify-center`}>
                        <SrvIcon className={`w-5 h-5 ${srv.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{srv.title}</div>
                        <div className="text-xs text-gray-500">{srv.subtitle}</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

