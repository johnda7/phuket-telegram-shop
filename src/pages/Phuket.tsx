import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, MapPin, Menu, Ship, Star, Clock, Compass, Search, SortAsc, Church, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { TourMenu } from "@/components/TourMenu";
import { Button } from "@/components/ui/button";

type Category = 'all' | 'islands' | 'oneday' | 'multiday' | 'popular' | 'adventures' | 'culture' | 'premium';

interface CategoryConfig {
  id: Category;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  color: string;
}

const categories: CategoryConfig[] = [
  { id: 'all', label: 'Все туры', Icon: Ship, tags: [], color: 'from-blue-500 to-cyan-500' },
  { id: 'islands', label: 'Острова', Icon: Ship, tags: ['islands', 'phi-phi', 'james-bond', 'similan', 'racha', 'coral'], color: 'from-emerald-500 to-teal-500' },
  { id: 'oneday', label: '1 день', Icon: Clock, tags: ['1-day', 'однодневные'], color: 'from-orange-500 to-amber-500' },
  { id: 'multiday', label: '2+ дня', Icon: Clock, tags: ['2-days', 'многодневные'], color: 'from-violet-500 to-purple-500' },
  { id: 'popular', label: 'Популярные', Icon: Star, tags: ['popular', 'популярное', 'хит', 'ХИТ'], color: 'from-red-500 to-pink-500' },
  { id: 'adventures', label: 'Приключения', Icon: Compass, tags: ['adventures', 'приключения', 'rafting', 'atv', 'zipline'], color: 'from-purple-500 to-indigo-500' },
  { id: 'culture', label: 'Культура', Icon: Church, tags: ['temples', 'храмы', 'culture', 'культура'], color: 'from-amber-500 to-orange-500' },
  { id: 'premium', label: 'Премиум', Icon: Sparkles, tags: ['premium', 'премиум', 'luxury'], color: 'from-pink-500 to-rose-500' },
];

