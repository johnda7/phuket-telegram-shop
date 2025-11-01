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
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, MapPin, Star, Map as MapIcon } from "lucide-react";
import { fetchProductsByCategory, type ShopifyProduct } from "@/lib/shopify";
import { getCategoryConfig, categoryExists } from "@/config/categories";
import { getAllServices } from "@/config/services";
import { getButtonClass, getCardClass, cn } from "@/styles/design-system";
import { getPlaceMetafields } from "@/data/placeMetafields";
import { getAllPartners } from "@/config/partners";
import DaBot from "@/components/DaBot";
import { PlaceCard } from "@/components/PlaceCard";
import LeafletMap from "@/components/LeafletMap";

// Интерфейс для маркеров карты (совместим с LeafletMap)
interface PlaceMarker {
  handle: string;
  title: string;
  lat: number;
  lng: number;
  category: string;
  rating?: string;
  district?: string;
  isPartner: boolean;
  emoji: string;
  tags: string[];
}

const CategoryPageDynamic = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [places, setPlaces] = useState<PlaceMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedPlaceHandle, setSelectedPlaceHandle] = useState<string | null>(null); // Выбранное место (для пляжей - название пляжа)
  
  // Получить конфиг категории (централизованный!)
  const config = categoryId && categoryExists(categoryId) 
    ? getCategoryConfig(categoryId) 
    : null;

  // Получить все сервисы (централизованный!)
  const services = getAllServices();

  // Получить партнеров для выделения на карте (useMemo чтобы избежать бесконечного цикла!)
  const partnerHandles = useMemo(() => {
    const partners = getAllPartners();
    return new Set(partners.map(p => p.id));
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        const data = await fetchProductsByCategory(categoryId);
        setProducts(data);
        
        // Извлекаем места с координатами для карты (как в Map.tsx)
        // ВАЖНО: Для категории "districts" показываем ВСЕ районы, даже без координат!
        const placesWithCoordinates: PlaceMarker[] = data
          .filter(p => {
            const tags = p.node.tags || [];
            return tags.includes('info') || tags.includes('insider');
          })
          .map(p => {
            // Ищем координаты в metafields
            let coordinatesField = p.node.metafields?.find(m => 
              m && m.key === 'coordinates' && 
              (m.namespace === 'place_info' || m.namespace === 'custom' || m.namespace === undefined)
            );
            
            let ratingField = p.node.metafields?.find(m => 
              m && m.key === 'rating' && 
              (m.namespace === 'place_info' || m.namespace === 'custom' || m.namespace === undefined)
            );
            
            let districtField = p.node.metafields?.find(m => 
              m && m.key === 'district' && 
              (m.namespace === 'place_info' || m.namespace === 'custom' || m.namespace === undefined)
            );
            
            // Если нет координат из Shopify - используем fallback
            if (!coordinatesField?.value) {
              const fallbackData = getPlaceMetafields(p.node.handle);
              if (fallbackData?.coordinates) {
                // coordinates всегда строка "lat,lng" в fallback данных
                coordinatesField = { value: fallbackData.coordinates } as any;
                if (!ratingField?.value && fallbackData.rating) {
                  ratingField = { value: String(fallbackData.rating) } as any;
                }
                if (!districtField?.value && fallbackData.district) {
                  districtField = { value: fallbackData.district } as any;
                }
              }
            }
            
            // Для категории districts - используем дефолтные координаты если нет
            if (!coordinatesField?.value && categoryId === 'districts') {
              // Центр Пхукета как дефолт для районов
              coordinatesField = { value: '7.8804,98.3923' } as any;
            }
            
            if (!coordinatesField?.value) return null;
            
            const [lat, lng] = coordinatesField.value.split(',').map(Number);
            if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;
            
            // Определяем категорию и эмодзи
            const tags = p.node.tags || [];
            const categoryTag = tags.find(t => t.startsWith('category:'));
            const category = categoryTag ? categoryTag.replace('category:', '') : categoryId || 'uncategorized';
            
            // Эмодзи из конфига категории (централизованный маппинг как в Map.tsx)
            const categoryEmojiMap: Record<string, string> = {
              beaches: '🏖️', temples: '🛕', viewpoints: '⛰️',
              restaurants: '🍽️', nightlife: '🌙', spa: '💆', elephants: '🐘',
              shopping: '🛍️', aquaparks: '💦', museums: '🏛️', nightmarkets: '🌃',
              waterfalls: '💧', districts: '📍', excursions: '🚤', attractions: '🎯',
              amusement: '🎪', diving: '🤿', fishing: '🎣', yachts: '⛵',
              zoos: '🦁', clubs: '🎉', bars: '🍻', events: '📅',
              massage: '💆‍♀️', sauna: '🧖', coffee: '☕'
            };
            const emoji = categoryEmojiMap[category] || '📍';
            
            // Проверяем партнера
            const isPartner = partnerHandles.has(p.node.handle);
            
            return {
              handle: p.node.handle,
              title: p.node.title,
              lat,
              lng,
              category,
              rating: ratingField?.value,
              district: districtField?.value,
              isPartner,
              emoji,
              tags
            };
          })
          .filter(Boolean) as PlaceMarker[];
        
        setPlaces(placesWithCoordinates);
      } catch (err) {
        console.error('Failed to load products:', err);
        // Показываем ошибку пользователю
        setProducts([]);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, partnerHandles]);

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

  // Для категории пляжей - список всех пляжей (названия для меню, динамически из Shopify!)
  const placesForMenu = useMemo(() => {
    if (categoryId !== 'beaches') return [];
    return products.filter(p => {
      const tags = p.node.tags || [];
      return tags.includes('info') || tags.includes('insider');
    }).map(p => ({
      handle: p.node.handle,
      title: p.node.title
    }));
  }, [products, categoryId]);

  // Фильтрация продуктов
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Фильтр по выбранному месту (для пляжей - название пляжа)
    if (selectedPlaceHandle && categoryId === 'beaches') {
      filtered = filtered.filter(p => p.node.handle === selectedPlaceHandle);
      return filtered;
    }

    // Фильтр по району
    if (selectedDistrict !== "all") {
      filtered = filtered.filter(product => {
        const productTags = product.node.tags || [];
        const hasDistrict = productTags.some(tag => 
          tag === `district:${selectedDistrict}` || tag === selectedDistrict
        );
        return hasDistrict;
      });
    }
    
    return filtered;
  }, [products, selectedDistrict, selectedPlaceHandle, categoryId]);

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
            <div className="flex items-center justify-center gap-4 text-white/90 text-sm flex-wrap">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{filteredProducts.length} {filteredProducts.length === 1 ? 'место' : 'мест'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-white/90" />
                <span className="font-medium">{averageRating}</span>
              </span>
              <Link
                to={`/map?category=${categoryId}`}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
              >
                <MapIcon className="w-4 h-4" />
                <span className="font-medium">Карта</span>
              </Link>
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

          {/* МЕНЮ КАТЕГОРИИ: Для пляжей - названия пляжей (динамически из Shopify!) */}
          {categoryId === 'beaches' && placesForMenu.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                <button
                  onClick={() => {
                    setSelectedPlaceHandle(null);
                    setSelectedDistrict('all');
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex-shrink-0",
                    selectedPlaceHandle === null
                      ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20"
                      : "bg-white/90 text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-200/60"
                  )}
                  style={{
                    backdropFilter: selectedPlaceHandle === null ? 'none' : 'blur(20px)',
                    WebkitBackdropFilter: selectedPlaceHandle === null ? 'none' : 'blur(20px)',
                  }}
                >
                  <span className="text-sm leading-tight">Все</span>
                </button>
                {placesForMenu.map(place => (
                  <button
                    key={place.handle}
                    onClick={() => {
                      setSelectedPlaceHandle(place.handle);
                      setSelectedDistrict('all');
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex-shrink-0",
                      selectedPlaceHandle === place.handle
                        ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20"
                        : "bg-white/90 text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-200/60"
                    )}
                    style={{
                      backdropFilter: selectedPlaceHandle === place.handle ? 'none' : 'blur(20px)',
                      WebkitBackdropFilter: selectedPlaceHandle === place.handle ? 'none' : 'blur(20px)',
                    }}
                  >
                    <span className="text-sm leading-tight">{place.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filters - Унифицированное меню фильтров (единый дизайн с картой) */}
          {config.filters.showDistricts && availableDistricts.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Все районы */}
                <button
                  onClick={() => setSelectedDistrict("all")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex-shrink-0",
                    selectedDistrict === "all"
                      ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20"
                      : "bg-white/90 text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-200/60"
                  )}
                  style={{
                    backdropFilter: selectedDistrict === "all" ? 'none' : 'blur(20px)',
                    WebkitBackdropFilter: selectedDistrict === "all" ? 'none' : 'blur(20px)',
                  }}
                >
                  <span className="text-sm leading-tight">Все районы</span>
                </button>

                {/* Динамические районы из продуктов */}
                {availableDistricts.map(district => (
                  <button
                    key={district}
                    onClick={() => setSelectedDistrict(district)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex-shrink-0",
                      selectedDistrict === district
                        ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20"
                        : "bg-white/90 text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-200/60"
                    )}
                    style={{
                      backdropFilter: selectedDistrict === district ? 'none' : 'blur(20px)',
                      WebkitBackdropFilter: selectedDistrict === district ? 'none' : 'blur(20px)',
                    }}
                  >
                    <span className="text-sm leading-tight">{districtNames[district] || district}</span>
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

          {/* ВСТРОЕННАЯ КАРТА - как у phuket-insider.com (лучше чем просто ссылка!) */}
          {places.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-[#007AFF]" />
                  Карта мест на категории
                </h3>
                <Link
                  to={`/map?category=${categoryId}`}
                  className="text-sm text-[#007AFF] hover:text-[#0051D5] font-medium flex items-center gap-1"
                >
                  Открыть в полном режиме →
                </Link>
              </div>
              
              {/* Мини-карта - компактная встроенная версия */}
              <div className={cn(getCardClass('glass'), "p-0 overflow-hidden")}>
                <LeafletMap 
                  places={places.filter(p => {
                    // Фильтруем по району если выбран
                    if (selectedDistrict !== "all") {
                      const placeDistrict = p.tags.find(t => t.startsWith('district:'))?.replace('district:', '') || p.district;
                      return placeDistrict === selectedDistrict;
                    }
                    return true;
                  })}
                  height="400px"
                  onPlaceClick={(place) => navigate(`/place/${place.handle}`)}
                />
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-100">
                  <p className="text-xs text-gray-600 text-center">
                    🗺️ <strong>{places.length}</strong> {places.length === 1 ? 'место' : 'мест'} на карте • 
                    <Link to={`/map?category=${categoryId}`} className="text-[#007AFF] hover:underline ml-1">
                      Открыть полную карту
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* КНОПКА КАРТЫ (резервная) - показываем если есть места но нет координат */}
          {filteredProducts.length > 0 && places.length === 0 && (
            <div className="mb-6">
              <Link
                to={`/map?category=${categoryId}`}
                className={cn(
                  getCardClass('interactive'),
                  "p-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 border-[#007AFF]/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#007AFF] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">🗺️ Карта путешественника</div>
                    <div className="text-xs text-gray-500">Все места на одной карте • Бесплатно</div>
                  </div>
                </div>
                <span className="text-[#007AFF] font-bold">→</span>
              </Link>
            </div>
          )}

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
