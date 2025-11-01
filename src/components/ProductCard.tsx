import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, TrendingUp, TreePalm, Flame, Percent } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct["node"];
  showPrice?: boolean;
  showRating?: boolean;
  linkPrefix?: string;
}

export const ProductCard = ({
  product,
  showPrice = true,
  showRating = false,
  linkPrefix = "/product",
}: ProductCardProps) => {
  const firstImageEdge = product.images?.edges?.find(e => e?.node?.url);
  const image = firstImageEdge?.node;
  // Fallback: пробуем достать первое изображение из descriptionHtml, если у продукта пустая галерея
  const descriptionHtml = (product as any).descriptionHtml as string | undefined;
  const extractedUrl = (!image && descriptionHtml)
    ? (descriptionHtml.match(/<img[^>]*src=["']([^"']+\.(?:webp|jpg|jpeg|png))/i)?.[1] || null)
    : null;
  const variantPrices = (product.variants?.edges || [])
    .map(e => parseFloat(e?.node?.price?.amount || ''))
    .filter(n => !Number.isNaN(n) && n > 0);
  const minVariant = variantPrices.length ? Math.min(...variantPrices) : undefined;
  const minPriceStr = product.priceRange?.minVariantPrice?.amount
    || (minVariant !== undefined ? String(minVariant) : '')
    || product.variants?.edges?.[0]?.node?.price?.amount
    || '0';
  const price = parseFloat(minPriceStr);
  const hasPrice = !Number.isNaN(price) && price > 0;
  const tags = product.tags || [];
  const isHit = tags.some(t => ['хит','ХИТ','популярное','popular'].includes(t));
  const isSale = tags.some(t => ['sale','скидка','discount'].includes(t));
  
  // Извлекаем цены для взрослых и детей из вариантов
  const variants = product.variants?.edges || [];
  const adultVariant = variants.find(v => 
    v?.node?.title?.toLowerCase().includes('взросл') || 
    v?.node?.title?.toLowerCase().includes('adult') ||
    !v?.node?.title?.toLowerCase().includes('дет')
  );
  const childVariant = variants.find(v => 
    v?.node?.title?.toLowerCase().includes('дет') || 
    v?.node?.title?.toLowerCase().includes('child')
  );
  const adultPrice = adultVariant ? parseFloat(adultVariant.node?.price?.amount || '0') : price;
  const childPrice = childVariant ? parseFloat(childVariant.node?.price?.amount || '0') : undefined;
  
  // Рейтинг из metafields или дефолт 4.8
  const metafields = (product as any).metafields?.edges || [];
  const ratingMetafield = metafields.find((m: any) => m?.node?.key === 'rating' || m?.node?.key === 'рейтинг');
  const rating = ratingMetafield ? parseFloat(ratingMetafield.node?.value || '4.8') : 4.8;
  
  const features: string[] = [];
  if (tags.some(t => ['islands','острова','phi-phi','similan','james-bond'].includes(t))) features.push('Острова');
  if (tags.some(t => ['snorkeling','снорклинг','diving'].includes(t))) features.push('Снорклинг');
  if (tags.some(t => ['adventures','приключения','atv','rafting'].includes(t))) features.push('Приключения');
  if (tags.some(t => ['1-day','однодневные','half-day'].includes(t))) features.push('1 день');
  if (tags.some(t => ['2-days','многодневные','multi-day'].includes(t))) features.push('2+ дня');
  const rawType = (product.productType || '').toLowerCase();
  const category = rawType === 'excursions' || rawType === 'экскурсии'
    ? 'Экскурсии'
    : rawType === 'information' || rawType === 'place'
      ? 'Место'
      : (product.productType || '');

  const handleCardClick = (e: React.MouseEvent) => {
    // Разрешаем клик по карточке для перехода на детальную страницу
    // но кнопка "Забронировать" будет перехватывать клик
  };

  return (
    <Link
      to={`${linkPrefix}/${product.handle}`}
      className="group block"
      onClick={handleCardClick}
    >
      <div className="glass-card overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 border border-border/40 hover:border-[#007AFF]/30 rounded-2xl bg-white/95 backdrop-blur-sm group">
        {/* Image - 16:9 aspect ratio */}
        <div className="aspect-video bg-secondary/20 overflow-hidden relative">
          {image || extractedUrl ? (
            <>
              <img
                src={image ? image.url : (extractedUrl as string)}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                {isHit && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-3 py-1 text-xs shadow-lg flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Популярно
                  </Badge>
                )}
                {isSale && (
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-3 py-1 text-xs shadow-lg flex items-center gap-1">
                    <Percent className="w-3 h-3" /> Акция
                  </Badge>
                )}
                {category && (
                  <Badge className="bg-background/90 backdrop-blur-sm text-foreground font-semibold px-3 py-1 text-xs shadow-lg border border-border/50">
                    {category}
                  </Badge>
                )}
              </div>
              
              {/* Hover Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-background/90 backdrop-blur-sm rounded-full p-4 scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <TreePalm className="w-12 h-12 text-primary" />
            </div>
          )}
          
          {/* Rating badge - как на phukeo.com (звезды + число) */}
          {showRating && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-full px-2.5 py-1.5 flex items-center gap-1.5 shadow-lg border border-white/50 z-20">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-3 h-3 ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700 ml-0.5">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content - Компактно iOS 26 */}
        <div className="p-4 md:p-5">
          <h3 className="text-base md:text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {product.title}
          </h3>
          
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
            {product.description || "Описание скоро появится"}
          </p>

          {/* Теги - как на phukeo.com (хэштеги стиль) */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {features.slice(0,3).map((f) => (
                <span key={f} className="text-[10px] text-muted-foreground font-medium">
                  #{f.toLowerCase().replace(/\s+/g, '-')}
                </span>
              ))}
            </div>
          )}

          {/* Tour Info - Динамические данные из тегов */}
          <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground bg-muted/20 rounded-lg p-2.5">
            {tags.some(t => ['2-days', 'многодневные', 'multi-day'].includes(t)) && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">2 дня</span>
              </div>
            )}
            {tags.some(t => ['1-day', 'однодневные', 'half-day'].includes(t)) && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">1 день</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">до 30 чел</span>
            </div>
            {isHit && (
              <div className="flex items-center gap-1.5 ml-auto">
                <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                <span className="font-bold text-red-500">Топ</span>
              </div>
            )}
          </div>

          {/* Footer - как на phukeo.com (цена + 2 кнопки) */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-border/50">
            {showPrice ? (
              <>
                {/* Цена - как на phukeo.com: "от XXXX ฿ / чел" + "Дети: XXXX" */}
                <div className="flex flex-col gap-1">
                  {hasPrice ? (
                    <>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl md:text-2xl font-bold text-gray-900">
                          от {adultPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ฿
                        </span>
                        <span className="text-xs text-muted-foreground">/ чел</span>
                      </div>
                      {childPrice && childPrice !== adultPrice && (
                        <div className="text-xs text-muted-foreground">
                          Дети: {childPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ฿
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Цена по запросу</span>
                  )}
                </div>
                
                {/* Две кнопки как на phukeo.com: "Подробнее" + "Забронировать" */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `${linkPrefix}/${product.handle}`;
                    }}
                    className="flex-1 text-xs border border-border hover:bg-secondary"
                  >
                    📖 Подробнее
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open('https://t.me/PHUKETDABOT', '_blank');
                    }}
                    className="flex-1 bg-[#007AFF] hover:bg-[#0051D5] text-white text-xs min-h-[44px] font-semibold"
                  >
                    🏝️ Забронировать
                  </Button>
                </div>
              </>
            ) : (
              <Button
                variant="ghost"
                size="lg"
                className="w-full text-primary hover:text-primary/80 font-semibold rounded-xl hover:bg-primary/10 transition-all duration-200 min-h-[44px]"
              >
                Читать →
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
