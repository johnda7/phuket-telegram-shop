import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Tag } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

interface PlaceCardProps {
  product: ShopifyProduct["node"];
}

export const PlaceCard = ({ product }: PlaceCardProps) => {
  const image = product.images.edges[0]?.node;
  const tags = product.tags || [];
  
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
    tag !== 'place'
  ).slice(0, 3);

  // Mock rating (в будущем из metafields)
  const rating = 4.5;

  return (
    <Link
      to={`/place/${product.handle}`}
      className="group block h-full"
    >
      <div className="glass-card overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-border/50 hover:border-primary/30 rounded-2xl h-full flex flex-col">
        {/* Image - 4:3 aspect ratio */}
        <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden relative">
          {image ? (
            <>
              <img
                src={image.url}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Rating badge - top right */}
              <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg border border-border/30">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-bold">{rating}</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🏢
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {product.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {product.description || "Популярное место на Пхукете"}
          </p>

          {/* Footer - District & Tags */}
          <div className="space-y-2">
            {/* District */}
            {district && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">{district}</span>
              </div>
            )}

            {/* Category tags */}
            {categoryTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {categoryTags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
