import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
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

  return (
    <Link
      to={`${linkPrefix}/${product.handle}`}
      className="group block animate-fade-in"
    >
      <div className="glass-card overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
        {/* Image - 16:9 aspect ratio */}
        <div className="aspect-video bg-secondary/20 overflow-hidden relative">
          {image ? (
            <img
              src={image.url}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              🏝️
            </div>
          )}
          
          {/* Rating badge (for Insider) */}
          {showRating && (
            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-semibold">4.8</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {product.description || "Описание скоро появится"}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
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
                  className="bg-primary hover:bg-primary-glow text-primary-foreground"
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
