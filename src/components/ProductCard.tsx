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
      className="group block animate-fade-in"
    >
      <div className="glass-card overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        {/* Image - 16:9 aspect ratio */}
        <div className="aspect-video bg-secondary/20 overflow-hidden relative">
          {image ? (
            <>
              <img
                src={image.url}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2 z-10">
                {isHit && (
                  <Badge className="bg-destructive text-destructive-foreground font-bold px-2.5 py-0.5 text-xs">
                    ХИТ
                  </Badge>
                )}
                {category && (
                  <Badge className="bg-success text-success-foreground font-bold px-2.5 py-0.5 text-xs">
                    {category}
                  </Badge>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              🏝️
            </div>
          )}
          
          {/* Rating badge */}
          {showRating && (
            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="text-sm font-semibold">4.8</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
            {product.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
            {product.description || "Описание скоро появится"}
          </p>

          {/* Tour Info */}
          <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>2 дня</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>до 30 чел</span>
            </div>
            {isHit && (
              <div className="flex items-center gap-1 text-primary">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="font-semibold">Популярно</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {showPrice ? (
              <>
                <div>
                  <span className="text-2xl font-bold text-primary">
                    ${price.toFixed(0)}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    / чел
                  </span>
                </div>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-md"
                >
                  Подробнее →
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-primary hover:text-primary-glow"
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
