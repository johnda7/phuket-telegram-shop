import { useEffect, useState } from "react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Tours = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(20);
        // Фильтруем только товары с тегом "tour"
        const tours = data.filter(p => p.node.tags.includes('tour'));
        setProducts(tours);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tours');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
            ← Назад
          </Link>
          <h1 className="text-4xl font-bold mb-4">🎟️ Туры по Пхукету</h1>
          <p className="text-muted-foreground">
            Экскурсии с ценами и онлайн бронированием через Telegram
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Пока нет туров</h2>
            <p className="text-muted-foreground">
              Скажите мне какой тур создать (название, описание, цена)
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link 
                key={product.node.id} 
                to={`/product/${product.node.handle}`}
                className="group"
              >
                <div 
                  className="rounded-2xl overflow-hidden transition-all hover:scale-105"
                  style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: 'var(--glass-shadow), inset 0 1px 0 var(--glass-border)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  {/* Image */}
                  <div className="aspect-video bg-secondary/20 overflow-hidden">
                    {product.node.images.edges[0]?.node && (
                      <img
                        src={product.node.images.edges[0].node.url}
                        alt={product.node.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {product.node.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {product.node.description}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          ${parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          / чел
                        </span>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary-glow">
                        Подробнее →
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;
