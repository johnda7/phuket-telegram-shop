/**
 * 🤝 СТРАНИЦА ПАРТНЕРСКИХ УСЛУГ (Ex24 Pro Style)
 * 
 * Визуальная стратегия как у Ex24 Pro:
 * - Grid layout 2 колонки с красивыми картинками
 * - Hero image на каждой карточке
 * - Название + краткое описание
 * - Кнопка CTA (#007AFF вместо желтого)
 * 
 * Дизайн: iOS 26 + Telegram Wallet + Perplexity принципы
 */

import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getAllPartners, getActivePartners, getPartnerConfig } from "@/config/partners";

const Partners = () => {
  const { partnerId } = useParams<{ partnerId?: string }>();
  const allPartners = getAllPartners();
  const activePartners = getActivePartners();

  // Если передан partnerId, показываем детальную страницу партнера
  if (partnerId) {
    const partner = getPartnerConfig(partnerId);
    if (!partner) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Партнер не найден</h1>
            <Link to="/partners" className="text-[#007AFF] hover:underline">
              Вернуться к партнерам
            </Link>
          </div>
        </div>
      );
    }

    const Icon = partner.icon;
    const heroImage = partner.heroImage || `https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=600&fit=crop`;
    const detailedDescription = partner.detailedDescription || partner.description;

    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Hero Image Section - Ex24 Pro Style */}
        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          <img 
            src={heroImage} 
            alt={partner.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Back Button - Overlay */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 py-3">
              <Link 
                to="/partners" 
                className="inline-flex items-center gap-2 text-[#007AFF] hover:text-[#0051D5] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Назад</span>
              </Link>
            </div>
          </div>

          {/* Title Overlay - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {partner.title}
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              {partner.subtitle}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Description - Ex24 Pro Style with emojis */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 mb-6">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed text-sm md:text-base">
              {detailedDescription.split('\n').map((line, index) => (
                <p key={index} className="mb-3 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Commission & Status Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100/50 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Комиссия</p>
                <p className="text-xl font-bold text-[#007AFF]">{partner.commission}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Статус</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                  partner.status === 'active' 
                    ? 'bg-green-100 text-green-700'
                    : partner.status === 'coming-soon'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {partner.status === 'active' ? 'Активно' : partner.status === 'coming-soon' ? 'Скоро' : 'Планируется'}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button - Ex24 Pro Style (но #007AFF вместо желтого) */}
          {partner.id === 'currency-exchange' ? (
            <Link
              to={`/partner/cabinet/${partner.id}`}
              className="block w-full p-4 bg-[#007AFF] rounded-2xl text-center hover:bg-[#0051D5] transition-colors shadow-[0_2px_8px_rgba(0,122,255,0.25)] text-white font-semibold text-base"
            >
              Открыть кабинет партнера
            </Link>
          ) : partner.status === 'active' && partner.telegram ? (
            <a
              href={partner.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-4 bg-[#007AFF] rounded-2xl text-center hover:bg-[#0051D5] transition-colors shadow-[0_2px_8px_rgba(0,122,255,0.25)] text-white font-semibold text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Связаться с нами
            </a>
          ) : (
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 text-center">
              <p className="text-sm text-gray-700">
                {partner.status === 'coming-soon' 
                  ? 'Эта услуга скоро появится. Следите за обновлениями!'
                  : 'Эта услуга в планах. Мы работаем над добавлением новых партнеров.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Основная страница со списком партнеров - Ex24 Pro Grid Style

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header - iOS 26 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#007AFF] hover:text-[#0051D5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад</span>
          </Link>
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
            <Link to="/" className="hover:text-[#007AFF] transition-colors">Главная</Link>
            <span>•</span>
            <span className="text-gray-900 font-medium">Партнеры</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Hero Section - iOS 26 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Партнерские услуги
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Дополнительные сервисы от наших партнеров. Каждая услуга проходит через нашу платформу с гарантией качества.
          </p>
        </div>

        {/* Active Partners - Grid 2 колонки (Ex24 Pro Style) */}
        {activePartners.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Доступно сейчас</h2>
            <div className="grid grid-cols-2 gap-4">
              {activePartners.map((partner) => {
                const heroImage = partner.heroImage || `https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop`;
                return (
                  <Link
                    key={partner.id}
                    to={partner.path}
                    className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_4px_16px_rgba(0,122,255,0.15)] hover:-translate-y-0.5 transition-all"
                  >
                    {/* Hero Image - Ex24 Pro Style */}
                    <div className="relative w-full h-40 overflow-hidden">
                      <img 
                        src={heroImage} 
                        alt={partner.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-green-500 text-white text-[10px] font-medium rounded-full">
                          Активно
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-[#007AFF] transition-colors">
                        {partner.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {partner.subtitle}
                      </p>
                      
                      {/* CTA Button - Ex24 Pro Style (#007AFF) */}
                      <div className="w-full px-3 py-2 bg-[#007AFF] rounded-xl text-center">
                        <span className="text-white text-xs font-semibold">
                          {partner.id === 'currency-exchange' ? 'Кабинет' : 'Связаться'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Coming Soon - Grid 2 колонки */}
        {allPartners.filter(p => p.status === 'coming-soon').length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Скоро появится</h2>
            <div className="grid grid-cols-2 gap-4">
              {allPartners
                .filter(p => p.status === 'coming-soon')
                .map((partner) => {
                  const heroImage = partner.heroImage || `https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop`;
                  return (
                    <div
                      key={partner.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 opacity-75"
                    >
                      {/* Hero Image */}
                      <div className="relative w-full h-40 overflow-hidden">
                        <img 
                          src={heroImage} 
                          alt={partner.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-medium rounded-full">
                            Скоро
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-sm mb-1">
                          {partner.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          {partner.subtitle}
                        </p>
                        <div className="w-full px-3 py-2 bg-gray-300 rounded-xl text-center">
                          <span className="text-gray-600 text-xs font-semibold">Скоро</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Info Block - Perplexity Style */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Как это работает?</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-[#007AFF] font-bold">1.</span>
              <span>Вы оставляете заявку через наше приложение</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#007AFF] font-bold">2.</span>
              <span>Партнер видит лид в личном кабинете и обрабатывает заявку</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#007AFF] font-bold">3.</span>
              <span>После сделки мы получаем комиссию, партнер — клиента</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
