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
  color: string;
}

const categories: CategoryConfig[] = [
  { id: 'all', label: 'Всё', emoji: '🗺️', tags: [], color: 'from-blue-500 to-cyan-500' },
  { id: 'tour', label: 'Туры', emoji: '🎟️', tags: ['islands', 'popular', '1-day', '2-days'], color: 'from-emerald-500 to-teal-500' },
  { id: 'beach', label: 'Пляжі', emoji: '🏖️', tags: ['beach', 'пляж'], color: 'from-orange-500 to-amber-500' },
  { id: 'temple', label: 'Места', emoji: '📍', tags: ['place', 'category:viewpoints', 'category:elephants', 'category:waterfalls', 'category:restaurants', 'category:spa'], color: 'from-violet-500 to-purple-500' },
  { id: 'restaurant', label: 'Рестораны', emoji: '🍜', tags: ['category:restaurants'], color: 'from-red-500 to-pink-500' },
  { id: 'district', label: 'Районы', emoji: '🏘️', tags: ['district'], color: 'from-purple-500 to-indigo-500' },
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

        {/* iOS 26 Style Category Filter */}
        <div className="mb-8 -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-3 pb-3">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    relative flex-shrink-0 px-6 py-3 rounded-full font-semibold text-sm
                    transition-all duration-300 ease-out
                    ${isActive 
                      ? 'text-white shadow-xl scale-110' 
                      : 'text-foreground bg-secondary/50 hover:bg-secondary/80 hover:scale-105'
                    }
                  `}
                  style={isActive ? {
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    '--tw-gradient-from': `rgb(${category.color === 'from-blue-500 to-cyan-500' ? '59 130 246' : 
                                                  category.color === 'from-emerald-500 to-teal-500' ? '16 185 129' :
                                                  category.color === 'from-orange-500 to-amber-500' ? '249 115 22' :
                                                  category.color === 'from-violet-500 to-purple-500' ? '139 92 246' :
                                                  category.color === 'from-red-500 to-pink-500' ? '239 68 68' :
                                                  '168 85 247'})`,
                    '--tw-gradient-to': `rgb(${category.color === 'from-blue-500 to-cyan-500' ? '6 182 212' : 
                                                category.color === 'from-emerald-500 to-teal-500' ? '20 184 166' :
                                                category.color === 'from-orange-500 to-amber-500' ? '245 158 11' :
                                                category.color === 'from-violet-500 to-purple-500' ? '168 85 247' :
                                                category.color === 'from-red-500 to-pink-500' ? '236 72 153' :
                                                '99 102 241'})`,
                  } as React.CSSProperties : undefined}
                >
                  <span className="mr-2 text-lg">{category.emoji}</span>
                  {category.label}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                  )}
                </button>
              );
            })}
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
              const isTour = product.node.productType === 'Экскурсии' || 
                             product.node.tags.some(tag => ['islands', 'popular', '1-day', '2-days'].includes(tag));
              const isBeach = product.node.tags.some(tag => ['beach', 'пляж'].includes(tag));
              
              return (
                <ProductCard
                  key={product.node.id}
                  product={product.node}
                  showPrice={isTour}
                  showRating={isBeach}
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
