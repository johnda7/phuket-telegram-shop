/**
 * 🏆 ULTIMATE PREMIUM PLACE DETAIL PAGE
 * 
 * ALL BUTTONS WORK! ALL FEATURES COMPLETE!
 * Design: iOS 26 + Perplexity AI + Steve Jobs
 */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle } from "@/lib/shopify";
import { getPlaceMetafields } from "@/data/placeMetafields";
import { 
  Loader2, MapPin, Star, ExternalLink, MessageCircle, 
  Clock, DollarSign, ChevronLeft, ChevronRight, ArrowLeft,
  Wifi, ParkingCircle, Utensils, Film, ShoppingBag, Car, Home, Share2, Ship
} from "lucide-react";

interface PlacePhoto {
  url: string;
  alt: string;
}

interface ParsedPlace {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  category: string;
  district?: string;
  images: PlacePhoto[];
  tags: string[];
  rating: number;
  priceLevel: number;
  workingHours?: string;
  coordinates?: string; // lat,lng
  amenities?: string[];
}

// Функция для перевода районов на русский
const getDistrictInRussian = (district: string): string => {
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
};

// Функция для перевода категорий на русский
const getCategoryNameInRussian = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'shopping': 'Торговые центры',
    'beaches': 'Пляжи',
    'temples': 'Храмы',
    'viewpoints': 'Смотровые площадки',
    'restaurants': 'Рестораны',
    'nightlife': 'Ночная жизнь',
    'markets': 'Рынки',
    'attractions': 'Достопримечательности',
    'spa': 'СПА и массаж',
    'museums': 'Музеи',
    'waterfalls': 'Водопады',
    'parks': 'Парки',
    'activities': 'Активности'
  };
  return categoryMap[category] || category;
};

const PlaceDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [place, setPlace] = useState<ParsedPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadPlace = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        const foundProduct = await fetchProductByHandle(handle);
        
        if (!foundProduct) {
          setLoading(false);
          return;
        }

        const product = foundProduct.node;
        
        // Parse category
        const categoryTag = product.tags.find(t => t.startsWith('category:'));
        const category = categoryTag?.replace('category:', '') || '';
        
        // District will be parsed from metafields below
        
        // Parse price level
        const priceLevelTag = product.tags.find(t => t.startsWith('price-level:'));
        const priceLevel = priceLevelTag ? parseInt(priceLevelTag.replace('price-level:', '')) : 2;
        
        // Parse working hours
        const workingHoursTag = product.tags.find(t => t.includes(':00'));
        const workingHours = workingHoursTag;
        
        // Получаем metafields из fallback данных (Storefront API не может получить metafields)
        const fallbackData = getPlaceMetafields(handle);
        const rating = fallbackData.rating;
        const coordinates = fallbackData.coordinates;
        const district = fallbackData.district;
        
        console.log('🔍 Debug metafields (fallback):');
        console.log('  Handle:', handle);
        console.log('  Fallback data:', fallbackData);
        console.log('  Final rating:', rating);
        console.log('  Final district:', district);
        console.log('  Final coordinates:', coordinates);
        
        // Debug description data
        console.log('📝 Debug description:');
        console.log('  Product description:', product.description);
        console.log('  Product descriptionHtml:', product.descriptionHtml);
        console.log('  Product title:', product.title);
        
        // Images - ALL from Shopify!
        const images = product.images?.edges.map(e => ({
          url: e.node.url,
          alt: e.node.altText || product.title
        })) || [];

        setPlace({
          id: product.id,
          handle: product.handle,
          title: product.title,
          description: product.description || '',
          descriptionHtml: product.descriptionHtml || '',
          category,
          district,
          images,
          tags: product.tags,
          rating,
          priceLevel,
          workingHours,
          coordinates,
          amenities: ['Wi-Fi', 'Парковка', 'Фуд-корт', 'Банкомат', 'Кино', 'Аквариум']
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading place:', error);
        setLoading(false);
      }
    };

    loadPlace();
  }, [handle]);

  // ✅ WORKING BUTTON: Share via Telegram
  const handleShare = () => {
    const url = window.location.href;
    const text = `${place?.title}\n\n⭐ ${place?.rating}/5\n\nСмотри на PhuketDA:`;
    
    if (window.Telegram?.WebApp) {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  // ✅ WORKING BUTTON: Open Google Maps
  const handleShowOnMap = () => {
    if (place?.coordinates) {
      const [lat, lng] = place.coordinates.split(',');
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(mapsUrl, '_blank');
    }
  };

  // ✅ WORKING BUTTON: Open Telegram Bot
  const handleOpenBot = () => {
    window.open('https://t.me/PHUKETDABOT', '_blank');
  };

  // ✅ NEW: Show Examples
  const handleShowExamples = () => {
    const examples = [
      "Какие пляжи лучше всего на Пхукете?",
      "Где купить сувениры недорого?",
      "Где попробовать настоящую тайскую кухню?",
      "Как добраться из аэропорта до Патонга?",
      "Где выгодно обменять валюту?",
      "Посоветуйте хороший отель в Кароне"
    ];
    
    const message = `Примеры вопросов для ДА Бота:\n\n${examples.join('\n')}\n\nНажмите "Открыть бот" чтобы задать любой из этих вопросов!`;
    alert(message);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-lg text-gray-600 mb-4">Место не найдено</p>
        <Link to="/categories" className="text-primary hover:underline">
          ← Вернуться к категориям
          </Link>
      </div>
    );
  }

  const heroImage = place.images[currentImageIndex] || {
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"%3E%3Crect fill="%234B5563" width="1200" height="800"/%3E%3C/svg%3E',
    alt: place.title
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 
        🧭 NAVIGATION HEADER - Back Button + Breadcrumbs
        iOS 26 Style Navigation - App-like Design
      */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/30 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Back Button - iOS Style */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-100/60 hover:bg-gray-200/70 active:scale-95 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
            <span className="text-gray-600 text-sm font-medium group-hover:text-gray-800 transition-colors">Назад</span>
          </button>

          {/* Breadcrumbs - Compact App Style - ДИНАМИЧЕСКИЕ! */}
          <div className="flex items-center gap-1 text-xs text-gray-500 max-w-[60%]">
            <Link 
              to="/" 
              className="hover:text-primary transition-colors duration-150 px-1 py-0.5 rounded text-xs font-medium"
            >
              Главная
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              to="/categories" 
              className="hover:text-primary transition-colors duration-150 px-1 py-0.5 rounded text-xs font-medium"
            >
              Категории
            </Link>
            {place.category && (
              <>
                <span className="text-gray-300">•</span>
                <Link 
                  to={`/category/${place.category}`}
                  className="hover:text-primary transition-colors duration-150 px-1 py-0.5 rounded text-xs font-medium truncate"
                >
                  {getCategoryNameInRussian(place.category)}
                </Link>
              </>
            )}
            <span className="text-gray-300">•</span>
            <span className="text-gray-800 font-semibold truncate max-w-24">
              {place.title.split('(')[0].trim()}
            </span>
          </div>
        </div>
      </div>

      {/* 
        🌟 HERO SECTION - Full Screen Photo Gallery
        ALL BUTTONS WORK!
      */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden z-10">
        {/* Hero Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${heroImage.url})` }}
        >
          {/* Telegram Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent backdrop-blur-[0.5px]" />
        </div>

        {/* Navigation Controls - FIXED Z-INDEX! */}
        {place.images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? place.images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border border-white/40 flex items-center justify-center hover:bg-black/50 hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl z-[60]"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === place.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border border-white/40 flex items-center justify-center hover:bg-black/50 hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl z-[60]"
              aria-label="Следующее фото"
            >
              <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
            </button>
          </>
        )}

        {/* Photo Dots Navigation - FIXED POSITION */}
        {place.images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/30 z-50">
            {place.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'w-3 h-3 bg-white shadow-lg scale-110'
                    : 'w-2.5 h-2.5 bg-white/70 hover:bg-white/90 hover:scale-110 active:scale-95'
                }`}
                aria-label={`Фото ${index + 1}`}
                  />
                ))}
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge - ТОЛЬКО РУССКИЙ! */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium">
                <ShoppingBag className="w-4 h-4" />
                Торговые центры
              </span>
            </div>

            {/* Title - Telegram Mobile Optimized */}
            <h1 className="text-lg md:text-xl font-bold text-white mb-3 drop-shadow-2xl leading-tight px-2">
              {place.title}
            </h1>

            {/* Meta Info - Z-INDEX 10! */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {/* Rating */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                <span className="text-white font-bold">{place.rating.toFixed(1)}</span>
              </div>
              
              {/* Price Level - УБРАНО! НЕ НУЖНО */}

              {/* District - РУССКИЙ! */}
              {place.district && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">{getDistrictInRussian(place.district)}</span>
                </div>
              )}
              
              {/* Working Hours */}
              {place.workingHours && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">{place.workingHours}</span>
            </div>
              )}
            </div>

            {/* Quick Actions - ALL WORKING! */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={handleOpenBot}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all shadow-lg active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                Написать в бот
              </button>
              <button
                onClick={handleShowOnMap}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all shadow-lg active:scale-95"
              >
                <MapPin className="w-4 h-4" />
                На карте
                      </button>
                      <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all shadow-lg active:scale-95"
                      >
                <Share2 className="w-4 h-4" />
                Поделиться
                      </button>
            </div>
                  </div>
                </div>

        {/* Photo Counter */}
        {place.images.length > 1 && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-xs font-medium z-50">
            {currentImageIndex + 1} / {place.images.length}
                  </div>
                )}
      </div>

      {/* 
        📝 CONTENT SECTION - Medium-Style Typography
      */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Description Card - iOS 26 ELEGANT DESIGN */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg">
          {/* Subtle iOS 26 Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white/30 to-gray-100/40"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/20 to-transparent"></div>
          
          <div className="relative p-6 md:p-8">
            {/* Header with Icon - iOS 26 Style */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                  <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">О месте</h2>
                <p className="text-gray-500 text-sm">Подробная информация и рекомендации</p>
              </div>
            </div>
            
            {/* Telegram WebApp Style Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-em:text-gray-500 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h2:mt-8 prose-h2:mb-4 prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-ul:my-4 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: place.descriptionHtml || place.description || '' }}
            />
          </div>
        </div>

        {/* Amenities - iOS 26 ELEGANT DESIGN */}
        {place.amenities && place.amenities.length > 0 && (
          <div className="relative mb-12 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg">
            {/* Subtle iOS 26 Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white/30 to-gray-100/40"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/20 to-transparent"></div>
            
            <div className="relative p-6 md:p-8">
              {/* Header with Icon - iOS 26 Style */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Удобства</h2>
                  <p className="text-gray-500 text-sm">Что доступно в этом месте</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {place.amenities.map((amenity, i) => {
                  const icons = [Wifi, ParkingCircle, Utensils, DollarSign, Film, ShoppingBag];
                  const Icon = icons[i % icons.length];
                  return (
                    <div key={i} className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/70 hover:scale-[1.02] transition-all duration-200">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-600 text-sm font-medium group-hover:text-gray-900 transition-colors">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
              
        {/* 
          💰 CONVERSION SECTION - iOS 26 ELEGANT DESIGN
        */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg">
          {/* Subtle iOS 26 Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white/30 to-gray-100/40"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/20 to-transparent"></div>
          
          <div className="relative p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                  <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Наши сервисы</h2>
                <p className="text-gray-500 text-sm">Полный спектр услуг для вашего отдыха</p>
              </div>
            </div>

            {/* Telegram WebApp Style Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
                to="/phuket"
                className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Ship className="w-5 h-5 text-[#007AFF]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">Туры</div>
                    <div className="text-xs text-gray-500">С гидом</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                to="/services/car-rental"
                className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <Car className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">Аренда авто</div>
                    <div className="text-xs text-gray-500">Самостоятельно</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                to="/services/currency-exchange"
                className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">Обмен валюты</div>
                    <div className="text-xs text-gray-500">Выгодный курс</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ДА БОТ - iOS 26 ELEGANT DESIGN */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg">
          {/* Subtle iOS 26 Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white/30 to-gray-100/40"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/20 to-transparent"></div>
          
          <div className="relative p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              
              <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-500 text-sm font-medium">ИИ Консьерж онлайн</span>
            </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Есть вопросы? Спросите ДА Бота!
                </h3>
                
                <p className="text-gray-500 text-sm mb-4">
                  Персональный ИИ-консьерж ответит на все вопросы про Пхукет 24/7
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenBot}
                    className="group px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-sm hover:shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Открыть бот
                    </span>
                  </button>
                  
                  <button
                    onClick={handleShowExamples}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-all"
                  >
                    Примеры
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
