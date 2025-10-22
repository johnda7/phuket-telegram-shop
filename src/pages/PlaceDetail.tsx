import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, ArrowLeft, MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const PlaceDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        const data = await fetchProductByHandle(handle);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load place');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Place not found'}</p>
          <Link to="/insider">
            <Button>← Вернуться к Insider</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = product.node.images.edges[0]?.node;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link 
          to="/insider" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к Insider
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          {mainImage && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8 animate-scale-in">
              <img
                src={mainImage.url}
                alt={product.node.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="glass-card p-8 animate-fade-in">
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-4xl font-bold">{product.node.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-semibold">4.8</span>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Пхукет</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Лучшее время: Круглый год</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {product.node.description || "Описание скоро появится"}
              </p>
            </div>

            {/* Additional images gallery */}
            {product.node.images.edges.length > 1 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Фотогалерея</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.node.images.edges.slice(1).map((image, index) => (
                    <div 
                      key={index} 
                      className="aspect-square rounded-xl overflow-hidden"
                    >
                      <img
                        src={image.node.url}
                        alt={`${product.node.title} ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
