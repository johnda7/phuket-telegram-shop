import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

interface CircleTourCardProps {
  product: ShopifyProduct["node"];
  detailPath: string;
}

export const CircleTourCard = ({ 
  product, 
  detailPath 
}: CircleTourCardProps) => {
  const firstImageEdge = product.images?.edges?.find(e => e?.node?.url);
  const image = firstImageEdge?.node;
  const imageUrl = image?.url || '';
  
  // Извлекаем цену
  const variantPrices = (product.variants?.edges || [])
    .map(e => parseFloat(e?.node?.price?.amount || ''))
    .filter(n => !Number.isNaN(n) && n > 0);
  const minPrice = variantPrices.length ? Math.min(...variantPrices) : 0;
  
  // Рейтинг из metafields или дефолт 4.8
  const metafields = (product as any).metafields?.edges || [];
  const ratingMetafield = metafields.find((m: any) => m?.node?.key === 'rating' || m?.node?.key === 'рейтинг');
  const rating = ratingMetafield ? parseFloat(ratingMetafield.node?.value || '4.8') : 4.8;
  
  return (
    <Link 
      to={detailPath}
      className="flex flex-col items-center flex-shrink-0 w-[110px] group"
    >
      <div className="relative w-[100px] h-[100px] mb-2">
        <div 
          className="absolute inset-0 rounded-2xl bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div 
          className="absolute inset-0 rounded-2xl transition-opacity duration-300 group-hover:opacity-70"
          style={{ background: 'linear-gradient(180deg, rgba(0, 122, 255, 0.15) 0%, rgba(0, 122, 255, 0.35) 100%)' }}
        />
        <div 
          className="absolute -top-1 -right-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: 'rgba(255, 204, 0, 0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 8px rgba(255, 204, 0, 0.3)' }}
        >
          <Star className="w-2.5 h-2.5 fill-white text-white" />
          <span className="text-white">{rating.toFixed(1)}</span>
        </div>
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{ border: '2px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 16px rgba(0, 122, 255, 0.2)' }}
        />
      </div>
      <h3 
        className="text-[11px] font-semibold text-center leading-tight mb-1 line-clamp-2 px-1"
        style={{ fontFamily: "'SF Pro Text', -apple-system, system-ui, sans-serif", color: '#1C1C1E' }}
      >
        {product.title}
      </h3>
      <div 
        className="text-[13px] font-bold"
        style={{ fontFamily: "'SF Pro Display', -apple-system, system-ui, sans-serif", color: '#007AFF' }}
      >
        от ฿{minPrice.toLocaleString('ru-RU')}
      </div>
    </Link>
  );
};

