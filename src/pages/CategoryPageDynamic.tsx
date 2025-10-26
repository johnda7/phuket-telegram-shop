// ВАЖНО: Этот проект работает только в режиме live coding (вайбкодинг)!
// Агент всегда сам ищет и устраняет ошибки, не спрашивает пользователя о деталях, не просит скриншоты и логи — только самодиагностика и автофиксы.
// Любые баги, белый экран, ошибки — агент обязан сам локализовать и исправить, не перекладывая ответственность на пользователя.
// Вся разработка — исключительно через vibe/live coding, без ручных инструкций от пользователя.
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { fetchProductsByCategory, type ShopifyProduct } from "@/lib/shopify";
import DaBot from "@/components/DaBot";

interface CategoryConfig {
  title: string;
  description: string;
  heroImage: string;
  breadcrumbs: Array<{ label: string; path?: string }>;
}

const categoryConfigs: Record<string, CategoryConfig> = {
  shopping: {
    title: "Торговые центры на Пхукете",
    heroImage: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1600&h=400&fit=crop",
    description: "Торговые центры на Пхукете представляют собой уникальное сочетание традиционного тайского колорита и современных мировых брендов. Здесь можно найти всё: от модных бутиков и экзотических сувениров до ресторанов с разнообразной кухней и развлекательных зон для всей семьи. Торговый центр на Пхукете — это не просто место для покупок, но и отличный способ провести время в комфортной обстановке, наслаждаясь атмосферой тропического острова. Большие торговые центры с брендами на Пхукете предлагают широкий выбор магазинов и развлечений для всех возрастов.",
    breadcrumbs: [
      { label: "Главная", path: "/" },
      { label: "Что посетить?", path: "/categories" },
      { label: "Полезное", path: "/categories" },
      { label: "Сувениры и шопинг", path: "/categories" },
      { label: "Торговые центры на Пхукете" }
    ]
  }
};

const CategoryPageDynamic = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "open">("all");
  
  const config = categoryId ? categoryConfigs[categoryId] : null;

  useEffect(() => {
    const loadProducts = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        const data = await fetchProductsByCategory(categoryId);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Категория не найдена</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-24">
        {/* ДА БОТ - AI консьерж доступен везде! */}
        <DaBot />
        {/* Hero Image */}
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            src={config.heroImage}
            alt={config.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
          <h1 className="absolute bottom-8 left-1/2 -translate-x-1/2 text-4xl md:text-5xl font-bold text-white text-center whitespace-nowrap">
            {config.title}
          </h1>
        </div>
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm py-6 flex-wrap">
            {config.breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {item.path ? (
                  <Link to={item.path} className="text-muted-foreground hover:text-primary">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium">{item.label}</span>
                )}
                {index < config.breadcrumbs.length - 1 && (
                  <span className="text-muted-foreground">•</span>
                )}
              </div>
            ))}
          </nav>
          {/* Description */}
          <div className="mb-8 max-w-5xl">
            <p className="text-base leading-relaxed text-muted-foreground">
              {config.description}
            </p>
          </div>
          {/* Filters & Map Button */}
          <div className="mb-8">
            {/* Filter Buttons Row */}
            <div className="flex flex-wrap gap-3 mb-4">
              {/* All/Open Filter - iOS Style */}
              <div className="inline-flex gap-1 bg-secondary/50 rounded-full p-1 shadow-sm">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeFilter === "all"
                      ? "bg-white text-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => setActiveFilter("open")}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeFilter === "open"
                      ? "bg-white text-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Открытые
                </button>
              </div>
              {/* Category Dropdown - iOS Style */}
              <select className="px-5 py-2.5 rounded-full border-2 border-border bg-white text-sm font-medium hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
                <option>Категория: Торговые центры</option>
                <option>Категория: Все места</option>
              </select>
              {/* District Dropdown - iOS Style */}
              <select className="px-5 py-2.5 rounded-full border-2 border-border bg-white text-sm font-medium hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
                <option>Район: Все</option>
                <option>Район: Патонг</option>
                <option>Район: Пхукет Таун</option>
                <option>Район: Чалонг</option>
                <option>Район: Банг Тао</option>
              </select>
            </div>
            {/* Map Preview Card - Interactive */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border-2 border-blue-200/50 hover:border-blue-300 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 mb-1 flex items-center gap-2">
                    🗺️ Смотреть на карте
                    <span className="text-sm font-normal text-blue-600">({products.length} мест)</span>
                  </h3>
                  <p className="text-sm text-blue-700">
                    Посмотрите расположение всех торговых центров на интерактивной карте
                  </p>
                </div>
                <Button 
                  size="lg"
                  className="bg-[#007AFF] hover:bg-[#0063cc] text-white font-semibold px-8 shadow-lg"
                  style={{ boxShadow: '0 2px 8px #007AFF33' }}
                >
                  ПОКАЗАТЬ НА КАРТЕ
                </Button>
              </div>
            </div>
          </div>
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {products.map((product) => {
              const image = product.node.images.edges[0]?.node.url || "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600";
              // Extract district from tags (district:xxx)
              const districtTag = product.node.tags.find((tag: string) => tag.startsWith('district:'));
              const district = districtTag ? districtTag.replace('district:', '').split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';
              // Mock rating (в будущем из metafields)
              const rating = 4.5;
              return (
                <Link
                  key={product.node.id}
                  to={`/place/${product.node.handle}`}
                  className="group block overflow-hidden rounded-xl bg-card shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={image}
                      alt={product.node.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Blue Arrow Button */}
                    <div className="absolute bottom-4 right-4 bg-[#007AFF] text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-tight">
                      {product.node.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                      {product.node.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Места скоро появятся
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CategoryPageDynamic;
