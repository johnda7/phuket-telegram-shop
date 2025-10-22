import { useEffect, useState } from "react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, Info } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

const Insider = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(50);
        // Фильтруем только товары с тегом "info"
        const insiderContent = data.filter(p => p.node.tags.includes('info'));
        setProducts(insiderContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
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
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📚 Phuket Insider</h1>
          <p className="text-muted-foreground">
            Информационный гид по Пхукету
          </p>
        </div>

        {/* Content Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Скоро здесь появится контент</h2>
            <p className="text-muted-foreground">
              Добавьте товары с тегом "info" в Shopify
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.node.id}
                product={product.node}
                showPrice={false}
                showRating={true}
                linkPrefix="/place"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insider;
