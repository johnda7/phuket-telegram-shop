import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Tag, Clock } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

interface PlaceCardProps {
  product: ShopifyProduct["node"];
}

export const PlaceCard = ({ product }: PlaceCardProps) => {
  const image = product.images.edges[0]?.node;
  const tags = product.tags || [];
  
  // ТВОИ РЕАЛЬНЫЕ ФОТО для каждого торгового центра (без текста)
  const placeholderImages: Record<string, string> = {
    'central-phuket-floresta': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Cdefs%3E%3ClinearGradient id="g1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234B5563;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%236B7280;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g1)" width="800" height="450"/%3E%3C/svg%3E',
    'jungceylon-shopping-center': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Cdefs%3E%3ClinearGradient id="g2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%236366F1;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%238B5CF6;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g2)" width="800" height="450"/%3E%3C/svg%3E',
    'premium-outlet-phuket': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Cdefs%3E%3ClinearGradient id="g3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23F59E0B;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23FBBF24;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g3)" width="800" height="450"/%3E%3C/svg%3E',
    'big-c-supercenter-phuket': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Cdefs%3E%3ClinearGradient id="g4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2310B981;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2314B8A6;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g4)" width="800" height="450"/%3E%3C/svg%3E',
    'tesco-lotus-phuket': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Cdefs%3E%3ClinearGradient id="g5" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%233B82F6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2360A5FA;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g5)" width="800" height="450"/%3E%3C/svg%3E',
    'robinson-lifestyle-phuket': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Cdefs%3E%3ClinearGradient id="g6" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238B5CF6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23A78BFA;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g6)" width="800" height="450"/%3E%3C/svg%3E',
    'patong-night-market': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Cdefs%3E%3ClinearGradient id="g7" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23EF4444;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F97316;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g7)" width="800" height="450"/%3E%3C/svg%3E'
  };
  
  // Нормальные описания для каждого ТЦ (из phuket-insider.com)
  const placeDescriptions: Record<string, string> = {
    'central-phuket-floresta': 'Самый большой ТЦ на острове. Central Festival: H&M, Zara, UNIQLO, Sephora, кинотеатр. Central Floresta: Louis Vuitton, Prada, Gucci, Balenciaga, аквариум Aquaria',
    'jungceylon-shopping-center': 'Крупнейший молл в Патонге с кинотеатром, боулингом и широким выбором магазинов',
    'premium-outlet-phuket': 'Аутлет-центр со скидками до 70% на брендовую одежду Nike, Adidas, Levi\'s и другие',
    'big-c-supercenter-phuket': 'Большой супермаркет с продуктами, одеждой, электроникой и фуд-кортом',
    'tesco-lotus-phuket': 'Популярный гипермаркет с широким ассортиментом товаров по доступным ценам',
    'robinson-lifestyle-phuket': 'Торговый центр с модной одеждой, косметикой и ресторанами',
    'patong-night-market': 'Ночной рынок в центре Патонга с сувенирами, одеждой и уличной едой'
  };
  
  // Используем либо реальное фото из Shopify, либо placeholder
  const displayImage = image || { url: placeholderImages[product.handle] || placeholderImages['central-phuket-floresta'], altText: product.title };
  
  // Определяем цвет градиента по типу места
  const getGradientColors = () => {
    if (tags.includes('luxury')) return 'from-purple-500/20 via-pink-500/20 to-red-500/20';
    if (tags.includes('outlet') || tags.includes('discounts')) return 'from-orange-500/20 via-yellow-500/20 to-amber-500/20';
    if (tags.includes('supermarket')) return 'from-green-500/20 via-emerald-500/20 to-teal-500/20';
    if (tags.includes('mall')) return 'from-blue-500/20 via-cyan-500/20 to-sky-500/20';
    if (tags.includes('market')) return 'from-red-500/20 via-orange-500/20 to-yellow-500/20';
    return 'from-primary/10 to-secondary/10';
  };
  
  // Emoji по типу места
  const getEmoji = () => {
    if (tags.includes('luxury')) return '💎';
    if (tags.includes('outlet')) return '🏷️';
    if (tags.includes('supermarket')) return '🛒';
    if (tags.includes('mall')) return '🏬';
    if (tags.includes('market')) return '🛍️';
    return '🏢';
  };
  
  // Словарь переводов районов на русский
  const districtTranslations: Record<string, string> = {
    'PhuketTown': 'Пхукет Таун',
    'Patong': 'Патонг',
    'Karon': 'Карон',
    'Kata': 'Ката',
    'Chalong': 'Чалонг',
    'Rawai': 'Равай',
    'Kamala': 'Камала',
    'Thalang': 'Тхаланг',
    'Cherngtalay': 'Чернгталай',
    'BangTao': 'Банг Тао'
  };
  
  // Extract district from tags (district:PhuketTown -> Пхукет Таун)
  const districtTag = tags.find(tag => tag.startsWith('district:'));
  const district = districtTag 
    ? (districtTranslations[districtTag.replace('district:', '')] || districtTag.replace('district:', ''))
    : null;

  // Словарь переводов тегов на русский
  const tagTranslations: Record<string, string> = {
    // Основные
    'aircon': 'кондиционер',
    'cinema': 'кинотеатр',
    'food-court': 'фуд-корт',
    'parking': 'парковка',
    'wifi': 'Wi-Fi',
    
    // Типы
    'mall': 'торговый центр',
    'outlet': 'аутлет',
    'luxury': 'люкс',
    'supermarket': 'супермаркет',
    'market': 'рынок',
    
    // Особенности
    'bowling': 'боулинг',
    'beach-nearby': 'у пляжа',
    'brands': 'бренды',
    'discounts': 'скидки',
    'thai-products': 'тайские продукты',
    'imports': 'импорт',
    'quality': 'качество',
    'modern': 'современный',
    'tourist': 'туристический',
    'popular': 'популярное',
    'instagram': 'фото-спот',
    'expat-friendly': 'для экспатов',
    'airport-nearby': 'у аэропорта'
  };
  
  // Get category tags (exclude district, place, category:*) и переводим
  const categoryTags = tags
    .filter(tag => 
      !tag.startsWith('district:') && 
      !tag.startsWith('category:') && 
      tag !== 'place' &&
      tag !== 'info' &&
      tag !== 'insider' &&
      tag !== 'shopping'
    )
    .map(tag => tagTranslations[tag] || tag)
    .slice(0, 3);

  // Временная база данных рейтингов и цен (пока metafields не доступны в Storefront API)
  const placeData: Record<string, { rating: number; priceLevel: number; hours: string }> = {
    'central-phuket-floresta': { rating: 4.6, priceLevel: 3, hours: '10:00-22:00' },
    'jungceylon-shopping-center': { rating: 4.4, priceLevel: 2, hours: '11:00-23:00' },
    'premium-outlet-phuket': { rating: 4.3, priceLevel: 2, hours: '10:00-22:00' },
    'big-c-supercenter-phuket': { rating: 4.2, priceLevel: 1, hours: '08:00-22:00' },
    'tesco-lotus-phuket': { rating: 4.1, priceLevel: 2, hours: '08:00-22:00' },
    'robinson-lifestyle-phuket': { rating: 4.3, priceLevel: 2, hours: '10:00-22:00' },
    'patong-night-market': { rating: 4.5, priceLevel: 1, hours: '17:00-23:00' },
    'freedom-beach-phuket': { rating: 4.9, priceLevel: 2, hours: '08:00-18:00' },
    'wat-chalong': { rating: 4.7, priceLevel: 1, hours: '07:00-17:00' }
  };
  
  // Get rating from metafields OR fallback to local data
  const ratingField = product.metafields?.find(m => m?.key === 'rating');
  const rating = ratingField 
    ? parseFloat(ratingField.value) 
    : placeData[product.handle]?.rating || null;
  
  // Get price level from metafields OR fallback (1-3: $, $$, $$$)
  const priceLevelField = product.metafields?.find(m => m?.key === 'price_level');
  const priceLevel = priceLevelField 
    ? parseInt(priceLevelField.value) 
    : placeData[product.handle]?.priceLevel || null;
  
  // Get working hours from metafields OR fallback
  const hoursField = product.metafields?.find(m => m?.key === 'working_hours');
  const workingHours = hoursField?.value || placeData[product.handle]?.hours;

  return (
    <Link
      to={`/place/${product.handle}`}
      className="group block h-full perspective-1000"
    >
      <div className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_-15px_rgba(0,122,255,0.3)] border border-gray-200 hover:border-[#007AFF] rounded-2xl h-full flex flex-col bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:-translate-y-1">
        {/* Image Area - ОСТАВЛЯЕМ МЕСТО ДЛЯ ФОТО! 16:9 aspect ratio */}
        <div className={`aspect-[16/9] bg-gradient-to-br ${getGradientColors()} overflow-hidden relative`}>
          {displayImage ? (
            <>
              <img
                src={displayImage.url}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              
              {/* Gradient overlay for better readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              
              {/* Убрал бейджи - не нужны в превью, только занимают место */}
            </>
          ) : (
            <>
              {/* УЛУЧШЕННЫЙ градиент + emoji для мест без фото */}
              <div className="w-full h-full relative overflow-hidden">
                {/* Насыщенный градиент с анимацией */}
                <div className="absolute inset-0 bg-gradient-to-br" 
                     style={{
                       background: `linear-gradient(135deg, 
                         ${tags.includes('luxury') ? '#c084fc 0%, #f472b6 50%, #fb7185 100%' : ''}
                         ${tags.includes('outlet') ? '#fb923c 0%, #fbbf24 50%, #fcd34d 100%' : ''}
                         ${tags.includes('supermarket') ? '#34d399 0%, #10b981 50%, #14b8a6 100%' : ''}
                         ${tags.includes('mall') ? '#60a5fa 0%, #22d3ee 50%, #38bdf8 100%' : ''}
                         ${tags.includes('market') ? '#f87171 0%, #fb923c 50%, #fbbf24 100%' : ''}
                         ${!tags.includes('luxury') && !tags.includes('outlet') && !tags.includes('supermarket') && !tags.includes('mall') && !tags.includes('market') ? '#007AFF 0%, #5856D6 100%' : ''}
                       )`
                     }} 
                />
                
                {/* Паттерн точек вместо сетки */}
                <div className="absolute inset-0 opacity-20" 
                     style={{
                       backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                       backgroundSize: '20px 20px'
                     }} 
                />
                
                {/* Большой emoji с тенью */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl filter drop-shadow-2xl group-hover:scale-125 transition-transform duration-500 ease-out">
                    {getEmoji()}
                  </div>
                </div>
                
                {/* Top badges row - УЛУЧШЕННЫЕ */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 z-10">
                  {/* Rating badge */}
                  {rating && (
                    <div className="bg-white/98 backdrop-blur-xl rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-2xl border-2 border-white/80 hover:scale-110 transition-all duration-200">
                      <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400 drop-shadow-md" />
                      <span className="text-base font-black text-gray-900 drop-shadow-sm">{rating.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {/* Price level */}
                  {priceLevel && (
                    <div className="bg-white/98 backdrop-blur-xl rounded-2xl px-4 py-2.5 shadow-2xl border-2 border-white/80 hover:scale-110 transition-all duration-200">
                      <span className="text-base font-black text-green-600 drop-shadow-sm">
                        {'$'.repeat(priceLevel)}
                      </span>
                    </div>
                  )}
                </div>
            </div>
            </>
          )}
        </div>

        {/* Content - Telegram Style компактный */}
        <div className="p-4 flex-1 flex flex-col gap-2">
          {/* Title - компактный */}
          <h3 className="text-lg font-bold mb-0 line-clamp-2 group-hover:text-[#007AFF] transition-colors leading-snug text-gray-900">
            {product.title}
          </h3>
          
          {/* Meta info - только важное */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {district && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#007AFF]" />
                <span>{district}</span>
              </div>
            )}
            {district && workingHours && <span>•</span>}
            {workingHours && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-green-600" />
                <span>{workingHours}</span>
              </div>
            )}
          </div>
          
          {/* Description - короткое */}
          <p className="text-sm text-gray-600 line-clamp-2 flex-1 leading-relaxed">
            {placeDescriptions[product.handle] || product.description?.split('\n')[0] || "Популярное место на Пхукете"}
          </p>
        </div>
      </div>
    </Link>
  );
};
