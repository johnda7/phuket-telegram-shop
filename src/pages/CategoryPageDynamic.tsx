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
            <div className="text-base leading-relaxed text-muted-foreground">
              {config.description && config.description.split('\n').map((line, index) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-lg font-bold text-foreground mb-3 mt-6">
                      {line.replace(/\*\*/g, '')}
                    </h3>
                  );
                } else if (line.startsWith('•')) {
                  return (
                    <p key={index} className="ml-4 mb-2">
                      <span className="text-primary">•</span> {line.substring(1).trim()}
                    </p>
                  );
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else {
                  return (
                    <p key={index} className="mb-3">
                      {line}
                    </p>
                  );
                }
              })}
            </div>
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
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-5 py-2.5 rounded-full border-2 border-border bg-white text-sm font-medium hover:border-primary/50 transition-colors cursor-pointer shadow-sm"
              >
                {categoryId === 'shopping' && (
                  <>
                    <option value="all">Категория: Все места ({products.length})</option>
                    <option value="mall">Категория: Торговые центры ({getCategoryCount("mall")})</option>
                    <option value="supermarket">Категория: Супермаркеты ({getCategoryCount("supermarket")})</option>
                    <option value="outlet">Категория: Аутлеты ({getCategoryCount("outlet")})</option>
                    <option value="luxury">Категория: Люксовые бутики ({getCategoryCount("luxury")})</option>
                    <option value="market">Категория: Рынки ({getCategoryCount("market")})</option>
                  </>
                )}
                {categoryId === 'viewpoints' && (
                  <>
                    <option value="all">Тип: Все площадки ({products.length})</option>
                    <option value="sunset">Тип: Закатные ({getCategoryCount("sunset")})</option>
                    <option value="sunrise">Тип: Рассветные ({getCategoryCount("sunrise")})</option>
                    <option value="panorama">Тип: Панорамные ({getCategoryCount("panorama")})</option>
                    <option value="beach-view">Тип: С видом на пляжи ({getCategoryCount("beach-view")})</option>
                    <option value="hidden">Тип: Секретные ({getCategoryCount("hidden")})</option>
                  </>
                )}
              </select>
              {/* District Dropdown - iOS Style */}
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-5 py-2.5 rounded-full border-2 border-border bg-white text-sm font-medium hover:border-primary/50 transition-colors cursor-pointer shadow-sm"
              >
                <option value="all">Район: Все ({products.length})</option>
                <option value="rawai">Район: Равай ({getDistrictCount("rawai")})</option>
                <option value="karon">Район: Карон ({getDistrictCount("karon")})</option>
                <option value="kata">Район: Ката ({getDistrictCount("kata")})</option>
                <option value="chalong">Район: Чалонг ({getDistrictCount("chalong")})</option>
                <option value="phuket-town">Район: Пхукет Таун ({getDistrictCount("phuket-town")})</option>
                <option value="patong">Район: Патонг ({getDistrictCount("patong")})</option>
                <option value="kamala">Район: Камала ({getDistrictCount("kamala")})</option>
                <option value="thalang">Район: Тхаланг ({getDistrictCount("thalang")})</option>
                <option value="bang-tao">Район: Банг Тао ({getDistrictCount("bang-tao")})</option>
                {categoryId === 'viewpoints' && (
                  <option value="phangnga">Район: Пханг Нга ({getDistrictCount("phangnga")})</option>
                )}
              </select>
              {/* Reset Filters Button */}
              {(selectedCategory !== "all" || selectedDistrict !== "all") && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedDistrict("all");
                  }}
                  className="px-4 py-2.5 rounded-full border-2 border-primary/20 bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition-colors cursor-pointer shadow-sm"
                >
                  🔄 Сбросить
                </button>
              )}
            </div>
            {/* Map Preview Card - Interactive */}
            <div 
              onClick={() => setShowMap(true)}
              className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border-2 border-blue-200/50 hover:border-blue-300 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 mb-1 flex items-center gap-2">
                    🗺️ Смотреть на карте
                    <span className="text-sm font-normal text-blue-600">({filteredProducts.length} мест)</span>
                  </h3>
                  <p className="text-sm text-blue-700">
                    {categoryId === 'viewpoints' 
                      ? 'Посмотрите расположение всех смотровых площадок на интерактивной карте'
                      : 'Посмотрите расположение всех торговых центров на интерактивной карте'
                    }
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
