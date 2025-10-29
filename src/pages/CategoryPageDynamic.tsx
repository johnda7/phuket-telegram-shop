// ВАЖНО: Этот проект работает только в режиме live coding (вайбкодинг)!
// Агент всегда сам ищет и устраняет ошибки, не спрашивает пользователя о деталях, не просит скриншоты и логи — только самодиагностика и автофиксы.
// Любые баги, белый экран, ошибки — агент обязан сам локализовать и исправить, не перекладывая ответственность на пользователя.
// Вся разработка — исключительно через vibe/live coding, без ручных инструкций от пользователя.
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { fetchProductsByCategory, type ShopifyProduct } from "@/lib/shopify";
import DaBot from "@/components/DaBot";
import { PlaceCard } from "@/components/PlaceCard";
import { ShoppingMap } from "@/components/ShoppingMap";

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
    description: "🛍️ **Торговые центры Пхукета** — это уникальное сочетание традиционного тайского колорита и современных мировых брендов. Здесь можно найти всё: от модных бутиков и экзотических сувениров до ресторанов с разнообразной кухней и развлекательных зон для всей семьи.\n\n**🔥 ТОП торговых центров:**\n• **Central Phuket** — самый большой ТЦ с люксовыми бутиками\n• **Jungceylon** — в сердце Патонга, рядом с пляжем\n• **Premium Outlet** — скидки до 70% на бренды\n• **Big C & Tesco Lotus** — супермаркеты для повседневных покупок\n\n**💡 Советы:**\n• Лучшее время для шоппинга — день (кондиционеры)\n• В аутлетах скидки круглый год\n• В супермаркетах можно купить тайские продукты\n• В торговых центрах есть фуд-корты и развлечения",
    breadcrumbs: [
      { label: "Главная", path: "/" },
      { label: "Что посетить?", path: "/categories" },
      { label: "Полезное", path: "/categories" },
      { label: "Сувениры и шопинг", path: "/categories" },
      { label: "Торговые центры на Пхукете" }
    ]
  },
  viewpoints: {
    title: "Смотровые площадки на Пхукете",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=400&fit=crop",
    description: "🌅 **Смотровые площадки Пхукета** — места, где открываются невероятные виды на остров с протяженными песчаными пляжами и зелеными джунглями. На высоких точках встречают самые эффектные закаты и рассветы. На некоторых смотровых можно даже встретить диких животных.\n\n**🔥 ТОП смотровых площадок:**\n• **Мыс Промтеп** — легендарные закаты над Андаманским морем\n• **Карон Вьюпоинт** — три пляжа одновременно в одном кадре\n• **Самет Нангше** — виды как в фильме \"Аватар\"\n• **Као Ранг** — панорама всего Пхукет Тауна\n\n**💡 Советы:**\n• Приезжайте за 30 минут до заката на западные смотровые\n• На рассвет едьте на восточные площадки (Ао Пор, Самет Нангше)\n• Берите воду и закуски — на высоте может не быть магазинов\n• Большинство смотровых бесплатные!\n• Будьте аккуратны на крутых дорогах",
    breadcrumbs: [
      { label: "Главная", path: "/" },
      { label: "Что посетить?", path: "/categories" },
      { label: "Достопримечательности", path: "/categories" },
      { label: "Смотровые площадки на Пхукете" }
    ]
  }
};

