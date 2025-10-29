import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import { getCardClass, cn } from "@/styles/design-system";
import { placeMetafieldsData } from "@/data/placeMetafields";

interface PlaceCardProps {
  product: ShopifyProduct["node"];
}

/**
 * PlaceCard - Компактная карточка места в стиле Telegram Wallet
 * 
 * ФИЛОСОФИЯ:
 * - Минимализм (только важное)
 * - Telegram Wallet aesthetic (компактно, профессионально)
 * - Все данные из Shopify (fallback из placeMetafields)
 * - Lucide React иконки (НЕТ эмодзи!)
 * - Быстрая загрузка (< 2 сек)
 */
export const PlaceCard = ({ product }: PlaceCardProps) => {
  const image = product.images.edges[0]?.node;
  const tags = product.tags || [];
  
  // ✅ Дефолтный SVG градиент (если нет фото в Shopify)
  const defaultGradient = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23007AFF;stop-opacity:0.8" /%3E%3Cstop offset="100%25" style="stop-color:%2334C759;stop-opacity:0.8" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="800" height="450"/%3E%3C/svg%3E';
  
  const displayImage = image || { url: defaultGradient, altText: product.title };
  
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

  // Get rating from metafields OR fallback to placeMetafieldsData
  const ratingField = product.metafields?.find(m => m?.key === 'rating');
  const rating = ratingField 
    ? parseFloat(ratingField.value) 
    : placeMetafieldsData[product.handle]?.rating || null;

  return (
    <Link
      to={`/place/${product.handle}`}
      className={cn(
        getCardClass('hover'),
        "block overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-1"
      )}
    >
      {/* 📸 Фото - 16:9 aspect ratio */}
      <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
        <img
          src={displayImage.url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Rating badge - Premium style */}
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/50">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-gray-900">{rating}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#007AFF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* 📝 Информация - Premium spacing */}
      <div className="p-5">
        {/* Название */}
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#007AFF] transition-colors">
          {product.title}
        </h3>

        {/* Описание (первые 2 строки) */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Район - Premium style */}
        {district && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-[#007AFF]" />
            <span className="font-medium">{district}</span>
          </div>
        )}
      </div>
    </Link>
  );
};
