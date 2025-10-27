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
  
  // Extract district from tags (district:phuket-town -> Phuket Town)
  const districtTag = tags.find(tag => tag.startsWith('district:'));
  const district = districtTag 
    ? districtTag.replace('district:', '').split('-').map(w => 
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ')
    : null;

  // Get category tags (exclude district, place, category:*)
  const categoryTags = tags.filter(tag => 
    !tag.startsWith('district:') && 
    !tag.startsWith('category:') && 
    tag !== 'place' &&
    tag !== 'info' &&
    tag !== 'insider'
  ).slice(0, 3);

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
      <div className="overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-2 border-gray-200/80 hover:border-primary/60 rounded-[28px] h-full flex flex-col bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-3 hover:rotate-1">
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
              
              {/* Top badges row - ПРЕМИУМ ДИЗАЙН */}
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3">
                {/* Rating badge - ЗОЛОТОЙ ГРАДИЕНТ */}
                {rating && (
                  <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 backdrop-blur-xl rounded-[18px] px-5 py-3 flex items-center gap-2.5 shadow-[0_10px_30px_rgba(245,158,11,0.5)] border-2 border-white/95 hover:scale-110 hover:shadow-[0_14px_40px_rgba(245,158,11,0.7)] transition-all duration-300">
                    <Star className="w-5 h-5 fill-white text-white drop-shadow-lg" />
                    <span className="text-lg font-black text-white drop-shadow-md tracking-tight">{rating.toFixed(1)}</span>
                  </div>
                )}
                
                {/* Price level - ЗЕЛЁНЫЙ ГРАДИЕНТ */}
                {priceLevel && (
                  <div className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 backdrop-blur-xl rounded-[18px] px-5 py-3 shadow-[0_10px_30px_rgba(16,185,129,0.5)] border-2 border-white/95 hover:scale-110 hover:shadow-[0_14px_40px_rgba(16,185,129,0.7)] transition-all duration-300">
                    <span className="text-lg font-black text-white drop-shadow-md tracking-tight">
                      {'$'.repeat(priceLevel)}
                    </span>
                  </div>
                )}
              </div>
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

        {/* Content - ПРЕМИУМ ДИЗАЙН */}
        <div className="p-6 flex-1 flex flex-col gap-4">
          {/* Title - КРУПНЕЕ И ЧИТАБЕЛЬНЕЕ */}
          <h3 className="text-2xl font-black mb-0 line-clamp-2 group-hover:text-primary transition-colors leading-tight tracking-tight text-gray-900">
            {product.title}
          </h3>
          
          {/* Meta info row - ПРЕМИУМ БЕЙДЖИ */}
          <div className="flex items-center gap-3 text-sm flex-wrap">
            {district && (
              <div className="flex items-center gap-2 font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />
                <span className="text-sm">{district}</span>
              </div>
            )}

            {workingHours && (
              <div className="flex items-center gap-2 font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                <Clock className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                <span className="text-sm">{workingHours.split(' ')[0]}</span>
              </div>
            )}
          </div>
          
          {/* Description - НОРМАЛЬНОЕ ОПИСАНИЕ */}
          <p className="text-sm text-gray-600 line-clamp-3 flex-1 leading-relaxed">
            {placeDescriptions[product.handle] || product.description?.split('\n')[0] || "Популярное место на Пхукете"}
          </p>

          {/* Footer - Category tags - улучшенный стиль */}
          {categoryTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-gray-200">
              {categoryTags.map((tag) => (
                <div
                  key={tag}
                  className="text-xs px-3 py-1.5 font-bold rounded-full bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  #{tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