const CategoryPageDynamic = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "open">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [showMap, setShowMap] = useState(false);
  
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

  // Функция для подсчета продуктов по категориям
  const getCategoryCount = (category: string) => {
    return products.filter(product => {
      const productTags = product.node.tags || [];
      return productTags.some(tag => 
        tag === category || 
        tag === `category:${category}` ||
        (category === "mall" && (tag === "mall" || tag === "shopping")) ||
        (category === "supermarket" && tag === "supermarket") ||
        (category === "outlet" && tag === "outlet") ||
        (category === "luxury" && tag === "luxury") ||
        (category === "market" && tag === "market")
      );
    }).length;
  };

  // Функция для подсчета продуктов по районам
  const getDistrictCount = (district: string) => {
    return products.filter(product => {
      const productTags = product.node.tags || [];
      return productTags.some(tag => 
        tag === `district:${district}` ||
        tag === district ||
        (district === "phuket-town" && tag === "district:PhuketTown") ||
        (district === "bang-tao" && tag === "district:BangTao") ||
        (district === "thalang" && tag === "district:Thalang")
      );
    }).length;
  };

  // Фильтрация продуктов по выбранным фильтрам
  const filteredProducts = products.filter(product => {
    const productTags = product.node.tags || [];
    
    // Фильтр по категории
    if (selectedCategory !== "all") {
      const hasCategory = productTags.some(tag => 
        tag === selectedCategory || 
        tag === `category:${selectedCategory}` ||
        (selectedCategory === "mall" && (tag === "mall" || tag === "shopping")) ||
        (selectedCategory === "supermarket" && tag === "supermarket") ||
        (selectedCategory === "outlet" && tag === "outlet") ||
        (selectedCategory === "luxury" && tag === "luxury") ||
        (selectedCategory === "market" && tag === "market")
      );
      if (!hasCategory) return false;
    }
    
    // Фильтр по району
    if (selectedDistrict !== "all") {
      const hasDistrict = productTags.some(tag => 
        tag === `district:${selectedDistrict}` ||
        tag === selectedDistrict ||
        (selectedDistrict === "phuket-town" && tag === "district:PhuketTown") ||
        (selectedDistrict === "bang-tao" && tag === "district:BangTao") ||
        (selectedDistrict === "thalang" && tag === "district:Thalang")
      );
      if (!hasDistrict) return false;
    }
    
    return true;
  });

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
      <div className="min-h-screen pb-24">
        {/* ДА БОТ - AI консьерж доступен везде! */}
        <DaBot />
        
        {/* Hero - Telegram WebApp Style с Glassmorphism */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
          
          {/* Glassmorphism overlay */}
          <div className="relative backdrop-blur-md bg-white/10 border-b border-white/20">
            <div className="container mx-auto px-4 py-8">
              {/* Breadcrumbs - Компактные */}
              <nav className="flex items-center gap-1.5 text-xs mb-4 text-white/80">
                <Link to="/" className="hover:text-white transition-colors">Главная</Link>
                <span>•</span>
                <span className="text-white font-medium">{categoryId === 'shopping' ? 'Торговые центры' : config.title}</span>
              </nav>
              
              {/* Title - Компактный */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 flex items-center gap-2">
                {categoryId === 'shopping' ? '🛍️' : '🌅'} {config.title}
              </h1>
              
              {/* Stats - Telegram Style */}
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-300">📍</span>
                  <span className="font-medium">{products.length} мест</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-300">⭐</span>
                  <span className="font-medium">от 4.2 до 4.7</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Description - Компактная карточка */}
          <div className="mb-6 bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <p className="text-sm text-gray-700 leading-relaxed">
              {categoryId === 'shopping' 
                ? '🛍️ Торговые центры Пхукета — современные ТРЦ с мировыми брендами, ресторанами и развлечениями. Идеально для шопинга в комфортных условиях с кондиционерами.'
                : config.description.split('\n')[0]
              }
            </p>
          </div>

          {/* Filters - Telegram Style Chips */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {/* Район фильтры как chips */}
              <button
                onClick={() => setSelectedDistrict("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDistrict === "all"
                    ? "bg-[#007AFF] text-white shadow-md"
                    : "bg-white/70 backdrop-blur-md text-gray-700 border border-gray-200 hover:border-[#007AFF]/50"
                }`}
              >
                Все районы
              </button>
              <button
                onClick={() => setSelectedDistrict("patong")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDistrict === "patong"
                    ? "bg-[#007AFF] text-white shadow-md"
                    : "bg-white/70 backdrop-blur-md text-gray-700 border border-gray-200 hover:border-[#007AFF]/50"
                }`}
              >
                📍 Патонг
              </button>
              <button
                onClick={() => setSelectedDistrict("karon")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDistrict === "karon"
                    ? "bg-[#007AFF] text-white shadow-md"
                    : "bg-white/70 backdrop-blur-md text-gray-700 border border-gray-200 hover:border-[#007AFF]/50"
                }`}
              >
                📍 Карон
              </button>
              <button
                onClick={() => setSelectedDistrict("chalong")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDistrict === "chalong"
                    ? "bg-[#007AFF] text-white shadow-md"
                    : "bg-white/70 backdrop-blur-md text-gray-700 border border-gray-200 hover:border-[#007AFF]/50"
                }`}
              >
                📍 Чалонг
              </button>
              <button
                onClick={() => setSelectedDistrict("thalang")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDistrict === "thalang"
                    ? "bg-[#007AFF] text-white shadow-md"
                    : "bg-white/70 backdrop-blur-md text-gray-700 border border-gray-200 hover:border-[#007AFF]/50"
                }`}
              >
                📍 Тхаланг
              </button>
            </div>
          </div>

          {/* Map Card - Компактная */}
          <div 
            onClick={() => setShowMap(true)}
            className="mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  🗺️
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-0.5">
                    Карта мест
                  </h3>
                  <p className="text-white/80 text-xs">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'место' : 'мест'}
                  </p>
                </div>
              </div>
              <div className="text-white text-xl group-hover:scale-110 transition-transform">
                →
              </div>
            </div>
          </div>

          {/* Products Grid - Компактная сетка */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
            {filteredProducts.map((product) => (
              <PlaceCard key={product.node.id} product={product.node} />
            ))}
          </div>
          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted/20 rounded-full flex items-center justify-center">
                <span className="text-4xl">{categoryId === 'viewpoints' ? '🌅' : '🛍️'}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {selectedCategory !== "all" || selectedDistrict !== "all" 
                  ? "Ничего не найдено" 
                  : "Места скоро появятся"
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {selectedCategory !== "all" || selectedDistrict !== "all"
                  ? "Попробуйте изменить фильтры или сбросить их"
                  : "Мы работаем над добавлением новых торговых центров"
                }
              </p>
              {(selectedCategory !== "all" || selectedDistrict !== "all") && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedDistrict("all");
                  }}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  🔄 Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shopping Map Modal */}
      {showMap && (
        <ShoppingMap 
          products={filteredProducts} 
          onClose={() => setShowMap(false)} 
        />
      )}
    </>
  );
}

export default CategoryPageDynamic;
