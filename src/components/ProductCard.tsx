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

  return (
    <Link
      to={`${linkPrefix}/${product.handle}`}
      className="group block"
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
          
          {/* Rating badge */}
          {showRating && (
            <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-xl border border-border/50 animate-fade-in">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-bold">4.8</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem] leading-tight">
            {product.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[4rem] leading-relaxed">
            {product.description || "Описание скоро появится"}
          </p>

          {/* Feature chips from tags */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {features.slice(0,4).map((f) => (
                <Badge key={f} variant="secondary" className="px-2 py-0.5 text-xs rounded-full">
                  {f}
                </Badge>
              ))}
            </div>
          )}

          {/* Tour Info */}
          <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium">2 дня</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium">до 30 чел</span>
            </div>
            {isHit && (
              <div className="flex items-center gap-1.5 ml-auto">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="font-bold text-red-500">Топ</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-5 border-t border-border/50">
            {showPrice ? (
              <>
                <div>
                  {hasPrice ? (
                    <>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        {price.toFixed(0)} ฿
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">/ чел</span>
                    </>
                  ) : (
                    <span className="text-base text-muted-foreground">Цена по запросу</span>
                  )}
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 hover-scale"
                >
                  Забронировать
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="lg"
                className="ml-auto text-primary hover:text-primary-glow font-semibold rounded-full px-6 hover:bg-primary/10 transition-all duration-300 hover-scale"
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
