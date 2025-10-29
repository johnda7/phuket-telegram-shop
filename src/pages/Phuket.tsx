import { useEffect, useState } from "react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, MapPin, Menu } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { TourMenu } from "@/components/TourMenu";
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
  { id: 'all', label: 'Все туры', emoji: '🎟️', tags: [], color: 'from-blue-500 to-cyan-500' },
  { id: 'tour', label: 'Острова', emoji: '🏝️', tags: ['islands', 'phi-phi', 'james-bond'], color: 'from-emerald-500 to-teal-500' },
  { id: 'beach', label: '1 день', emoji: '☀️', tags: ['1-day', 'однодневные'], color: 'from-orange-500 to-amber-500' },
  { id: 'temple', label: '2+ дня', emoji: '🌙', tags: ['2-days', 'многодневные'], color: 'from-violet-500 to-purple-500' },
  { id: 'restaurant', label: 'Популярные', emoji: '⭐', tags: ['популярное', 'хит', 'ХИТ'], color: 'from-red-500 to-pink-500' },
  { id: 'district', label: 'Приключения', emoji: '🎯', tags: ['adventures', 'приключения'], color: 'from-purple-500 to-indigo-500' },
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
        console.log('🔄 Загружаем ТУРЫ...');
        const data = await fetchProducts(100);
        console.log('📦 Загружено продуктов:', data.length);
        
        // Filter ONLY tours (Excursions or with 'tour' tag)
        const toursOnly = data.filter(p => 
          p.node.productType === 'Excursions' || p.node.tags.includes('tour')
        );
        
        // Sort tours: template first, then by publishedAt
        const sortedTours = toursOnly.sort((a, b) => {
          const aIsTemplate = a.node.tags.includes('template');
          const bIsTemplate = b.node.tags.includes('template');
          
          if (aIsTemplate && !bIsTemplate) return -1;
          if (!aIsTemplate && bIsTemplate) return 1;
          
          // If both or neither are template, sort by publishedAt
          return new Date(b.node.publishedAt).getTime() - new Date(a.node.publishedAt).getTime();
        });
        
        console.log('🎟️ Найдено туров:', sortedTours.length);
        console.log('🎟️ Все продукты:', data.map(p => ({ title: p.node.title, type: p.node.productType, tags: p.node.tags })));
        console.log('🎟️ Туры (отсортированы):', sortedTours.map(p => ({ title: p.node.title, type: p.node.productType, tags: p.node.tags, isTemplate: p.node.tags.includes('template') })));
        setProducts(sortedTours);
        
        // Check URL params for initial category
        const params = new URLSearchParams(window.location.search);
        const urlCategory = params.get('category') as Category | null;
        if (urlCategory && categories.find(c => c.id === urlCategory)) {
          setActiveCategory(urlCategory);
        } else {
          setFilteredProducts(toursOnly);
        }
      } catch (err) {
        console.error('❌ Ошибка загрузки:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    console.log('🔄 Фильтрация туров...', { activeCategory, productsCount: products.length });
    if (activeCategory === 'all') {
      console.log('📦 Показываем все туры:', products.length);
      setFilteredProducts(products);
    } else {
      const category = categories.find(c => c.id === activeCategory);
      if (category) {
        console.log('🏷️ Фильтруем по категории:', category.label, 'теги:', category.tags);
        const filtered = products.filter(p => 
          category.tags.some(tag => 
            p.node.tags.some(productTag => 
              productTag.toLowerCase().includes(tag.toLowerCase())
            )
          )
        );
        console.log('📦 Отфильтровано туров:', filtered.length);
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
      {/* SEO Meta Tags */}
      <head>
        <title>🎟️ Туры по Пхукету - Лучшие экскурсии и острова | PhuketDa</title>
        <meta name="description" content="Лучшие туры по Пхукету: Пхи-Пхи, Джеймс Бонд, Симиланские острова. Морские экскурсии, приключения, многодневные туры. Бронирование онлайн." />
        <meta name="keywords" content="туры Пхукет, экскурсии Пхукет, Пхи-Пхи, Джеймс Бонд, Симиланские острова, морские туры, приключения" />
        <link rel="canonical" href="https://phuketda.com/tours" />
      </head>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header with Menu */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎟️ Туры по Пхукету</h1>
              <p className="text-muted-foreground">
                Лучшие экскурсии и туры на острова Пхи-Пхи, Джеймс Бонд и другие достопримечательности
              </p>
            </div>
            <TourMenu 
              trigger={
                <Button variant="outline" size="lg" className="gap-2">
                  <Menu className="w-5 h-5" />
                  Меню туров
                </Button>
              }
            />
          </div>
        </div>

        {/* Featured Banner - Popular Tours */}
        <div className="mb-8">
          <div className="glass-card overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200')] bg-cover bg-center opacity-20" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold mb-2">🏝️ Популярные туры</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Пхи-Пхи, Джеймс Бонд, Симиланские острова и многое другое
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#007AFF] text-white rounded-full">
                  <MapPin className="w-4 h-4" />
                  <span>Выберите тур</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
        {(() => {
          console.log('🎨 Рендеринг продуктов:', { filteredProductsCount: filteredProducts.length, loading, error });
          return filteredProducts.length === 0 ? (
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
                const isTour = product.node.productType === 'Excursions' || 
                               product.node.tags.some(tag => ['islands', 'popular', '1-day', '2-days', 'tour'].includes(tag));
                const isBeach = product.node.tags.some(tag => ['beach', 'пляж'].includes(tag));
                
                console.log('🎯 Продукт:', { title: product.node.title, type: product.node.productType, isTour, isBeach });
                
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
          );
        })()}
      </div>
    </div>
  );
};

export default Phuket;