const Phuket = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Синхронизация с URL
  const urlCategory = searchParams.get('category') as Category | null;
  const urlSearch = searchParams.get('search') || '';
  const [activeCategory, setActiveCategory] = useState<Category>(urlCategory || 'all');
  
  const [search, setSearch] = useState<string>(urlSearch);
  const [onlyOneDay, setOnlyOneDay] = useState<boolean>(false);
  const [onlyMultiDay, setOnlyMultiDay] = useState<boolean>(false);
  const [onlyPopular, setOnlyPopular] = useState<boolean>(false);
  const [onlyAdventures, setOnlyAdventures] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 20000 });
  const [priceDomain, setPriceDomain] = useState<{ min: number; max: number }>({ min: 0, max: 20000 });
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'alpha'>('popular');
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Обновляем категорию и поиск при изменении URL
  useEffect(() => {
    if (urlCategory && categories.find(c => c.id === urlCategory)) {
      setActiveCategory(urlCategory);
    }
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [urlCategory, urlSearch]);

  // Обновляем URL при изменении категории
  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Загружаем ТУРЫ...');
        const data = await fetchProducts(250);
        console.log('📦 Загружено продуктов:', data.length);
        
        // Фильтруем ТОЛЬКО ТУРЫ: поддерживаем EN и RU productType + тег `tour`
        const toursOnly = data.filter(p => {
          const type = (p.node.productType || '').toLowerCase();
          const hasTourTag = p.node.tags.includes('tour');
          return type === 'excursions' || type === 'экскурсии' || hasTourTag;
        });
        
        // Сортировка: популярные → остальные по алфавиту
        const isPopular = (tags: string[]) => tags.some(t => ['popular','популярное','хит','ХИТ'].includes(t));
        const sortedTours = toursOnly.sort((a, b) => {
          const aPop = isPopular(a.node.tags) ? 1 : 0;
          const bPop = isPopular(b.node.tags) ? 1 : 0;
          if (aPop !== bPop) return bPop - aPop;
          return a.node.title.localeCompare(b.node.title, 'ru');
        });
        
        console.log('🎟️ Найдено туров:', sortedTours.length);
        console.log('🎟️ Все продукты:', data.map(p => ({ title: p.node.title, type: p.node.productType, tags: p.node.tags })));
        console.log('🎟️ Туры (отсортированы):', sortedTours.map(p => ({ title: p.node.title, type: p.node.productType, tags: p.node.tags, isTemplate: p.node.tags.includes('template') })));
        setProducts(sortedTours);

        // Диапазон цен по фактическим данным (с запасом для дорогих туров)
        const prices = sortedTours
          .map(p => parseFloat(p.node.priceRange?.minVariantPrice?.amount || '0'))
          .filter(n => !Number.isNaN(n) && n > 0);
        if (prices.length) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          // Добавляем запас 30% для дорогих туров
          setPriceDomain({ min, max: Math.ceil(max * 1.3) });
          setPriceRange({ min, max: Math.ceil(max * 1.3) });
        }
        
        // Инициализация категории из URL уже выполнена выше
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
    const byCategory = (() => {
      if (activeCategory === 'all') return products;
      const category = categories.find(c => c.id === activeCategory);
      if (!category) return products;
      return products.filter(p => 
        category.tags.some(tag => p.node.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())))
      );
    })();

    const byQuick = byCategory.filter(p => {
      const tags = p.node.tags || [];
      if (onlyOneDay && !tags.some(t => ['1-day','однодневные'].includes(t))) return false;
      if (onlyMultiDay && !tags.some(t => ['2-days','многодневные'].includes(t))) return false;
      if (onlyPopular && !tags.some(t => ['popular','популярное','хит','ХИТ'].includes(t))) return false;
      if (onlyAdventures && !tags.some(t => ['adventures','приключения','rafting','atv','zipline'].includes(t))) return false;
      return true;
    });

    const bySearch = byQuick.filter(p => 
      p.node.title.toLowerCase().includes(search.trim().toLowerCase())
    );

    let byPrice = bySearch.filter(p => {
      const price = parseFloat(p.node.priceRange?.minVariantPrice?.amount || '0');
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Сортировка
    const getPrice = (p: ShopifyProduct) => parseFloat(p.node.priceRange?.minVariantPrice?.amount || '0');
    const isPop = (tags: string[]) => tags.some(t => ['popular','популярное','хит','ХИТ'].includes(t));
    byPrice = [...byPrice].sort((a, b) => {
      if (sortBy === 'popular') return Number(isPop(b.node.tags)) - Number(isPop(a.node.tags));
      if (sortBy === 'priceAsc') return getPrice(a) - getPrice(b);
      if (sortBy === 'priceDesc') return getPrice(b) - getPrice(a);
      return a.node.title.localeCompare(b.node.title, 'ru');
    });

    setFilteredProducts(byPrice);
  }, [activeCategory, products, search, onlyOneDay, onlyMultiDay, onlyPopular, onlyAdventures, priceRange.min, priceRange.max, sortBy]);

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
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Header with Menu (Telegram-friendly, compact) */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-start md:items-center justify-between gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-bold mb-1 leading-tight">Туры по Пхукету</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Лучшие экскурсии на Пхи‑Пхи, Джеймса Бонда, Симиланские острова и другие места. Бронирование в Telegram.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://t.me/PHUKETDABOT"
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex px-4 py-2 rounded-full bg-[#007AFF] text-white text-sm shadow hover:brightness-110"
              >
                Открыть в Telegram
              </a>
              <TourMenu 
                trigger={
                  <Button variant="outline" size="sm" className="gap-2 md:size-auto md:px-4 md:py-2">
                    <Menu className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden md:inline">Меню туров</span>
                    <span className="md:hidden">Меню</span>
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        {/* Why Us - Компактная горизонтальная строка (Perplexity: минимум, но эффективно) */}
        <div className="mb-3 hidden md:flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {[
            { title: 'Русскоязычные гиды', gradient: 'from-blue-600 to-cyan-500' },
            { title: 'Без скрытых платежей', gradient: 'from-emerald-600 to-teal-500' },
            { title: 'Быстрое бронирование', gradient: 'from-purple-600 to-pink-500' },
            { title: 'Поддержка 24/7', gradient: 'from-orange-600 to-red-500' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <span 
                className={`bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* ЕДИНЫЙ БЛОК: Категории + Поиск + Цена (ОПТИМИЗИРОВАНО - БЕЗ ДУБЛИРОВАНИЯ) */}
        <div className="mb-4">
          <div 
            className="overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            {/* Категории - Компактные */}
            <div className="px-3 py-2 border-b border-border/30">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {categories.filter(c => c.id !== 'all').map((category) => {
                  const isActive = activeCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`
                        flex-shrink-0 px-3 py-2 rounded-full font-semibold text-xs min-h-[44px]
                        transition-all duration-200 ease-out
                        ${isActive 
                          ? 'text-white shadow-md' 
                          : 'text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 active:scale-95'
                        }
                      `}
                      style={isActive ? {
                        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                        '--tw-gradient-from': `rgb(${category.color === 'from-blue-500 to-cyan-500' ? '59 130 246' : 
                                                  category.color === 'from-emerald-500 to-teal-500' ? '16 185 129' :
                                                  category.color === 'from-orange-500 to-amber-500' ? '249 115 22' :
                                                  category.color === 'from-violet-500 to-purple-500' ? '139 92 246' :
                                                  category.color === 'from-red-500 to-pink-500' ? '239 68 68' :
                                                  category.color === 'from-amber-500 to-orange-500' ? '245 158 11' :
                                                  category.color === 'from-pink-500 to-rose-500' ? '236 72 153' :
                                                  '168 85 247'})`,
                        '--tw-gradient-to': `rgb(${category.color === 'from-blue-500 to-cyan-500' ? '6 182 212' : 
                                                    category.color === 'from-emerald-500 to-teal-500' ? '20 184 166' :
                                                    category.color === 'from-orange-500 to-amber-500' ? '245 158 11' :
                                                    category.color === 'from-violet-500 to-purple-500' ? '168 85 247' :
                                                    category.color === 'from-red-500 to-pink-500' ? '236 72 153' :
                                                    category.color === 'from-amber-500 to-orange-500' ? '249 115 22' :
                                                    category.color === 'from-pink-500 to-rose-500' ? '244 63 94' :
                                                    '99 102 241'})`,
                      } as React.CSSProperties : undefined}
                    >
                      <category.Icon className="mr-1 w-3 h-3 inline" />
                      <span>{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Поиск + Цена - Компактно в одной строке */}
            <div className="px-3 py-2.5 flex gap-2">
              {/* Поиск */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full pl-8 pr-2.5 py-2.5 rounded-lg border border-gray-200 bg-white/90 text-sm min-h-[44px] focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF]"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}
                />
              </div>
              {/* Цена - Компактно */}
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(r => ({ ...r, min: Number(e.target.value) }))}
                  className="w-20 px-2 py-2.5 rounded-lg border border-gray-200 bg-white/90 text-sm min-h-[44px] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
                  placeholder="от"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}
                />
                <span className="text-gray-400 text-xs">—</span>
                <input
                  type="number"
                  min={0}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(r => ({ ...r, max: Number(e.target.value) }))}
                  className="w-20 px-2 py-2.5 rounded-lg border border-gray-200 bg-white/90 text-sm min-h-[44px] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
                  placeholder="до"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Сортировка + счётчик результатов - Компактно */}
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Найдено: <span className="font-semibold text-foreground">{filteredProducts.length}</span></div>
          <div className="flex items-center gap-1.5">
            <SortAsc className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-border/60 bg-background/80 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="popular">Популярные</option>
              <option value="priceAsc">Дешевле</option>
              <option value="priceDesc">Дороже</option>
              <option value="alpha">А-Я</option>
            </select>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 auto-rows-fr">
              {filteredProducts.slice(0, visibleCount).map((product) => {
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
        {/* Пагинация */}
        {filteredProducts.length > visibleCount && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount(c => c + 9)}
              className="px-5 py-3 rounded-full bg-secondary hover:bg-secondary/80 border border-border/60"
            >
              Показать ещё
            </button>
          </div>
        )}

        {/* SEO paragraph */}
        <div className="mt-10 text-sm text-muted-foreground max-w-3xl">
          Экскурсии по Пхукету: острова Пхи‑Пхи, Джеймс Бонд, Симиланские острова, рафтинг и приключения. 
          Бронируйте напрямую в Telegram — без скрытых платежей, с русскоязычными гидами и поддержкой 24/7.
        </div>
      </div>
    </div>
  );
};

export default Phuket;
