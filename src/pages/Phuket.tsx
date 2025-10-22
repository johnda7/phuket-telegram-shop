import { useEffect, useState } from "react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, MapPin } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

type Category = 'all' | 'tour' | 'beach' | 'temple' | 'restaurant' | 'district';

interface CategoryConfig {
  id: Category;
  label: string;
  emoji: string;
  tags: string[];
}

const categories: CategoryConfig[] = [
  { id: 'all', label: 'Всё', emoji: '🗺️', tags: [] },
  { id: 'tour', label: 'Туры', emoji: '🎟️', tags: ['tour'] },
  { id: 'beach', label: 'Пляжи', emoji: '🏖️', tags: ['beach'] },
  { id: 'temple', label: 'Храмы', emoji: '🛕', tags: ['temple'] },
  { id: 'restaurant', label: 'Рестораны', emoji: '🍜', tags: ['restaurant'] },
  { id: 'district', label: 'Районы', emoji: '🏘️', tags: ['district'] },
];

const Phuket = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(50);
        setProducts(data);
        
        // Check URL params for initial category
        const params = new URLSearchParams(window.location.search);
        const urlCategory = params.get('category') as Category | null;
        if (urlCategory && categories.find(c => c.id === urlCategory)) {
          setActiveCategory(urlCategory);
        } else {
          setFilteredProducts(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(products);
    } else {
      const category = categories.find(c => c.id === activeCategory);
      if (category) {
        const filtered = products.filter(p => 
          category.tags.some(tag => p.node.tags.includes(tag))
        );
        setFilteredProducts(filtered);
      }
    }
  }, [activeCategory, products]);

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🗺️ Всё о Пхукете</h1>
          <p className="text-muted-foreground">
            Туры, пляжи, храмы и полезная информация в одном месте
          </p>
        </div>

        {/* Featured Banner - Beaches */}
        <a 
          href="/beaches"
          className="block mb-8 group"
        >
          <div className="glass-card overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="relative h-48 bg-gradient-to-r from-primary/20 to-success/20 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold mb-2">🏖️ Пляжи Пхукета</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Откройте для себя лучшие пляжи острова
                </p>
                <Button size="lg" className="bg-[#4CAF50] hover:bg-[#4CAF50]/90">
                  Смотреть все пляжи →
                </Button>
              </div>
            </div>
          </div>
        </a>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="whitespace-nowrap"
              >
                <span className="mr-2">{category.emoji}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Пока нет контента</h2>
            <p className="text-muted-foreground">
              Добавьте товары с соответствующими тегами в Shopify
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isTour = product.node.tags.includes('tour');
              return (
                <ProductCard
                  key={product.node.id}
                  product={product.node}
                  showPrice={isTour}
                  showRating={!isTour}
                  linkPrefix={isTour ? "/product" : "/place"}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Phuket;
