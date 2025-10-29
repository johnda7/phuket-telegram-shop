// ВАЖНО: Этот проект работает только в режиме live coding (вайбкодинг)!
// Агент всегда сам ищет и устраняет ошибки, не спрашивает пользователя о деталях, не просит скриншоты и логи — только самодиагностика и автофиксы.
// Любые баги, белый экран, ошибки — агент обязан сам локализовать и исправить, не перекладывая ответственность на пользователя.
// Вся разработка — исключительно через vibe/live coding, без ручных инструкций от пользователя.

/**
 * 🗂️ ДИНАМИЧЕСКАЯ СТРАНИЦА КАТЕГОРИИ
 * 
 * Использует:
 * - config/categories.ts для всех настроек
 * - styles/design-system.ts для стилей
 * - config/services.ts для сервисов
 * 
 * Философия:
 * - 100% динамическая (работает для ЛЮБОЙ категории)
 * - Фильтры генерируются автоматически из тегов
 * - Design System для всех компонентов
 * - Telegram Wallet стиль
 */

import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, MapPin, Star } from "lucide-react";
import { fetchProductsByCategory, type ShopifyProduct } from "@/lib/shopify";
import { getCategoryConfig, categoryExists } from "@/config/categories";
import { getAllServices } from "@/config/services";
import { getButtonClass, getCardClass, cn } from "@/styles/design-system";
import DaBot from "@/components/DaBot";
import { PlaceCard } from "@/components/PlaceCard";

const CategoryPageDynamic = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  
  // Получить конфиг категории (централизованный!)
  const config = categoryId && categoryExists(categoryId) 
    ? getCategoryConfig(categoryId) 
    : null;

  // Получить все сервисы (централизованный!)
  const services = getAllServices();

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

  // ДИНАМИЧЕСКИ извлекаем районы из продуктов (НЕ хардкод!)
  const availableDistricts = useMemo(() => {
    const districts = new Set<string>();
    products.forEach(product => {
      const tags = product.node.tags || [];
      tags.forEach(tag => {
        if (tag.startsWith('district:')) {
          districts.add(tag.replace('district:', ''));
        }
      });
    });
    return Array.from(districts).sort();
  }, [products]);

  // Маппинг district ID → Русское название
  const districtNames: Record<string, string> = {
    Patong: 'Патонг',
    Karon: 'Карон',
    Kata: 'Ката',
    Chalong: 'Чалонг',
    Rawai: 'Раваи',
    Kamala: 'Камала',
    Kathu: 'Катху',
    Thalang: 'Тхаланг',
    PhuketTown: 'Пхукет Таун',
    Cherngtalay: 'Чернгталай',
  };

  // Фильтрация продуктов
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const productTags = product.node.tags || [];
      
      // Фильтр по району
      if (selectedDistrict !== "all") {
        const hasDistrict = productTags.some(tag => 
          tag === `district:${selectedDistrict}` || tag === selectedDistrict
        );
        if (!hasDistrict) return false;
      }
      
      return true;
    });
  }, [products, selectedDistrict]);

  // Средний рейтинг (если будем добавлять metafields)
  const averageRating = "4.2 - 4.7"; // TODO: вычислять из metafields когда добавим

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Категория не найдена</h1>
          <p className="text-gray-600 mb-6">Возможно, вы перешли по неправильной ссылке</p>
          <Link 
            to="/categories" 
            className={getButtonClass('primary')}
          >
            Вернуться к категориям
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pb-24">
        {/* ДА БОТ - AI консьерж доступен везде! */}
        <DaBot />
        
        {/* Sticky Navigation Header - iOS 26 Style */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <Link
                to="/categories"
                className="flex items-center gap-2 text-[#007AFF] hover:text-[#0051D5] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Назад</span>
              </Link>
            </div>
            
            {/* Breadcrumbs - Динамические из конфига */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
              {config.breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  {index > 0 && <span>•</span>}
                  {crumb.path ? (
                    <Link to={crumb.path} className="hover:text-[#007AFF] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Hero - iOS 26 Style - только #007AFF */}
        <div className="relative overflow-hidden py-12 bg-[#007AFF]">
          <div className="container mx-auto px-4 text-center">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {config.title}
            </h1>
            
            {/* Stats - Telegram Style с иконками Lucide */}
            <div className="flex items-center justify-center gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{filteredProducts.length} {filteredProducts.length === 1 ? 'место' : 'мест'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-white/90" />
                <span className="font-medium">{averageRating}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Description - Компактная карточка через Design System */}
          <div className={cn(getCardClass('glass'), "mb-6")}>
            <p className="text-sm text-gray-700 leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Filters - Динамические районы через Design System */}
          {config.filters.showDistricts && availableDistricts.length > 0 && (
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {/* Все районы */}
                <button
                  onClick={() => setSelectedDistrict("all")}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedDistrict === "all"
                      ? "bg-[#007AFF] text-white shadow-md"
                      : "bg-white/70 backdrop-blur-md text-gray-700 border border-gray-200 hover:border-[#007AFF]/50"
                  )}
                >
                  Все районы
                </button>

                {/* Динамические районы из продуктов */}
                {availableDistricts.map(district => (
                  <button
                    key={district}
                    onClick={() => setSelectedDistrict(district)}
                    className={cn(
                      "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      selectedDistrict === district
                        ? "bg-[#007AFF] text-white shadow-md"
                        : "bg-white/70 backdrop-blur-md text-gray-700 border border-gray-200 hover:border-[#007AFF]/50"
                    )}
                  >
                    {districtNames[district] || district}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid - Компактная сетка */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {filteredProducts.map((product) => (
              <PlaceCard key={product.node.id} product={product.node} />
            ))}
          </div>

          {/* НАШИ СЕРВИСЫ - Динамически из config/services.ts */}
          {filteredProducts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Наши сервисы
              </h3>
              
              <div className={cn(getCardClass('default'), "p-0")}>
                {services.map((service, index) => (
                  <Link
                    key={service.id}
                    to={service.path}
                    className={cn(
                      "flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors",
                      index < services.length - 1 && "border-b border-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", service.bgColor)}>
                        <service.icon className={cn("w-5 h-5", service.iconColor)} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{service.title}</div>
                        <div className="text-xs text-gray-500">{service.subtitle}</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - через Design System */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <config.icon className={cn("w-12 h-12", config.iconColor)} />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {selectedDistrict !== "all" 
                  ? "Ничего не найдено" 
                  : "Места скоро появятся"
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedDistrict !== "all"
                  ? "Попробуйте изменить фильтры или сбросить их"
                  : `Мы работаем над добавлением новых мест в категорию "${config.title}"`
                }
              </p>
              {selectedDistrict !== "all" && (
                <button
                  onClick={() => setSelectedDistrict("all")}
                  className={getButtonClass('primary')}
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CategoryPageDynamic;
