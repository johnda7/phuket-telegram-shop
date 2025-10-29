import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, TrendingUp } from "lucide-react";
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
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const tags = product.tags || [];
  const isHit = tags.includes('хит') || tags.includes('ХИТ') || tags.includes('популярное');
  const category = product.productType;

  return (
    <Link
      to={`${linkPrefix}/${product.handle}`}
      className="group block"
    >
      <div className="glass-card overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl border border-border/50 hover:border-primary/50 rounded-2xl bg-gradient-to-b from-background to-background/95">
        {/* Image - 16:9 aspect ratio */}
        <div className="aspect-video bg-secondary/20 overflow-hidden relative">
          {image ? (
            <>
              <img
                src={image.url}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                {isHit && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-3 py-1 text-xs shadow-lg animate-pulse">
                    🔥 ХИТ
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
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-primary/10 to-primary/5">
              🏝️
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
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {price.toFixed(0)} ฿
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    / чел
                  </span>
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 hover-scale"
                >
                  Подробнее →
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
